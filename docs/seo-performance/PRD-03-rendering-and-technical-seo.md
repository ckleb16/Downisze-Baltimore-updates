# PRD 03 — Reliable discovery and technical SEO

Status: proposed; P1 foundation / P2 expansion. Owner: full-stack engineer; owner verifies business facts. Dependencies: PRD 01 canonical destination, PRD 07 parity baseline, Search Console access where available. Evidence: E08–E12. Estimate: phase A 6–10 hours; optional phase B 16–30 hours after a rendering decision.

## Problem and intended outcome

Server-generated head metadata already exists, but the initial HTML body is empty until JavaScript renders. Client metadata effects do not keep all head fields in sync. Article content depends on public API paths currently covered by a robots disallow rule. Reduce avoidable crawl/render dependencies while preserving all approved content.

Google can render JavaScript. Do not describe this site as unindexable without Search Console evidence. The scope is reliable access and parity, not a replacement of the application solely for SEO.

## Phase A: Technical correctness and decision record

| ID | Requirement | Acceptance |
| --- | --- | --- |
| SEO-01 | Use a shared route/post metadata model for the initial response and client transitions; update canonical, robots, OG/Twitter and article fields as well as title/description | Direct load, internal navigation, back/forward, unknown article, and publisher transitions end with exactly one correct instance of each tag; no stale article/date/URL tags; existing approved words unchanged |
| SEO-02 | Audit crawler dependencies, especially `/api/posts` and `/api/posts/:slug`, and distinguish public content from publisher/session endpoints | Document actual Google rendered HTML/resources when access permits. If client fetching remains necessary, narrowly allow required published-content endpoints or remove the dependency with server rendering; never expose private endpoints/data or blanket-allow all `/api/` |
| SEO-03 | Preserve indexability rules for production versus preview and private/404 states | Production recognized pages have expected robots/canonical values; publisher, drafts, previews and missing pages are noindex. Preview HTML and robots are checked, not just the environment variable |
| SEO-04 | Keep sitemap exhaustive for published canonical URLs only, with truthful modification dates and deterministic output | All current 12 URLs plus newly published eligible posts; no drafts, aliases, tracking parameters, missing posts or private URLs; every listed URL succeeds; publish/unpublish lifecycle reflected |
| SEO-05 | Eliminate route-origin drift in emitted metadata and test the GoDaddy template replacement | No old preview-host URLs in production head; preview is not indexed; social image URL resolves. No new social image or rewritten social text without approval |
| SEO-06 | Produce a bounded comparison of responsive HTML preload, static prerender plus hydration, and React server rendering within the existing Express deployment | One decision record includes raw/rendered content, LCP, implementation complexity, dynamic-article behavior, parity risks and operating cost; select approach before phase B |
| SEO-07 | Prepare minimal structured data using only existing visible, verified facts and owner-confirmed identity | Schema validation has no errors; approved fact sheet and stable entity IDs exist; no invented claims, ratings, services, addresses or opening hours |

### Structured data boundaries

Model Mary as a Person and the correct business/brokerage relationship as supported by verified facts; consider the appropriate LocalBusiness/RealEstateAgent type only after identity and eligibility review. Add Article data for published articles using the existing title, author, dates, canonical URL and applicable images. Do not invent `dateModified` or a local office. Use only verified `sameAs` profiles.

Do not add self-serving aggregate-rating markup to force stars, mark private content as public, or imply a certification not verified by the owner. Do not promise FAQ rich results for a real estate site. Breadcrumb markup must reflect a genuine hierarchy and Google's requirements; any new visible breadcrumb UI requires separate approval. JSON-LD must safely escape user-editable content and stay synchronized with the visible page. Any new or changed wording/factual claim requires approval even if it appears only in metadata.

## Phase B: Same-content rendering (optional, gated)

Prefer a narrow solution compatible with Node 22/Express/Vite over a platform rewrite. Phase B requires an explicit implementation decision and budget; merging the planning PR does not authorize it.

| ID | Requirement | Acceptance |
| --- | --- | --- |
| RENDER-01 | Render existing meaningful public content and navigation into initial HTML for agreed templates, serving the same content to people and bots | No-JS HTML contains the approved main heading, primary copy and real links; after hydration text, styling, carousels and controls match the baseline; no duplicate roots/content or hydration errors |
| RENDER-02 | Make current published archive/article content available without waiting for a disallowed crawler fetch | A newly published/edited/unpublished test article appears/updates/disappears in HTML, metadata and sitemap coherently within the documented invalidation interval; drafts never enter public output |
| RENDER-03 | Design an explicit refresh/invalidation policy; do not snapshot live articles only at a code deployment | Publishing needs no unrelated redeploy. Target freshness ≤60 seconds or an owner-approved alternative. Unpublish denies fresh origin access immediately; any previously published cached output expires within the documented ≤60-second bound, without stale-while-revalidate extending visibility; never-published drafts/images remain private |
| RENDER-04 | Keep browser-only APIs out of server execution and preserve hydration semantics | Deterministic date formatting, IDs and initial carousel state; no `window`/storage crashes on server; no duplicate analytics or fetch loops; Node production build/tests pass |
| RENDER-05 | Preserve truthful response states | Unknown/deleted public URLs return real 404/410; transient backend failures are not mislabeled permanently missing; no anonymous access to drafts/publisher records; follow runtime failure policy in PRD 04 |

Archive pagination beyond 20 posts needs a crawlability plan. Ensure every published article remains discoverable from the sitemap and meaningful links; if proposing visible pagination or link-label changes, route those through PRD 06. No hidden keyword blocks or bot-only alternate content.

Published insight images currently have a public 60-second cache lifetime. Do not promise revocation of copies someone already downloaded; test new origin access and HTTP-cache expiry separately. No new prerender/CDN cache may lengthen the approved unpublish exposure, and private image responses must remain uncached and authorized.

## Validation matrix

- Compare raw HTML and rendered DOM on all 12 current public URLs; assert approved heading/body text parity and functioning anchors/downloads.
- Test `/` → a service → an article → a different article → missing page → back; test direct deep links separately. Metadata tests must use the actual navigation implementation and not assume every link uses the client router.
- Test published/draft/missing article states, first/multiple/empty archive pages, API failure and network delay in an isolated database.
- Inspect production robots and actual allowed resource paths; Search Console URL Inspection is additional evidence, not a substitute for local deterministic tests.
- Validate schema with the relevant schema validator and Google's Rich Results Test where applicable. Distinguish valid schema from rich-result eligibility and display.
- Test page-source output on the real server build, not the Vite development server. Include safe escaping tests for quotes, ampersands, Unicode and script-like article text.

## Non-goals and rollback

No heading changes, keyword insertion, FAQ rewriting, title/description rewriting, new location pages, host migration, or guaranteed index/rank improvement. Keep the original renderer available until phase B passes. Roll back rendering/metadata commits together with their caches and any public-only robots exceptions that depended on them; preserve published content and database backups. A rendering rollback must not restore an unsafe draft cache.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).
