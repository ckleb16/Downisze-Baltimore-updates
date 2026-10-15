import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Offline integrity/preservation check. Typography and cold-load layout still
// require the PRD-07 browser comparison; byte equality alone is not visual QA.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "client/public");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const manifest = JSON.parse(await readFile(path.join(publicRoot, "fonts/provenance.json"), "utf8"));
const sourceCss = manifest.source.css;
const html = await readFile(path.join(root, "client/index.html"), "utf8");
assert.equal(manifest.schemaVersion, 1);
assert.ok(Number.isFinite(Date.parse(manifest.fetchedAt)), "Fetch date must be recorded");
assert.equal(manifest.source.cssRequest, "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap");
assert.equal(sha256(sourceCss), manifest.source.sha256);
assert.equal(manifest.files.length, 12);
assert.equal(manifest.licenses.length, 2);
assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html), "HTML must not depend on external font servers");
assert.ok(html.includes(`href="${manifest.stylesheet.path}" rel="stylesheet"`), "HTML uses the fingerprinted local stylesheet");
assert.ok(html.includes("<!--__ROUTE_RESOURCE_HINTS__-->"), "Route-resource marker is preserved");
assert.ok(!/<link\b[^>]*as=["']font["']/i.test(html), "Initial comparison must not add font preloads");

async function verifyFile(record, extension) {
  assert.match(record.path, new RegExp(`^/fonts/[a-z0-9.-]+\\.${record.sha256.slice(0, 16)}\\.${extension}$`, "i"));
  const bytes = await readFile(path.join(publicRoot, record.path.slice(1)));
  assert.equal(bytes.length, record.bytes, `Byte count: ${record.path}`);
  assert.equal(sha256(bytes), record.sha256, `Content hash: ${record.path}`);
  return bytes;
}
const localCss = (await verifyFile(manifest.stylesheet, "css")).toString("utf8");
assert.ok(!/https?:|@import|local\(/i.test(localCss), "Only exact bundled font resources are allowed");
const originalFaces = [...sourceCss.matchAll(/@font-face\s*\{([^}]+)\}/g)].map((match) => match[1]);
const localFaces = [...localCss.matchAll(/@font-face\s*\{([^}]+)\}/g)].map((match) => match[1]);
assert.equal(originalFaces.length, 33);
assert.equal(localFaces.length, 33);
assert.equal(manifest.stylesheet.faceCount, 33);
const fileUrls = [...new Set([...localCss.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]))];
assert.deepEqual(fileUrls.sort(), manifest.files.map((item) => item.path).sort());
let restoredCss = localCss;
for (const file of manifest.files) {
  const bytes = await verifyFile(file, "woff2");
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "wOF2");
  assert.match(file.originalUrl, /^https:\/\/fonts\.gstatic\.com\/s\/(?:cormorantgaramond\/v21|dmsans\/v17)\/[a-zA-Z0-9_-]+\.woff2$/);
  restoredCss = restoredCss.replaceAll(file.path, file.originalUrl);
}
assert.equal(restoredCss, sourceCss, "Every descriptor, subset, and rule order matches the captured provider CSS");
const descriptorCounts = new Map();
for (let index = 0; index < localFaces.length; index++) {
  const read = (name) => localFaces[index].match(new RegExp(`${name}:\\s*([^;]+);`))?.[1];
  assert.equal(read("font-display"), "swap");
  assert.ok(read("unicode-range"));
  const key = `${read("font-family")}/${read("font-style")}/${read("font-weight")}`;
  descriptorCounts.set(key, (descriptorCounts.get(key) ?? 0) + 1);
  const withoutUrl = (face) => face.replace(/url\([^)]+\)/, "url(PRESERVED_BINARY)");
  assert.equal(withoutUrl(localFaces[index]), withoutUrl(originalFaces[index]));
}
const expected = new Map([
  ...["400", "500", "600"].map((weight) => [`'Cormorant Garamond'/normal/${weight}`, 5]),
  ...["400", "500"].map((weight) => [`'Cormorant Garamond'/italic/${weight}`, 5]),
  ...["400", "500", "600", "700"].map((weight) => [`'DM Sans'/normal/${weight}`, 2]),
]);
assert.deepEqual([...descriptorCounts].sort(), [...expected].sort());
for (const license of manifest.licenses) {
  const text = (await verifyFile(license, "txt")).toString("utf8");
  assert.ok(text.includes("SIL OPEN FONT LICENSE Version 1.1"));
  assert.ok(text.includes(license.family === "DM Sans"
    ? "Copyright 2014 The DM Sans Project Authors" : "Copyright 2015 the Cormorant Project Authors"));
  assert.match(license.originalUrl, /^https:\/\/raw\.githubusercontent\.com\/google\/fonts\/main\/ofl\/(?:cormorantgaramond|dmsans)\/OFL\.txt$/);
}
console.log("Local fonts passed: 12 byte-hashed WOFF2 files, 33 unchanged face descriptors, 2 OFL licenses, immutable CSS, no external font dependency or new preloads.");
