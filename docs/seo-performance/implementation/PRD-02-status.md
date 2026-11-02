# PRD 02 — Performance implementation status

Updated October 14, 2026. Branch: `codex/prd-02-mobile-performance`, based on PRD 01 (`edece5a`). Implemented for review, **not deployed or release-approved**. No approved wording, photo, crop, styling declaration, or interaction was intentionally changed.

## Implemented

- PERF-01: Initial GoDaddy HTML now contains one route-specific responsive image preload. The server and seven existing priority images share source, sizes, and candidate generation. Home and Downsizing hints apply at every width. Five split portraits are hinted only above their existing stacking breakpoints, avoiding an extra mobile preload competing with opening text. Guides, archive, articles, publisher and missing pages receive no unrelated hero hint. Existing eager/high-priority image behavior remains.
- PERF-03: Locally bundled exact Google-delivered Cormorant Garamond v21 and DM Sans v17 WOFF2 bytes, with all 33 original style/weight/unicode-range/display descriptors. Twelve unique files cover all original subsets; the browser requests needed subsets. Two OFL licenses, source CSS/URLs, SHA-256 hashes and fetch timestamp are retained in `client/public/fonts/provenance.json`. No font preload was added; comparing preload strategies remains a measurement task. New assets have output-content fingerprints and immutable cache headers. The vendor script refuses silently changed upstream bytes after pinning.
- PERF-05: Removed unused global Toaster and TooltipProvider imports. No reachable page used either consumer; the active light ThemeProvider and publisher dialogs remain. Route and Markdown/editor code remains lazy.
- PERF-06: Existing responsive image bytes, dimensions, sizes, lazy below-fold images, video poster/controls and media files are untouched. Font provenance/license files are excluded from utility-class scanning so they cannot accidentally add CSS rules.
- Added resource/font checks to Node 22 production-only CI, enabled on sequential `codex/prd-*` branches.

## Build comparison

| Asset | Baseline | After | Difference |
| --- | ---: | ---: | ---: |
| Main entry JavaScript | 310,197 bytes | 269,320 bytes | −40,877 bytes (13.18%) |
| Same entry, gzip | 97,720 bytes | 85,906 bytes | −11,814 bytes (12.09%) |
| Main stylesheet | 288,012 bytes | 288,012 bytes | Identical `index-dMurukAP.css` output |

Baseline entry `index-Do2j4pjE.js` was recorded before edits and its 310,197-byte live copy checked for the gzip comparison. Updated entry is `index-CXwNYoFB.js`. Both gzip sizes use the same local gzip function. These are **bundle sizes, not PageSpeed scores or measured load times**. Font payload is not claimed smaller; self-hosting removes the external stylesheet/font-origin dependency while preserving bytes.

## Verification completed

- Production build passes on trusted bundled Node 24.19.0. Deployment uses Node 22; CI verification on that runtime remains required for this batch.
- `test-performance-resources.mjs`: 920 assertions passed. Seven route mappings, shared rendered props, initial HTML/query variants, negative routes, viewport-before-preload order, 28 hero candidate MIME/dimensions/byte identity/cache headers, and local font/CSS/license bytes/MIME/cache behavior. Preview remains noindex.
- `test-local-fonts.mjs`: passed. Twelve hashes, 33 unchanged descriptors, licenses, immutable CSS, no external font link or extra font preloads.
- Canonical helper 103, production redirects 621, existing GoDaddy production 30, source integration 22 checks passed during this batch.
- Browser baseline before frontend edits: eleven fixed public routes, including the archive with the seeded published article, at 320, 390, 768, 1024, 1440 and 1920 CSS-pixel widths. Heights: 844 / 960 / 1080 for mobile / tablet / desktop pairs. Compared 5,082 rendered heading, paragraph, link, button, image and video records across 66 views. All visible text, selected image attributes, font families/weights/sizes/line heights, colors and element dimensions matched (0.05 CSS-pixel numeric tolerance). Sixty views matched all inspected fields; six Home views differed only by a uniform 4.18–8.48px Y translation of five hero-copy descendants. This matches the unchanged `rise` animation (`translateY(20px)` to zero in 0.7 seconds); no text or dimensions were masked.
- Full-page baseline captures were retained in the temporary browser inspection session; this is **not** a persisted pixel-diff artifact or full PRD-07 certification. Representative mobile output was visually inspected.
- Mobile menu opens and closes with Escape. All three question states and five testimonial states cycle correctly; testimonial expansion/collapse updates `aria-expanded`. Empty contact-form submission stays on the page, identifies four invalid required controls and focuses Name without opening an email draft. Logged-out publisher renders. Automated production tests cover disposable publisher/API persistence behavior, not a complete authenticated browser-dialog audit.
- `git diff --check` passes.
- Git attributes preserve exact fingerprinted font/CSS/license bytes across Windows and Linux. All 15 committed fingerprinted blobs match provenance hashes, including the original DM Sans license line endings. The GitHub connector returned no workflow runs for this branch SHA; remote CI success is not assumed.

## Still required; no exception assumed

1. PERF-02: No further hero encoding or header-logo resizing. Approved image bytes remain unchanged; new encoded outputs require 1×/2× visual comparison and new content hashes.
2. PERF-04: No stylesheet pruning/splitting. Historical overrides and interactive states require coverage first.
3. PERF-07: Three controlled cold-load measurements per device/representative route, median/range, and network evidence of preload reuse/early discovery remain pending. The browser inspection surface did not expose Resource Timing; the public unauthenticated PSI API returned quota exhaustion during investigation. No new Lighthouse score, LCP, CLS or field improvement is claimed.
4. Published-article visual comparison, every non-default state, persisted pixel diffs, real iOS/Android and Firefox/Safari tests remain release gates. Six-width fixed-page DOM checks are not substitutes.
5. Full TypeScript check still reports the pre-existing `server/sqliteD1.ts:82` missing `size_after` / `changed_db` metadata. Production build passes, but this issue is queued for PRD 04 and blocks calling the repository release-ready.
6. Confirm the authorized GoDaddy deployment serves font files with tested MIME/cache behavior. No domain, hosting, production database or tracking configuration was changed.

## Rollback / approval

Keep resource hints, dormant-provider cleanup and local fonts independently reversible. Restore matching HTML/JavaScript/assets together; retain old fingerprinted assets needed by cached pages. Font rollback restores original Google CSS/preconnect links; no data migration is involved. Do not deploy before outstanding measurement/parity gates pass or the owner explicitly accepts a documented exception.

References: [responsive preload guidance](https://web.dev/articles/preload-responsive-images), [Cormorant Garamond license](https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt), [DM Sans license](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt).

October 26 follow-up: The previously noted SQLite adapter type mismatch has been repaired on the subsequent `codex/prd-03-technical-seo` branch, and the full TypeScript check passes there. Three local throttled Chrome runs are recorded in [the PRD 03/audit status](PRD-03-status.md); they are not a substitute for post-deployment PageSpeed, real-user data, or the remaining visual-parity gates above.
