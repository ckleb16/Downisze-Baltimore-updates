# PRD 03 and follow-up audit: local implementation status

Updated October 26, 2026. This branch is for review; it has not been deployed. The client-facing site wording is unchanged. The one intentional visual correction is the Resource Center closing phrase, changed from low-contrast gold to existing warm brown.

## Implemented and checked

- Server and client now share route/article metadata rules. A navigation updates title, description, canonical, robots, Open Graph, Twitter and article published-date tags, with no duplicate/stale tags. Existing wording is retained.
- The production robots policy narrowly permits `/api/posts` and published post-detail requests needed by the JavaScript-rendered archive/articles. All other `/api/` paths remain disallowed, private responses remain noindex, and public API responses carry an `X-Robots-Tag: noindex` response header. The server still enforces published-only access; robots rules are not security controls.
- Published article, draft, missing, preview, publisher, sitemap and domain-canonical paths were exercised against a production build and an isolated temporary database. Technical SEO: 377 checks; page metadata: 171; canonical redirects: 103; domain redirects: 621.
- The question carousel now uses a `div role="group"` slide, preserving its visible behavior while removing an invalid role on `article`.
- The Resource Center closing italic text now has measured 5.58:1 contrast against the audited cream background, above the 4.5:1 normal-text criterion. No words or other colors changed.
- Route and article loading states reserve a mobile viewport of height, preventing a temporarily visible footer from jumping when the article arrives. Three local 390px-width cold browser runs under a repeatable 150ms/1.6Mbps/4× CPU throttle measured article layout-shift sums of 0.000156 each and LCP of 2.58–2.67 seconds. These are **local laboratory observations, not production PageSpeed or field data**.
- Production build, full TypeScript check, 920 performance-resource checks, 71 QA repair checks, 30 GoDaddy production checks, 22 source integration checks and the focused audit regression check pass. The old database-adapter type mismatch was fixed without suppressing the check.

## Still open; do not overstate completion

- Initial HTML still has an empty React root. The page body appears after JavaScript; metadata and public API crawl access reduce avoidable problems but do not make the site no-JS readable. Google can render JavaScript; actual indexing must be verified in Search Console. Same-content SSR/prerendering remains PRD 03 phase B and requires an explicit implementation/release decision because dynamic articles, hydration and caches make it a substantial change.
- A static snapshot could help fixed routes but would be stale for published articles without invalidation. Responsive HTML preload already improves hero discovery but cannot supply page text. Existing Express/React SSR with hydration is the strongest candidate for no-JS content, provided a prototype meets dynamic-post freshness, 404/private safety, visual parity and Node 22 requirements. No framework migration is assumed.
- The 288 KB raw/roughly 48 KB gzip shared stylesheet, all-route critical CSS, image encoding and further JS delivery require controlled visual tests before changing. Local LCP numbers cannot be compared directly with production PageSpeed scores. The prior production mobile article report recorded performance 73, LCP 3.6 seconds and CLS 0.258; rerun after an authorized deployment.
- The www-to-apex 308 is implemented in this branch's ancestry, but the live host will remain unchanged until deployment. Legacy-domain page mappings and hosting redirects still need the owner/GoDaddy inventory and access.
- Business identity/structured data, Search Console inspection, production Node 22/browser parity, provider integrations and final deployment remain gated by owner facts, access or release approval. The unfinished email sign-up branch is not part of this release path.

## Release check

After explicit deployment authorization, release only the reviewed branch (not the unfinished sign-up worktree), verify the target Node 22 host and persistent publisher data, then rerun `/robots.txt`, `/sitemap.xml`, a published article/API fetch, www redirect, production mobile PageSpeed and Search Console URL Inspection. Roll back the complete code bundle if any publisher, metadata or article-state regression occurs. Do not alter DNS or old-host redirects as part of this code release.
