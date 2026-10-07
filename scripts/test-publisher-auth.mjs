import assert from "node:assert/strict";
import { scryptSync, randomBytes, createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import worker from "../server/worker.ts";

// Disposable, in-memory data and credentials. Never use production credentials here.
const sqlite = new DatabaseSync(":memory:");
for (const file of readdirSync("drizzle").filter((file) => file.endsWith(".sql")).sort()) {
  sqlite.exec(readFileSync(`drizzle/${file}`, "utf8"));
}
class Statement {
  constructor(sql, values = []) { this.sql = sql; this.values = values; }
  bind(...values) { return new Statement(this.sql, values); }
  async first() { return sqlite.prepare(this.sql).get(...this.values) ?? null; }
  async all() { return { success: true, results: sqlite.prepare(this.sql).all(...this.values), meta: {} }; }
  async run() {
    const result = sqlite.prepare(this.sql).run(...this.values);
    return { success: true, results: [], meta: { changes: Number(result.changes) } };
  }
}
const DB = {
  prepare: (sql) => new Statement(sql),
  async batch(statements) {
    sqlite.exec("BEGIN");
    try {
      const results = [];
      for (const statement of statements) {
        const isQuery = /\bRETURNING\b|^\s*SELECT|^\s*PRAGMA/i.test(statement.sql);
        results.push(await (isQuery ? statement.all() : statement.run()));
      }
      sqlite.exec("COMMIT");
      return results;
    } catch (error) { sqlite.exec("ROLLBACK"); throw error; }
  },
};
const password = "test-only-publisher-password";
function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 });
  return `scrypt$16384$8$5$${salt.toString("hex")}$${key.toString("hex")}`;
}
const env = {
  DB,
  ASSETS: { async fetch() { return new Response('<html><head><title>Test</title><!--__ROUTE_META_START__--><!--__ROUTE_META_END__--></head><body></body></html>', { headers: { "Content-Type": "text/html" } }); } },
  BLOG_LOGIN_USERNAME: "mary@example.test",
  BLOG_LOGIN_PASSWORD_HASH: hashPassword(password),
};
const origin = "https://publisher.example.test";
let checks = 0;
function equal(actual, expected, label) { assert.equal(actual, expected, label); checks++; }
function ok(value, label) { assert.ok(value, label); checks++; }
async function request(path, options = {}, environment = env) {
  return worker.fetch(new Request(`${origin}${path}`, options), environment);
}
function mutation(body, headers = {}) {
  return { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "X-Downsize-Publisher": "1", "CF-Connecting-IP": "192.0.2.1", ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) };
}
async function login(username = env.BLOG_LOGIN_USERNAME, suppliedPassword = password, headers = {}, environment = env) {
  return request("/api/admin/login", mutation({ username, password: suppliedPassword }, headers), environment);
}
const countBefore = sqlite.prepare("SELECT COUNT(*) AS count FROM insight_posts").get().count;
equal((await request("/publisher")).status, 200, "Anonymous visitors see the standalone login without redirect");
equal((await request("/publisher")).headers.get("Cache-Control"), "private, no-store", "Login HTML is not cached");
equal((await request("/api/admin/session")).status, 401, "Anonymous session is denied");
equal((await request("/api/admin/posts", { headers: { "oai-authenticated-user-id": "legacy-user", "oai-authenticated-user-email": "mary@example.test" } })).status, 401, "ChatGPT headers alone no longer grant access");
for (const method of ["GET", "POST", "PUT", "DELETE"]) {
  equal((await request(method === "GET" || method === "POST" ? "/api/admin/posts" : "/api/admin/posts/example", { method })).status, 401, `Anonymous ${method} is denied`);
}
equal((await login(undefined, undefined, { Origin: "https://evil.example" })).status, 403, "Cross-origin login is denied");
equal((await login(undefined, undefined, { "X-Downsize-Publisher": "" })).status, 403, "Missing CSRF header is denied");
equal((await login(undefined, undefined, { "Sec-Fetch-Site": "cross-site" })).status, 403, "Cross-site login is denied");
equal((await request("/api/admin/login")).status, 405, "GET cannot log in");
equal((await login(undefined, undefined, {}, { ...env, BLOG_LOGIN_PASSWORD_HASH: undefined })).status, 503, "Missing secret fails closed");
equal((await login(undefined, undefined, {}, { ...env, BLOG_LOGIN_PASSWORD_HASH: "malformed" })).status, 503, "Malformed secret fails closed");
equal((await request("/api/admin/login", mutation({ username: "", password: "" }))).status, 400, "Empty login is rejected");
equal((await request("/api/admin/login", mutation({ username: env.BLOG_LOGIN_USERNAME, password: "x".repeat(5000) }))).status, 400, "Oversized body is rejected");
equal((await request("/api/admin/login", { ...mutation(), body: "not-json" })).status, 400, "Invalid JSON is rejected");
const wrongUser = await login("other@example.test");
const wrongPassword = await login(undefined, "wrong-password");
equal(wrongUser.status, 401, "Wrong username is denied");
equal(wrongPassword.status, 401, "Wrong password is denied");
equal((await wrongUser.json()).error, (await wrongPassword.json()).error, "Wrong credentials have the same message");
equal(wrongPassword.headers.get("Set-Cookie"), null, "Failure issues no session");
equal((await login(undefined, undefined, {}, { ...env, BLOG_LOGIN_USERNAME: "new@example.test" })).status, 401, "Changed username rejects old credentials");
const signedIn = await login("  MARY@EXAMPLE.TEST ");
equal(signedIn.status, 200, "Username is case-insensitive and whitespace-normalized");
const setCookie = signedIn.headers.get("Set-Cookie");
ok(setCookie.includes("HttpOnly") && setCookie.includes("Secure") && setCookie.includes("SameSite=Strict") && !setCookie.includes("Domain="), "Host-only cookie has security flags");
const cookie = setCookie.split(";")[0];
const rawToken = cookie.split("=")[1];
ok(/^[a-f0-9]{64}$/.test(rawToken), "Session token has 256 random bits");
const sessionRow = sqlite.prepare("SELECT * FROM publisher_sessions").get();
equal(sessionRow.token_hash, createHash("sha256").update(rawToken).digest("hex"), "Only token hash is stored in D1");
equal(sessionRow.expires_at - sessionRow.created_at, 8 * 60 * 60 * 1000, "Session lifetime is eight hours");
equal((await request("/api/admin/session", { headers: { Cookie: cookie } })).status, 200, "Opaque session authorizes");
equal((await request("/api/admin/posts", { headers: { Cookie: cookie } })).status, 200, "Authorized user can read existing posts");
equal((await request("/api/admin/session", { headers: { Cookie: `${cookie}; ${cookie}` } })).status, 401, "Duplicate cookies fail closed");
equal((await request("/api/admin/session", { headers: { Cookie: "__Host-downsize_publisher=" + "0".repeat(64) } })).status, 401, "Forged session fails closed");
equal((await request("/api/admin/session", { headers: { Cookie: cookie } }, { ...env, BLOG_LOGIN_PASSWORD_HASH: hashPassword("rotated-test-password") })).status, 401, "Password rotation invalidates old sessions");
const post = { title: "Auth test", slug: "auth-test", excerpt: "Test summary", body: "This is a disposable test article.", status: "draft", publishedAt: null };
equal((await request("/api/admin/posts", mutation(post, { Cookie: cookie, Origin: "https://evil.example" }))).status, 403, "Cross-origin publishing is denied");
const created = await request("/api/admin/posts", mutation(post, { Cookie: cookie }));
equal(created.status, 201, "Authorized user can save a draft");
const saved = (await created.json()).post;
equal(saved.authorEmail, env.BLOG_LOGIN_USERNAME, "Draft is attributed to the configured publisher");
equal((await request("/api/posts/auth-test")).status, 404, "Private draft stays private");
const published = await request(`/api/admin/posts/${saved.id}`, { ...mutation({ ...post, version: saved.version, status: "published", publishedAt: "2026-10-07T12:00:00Z" }, { Cookie: cookie }), method: "PUT" });
equal(published.status, 200, "Authorized user can publish");
equal((await request("/api/posts/auth-test")).status, 200, "Published article remains public");
equal((await request(`/api/admin/posts/${saved.id}`, { ...mutation(undefined, { Cookie: cookie }), method: "DELETE" })).status, 200, "Authorized user can delete disposable test post");
equal((await request("/api/admin/logout", mutation(undefined, { Cookie: cookie, Origin: "https://evil.example" }))).status, 403, "Cross-origin logout is denied");
const logout = await request("/api/admin/logout", mutation(undefined, { Cookie: cookie }));
equal(logout.status, 200, "Sign-out works");
ok(logout.headers.get("Set-Cookie").includes("Max-Age=0"), "Sign-out clears cookie");
equal((await request("/api/admin/session", { headers: { Cookie: cookie } })).status, 401, "Logged-out session cannot be replayed");
const again = await login();
const againCookie = again.headers.get("Set-Cookie").split(";")[0];
const renewed = await login(undefined, undefined, { Cookie: againCookie });
equal(renewed.status, 200, "Relogin creates fresh session");
equal((await request("/api/admin/session", { headers: { Cookie: againCookie } })).status, 401, "Previous session is revoked on relogin");
sqlite.prepare("UPDATE publisher_sessions SET expires_at = 0").run();
equal((await request("/api/admin/session", { headers: { Cookie: renewed.headers.get("Set-Cookie").split(";")[0] } })).status, 401, "Expired session is rejected");
sqlite.exec("DELETE FROM publisher_login_attempts");
for (let i = 0; i < 10; i++) equal((await login(undefined, "wrong-password")).status, 401, `Attempt ${i + 1} is counted`);
const throttled = await login();
equal(throttled.status, 429, "Eleventh login attempt is throttled");
ok(Number(throttled.headers.get("Retry-After")) > 0, "Throttling supplies retry delay");
equal((await login(undefined, undefined, { "CF-Connecting-IP": "192.0.2.2" })).status, 200, "Separate IP is not locked out by one visitor");
sqlite.prepare("UPDATE publisher_login_attempts SET expires_at = 0").run();
equal((await login()).status, 200, "Login works after throttle window expires");
sqlite.exec("DELETE FROM publisher_login_attempts");
await login(undefined, "wrong-password");
sqlite.prepare("UPDATE publisher_login_attempts SET attempts = 60 WHERE key LIKE '%:global'").run();
equal((await login(undefined, undefined, { "CF-Connecting-IP": "192.0.2.3" })).status, 429, "Global throttle limits distributed attempts");
equal(sqlite.prepare("SELECT COUNT(*) AS count FROM insight_posts").get().count, countBefore, "Existing articles survive migration and auth tests unchanged");
sqlite.close();
console.log(`Publisher security checks passed: ${checks}`);
