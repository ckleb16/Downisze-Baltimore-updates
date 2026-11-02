import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { test } from "node:test";
import { handleGodaddyApi } from "../server/godaddyApi";
import { exportSignups, saveSignup, signupSummary } from "../server/signupLists";
import { openApplicationDatabase } from "../server/sqliteD1";

const root = resolve(process.cwd(), ".data", "signup-tests");
mkdirSync(root, { recursive: true });

function request(payload: object, origin = "https://downsizebaltimore.com") {
  return new Request("https://downsizebaltimore.com/api/signups", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", "cf-connecting-ip": crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
}

test("stores separate lists and protects private CSV exports", async () => {
  const directory = mkdtempSync(join(root, "run-"));
  const db = openApplicationDatabase(directory);
  try {
    const newsletter = { kind: "newsletter", source: "guide", name: '=HYPERLINK("https://example.com")', email: " GUIDE@EXAMPLE.COM " };
    assert.equal((await saveSignup(request(newsletter), db)).status, 200);
    assert.equal((await saveSignup(request(newsletter), db)).status, 200);
    assert.equal((await saveSignup(request(newsletter, "https://other.example"), db)).status, 403);

    const club = { kind: "club", source: "resource-center", name: "Test Person", email: "club@example.com", mailingAddress: "123 Main St", phone: "555-0101", timing: ["Ready to start soon"], planningFor: ["Myself"], partOfTown: "Towson", timeOfDay: ["Daytime"], newsletter: false };
    assert.equal((await saveSignup(request(club), db)).status, 200);
    let summary = await (await signupSummary(db)).json();
    assert.equal(summary.newsletter.count, 1);
    assert.equal(summary.club.count, 1);

    assert.equal((await saveSignup(request({ ...club, newsletter: true }), db)).status, 200);
    summary = await (await signupSummary(db)).json();
    assert.equal(summary.newsletter.count, 2);
    assert.equal(summary.club.count, 1);

    const newsletterCsv = await exportSignups(db, "newsletter");
    assert.equal(newsletterCsv.headers.get("Cache-Control"), "private, no-store");
    assert.match(newsletterCsv.headers.get("Content-Disposition") || "", /attachment/);
    const newsletterText = await newsletterCsv.text();
    assert.match(newsletterText, /'\=HYPERLINK/);
    assert.match(newsletterText, /guide@example.com/);
    assert.match(newsletterText, /downsizers-club/);

    const clubText = await (await exportSignups(db, "club")).text();
    assert.match(clubText, /123 Main St/);
    assert.match(clubText, /Ready to start soon/);
    assert.match(clubText, /"Yes"/);

    const unauthorized = await handleGodaddyApi(
      new Request("https://downsizebaltimore.com/api/admin/signups/club.csv"),
      { DB: db, mediaDirectory: join(directory, "media") },
    );
    assert.equal(unauthorized.status, 401);

    (db as unknown as { close(): void }).close();
    const reopened = openApplicationDatabase(directory);
    try {
      const persisted = await (await signupSummary(reopened)).json();
      assert.equal(persisted.newsletter.count, 2);
      assert.equal(persisted.club.count, 1);
    } finally {
      (reopened as unknown as { close(): void }).close();
    }
  } finally {
    try { (db as unknown as { close(): void }).close(); } catch { /* already closed */ }
    if (!resolve(directory).startsWith(root + sep)) throw new Error("Unsafe test cleanup path.");
    rmSync(directory, { recursive: true, force: true });
  }
});
