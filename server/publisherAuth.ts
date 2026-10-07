import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export type PublisherAuthEnv = {
  DB: D1Database;
  BLOG_LOGIN_USERNAME?: string;
  BLOG_LOGIN_PASSWORD_HASH?: string;
};

const SESSION_SECONDS = 8 * 60 * 60;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const HASH_PATTERN = /^scrypt\$16384\$8\$5\$([a-f0-9]{32})\$([a-f0-9]{64})$/;

async function configuration(env: PublisherAuthEnv) {
  const username = env.BLOG_LOGIN_USERNAME?.trim().toLowerCase();
  const stored = username ? await env.DB.prepare("SELECT password_hash FROM publisher_credentials WHERE username = ?").bind(username).first<{ password_hash: string }>() : null;
  const encoded = stored?.password_hash ?? env.BLOG_LOGIN_PASSWORD_HASH;
  const hash = encoded?.match(HASH_PATTERN);
  if (!username || !encoded || !hash) return null;
  return {
    username,
    salt: Buffer.from(hash[1], "hex"),
    hash: Buffer.from(hash[2], "hex"),
    encoded,
    version: digest(`${username}\n${encoded}`),
  };
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function isLoopback(request: Request) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
}

function cookieName(request: Request) {
  return isLoopback(request) ? "downsize_publisher_dev" : "__Host-downsize_publisher";
}

function sessionToken(request: Request) {
  const cookies = (request.headers.get("cookie") ?? "").split(";");
  const prefix = `${cookieName(request)}=`;
  const matches = cookies.map((cookie) => cookie.trim()).filter((cookie) => cookie.startsWith(prefix));
  if (matches.length !== 1) return null;
  const token = matches[0].slice(prefix.length);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

function sessionCookie(request: Request, token: string, maxAge: number) {
  const secure = !isLoopback(request) || new URL(request.url).protocol === "https:";
  return `${cookieName(request)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function sameOriginMutation(request: Request) {
  if (request.headers.get("x-downsize-publisher") !== "1") return false;
  if (request.headers.get("origin") !== new URL(request.url).origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

function response(request: Request, payload: unknown, status: number, extraHeaders?: HeadersInit) {
  return new Response(request.method === "HEAD" ? null : JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function publisherUser(request: Request, env: PublisherAuthEnv) {
  if (new URL(request.url).protocol !== "https:" && !isLoopback(request)) return null;
  const config = await configuration(env);
  const token = sessionToken(request);
  if (!config || !token) return null;
  const session = await env.DB.prepare(
    "SELECT username FROM publisher_sessions WHERE token_hash = ? AND credential_version = ? AND expires_at > ?",
  ).bind(digest(token), config.version, Date.now()).first<{ username: string }>();
  return session?.username === config.username
    ? { email: config.username, displayName: "Mary Lynch" }
    : null;
}

async function derivePassword(password: string, salt: Buffer) {
  const derived = await new Promise<Buffer>((resolve, reject) => {
    // OWASP's 16 MiB scrypt profile fits the Workers 128 MiB isolate limit.
    scrypt(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
  return derived;
}

async function verifyPassword(password: string, salt: Buffer, expected: Buffer) {
  return timingSafeEqual(await derivePassword(password, salt), expected);
}

async function consumeLoginAttempt(request: Request, env: PublisherAuthEnv, config: NonNullable<Awaited<ReturnType<typeof configuration>>>) {
  const now = Date.now();
  // Cloudflare's visitor IP is used only for throttling, never authentication.
  const ip = request.headers.get("cf-connecting-ip")?.slice(0, 128) || "unknown";
  const ipKey = createHmac("sha256", config.encoded).update(ip).digest("hex");
  const statement = (key: string) => env.DB.prepare(
    "INSERT INTO publisher_login_attempts (key, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = MIN(publisher_login_attempts.attempts + 1, 1000) RETURNING attempts, expires_at",
  ).bind(key, now + ATTEMPT_WINDOW_MS);
  const results = await env.DB.batch<{ attempts: number; expires_at: number }>([
    env.DB.prepare("DELETE FROM publisher_login_attempts WHERE expires_at <= ?").bind(now),
    env.DB.prepare("DELETE FROM publisher_sessions WHERE expires_at <= ? OR credential_version != ?").bind(now, config.version),
    statement(`${config.version}:global`),
    statement(`${config.version}:${ipKey}`),
  ]);
  const global = results[2].results[0];
  const visitor = results[3].results[0];
  if (global.attempts > 60 || visitor.attempts > 10) {
    return Math.max(1, Math.ceil(((global.attempts > 60 ? global : visitor).expires_at - now) / 1000));
  }
  return 0;
}

export async function publisherLogin(request: Request, env: PublisherAuthEnv) {
  if (!sameOriginMutation(request)) return response(request, { error: "This sign-in request was blocked." }, 403);
  if (new URL(request.url).protocol !== "https:" && !isLoopback(request)) {
    return response(request, { error: "Use the secure website to sign in." }, 403);
  }
  const config = await configuration(env);
  if (!config) return response(request, { error: "Admin sign-in is temporarily unavailable." }, 503);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response(request, { error: "Invalid sign-in request." }, 400);
  }
  if (Number(request.headers.get("content-length")) > 4096) return response(request, { error: "Invalid sign-in request." }, 400);
  // Limit the actual stream as well, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return response(request, { error: "Enter your username and password." }, 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.byteLength;
    if (length > 4096) {
      await reader.cancel();
      return response(request, { error: "Invalid sign-in request." }, 400);
    }
    chunks.push(chunk.value);
  }
  let input: { username?: unknown; password?: unknown } | null;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response(request, { error: "Invalid sign-in request." }, 400);
  }
  if (!input || typeof input.username !== "string" || typeof input.password !== "string" ||
      !input.username.trim() || !input.password || input.username.length > 254 || input.password.length > 256) {
    return response(request, { error: "Enter your username and password." }, 400);
  }
  const retryAfter = await consumeLoginAttempt(request, env, config);
  if (retryAfter) return response(request, { error: "Too many sign-in attempts. Please try again in 15 minutes." }, 429, { "Retry-After": String(retryAfter) });
  const passwordMatches = await verifyPassword(input.password, config.salt, config.hash);
  if (!passwordMatches || input.username.trim().toLowerCase() !== config.username) {
    return response(request, { error: "The username or password is incorrect." }, 401);
  }
  const token = randomBytes(32).toString("hex");
  const priorToken = sessionToken(request);
  const now = Date.now();
  const statements = [env.DB.prepare(
    "INSERT INTO publisher_sessions (token_hash, username, credential_version, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(digest(token), config.username, config.version, now, now + SESSION_SECONDS * 1000)];
  if (priorToken) statements.push(env.DB.prepare("DELETE FROM publisher_sessions WHERE token_hash = ?").bind(digest(priorToken)));
  await env.DB.batch(statements);
  return response(request, { authenticated: true, authorized: true, displayName: "Mary Lynch", email: config.username }, 200, {
    "Set-Cookie": sessionCookie(request, token, SESSION_SECONDS),
  });
}

export async function publisherLogout(request: Request, env: PublisherAuthEnv) {
  if (!sameOriginMutation(request)) return response(request, { error: "This sign-out request was blocked." }, 403);
  const token = sessionToken(request);
  if (token) await env.DB.prepare("DELETE FROM publisher_sessions WHERE token_hash = ?").bind(digest(token)).run();
  return response(request, { success: true }, 200, { "Set-Cookie": sessionCookie(request, "", 0) });
}

export async function publisherChangePassword(request: Request, env: PublisherAuthEnv) {
  if (!sameOriginMutation(request)) return response(request, { error: "This password change was blocked." }, 403);
  const user = await publisherUser(request, env);
  const config = await configuration(env);
  if (!user || !config) return response(request, { error: "Sign in to change the password." }, 401);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return response(request, { error: "Invalid request." }, 400);
  const reader = request.body?.getReader();
  if (!reader) return response(request, { error: "Enter both passwords." }, 400);
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) { const chunk = await reader.read(); if (chunk.done) break; length += chunk.value.byteLength; if (length > 4096) { await reader.cancel(); return response(request, { error: "Invalid request." }, 400); } chunks.push(chunk.value); }
  let input: { currentPassword?: unknown; newPassword?: unknown } | null;
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return response(request, { error: "Invalid request." }, 400); }
  if (!input || typeof input.currentPassword !== "string" || typeof input.newPassword !== "string" || input.currentPassword.length > 256 || input.newPassword.length < 14 || input.newPassword.length > 256) return response(request, { error: "Use a new password of 14–256 characters." }, 422);
  const retryAfter = await consumeLoginAttempt(request, env, config);
  if (retryAfter) return response(request, { error: "Too many attempts. Please try again in 15 minutes." }, 429, { "Retry-After": String(retryAfter) });
  if (!(await verifyPassword(input.currentPassword, config.salt, config.hash))) return response(request, { error: "The current password is incorrect." }, 403);
  if (input.currentPassword === input.newPassword) return response(request, { error: "Choose a different password." }, 422);
  const salt = randomBytes(16); const key = await derivePassword(input.newPassword, salt);
  const encoded = `scrypt$16384$8$5$${salt.toString("hex")}$${key.toString("hex")}`;
  const results = await env.DB.batch([
    env.DB.prepare("INSERT INTO publisher_credentials (username, password_hash, updated_at) VALUES (?, ?, ?) ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, updated_at = excluded.updated_at WHERE publisher_credentials.password_hash = ?")
      .bind(config.username, encoded, Date.now(), config.encoded),
    env.DB.prepare("DELETE FROM publisher_sessions WHERE username = ? AND credential_version = ?").bind(config.username, config.version),
  ]);
  if (!results[0].meta.changes) return response(request, { error: "The password changed in another session. Sign in again." }, 409);
  return response(request, { success: true }, 200, { "Set-Cookie": sessionCookie(request, "", 0) });
}
