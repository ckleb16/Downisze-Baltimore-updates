import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { handleConstantContact, validateSignup } from "../server/constantContact";

const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const settings: Record<string, string> = {
  CC_CLIENT_ID: "test-client", CC_CLIENT_SECRET: "test-secret",
  CC_REDIRECT_URI: "https://downsizebaltimore.com/api/admin/constant-contact/callback",
  CC_NEWSLETTER_LIST_ID: uuid(1), CC_CLUB_LIST_ID: uuid(2), CC_CLUB_TAG_ID: uuid(3),
  CC_SOURCE_FIELD_ID: uuid(4), CC_CLUB_ADDRESS_FIELD_ID: uuid(5), CC_CLUB_TIMING_FIELD_ID: uuid(6),
  CC_CLUB_PLANNING_FIELD_ID: uuid(7), CC_CLUB_TOWN_FIELD_ID: uuid(8), CC_CLUB_TIME_FIELD_ID: uuid(9),
};
const originalFetch = globalThis.fetch;
const originalEnv = Object.fromEntries(Object.keys(settings).map((key) => [key, process.env[key]]));
before(() => Object.assign(process.env, settings));
after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

const db = {
  prepare() {
    return {
      first: async () => ({ access_token: "test-token", refresh_token: "test-refresh", expires_at: Date.now() + 3600000 }),
    };
  },
} as unknown as D1Database;

function request(payload: object) {
  return new Request("https://downsizebaltimore.com/api/signups", {
    method: "POST", headers: { Origin: "https://downsizebaltimore.com", "Content-Type": "application/json", "cf-connecting-ip": crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
}

test("rejects malformed and forged submissions", async () => {
  assert.equal(validateSignup({ kind: "newsletter", source: "footer", name: "A", email: "bad" }), null);
  const forged = new Request("https://downsizebaltimore.com/api/signups", { method: "POST", headers: { Origin: "https://other.example", "Content-Type": "application/json" }, body: "{}" });
  assert.equal((await handleConstantContact(forged, { DB: db })).status, 403);
});

test("newsletter uses only its list and awaits provider success", async () => {
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ url: String(input), body: JSON.parse(String(init?.body)) });
    return Response.json({ contact_id: uuid(10), action: "created" }, { status: 201 });
  };
  const response = await handleConstantContact(request({ kind: "newsletter", source: "footer", name: "Test Person", email: "test@example.com" }), { DB: db });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].body.list_memberships, [uuid(1)]);
  assert.equal(calls[0].body.email_address, "test@example.com");
});

test("Club does not add newsletter without its separate checkbox and tags the contact", async () => {
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ url: String(input), body: JSON.parse(String(init?.body)) });
    return Response.json(calls.length === 1 ? { contact_id: uuid(10), action: "created" } : { activity_id: uuid(11) }, { status: calls.length === 1 ? 201 : 202 });
  };
  const payload = { kind: "club", source: "resource-center", name: "Test Person", email: "club@example.com", mailingAddress: "123 Main St", phone: "555-0101", timing: ["Ready to start soon"], planningFor: ["Myself"], partOfTown: "Towson", timeOfDay: ["Daytime"], newsletter: false };
  const response = await handleConstantContact(request(payload), { DB: db });
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0].body.list_memberships, [uuid(2)]);
  assert.equal(calls[0].body.phone_number, "555-0101");
  assert.equal((calls[0].body.custom_fields as object[]).length, 6);
  assert.equal(calls[1].url, "https://api.cc.email/v3/activities/contacts_taggings_add");
  assert.deepEqual(calls[1].body.tag_ids, [uuid(3)]);
  calls.length = 0;
  const both = await handleConstantContact(request({ ...payload, email: "both@example.com", newsletter: true }), { DB: db });
  assert.equal(both.status, 200);
  assert.deepEqual(calls[0].body.list_memberships, [uuid(2), uuid(1)]);
  globalThis.fetch = async () => Response.json({ error: "down" }, { status: 503 });
  assert.equal((await handleConstantContact(request({ ...payload, email: "failure@example.com", newsletter: true }), { DB: db })).status, 503);
});
