import { randomBytes } from "node:crypto";
import { publisherUser, type PublisherAuthEnv } from "./publisherAuth";

type Config = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  newsletterListId: string;
  clubListId: string;
  clubTagId: string;
  fields: Record<"source" | "mailingAddress" | "timing" | "planningFor" | "partOfTown" | "timeOfDay", string>;
};
type AuthConfig = Pick<Config, "clientId" | "clientSecret" | "redirectUri">;

type Signup =
  | { kind: "newsletter"; source: "guide" | "footer" | "meet-mary"; name: string; email: string }
  | { kind: "club"; source: "resource-center"; name: string; email: string; mailingAddress: string; phone: string; timing: string[]; planningFor: string[]; partOfTown: string; timeOfDay: string[]; newsletter: boolean };

type TokenRow = { access_token: string | null; refresh_token: string | null; expires_at: number | null; oauth_state: string | null; state_expires_at: number | null };
type TokenResponse = { access_token: string; refresh_token: string; expires_in: number };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const attempts = new Map<string, { count: number; until: number }>();
let refreshing: Promise<string> | null = null;

function authConfig(): AuthConfig | null {
  const clientId = process.env.CC_CLIENT_ID?.trim();
  const clientSecret = process.env.CC_CLIENT_SECRET?.trim();
  const redirectUri = process.env.CC_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  try {
    const redirect = new URL(redirectUri);
    if (redirect.protocol !== "https:" || redirect.pathname !== "/api/admin/constant-contact/callback") return null;
  } catch { return null; }
  return { clientId, clientSecret, redirectUri };
}

function config(): Config | null {
  const auth = authConfig();
  if (!auth) return null;
  const values = {
    newsletterListId: process.env.CC_NEWSLETTER_LIST_ID?.trim(),
    clubListId: process.env.CC_CLUB_LIST_ID?.trim(),
    clubTagId: process.env.CC_CLUB_TAG_ID?.trim(),
    source: process.env.CC_SOURCE_FIELD_ID?.trim(),
    mailingAddress: process.env.CC_CLUB_ADDRESS_FIELD_ID?.trim(),
    timing: process.env.CC_CLUB_TIMING_FIELD_ID?.trim(),
    planningFor: process.env.CC_CLUB_PLANNING_FIELD_ID?.trim(),
    partOfTown: process.env.CC_CLUB_TOWN_FIELD_ID?.trim(),
    timeOfDay: process.env.CC_CLUB_TIME_FIELD_ID?.trim(),
  };
  if (Object.values(values).some((value) => !value)) return null;
  if (![values.newsletterListId, values.clubListId, values.clubTagId, values.source, values.mailingAddress, values.timing, values.planningFor, values.partOfTown, values.timeOfDay].every((value) => UUID.test(value!))) return null;
  return {
    ...auth,
    newsletterListId: values.newsletterListId!, clubListId: values.clubListId!, clubTagId: values.clubTagId!,
    fields: { source: values.source!, mailingAddress: values.mailingAddress!, timing: values.timing!, planningFor: values.planningFor!, partOfTown: values.partOfTown!, timeOfDay: values.timeOfDay! },
  };
}

function json(payload: object, status: number) {
  return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

function text(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}
function optionalText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length <= max;
}
function choices(value: unknown, options: string[]): value is string[] {
  return Array.isArray(value) && value.length <= options.length && value.every((item) => typeof item === "string" && options.includes(item)) && new Set(value).size === value.length;
}
export function validateSignup(value: unknown): Signup | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (!text(v.name, 100) || !text(v.email, 50) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return null;
  const [firstName, ...restOfName] = v.name.trim().split(/\s+/);
  if (firstName.length > 50 || restOfName.join(" ").length > 50) return null;
  if (v.kind === "newsletter" && ["guide", "footer", "meet-mary"].includes(String(v.source))) {
    return { kind: "newsletter", source: v.source as "guide" | "footer" | "meet-mary", name: v.name.trim(), email: v.email.trim().toLowerCase() };
  }
  if (v.kind !== "club" || v.source !== "resource-center" || !optionalText(v.mailingAddress, 200) || !optionalText(v.phone, 40) || !optionalText(v.partOfTown, 120) || !choices(v.timing, ["Ready to start soon", "In the next 6 to 12 months", "In the next 1 to 2 years", "Just exploring for now"]) || !choices(v.planningFor, ["Myself", "A parent or loved one", "Both"]) || !choices(v.timeOfDay, ["Daytime", "Evening"]) || typeof v.newsletter !== "boolean") return null;
  return { kind: "club", source: "resource-center", name: v.name.trim(), email: v.email.trim().toLowerCase(), mailingAddress: v.mailingAddress.trim(), phone: v.phone.trim(), timing: v.timing, planningFor: v.planningFor, partOfTown: v.partOfTown.trim(), timeOfDay: v.timeOfDay, newsletter: v.newsletter };
}

async function tokenRow(db: D1Database) {
  return db.prepare("SELECT access_token, refresh_token, expires_at, oauth_state, state_expires_at FROM constant_contact_auth WHERE id = 1").first<TokenRow>();
}
async function exchangeToken(conf: AuthConfig, params: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch("https://authz.constantcontact.com/oauth2/default/v1/token", {
    method: "POST", signal: AbortSignal.timeout(10000),
    headers: { "Authorization": `Basic ${Buffer.from(`${conf.clientId}:${conf.clientSecret}`).toString("base64")}`, "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!response.ok) throw new Error(`Constant Contact token exchange failed (${response.status}).`);
  const data = await response.json() as Partial<TokenResponse>;
  if (!data.access_token || !data.refresh_token || !Number.isFinite(data.expires_in)) throw new Error("Constant Contact token response was incomplete.");
  return data as TokenResponse;
}
async function saveToken(db: D1Database, token: TokenResponse) {
  await db.prepare("INSERT INTO constant_contact_auth (id, access_token, refresh_token, expires_at, oauth_state, state_expires_at) VALUES (1, ?, ?, ?, NULL, NULL) ON CONFLICT(id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token, expires_at = excluded.expires_at, oauth_state = NULL, state_expires_at = NULL")
    .bind(token.access_token, token.refresh_token, Date.now() + token.expires_in * 1000).run();
}
async function accessToken(db: D1Database, conf: AuthConfig) {
  const row = await tokenRow(db);
  if (!row?.refresh_token) throw new Error("Constant Contact is not connected.");
  if (row.access_token && row.expires_at && row.expires_at > Date.now() + 60000) return row.access_token;
  if (!refreshing) refreshing = (async () => {
    const latest = await tokenRow(db);
    if (latest?.access_token && latest.expires_at && latest.expires_at > Date.now() + 60000) return latest.access_token;
    if (!latest?.refresh_token) throw new Error("Constant Contact must be reconnected.");
    const token = await exchangeToken(conf, new URLSearchParams({ grant_type: "refresh_token", refresh_token: latest.refresh_token }));
    await saveToken(db, token);
    return token.access_token;
  })().finally(() => { refreshing = null; });
  return refreshing;
}

async function providerPost(path: string, body: object, access: string) {
  const response = await fetch(`https://api.cc.email/v3${path}`, { method: "POST", signal: AbortSignal.timeout(10000), headers: { "Authorization": `Bearer ${access}`, "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Constant Contact rejected signup (${response.status}).`);
  return response.json() as Promise<Record<string, unknown>>;
}

function rateAllowed(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  if (attempts.size > 5000) attempts.forEach((value, key) => { if (value.until <= now) attempts.delete(key); });
  const entry = attempts.get(ip);
  if (!entry || entry.until <= now) { attempts.set(ip, { count: 1, until: now + 15 * 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}

export async function handleConstantContact(request: Request, env: PublisherAuthEnv): Promise<Response> {
  const url = new URL(request.url);
  const auth = authConfig();
  if (url.pathname === "/api/admin/constant-contact/connect") {
    if (request.method !== "GET") return json({ error: "Use GET." }, 405);
    if (!await publisherUser(request, env)) return json({ error: "Sign in as publisher first." }, 401);
    if (!auth || url.origin !== new URL(auth.redirectUri).origin) return json({ error: "Constant Contact settings are incomplete." }, 503);
    const state = randomBytes(32).toString("hex");
    await env.DB.prepare("INSERT INTO constant_contact_auth (id, oauth_state, state_expires_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET oauth_state = excluded.oauth_state, state_expires_at = excluded.state_expires_at")
      .bind(state, Date.now() + 5 * 60000).run();
    const authorize = new URL("https://authz.constantcontact.com/oauth2/default/v1/authorize");
    authorize.search = new URLSearchParams({ client_id: auth.clientId, redirect_uri: auth.redirectUri, response_type: "code", scope: "contact_data offline_access", state }).toString();
    return Response.redirect(authorize, 302);
  }
  if (url.pathname === "/api/admin/constant-contact/callback") {
    if (request.method !== "GET") return json({ error: "Use GET." }, 405);
    if (!auth || url.origin !== new URL(auth.redirectUri).origin) return json({ error: "Constant Contact settings are incomplete." }, 503);
    const row = await tokenRow(env.DB);
    if (!row?.oauth_state || row.oauth_state !== url.searchParams.get("state") || !row.state_expires_at || row.state_expires_at < Date.now() || !url.searchParams.get("code")) return json({ error: "Connection expired. Please start again from the publisher account." }, 403);
    await env.DB.prepare("UPDATE constant_contact_auth SET oauth_state = NULL, state_expires_at = NULL WHERE id = 1").run();
    const token = await exchangeToken(auth, new URLSearchParams({ grant_type: "authorization_code", code: url.searchParams.get("code")!, redirect_uri: auth.redirectUri }));
    await saveToken(env.DB, token);
    return new Response("Constant Contact is connected. You can close this tab.", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" } });
  }
  if (url.pathname !== "/api/signups") return json({ error: "Not found." }, 404);
  const conf = config();
  if (request.method !== "POST") return json({ error: "Use POST." }, 405);
  if (request.headers.get("origin") !== url.origin || ![null, "same-origin"].includes(request.headers.get("sec-fetch-site"))) return json({ error: "This request was blocked." }, 403);
  if (!conf || !await tokenRow(env.DB).then((row) => Boolean(row?.refresh_token))) return json({ error: "Sign-up is temporarily unavailable." }, 503);
  if (!rateAllowed(request)) return json({ error: "Please wait before trying again." }, 429);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json") || Number(request.headers.get("content-length") || 0) > 8192) return json({ error: "Invalid sign-up details." }, 422);
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Invalid sign-up details." }, 422);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > 8192) { await reader.cancel(); return json({ error: "Invalid sign-up details." }, 422); }
      chunks.push(chunk.value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return json({ error: "Invalid sign-up details." }, 422); }
  const signup = validateSignup(body);
  if (!signup) return json({ error: "Invalid sign-up details." }, 422);
  const [firstName, ...remaining] = signup.name.split(/\s+/);
  const fields: { custom_field_id: string; value: string }[] = [{ custom_field_id: conf.fields.source, value: signup.source }];
  if (signup.kind === "club") {
    for (const [key, value] of Object.entries({ mailingAddress: signup.mailingAddress, timing: signup.timing.join(", "), planningFor: signup.planningFor.join(", "), partOfTown: signup.partOfTown, timeOfDay: signup.timeOfDay.join(", ") })) {
      if (value) fields.push({ custom_field_id: conf.fields[key as keyof Config["fields"]], value });
    }
  }
  try {
    const access = await accessToken(env.DB, conf);
    const lists = signup.kind === "newsletter" ? [conf.newsletterListId] : signup.newsletter ? [conf.clubListId, conf.newsletterListId] : [conf.clubListId];
    const created = await providerPost("/contacts/sign_up_form", { email_address: signup.email, first_name: firstName, ...(remaining.length ? { last_name: remaining.join(" ") } : {}), list_memberships: lists, custom_fields: fields, ...(signup.kind === "club" && signup.phone ? { phone_number: signup.phone } : {}) }, access);
    if (signup.kind === "club") {
      if (typeof created.contact_id !== "string" || !UUID.test(created.contact_id)) throw new Error("Constant Contact did not return a contact ID for Club tagging.");
      await providerPost("/activities/contacts_taggings_add", { source: { contact_ids: [created.contact_id] }, tag_ids: [conf.clubTagId] }, access);
    }
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("Constant Contact signup failed:", error instanceof Error ? error.message : "Unknown provider error");
    return json({ error: "Sign-up is temporarily unavailable. Please try again later." }, 503);
  }
}
