# Baseline and evidence register

Audit date: October 12, 2026. Sources: supplied PageSpeed report, read-only production HTTP checks, and local source at `ca05ae2` (also the updates repository's main commit when checked). Production does not expose a verified build SHA; do not assume byte-for-byte equivalence solely from similar markup.

## E01: Supplied PageSpeed report

[Mobile report](https://pagespeed.web.dev/analysis/https-www-downsizebaltimore-com/bzp5udhlaj?form_factor=mobile) · [Desktop report](https://pagespeed.web.dev/analysis/https-www-downsizebaltimore-com/bzp5udhlaj?form_factor=desktop)

Report timestamp: October 12, 2026, 6:07:48 PM EDT. Tested URL: `https://www.downsizebaltimore.com/`. Lighthouse 13.5.0, HeadlessChromium 153.0.8010.36. Mobile emulates Moto G Power on slow 4G; desktop uses its own custom throttling. Both are initial-load single-page sessions, not every route or interaction.

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 81 | 98 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 3.0 s | 0.7 s |
| Largest Contentful Paint | 3.7 s | 1.0 s |
| Total Blocking Time | 0 ms | 0 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 4.8 s | 1.2 s |
| Real-user/CrUX data | No Data | No Data |
| Experimental Agentic Browsing | 1/2 | 1/2 |

The calculator links expose mobile FCP 2,997 ms, LCP 3,662 ms, SI 4,806 ms; desktop FCP 681 ms, LCP 1,009 ms, SI 1,160 ms. Rounded values above are the visible report values.

Interpretation: desktop loading is already strong. Mobile loading is the clearest measured opportunity. Lighthouse SEO 100 means its basic checks passed, not that indexing, domain migration, local visibility, content relevance, or rankings are optimal. Accessibility 100 does not replace manual testing. The experimental agentic result is not an established Google search-ranking score. No field pass/fail claim is possible from this report.

## E02–E06: Performance findings

| ID | Observation | Scope implication |
| --- | --- | --- |
| E02 | Mobile render-blocking estimate: 1,830 ms. Main CSS about 50.6 KiB / 1,000 ms; Google Fonts CSS 1.6 KiB / 780 ms | Inspect font delivery and critical CSS while preserving typography and preventing unstyled flashes |
| E03 | Mobile image estimate: 100.4 KiB saved across 126.1 KiB. Hero 768w WebP: 109.6 KiB, estimated 85.9 KiB savings. Header PNG: 16.5 KiB, estimated 14.6 KiB savings | Optimize approved assets conservatively; size the logo for rendered size and pixel density |
| E04 | Hero is already eager and high-priority; the failed check is discovery in the initial document | Add route-correct HTML resource discovery or same-content rendering, not another lazy/eager tweak |
| E05 | Mobile critical path max 1,543 ms. Entry JS -> lazy Home -> shared image/header/icon chunks. Google Fonts stylesheet -> font files. Both Google Fonts origins already preconnected | Measure bundling and self-hosted font options; don't add redundant preconnects or bundle the whole app into Home |
| E06 | Initial CSS: 49.8 KiB transfer / 22.4 KiB unused. Entry JS: 95.4 KiB / 45.2 KiB unused | Coverage is one page/state; removal must account for all routes, menus, forms, publisher, and breakpoints |

Report resource identifiers: `/assets/index-dMurukAP.css`, `/assets/index-Do2j4pjE.js`, `/manus-storage/AugustwebsiteHOMEphoto_6750abaf-768w.webp`, and `/manus-storage/DownsizeBaltimoreWide-YelWhite_e501a303.png`. Hashes will change on later builds; tests must use the actual build manifest, not hard-code these historical names.

The mobile LCP breakdown reports 0 ms TTFB, 750 ms resource-load delay, 500 ms duration, and 1,270 ms element-render delay. Those diagnostic trace components are not the same model as the displayed simulated LCP; do not sum them to dispute the score.

Desktop image opportunity: 151.7 KiB across 346.0 KiB. The 1536w hero is 329.4 KiB with 136.0 KiB estimated savings; logo savings 15.7 KiB. The report's sizing diagnostic mentions 1536×909, but direct inspection of both the local and live WebP frame header confirms **1536×1024**, matching the HTML and media manifest; the live file is 337,328 bytes. This is not a confirmed intrinsic-dimension defect and does not justify changing width/height or crop. Desktop render-blocking estimate is 300 ms. Estimated savings overlap and are not promises or additive budgets.

## E07: Semantic issue despite the accessibility score

The report flags an incompatible role in the questions carousel:

```html
<article class="questions-carousel__slide" role="group"
  aria-roledescription="slide" aria-label="Question 1 of 3" aria-hidden="false">
```

Source: `client/src/pages/Home.tsx`, question slides. A semantic element/role correction can preserve the design and existing wording. Do not redesign or replace the carousel as part of this fix.

## E08: Live domain and crawl checks

Read-only GET requests on the audit date confirmed:

- All eight main routes below return 200, index/follow, distinct server titles, and route-specific apex-domain canonicals.
- Their raw HTML contains no H1, anchor elements, or JSON-LD. Existing page bodies are rendered by JavaScript; this alone does not prove Google cannot index them.
- `https://www.downsizebaltimore.com/` returns 200 without a host redirect. It has an apex canonical; this is a normalization opportunity, not proof of a duplicate-content penalty.
- `https://movewithmarylynch.com/` returns 301 to `http://downsizebaltimore.com`, followed by HTTPS normalization in the earlier audit. Point the old root directly at the final HTTPS destination.
- Sampled old `/probate/`, `/buying-selling/`, `/bel-air/`, `/sellers/decide-to-sell/`, and `/attorneys/` return 404. Their traffic, backlinks, and complete legacy inventory have not been obtained. No numerical traffic-loss claim is supported.
- `robots.txt` allows the public site and disallows `/publisher` and `/api/`; it references the apex sitemap.
- Live robots cache is `public, max-age=2678400` (31 days), whereas server source sets 3,600 seconds. The layer changing this is not established. Sitemap cache is 3,600 seconds; sampled HTML is `no-cache, must-revalidate`.

## E09: Current public URL inventory

The live sitemap contains these 12 URLs. Re-discover it before execution because published articles can change.

| Path | Template / testing class |
| --- | --- |
| `/` | Home; hero, question carousel, testimonials |
| `/downsizing-services` | Service page |
| `/aging-in-place` | Service page |
| `/buying-selling` | Service page |
| `/resource-center` | Resource hub and external/download links |
| `/meet-mary` | Biography and video |
| `/contact` | Contact links and email-draft form |
| `/insights-advice` | Dynamic archive, pagination and error/empty states |
| `/what-do-i-do-with-all-this-stuff` | Resource guide |
| `/should-i-stay-or-should-i-go` | Resource guide |
| `/could-an-adu-work-for-your-family` | Resource guide |
| `/insights-advice/where-do-i-start-with-downsizing` | Published article at audit time |

Also test `/publisher` (private/noindex), an unknown route, an unknown article, case/trailing-slash aliases, query strings, and fragment links. Do not put private or missing routes in the sitemap.

## E10–E13: Source-backed findings and risks to verify

| ID | Source | Finding / certainty |
| --- | --- | --- |
| E10 | `server/index.ts`; `client/src/App.tsx`; `client/src/pages/InsightArticle.tsx` | Server renders metadata, but SPA effects update only title/description, not canonical/OG/robots. Risk of stale head state where client navigation occurs; verify actual transitions rather than assuming all links use the SPA router |
| E11 | `client/index.html`; `client/src/App.tsx`; `ResponsiveImage.tsx`; `responsiveMedia.ts` | Empty initial root; route-level lazy imports already exist; responsive WebPs and high-priority hero already exist. Google Fonts external stylesheet is used |
| E12 | `server/index.ts`; `InsightsArchive.tsx`; `InsightArticle.tsx` | Article bodies/archive are fetched from `/api/posts...`, but robots disallows `/api/`. Google's rendered view must be checked. Database exceptions in article metadata lookup fall through to 404; sitemap exceptions can return a 200 with articles omitted. These are source-level failure modes, not observed production outages |
| E13 | `client/src/pages/Contact.tsx` | Validating/submitting the form opens a `mailto:` draft; it does not send a message. Visible copy accurately explains this. Tracking cannot honestly label this as a submitted lead |

Other touchpoints: `client/src/index.css` (shared styles); `scripts/optimize_media.py` (media pipeline, including branding work that must not be rerun indiscriminately); `vite.godaddy.config.ts`; `.github/workflows/godaddy.yml`; `scripts/test-godaddy.mjs`; `scripts/test-godaddy-source.mjs`. Repository asset size alone is not initial-page transfer size.

## E14: Live response-header verification

An additional unauthenticated GET check of `/` and `/publisher` on the audit date found no explicit CSP, CSP-Report-Only, X-Frame-Options, Referrer-Policy, HSTS, or X-Content-Type-Options response header on those HTML responses. Publisher still returned `private, no-store`. These observations do not establish an exploit or mean authentication is absent.

Source comparison: the older `server/worker.ts` adds publisher-only framing denial and a same-origin referrer policy; the GoDaddy `server/index.ts` HTML handler does not currently add those protections. Scope a narrowly tested parity repair for the publisher, separately from broad CSP/HSTS proposals. Existing cookie/session, origin-validation, hashing and throttling protections must be preserved.

## Not verified / access-dependent

No authenticated Search Console, Analytics, Google Business Profile, old WordPress export, hosting/cache configuration, or backlink inventory was available for this scope. No complete current visual audit of every route/device or real-device interaction test was performed in this planning pass. Desktop and mobile scores above apply to the homepage only. Security-header prompts in Lighthouse are review items, not a penetration-test result. Business directory accuracy and all credential claims require owner verification.

## Reference standards

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): rendering and crawlable resources.
- [Google: site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes): URL inventory, relevant permanent redirects, migration follow-up.
- [Web Vitals](https://web.dev/articles/vitals): field targets at the 75th percentile: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. Lab TBT is not field INP.
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Google: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Google Business Profile representation guidelines](https://support.google.com/business/answer/3038177).

These references support technical requirements, not a promise of a particular ranking outcome.
