# PRD 02 — Faster mobile loading, same website

Status: proposed; P1. Owner: frontend/platform engineer. Dependencies: PRD 07 parity baseline; coordinate HTML resource discovery with PRD 03. Evidence: E01–E06, E11. Estimate: 10–18 hours, excluding the optional rendering implementation.

## Outcome and limits

Improve the existing mobile experience without changing the approved design, wording, media identity, or functionality. Desktop already scores 98; preserve it. Do not chase a perfect Lighthouse score by removing content, carousels, fonts, video, or testimonials.

## Requirements and acceptance

| ID | Implementation requirement | Acceptance evidence |
| --- | --- | --- |
| PERF-01 | Make the correct route's LCP image discoverable in initial server HTML, using a responsive preload or approved same-content render path. Source responsive candidates from shared media metadata | HTML contains correct `imagesrcset`/`imagesizes` or the actual image; browser requests the selected candidate early, before waiting for Home JS; no duplicate hero download; eager/high-priority remains |
| PERF-02 | Optimize existing hero variants and right-size the header logo for CSS size and DPR. Verify actual file dimensions against the media manifest | All variants load; correct MIME/dimensions; identical image composition, transparency and crop; side-by-side visual review at 1×/2× DPR; no CLS regression |
| PERF-03 | Compare licensed self-hosted WOFF2 versions of the exact current Cormorant Garamond and DM Sans faces against present delivery. Keep required weights/italics/glyph coverage and existing appearance | Font/license provenance documented; computed fonts, line wraps, heading height, and italic treatment match; only immediately needed faces preloaded; avoid synthetic styles and excessive preload bandwidth |
| PERF-04 | Split or remove CSS only with multi-route/state coverage and cascade analysis. Keep critical layout styles available before paint | Per-route CSS/request comparison; no flash of unstyled content or delayed menu/form styling; all PRD 07 screenshots and interactions pass |
| PERF-05 | Analyze the actual production JS bundle. Reduce avoidable initial imports or request waterfalls without pulling all routes into Home | Saved build report before/after; publisher/editor code not eagerly downloaded by public Home; no new long tasks, loading regressions, or broken lazy routes |
| PERF-06 | Preserve existing lazy loading below the fold, stable media sizing, video poster/controls, byte-range playback, and content hashes. Verify network behavior instead of inferring transfer size from the repository | No new eager video download or autoplay; navigation never loads an unrelated hero; cache behavior matches content versioning |
| PERF-07 | Record repeatable before/after homepage and representative deep-route measurements | Three cold-load runs per tested route/device with the same harness/version/settings, deployment, and timestamp; report median and range, not the best run |

## Specific cautions

- `ResponsiveImage.tsx` already sets priority correctly. Adding more `fetchpriority` is not the missing fix.
- A responsive preload must match the browser's image choice; a fixed desktop `href` that causes a second mobile download fails acceptance.
- The 1536w hero's verified intrinsic dimensions are 1536×1024 and match its HTML/manifest. Do not alter correct width/height or crop based only on the report's sizing-diagnostic wording. Verify other media independently before proposing a correction.
- Prefer lossless/reversible optimizations first. Lossy re-encoding requires no perceptible quality change; visible blur, color shifts, new crop, asset replacement, or AI modification needs explicit user approval. Retain original approved assets.
- Do not rerun the entire `scripts/optimize_media.py` branding generation path as a general optimization. Isolate approved input/output files.
- Google Fonts preconnects already exist. Do not add origins speculatively. If self-hosting changes font metrics, stop and seek approval or keep the original delivery.
- Do not delete CSS based on Home-only coverage, hide content with `content-visibility` without testing anchors/accessibility, or asynchronously load all global CSS at the cost of visible flashes.
- Installed package count is not bundled JS size. Only change dependencies after inspecting real imports and measured output.

## Targets and release decision

| Measure | Baseline mobile | Engineering target |
| --- | ---: | ---: |
| Performance | 81 | Median ≥90 |
| FCP | 3.0 s | Median ≤1.8 s |
| LCP | 3.7 s | Median ≤2.5 s |
| TBT | 0 ms | Aim to retain 0; investigate any repeatable increase, never accept >100 ms without explicit exception |
| CLS | 0 | Retain 0 within measurement precision; investigate any repeatable increase; ceiling 0.02 |
| Accessibility / Best Practices / SEO | 100 each | No regression in equivalent automated checks |

Targets are not forecasts; determine feasibility from controlled before/after measurements. Keep desktop median ≥95 and investigate >10% repeatable LCP deterioration. No visible/text regression is acceptable to reach these targets. If a target cannot be met safely, document the constraint and obtain an explicit release exception; do not quietly lower it.

Track field LCP/INP/CLS separately when enough data exists. Field goals are LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75. The present report has no field baseline and TBT does not establish INP.

## Touchpoints and rollback

`client/index.html`, `server/index.ts`, `client/src/components/ResponsiveImage.tsx`, `client/src/lib/responsiveMedia.ts`, `client/src/components/SiteHeader.tsx`, `client/src/App.tsx`, `client/src/index.css`, `vite.godaddy.config.ts`, and narrowly scoped media tooling.

Keep font, image, CSS and JS changes in independently reversible commits. Use new fingerprinted outputs, retain old files needed by cached HTML, and roll back HTML/assets together. Restore prior font delivery if glyph coverage or typography differs. No framework migration is included here.

The current optimizer can retain the original filename stem when regenerating derived WebPs, while the server recognizes those names as eligible for one-year immutable caching. A changed file must receive a genuinely new output-content-derived fingerprint and updated references; merely overwriting the old `_6750abaf`-style filename fails cache acceptance. Verify a browser with the prior version cached receives the new asset through its new URL.
