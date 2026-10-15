import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Vendor the existing Google response, not a rebuilt/re-subsetted font release.
// Once provenance exists, reruns use its exact CSS and pinned binary hashes.
// New upstream releases must be reviewed as a separate typography change.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(root, "client/public/fonts");
const provenancePath = path.join(destination, "provenance.json");
const cssRequest = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36";
const families = {
  "Cormorant Garamond": {
    slug: "cormorant-garamond", deliveryVersion: "v21", providerPath: "cormorantgaramond",
    licenseUrl: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt",
    copyright: "Copyright 2015 the Cormorant Project Authors",
  },
  "DM Sans": {
    slug: "dm-sans", deliveryVersion: "v17", providerPath: "dmsans",
    licenseUrl: "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt",
    copyright: "Copyright 2014 The DM Sans Project Authors",
  },
};
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function fetchBytes(url, limit) {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent }, signal: AbortSignal.timeout(30_000), redirect: "error",
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.length > 0 && bytes.length <= limit, `Unexpected response size: ${url}`);
  return bytes;
}
async function writeImmutable(filename, bytes) {
  const target = path.join(destination, filename);
  try {
    await writeFile(target, bytes, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    assert.deepEqual(await readFile(target), bytes, `Refusing to overwrite ${filename}`);
  }
}

let previous = null;
try { previous = JSON.parse(await readFile(provenancePath, "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
if (previous) {
  assert.equal(previous.schemaVersion, 1);
  assert.equal(previous.source.cssRequest, cssRequest);
  assert.equal(sha256(previous.source.css), previous.source.sha256);
}
const originalCss = previous?.source.css ?? (await fetchBytes(cssRequest, 100_000)).toString("utf8");
const faces = [...originalCss.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*\{([^}]+)\})/g)].map((match) => {
  const field = (name) => match[3].match(new RegExp(`${name}:\\s*([^;]+);`))?.[1];
  return {
    subset: match[1], family: field("font-family")?.replace(/^'|'$/g, ""),
    style: field("font-style"), weight: field("font-weight"), display: field("font-display"),
    unicodeRange: field("unicode-range"), originalUrl: field("src")?.match(/url\(([^)]+)\)/)?.[1],
  };
});
assert.equal(faces.length, 33, "Unexpected provider face count; review before vendoring");
assert.equal((originalCss.match(/@font-face/g) ?? []).length, faces.length);
for (const face of faces) {
  const family = families[face.family];
  assert.ok(family && face.unicodeRange && face.display === "swap");
  const allowedWeights = face.family === "DM Sans" ? ["400", "500", "600", "700"]
    : face.style === "italic" ? ["400", "500"] : ["400", "500", "600"];
  assert.ok(allowedWeights.includes(face.weight));
  assert.ok(face.style === "normal" || (face.family === "Cormorant Garamond" && face.style === "italic"));
  assert.ok(face.originalUrl?.startsWith(`https://fonts.gstatic.com/s/${family.providerPath}/${family.deliveryVersion}/`));
  assert.ok(face.originalUrl.endsWith(".woff2"));
}
const sourceUrls = [...new Set(faces.map((face) => face.originalUrl))];
assert.equal(sourceUrls.length, 12, "Unexpected provider file count; review before vendoring");
const downloads = await Promise.all(sourceUrls.map(async (originalUrl) => {
  const face = faces.find((item) => item.originalUrl === originalUrl);
  const bytes = await fetchBytes(originalUrl, 2_000_000);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "wOF2", "Not a WOFF2 file");
  const hash = sha256(bytes);
  const filename = `${families[face.family].slug}-${face.style}-${face.subset}.${hash.slice(0, 16)}.woff2`;
  const record = {
    family: face.family, style: face.style, subset: face.subset,
    weights: [...new Set(faces.filter((item) => item.originalUrl === originalUrl).map((item) => item.weight))],
    deliveryVersion: families[face.family].deliveryVersion,
    originalUrl, path: `/fonts/${filename}`, sha256: hash, bytes: bytes.length,
  };
  if (previous) assert.deepEqual(record, previous.files.find((item) => item.originalUrl === originalUrl), "Pinned provider binary changed");
  return { filename, bytes, record };
}));
const licenseDownloads = await Promise.all(Object.entries(families).map(async ([family, config]) => {
  const bytes = await fetchBytes(config.licenseUrl, 30_000);
  const license = bytes.toString("utf8");
  assert.ok(license.includes(config.copyright) && license.includes("SIL OPEN FONT LICENSE Version 1.1"));
  const hash = sha256(bytes);
  const filename = `${config.slug}.OFL.${hash.slice(0, 16)}.txt`;
  const record = { family, license: "SIL Open Font License 1.1", originalUrl: config.licenseUrl,
    path: `/fonts/${filename}`, sha256: hash, bytes: bytes.length };
  if (previous) assert.deepEqual(record, previous.licenses.find((item) => item.family === family), "Pinned license changed; review provenance");
  return { filename, bytes, record };
}));
let localCss = originalCss;
for (const { record } of downloads) localCss = localCss.replaceAll(record.originalUrl, record.path);
assert.ok(!/https?:|@import/i.test(localCss));
const cssHash = sha256(localCss);
const cssFilename = `fonts.${cssHash.slice(0, 16)}.css`;
const manifest = {
  schemaVersion: 1,
  fetchedAt: previous?.fetchedAt ?? new Date().toISOString(),
  source: { cssRequest, userAgent, sha256: sha256(originalCss), css: originalCss },
  preservation: "Exact provider WOFF2 bytes; all 33 original face descriptors preserved. Only src URLs changed. No re-encoding, subsetting, new weights, metrics, or font-display change.",
  stylesheet: { path: `/fonts/${cssFilename}`, sha256: cssHash, bytes: Buffer.byteLength(localCss), faceCount: faces.length },
  files: downloads.map((item) => item.record), licenses: licenseDownloads.map((item) => item.record),
};
if (previous) assert.deepEqual(manifest, previous, "Pinned provenance changed");
await mkdir(destination, { recursive: true });
for (const item of [...downloads, ...licenseDownloads]) await writeImmutable(item.filename, item.bytes);
await writeImmutable(cssFilename, localCss);
await writeImmutable("provenance.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Vendored ${downloads.length} exact WOFF2 files and ${licenseDownloads.length} OFL licenses.`);
console.log(`Stylesheet: ${manifest.stylesheet.path}`);
console.log("client/index.html is not automatically modified; update only its font-delivery links.");
