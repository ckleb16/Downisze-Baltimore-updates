# Downsize Baltimore — Comprehensive Audit Remediation PRD

## Document status

- Product: Downsize Baltimore public marketing website
- Status: Implemented in workspace; production deployment and content-owner sign-off pending
- Created: August 25, 2026
- Scope: All seven public routes, route variants, the 404 view, shared navigation and footer systems, interactive states, media, accessibility, production delivery, and launch metadata
- Audit baseline: Current workspace source and the production build reviewed during the comprehensive UI audit
- Audience: Product owner, designer, frontend engineer, hosting engineer, content owner, and QA reviewer
- Relationship to prior documents: This is the source of truth for the post-audit remediation. `CLIENT_READINESS_PRD.md` remains a historical record of the earlier client-readiness pass and does not mark the findings below as fixed.

## Executive summary

The original audit confirmed 12 defect families, including 17 contrast-failing nodes, plus two public-launch dependencies and one package-management configuration warning. All code-addressable findings in this PRD have now been remediated in the workspace without changing the approved brand direction or inventing content.

The rebuilt production application passes the route, responsive-layout, interaction, media, metadata, status, redirect, caching, compression, and production-integrity checks recorded below. Public release remains gated by deploying this build and completing the documented content-owner approvals for the canonical domain, social image, and video accessibility record.

## Implementation record — August 26, 2026

- The seven canonical routes passed a 63-view responsive regression matrix spanning 1440, 1280, 1180, 1024, 821, 820, 768, 390, and 320 CSS pixels, with no horizontal overflow, broken rendered image, duplicate ID, heading-level skip, or shared-layout failure.
- The 820/821 mobile-to-desktop navigation boundary passed separately on all seven routes. Mobile Escape/focus return, route selection, resize cleanup, and current-page state were exercised in the browser.
- Home carousel, Resource Center filters and FAQs, the complete Aging in Place evaluation, buying/selling anchors, Contact invalid-input flows, 404 recovery, skip-link focus, and Meet Mary video playback/captions/transcript states were exercised.
- All seven canonical URLs return HTTP 200 with route metadata; recognized variants return 308; unknown URLs return truthful 404/noindex responses; robots and sitemap responses are correct.
- Production HTML and CSS use Brotli when requested. Fingerprinted assets use one-year immutable caching, HTML revalidates, and video byte ranges return 206.
- Production output contains no `data-loc`, `__manus__`, Manus runtime, absolute workspace path, or Wouter route-collection hook. Route modules are split and the main JavaScript bundle is approximately 99.7 KB compressed.
- A clean frozen-lockfile install, TypeScript check, production build, and whitespace/error diff check pass.
- Remaining release actions are external to the code implementation: deploy/repoint the live domain, approve the generated 1200 × 630 social image, and sign `MEET_MARY_VIDEO_ACCESSIBILITY_RECORD.md` after content review.

## Product objective

Deliver a release in which:

1. Every supported URL returns the correct status, page, and metadata.
2. All meaningful text and controls meet WCAG 2.2 AA contrast and target-size requirements.
3. Shared navigation and footer behavior is visually and functionally consistent on every page.
4. Media is responsive and does not impose excessive initial download cost.
5. Production output contains no development instrumentation and is compressed, cached, and split appropriately.
6. The contact and mobile-menu interactions behave correctly with mouse, touch, and keyboard input.
7. The Meet Mary video uses approved copy and has an explicit, accessible audio treatment.
8. Search engines and social platforms receive correct metadata without relying on client-side JavaScript.

## Success measures

- Zero unresolved requirements in this document; lower priority does not permit deferral from this remediation release.
- Zero confirmed color-contrast failures in automated and manual verification.
- Zero critical or serious automated accessibility violations on the route and viewport matrix.
- Correct HTTP status, canonical destination, title, and description for every route test case.
- No `data-loc`, Manus runtime, debug collector, local source path, or equivalent development instrumentation in production output.
- Initial JavaScript is route-split and no larger than 200 KB compressed on the Home route.
- Initial viewport transfer is no larger than 2.5 MB at 390 px and 3.5 MB at 1440 px, excluding media fetched only after user initiation.
- Full-page image transfer is no larger than 5 MB per route on a cold load, excluding user-initiated video playback.
- LCP at or below 2.5 seconds and CLS below 0.1 on the agreed production-like mobile test profile.
- All regression cases in this PRD pass in the supported browser matrix.

## Priority definitions

- **P0 — Launch blocker:** Must be resolved before public launch.
- **P1 — High:** Confirmed user-facing, accessibility, routing, or production-quality defect required for the remediation release.
- **P2 — Medium:** Production polish or engineering-integrity issue required before final sign-off but not independently launch-blocking.

## Non-goals

- Rebranding the site or changing the approved navy, cream, antique-gold, and editorial-serif direction.
- Rewriting approved page content other than the exact video-caption correction and metadata needed by this PRD.
- Adding fabricated testimonials, program details, credentials, or events.
- Replacing the current email-draft contact workflow with a CRM or form provider.
- Adding analytics without approved ownership, consent requirements, and account credentials.
- Turning the brochure site into an install-focused progressive web app. The manifest is for complete browser identity and icon support.

## Requirements summary

| ID | Priority | Requirement | Primary area |
|---|---:|---|---|
| R1 | P1 | Canonical route handling and status consistency | Server and router |
| R2 | P1 | Repair all confirmed contrast failures | Design system and page CSS |
| R3 | P1 | Responsive, lazy, size-bounded media delivery | Images and video |
| R4 | P1 | Remove development instrumentation from production | Build configuration |
| R5 | P1 | Compression, caching, and route-level code splitting | Server and build output |
| R6 | P1 | Reliable mobile-menu keyboard behavior | Shared navigation |
| R7 | P1 | One consistent header and footer system | Shared layout |
| R8 | P1 | Trim-aware Contact validation | Contact form |
| R9 | P1 | Correct metadata in direct HTML responses | Rendering and server |
| R10 | P0/P1 | Correct and accessible Meet Mary video | Media and content |
| R11 | P1 | Minimum Contact phone target size | Contact page |
| R12 | P2 | Favicon, app icons, and manifest | Browser identity |
| R13 | P0 | Canonical, social, robots, and sitemap launch metadata | Hosting and SEO |
| R14 | P2 | Valid pnpm patch and override configuration | Package management |

## Detailed requirements

### R1 — Canonical route handling and status consistency

**Problem**

The client router accepts variants such as `/contact/` and `/Contact`, but the production server's exact route set returns HTTP 404 for them. Client metadata also uses an exact lookup, causing a visible page to receive “Page Not Found” metadata. Server, router, and metadata behavior therefore disagree.

**Requirement**

- Establish the lowercase, no-trailing-slash paths below as the only canonical public routes:
  - `/`
  - `/downsizing-services`
  - `/aging-in-place`
  - `/buying-selling`
  - `/resource-center`
  - `/meet-mary`
  - `/contact`
- Redirect recognized case and trailing-slash variants to the canonical path before serving the app. Use a permanent redirect suitable for a GET request and preserve query parameters.
- Normalize route handling in one shared utility or route manifest used by server status logic and client metadata logic.
- Keep genuinely unknown paths as truthful HTTP 404 responses that render the custom Not Found page.
- Do not expose `/404` as a canonical indexable public page. It may remain an internal preview path only if it carries `noindex`.

**Acceptance criteria**

- Each canonical route returns HTTP 200.
- `/contact/`, `/Contact`, and equivalent variants of all six interior routes redirect once to the lowercase, no-trailing-slash equivalent.
- `/contact/?source=test` redirects to `/contact?source=test` without dropping the query.
- A random unknown path returns HTTP 404 and renders the Not Found experience.
- The redirected page has the correct active navigation state, title, description, and canonical URL.
- There is no redirect loop and browser Back behavior remains predictable.

**Primary source surfaces:** `server/index.ts`, `client/src/App.tsx`, and the new shared route manifest.

### R2 — Repair all confirmed contrast failures

**Problem**

The audit confirmed 17 nodes below the applicable WCAG AA contrast threshold. Antique gold is being used too lightly on cream, white, or photographic backgrounds in several page-specific systems.

**Requirement**

- Use a darker approved gold/bronze token for normal-size text on light surfaces.
- Use a sufficiently light cream/gold token for text on navy or photographic surfaces.
- Do not solve text contrast only with font-weight changes. The computed foreground/background pair must meet the ratio.
- Preserve the approved palette character; add semantic tokens such as `--gold-text-on-light`, `--gold-large-on-light`, and `--gold-text-on-dark` rather than page-specific near-duplicates.
- Verify hover, focus, selected, and mobile breakpoint states, not only the default desktop state.

**Confirmed baseline to repair**

| Page | Element(s) | Measured ratio | Required minimum |
|---|---|---:|---:|
| Home | Way-card numerals `01`, `02`, and `03` | 3.04:1 | 4.5:1 |
| Downsizing Services | Supporting copy in the audited light section | 4.32:1 | 4.5:1 |
| Aging in Place | Hero eyebrow | 2.63:1 | 4.5:1 |
| Aging in Place | Personal-story blockquote | 4.01:1 | 4.5:1 |
| Aging in Place | NAIPC mark | 2.63:1 | 3:1 |
| Aging in Place | “Greater Baltimore” supporting label | 2.63:1 | 4.5:1 |
| Buying & Selling | Hero note | 4.24:1 | 4.5:1 |
| Buying & Selling | Hero `30` marker | 3.63:1 | 4.5:1 |
| Buying & Selling | Mobile buying-card `01` marker | 3.09:1 | 4.5:1 |
| Buying & Selling | Mobile `02 / BUYING` marker group | 3.41:1 | 4.5:1 |
| Buying & Selling | Mobile `04` large marker | 2.84:1 | 3:1 |
| Resource Center | Three “Ask Mary this question” links | 3.86:1 | 4.5:1 |
| Meet Mary | Story-section `02` large marker | 2.84:1 | 3:1 |

Repeated elements in the table account for the 17 individual failing nodes.

**Acceptance criteria**

- Normal text is at least 4.5:1 and large text/non-text indicators are at least 3:1 in every listed state.
- Automated checks report no confirmed contrast violations on any public route at 1440, 768, 390, or 320 px.
- Pseudo-elements and text over images are manually measured against the actual computed background because automated tools may mark them as incomplete.
- Visual review confirms the revised tokens still read as part of the approved Downsize Baltimore palette.

**Primary source surfaces:** `client/src/index.css` and the seven page components.

### R3 — Responsive, lazy, size-bounded media delivery

**Problem**

Cold page loads ranged from approximately 5.5 MB to 17.1 MB. The asset directory contains large decorative textures and photography, all 26 `<img>` elements load eagerly, and images do not provide responsive sources or intrinsic dimensions.

**Audit baseline**

| Route | Approximate cold media transfer |
|---|---:|
| Home | 17.1 MB |
| Downsizing Services | 15.5 MB |
| Aging in Place | 12.3 MB |
| Meet Mary | 11.5 MB |
| Buying & Selling | 9.7 MB |
| Resource Center | 9.7 MB |
| Contact | 5.5 MB |

Largest source assets include a 5.11 MB paper texture, 4.69 MB warm wash, 4.20 MB contour texture, 3.50 MB room photograph, 2.68 MB Home hero, and 9.17 MB 18-second MP4.

**Requirement**

- Convert photographic and decorative raster assets to modern, quality-reviewed formats such as AVIF or WebP, retaining a fallback only where the supported browser matrix requires it.
- Generate responsive source widths appropriate to the actual rendered breakpoints and use `srcset`/`sizes` or `<picture>`.
- Give every content `<img>` explicit intrinsic `width` and `height`, or an equivalent stable aspect-ratio contract.
- Load only the page's LCP image eagerly and give it appropriate fetch priority. Below-fold images must use lazy loading and asynchronous decoding.
- Prevent below-fold CSS background assets from downloading during the initial viewport when they are not needed for first paint.
- Preserve every approved crop, focal point, alt description, and the visual texture of the design.
- Re-encode the 18-second video for web delivery. Target no more than 5 MB while preserving acceptable motion and audio quality; provide a second format only if it materially improves supported-browser delivery.
- Keep video preload at metadata or less. The full video must not transfer before user initiation.

**Acceptance criteria**

- The transfer and performance budgets in Success measures pass on a cold cache.
- No image larger than its rendered need is selected at 390, 768, or 1440 px.
- Offscreen images are not requested until they approach the viewport.
- The LCP image is not lazy-loaded and does not regress LCP.
- CLS remains below 0.1 with the cache disabled.
- Image comparison confirms no visible banding, unacceptable compression, distorted aspect ratio, or harmful crop shift.
- The video poster appears immediately and playback remains smooth on a representative mobile connection.

**Primary source surfaces:** `client/public/manus-storage`, page image markup, and image/background rules in `client/src/index.css`.

### R4 — Remove development instrumentation from production

**Problem**

The audited production output included an approximately 368 KB HTML shell, Manus runtime code, hundreds of `data-loc` attributes in rendered markup, more than a thousand `data-loc` occurrences in the app bundle, and exposed source-location information. Development-only Vite plugins are currently registered unconditionally.

**Requirement**

- Enable JSX location tagging, the Manus runtime, and the Manus debug collector only in development mode.
- Ensure production HTML and JavaScript contain no `data-loc`, Manus debug endpoints, debug runtime, session-replay collector, absolute local path, or source-location payload.
- Preserve the existing development debugging workflow when running the local development server.
- Fail the production verification job if a defined list of development-only signatures is present.

**Acceptance criteria**

- Production `index.html` is a normal minimal app shell and is no larger than 15 KB before compression, excluding intentionally injected route metadata.
- Searches of the built output return zero matches for `data-loc`, `__manus__`, the Manus runtime signature, and absolute workspace paths.
- No production network request targets a Manus logging endpoint.
- Development mode still provides the explicitly retained debugging features.

**Primary source surfaces:** `vite.config.ts` and production build verification.

### R5 — Compression, caching, and route-level code splitting

**Problem**

Production responses did not use gzip or Brotli when requested. Hashed JavaScript and a 5.36 MB texture were served with `Cache-Control: public, max-age=0`. All route components are statically imported into one initial JavaScript bundle.

**Requirement**

- Compress HTML, CSS, JavaScript, SVG, JSON, XML, and text manifests with Brotli where supported and gzip as fallback.
- Serve content-hashed static assets with `Cache-Control: public, max-age=31536000, immutable`.
- Serve HTML with revalidation semantics so a new deployment is discovered promptly.
- Version or content-hash large public assets before assigning immutable caching.
- Load page components through route-level dynamic imports with a calm, accessible loading state.
- Keep common navigation, footer, design tokens, and small shared utilities in shared chunks rather than duplicating them per route.
- Preserve truthful 404 statuses and direct-route behavior after code splitting.

**Acceptance criteria**

- A request with `Accept-Encoding: br, gzip` receives an appropriate `Content-Encoding` for compressible production assets.
- Hashed assets receive one-year immutable caching; HTML does not.
- Visiting Home does not fetch the JavaScript module for every interior route.
- Navigating to an interior route loads its chunk once and produces no blank screen, focus loss, or console error.
- The initial compressed JavaScript and media budgets in Success measures pass.
- A redeploy invalidates changed assets without requiring visitors to clear cache.

**Primary source surfaces:** `server/index.ts`, `client/src/App.tsx`, hosting configuration, and build output.

### R6 — Reliable mobile-menu keyboard behavior

**Problem**

On all seven page implementations, pressing Escape immediately after opening the mobile menu does nothing while focus remains on the toggle. Escape only works after focus has moved inside the navigation because the handler is attached to the navigation element.

**Requirement**

- Handle Escape for as long as the mobile menu is open, regardless of which element currently owns focus.
- On Escape, close the menu and return focus to the same menu toggle that opened it.
- Maintain accurate `aria-expanded`, `aria-controls`, accessible toggle names, and hidden state.
- Close the menu after selecting an internal destination and when changing to the desktop breakpoint.
- Implement the behavior once in the shared header rather than copying page-specific listeners.

**Acceptance criteria**

- Open menu, do not move focus, press Escape: the menu closes and focus is on the toggle.
- Open menu, tab to the first, middle, and last actionable item, press Escape: the same result occurs.
- Touch/click toggle behavior, link activation, browser Back, and desktop resize remain functional.
- The behavior passes on all seven routes at 768, 390, and 320 px.
- No orphaned global event listener remains after close or unmount.

**Primary source surfaces:** the new shared header and the seven existing page header implementations.

### R7 — One consistent header and footer system

**Problem**

The audit found three visually divergent header/footer systems. Mobile headers measured approximately 75, 94, and 99 px; desktop headers ranged from 163 to 177 px; desktop logos ranged from 194 to 224 px; header CTAs ranged from 147 to 200 px; and footer logo sizes varied. Downsizing Services and Aging in Place footer logos were not Home links, and Aging in Place's main phone presentation differed from the other pages.

**Requirement**

- Replace copied page-level header/footer markup with shared `SiteHeader` and `SiteFooter` components.
- Use one navigation list, footer list, contact source, logo source, CTA label, mobile breakpoint, and set of layout tokens.
- Use mobile navigation through 820 px and desktop navigation from 821 px unless visual QA demonstrates a blocking layout issue.
- At a given breakpoint, header height, logo width, navigation rhythm, CTA dimensions, footer grid, footer logo dimensions, and contact treatment must be identical across routes.
- Every header and footer logo must link to Home and expose an accessible Home label.
- Phone and email actions must use the same icon, label, target, and focus treatment wherever they repeat.
- Page-specific themes may alter body-section presentation, but not shared component geometry or behavior.
- Active-page indication and `aria-current="page"` must derive from the normalized current route.

**Acceptance criteria**

- Computed shared-component dimensions at the same viewport differ by no more than 1 px between routes.
- Header/footer content and order match on all seven routes.
- All logo links navigate to Home; all phone and email links use the approved contact details.
- There is no clipping, navigation wrap, or horizontal overflow at any required viewport.
- Visual snapshot comparison approves the common desktop and mobile system before rollout to all pages.
- Refactoring introduces no change to page body copy, approved photography, quiz state, carousel state, filters, FAQs, or Contact behavior.

**Primary source surfaces:** all seven page components, `client/src/index.css`, and new shared layout components/configuration.

### R8 — Trim-aware Contact validation

**Problem**

The required Name input accepts only spaces because the browser's `required` check sees whitespace as a value. Topic and message are trimmed, but Name is not.

**Requirement**

- Normalize Name, Email, optional Phone, Topic, and Message before validation and before constructing the email draft.
- Treat a required value as empty when its trimmed value is empty.
- Keep native email-format validation and provide a clear custom message for whitespace-only Name and Message values.
- Construct the email subject/body from normalized values so invisible padding is not copied into the draft.
- Retain the current no-server-side-submission behavior and explanatory copy.

**Acceptance criteria**

- Name values of `"   "`, tabs, or line-breaking whitespace do not open an email draft and produce a visible validation message.
- A valid name with leading or trailing spaces succeeds and appears trimmed in the draft.
- Required Topic and Message checks still work; invalid email formats remain blocked.
- Valid input opens one correctly addressed draft with the approved subject/body structure.
- Validation works with keyboard-only input and focuses or exposes the first invalid field through native browser behavior.

**Primary source surface:** `client/src/pages/Contact.tsx`.

### R9 — Correct metadata in direct HTML responses

**Problem**

Every exact deep route currently returns raw HTML containing the Home title and description. Correct route metadata appears only after client JavaScript runs, causing title flicker and incorrect content for crawlers and preview systems that do not execute JavaScript.

**Requirement**

- Generate route-specific title and description in the initial HTML response using server injection, static prerendering, or another production-compatible method.
- Use the shared route manifest from R1 as the metadata source of truth.
- Generate Not Found metadata in the initial HTML of a 404 response.
- Retain client-side metadata updates for in-app navigation without duplicating divergent values.

**Acceptance criteria**

- An HTTP fetch with JavaScript disabled finds the correct unique `<title>` and description on every canonical route.
- An unknown route receives HTTP 404 plus the Not Found title and description in its initial HTML.
- Client-side navigation updates metadata exactly once and does not briefly show Home or Not Found metadata.
- Titles and descriptions contain no placeholder domain, staging name, or debug text.

**Primary source surfaces:** `client/index.html`, `client/src/App.tsx`, `server/index.ts`, and the route manifest.

### R10 — Correct and accessible Meet Mary video

**Problem**

The visible video caption does not match the previously approved exact caption, and the audited browser state reported `muted === false` despite the documented muted-by-default requirement. The MP4 contains an audio stream, but whether it contains meaningful speech was not confirmed. Meaningful uncaptained audio is a public-launch blocker.

**Requirement**

- Display the exact approved caption: “Our guy, Pop. Still happiest at the helm.”
- Start the video muted in the actual browser property state while preserving native controls, `playsInline`, no autoplay, poster behavior, and user control over sound.
- Content owner must listen to and classify the complete audio track before release.
- If the audio contains speech or meaningful sound, provide a reviewed, synchronized English WebVTT caption track and an adjacent transcript, or remove the audio track if it is nonessential and the content owner approves silent presentation.
- Do not treat muted-by-default behavior as a substitute for captions when meaningful audio remains available.

**Acceptance criteria**

- The visible caption exactly matches the approved sentence, including punctuation.
- Before playback, `video.muted` and `video.defaultMuted` are both true in supported browsers.
- The visitor can unmute, seek, pause, enter fullscreen where supported, and replay normally.
- Poster and metadata load without downloading the full video.
- A signed content note records whether the source contains speech or meaningful audio and which accessibility treatment was selected.
- If captions are required, the track can be enabled from native controls, is synchronized through the complete 18 seconds, and matches the approved transcript.

**Primary source surface:** `client/src/pages/MeetMary.tsx`, video assets, and the content approval record.

### R11 — Minimum Contact phone target size

**Problem**

The direct phone link on Contact is approximately 41 px tall at every tested width, below the project's 44 px minimum target. The adjacent email target already meets the target requirement.

**Requirement**

- Give the direct phone action a minimum interactive box of 44 by 44 CSS pixels without making the visible typography feel oversized.
- Preserve visible keyboard focus and enough separation from adjacent actions.
- Apply the same minimum to the shared footer phone control created by R7.

**Acceptance criteria**

- Computed clickable bounds are at least 44 by 44 px at 1440, 768, 390, and 320 px.
- The entire visible phone treatment activates the `tel:` link.
- It does not overlap the email action, wrap incorrectly, or change the approved phone number.

**Primary source surfaces:** Contact direct-contact markup and relevant rules in `client/src/index.css`.

### R12 — Favicon, app icons, and manifest

**Problem**

The document does not link a favicon, Apple touch icon, application icons, or web manifest, producing generic browser identity and inconsistent saved-link presentation.

**Requirement**

- Produce approved brand-derived favicon assets, including SVG or ICO browser fallback, 32 px PNG, 180 px Apple touch icon, and 192/512 px manifest icons.
- Provide a manifest with product name, short name, start URL, scope, theme color, background color, icon purpose, and standalone-safe display value.
- Add `theme-color` and all required links to the document head.
- Do not repurpose the brokerage logo as the primary site icon.

**Acceptance criteria**

- All declared icon and manifest URLs return HTTP 200 with correct MIME types.
- Current Chrome, Edge, Firefox, Safari, and iOS saved-link views show an approved Downsize Baltimore identity.
- The manifest contains no staging URL and passes browser validation without errors.
- No icon is visibly clipped at standard and maskable shapes.

**Primary source surfaces:** new public icon assets, `client/index.html`, and the generated initial HTML.

### R13 — Canonical, social, robots, and sitemap launch metadata

**Problem**

Canonical URLs, Open Graph metadata, Twitter/X card metadata, a social-sharing image, `robots.txt`, and `sitemap.xml` are not configured. The final owned production domain and social image require owner confirmation. This is a launch blocker because placeholder or staging URLs must not become the public source of truth.

**Requirement**

- Hosting owner must approve the final canonical HTTPS domain.
- Content/design owner must approve a 1200 × 630 social-sharing image with safe text placement and appropriate alt text.
- Emit per-route canonical URLs and route-specific Open Graph/Twitter title, description, URL, and image metadata in initial HTML.
- Provide a production `robots.txt` that references the absolute sitemap URL.
- Provide an XML sitemap containing only canonical, indexable public routes.
- Add `noindex` to unknown/404 pages and any noncanonical preview route.
- Keep staging deployments non-indexable and ensure they do not claim the production canonical domain until the release configuration is intentional.

**Acceptance criteria**

- Every canonical route exposes one self-referencing canonical URL using the approved domain.
- Open Graph and Twitter/X validators receive the correct route title, description, absolute URL, 1200 × 630 image, dimensions, type, and image alt text without executing JavaScript.
- `/robots.txt` and `/sitemap.xml` return HTTP 200 and valid content on production.
- The sitemap contains all seven canonical routes exactly once and no case, trailing-slash, `/404`, query, or staging variants.
- An unknown route is 404 and `noindex`.
- No production metadata references `localhost`, a workspace path, or an obsolete Manus preview domain.

**Primary source surfaces:** route manifest, server/prerender output, public SEO files, hosting environment, and approved social image.

### R14 — Valid pnpm patch and override configuration

**Problem**

The installed pnpm version reports that the `pnpm` field in `package.json` is ignored, so the declared Wouter patch and Tailwind/Nanoid override are not reliably applied.

**Requirement**

- Move patched dependency and override settings to the configuration location supported by the repository's pinned pnpm version.
- Keep the package manager version consistent between `packageManager`, development tooling, CI, and deployment.
- Confirm the Wouter patch remains necessary and targets the resolved version. Remove it only after demonstrating that routing behavior and tests pass without it.
- Regenerate the lockfile through the selected pnpm version and commit the configuration and lockfile together during implementation.

**Acceptance criteria**

- Dependency installation emits no ignored-configuration warning.
- A frozen-lockfile install succeeds in a clean environment.
- The dependency graph proves that the intended patch and override are applied, or the implementation record explains and tests their approved removal.
- TypeScript checks and the production build pass after a clean install.

**Primary source surfaces:** `package.json`, the new supported pnpm workspace/configuration file, `pnpm-lock.yaml`, and `patches/wouter@3.7.1.patch`.

## Implementation sequence

### Phase 0 — Resolve launch inputs

1. Approve the final canonical domain.
2. Approve the social-sharing image and its alt text.
3. Review the Pop video audio and decide captions/transcript versus approved silent encoding.

These decisions may proceed in parallel with code work, but R10 and R13 cannot receive final sign-off without them.

### Phase 1 — Shared behavior and accessibility

1. Create the route manifest and fix route normalization/status behavior.
2. Create shared header/footer components and repair mobile-menu behavior.
3. Apply semantic contrast tokens and repair every listed node.
4. Fix trim-aware Contact validation and target sizing.
5. Correct video caption/default mute behavior and add the approved audio accessibility treatment.

### Phase 2 — Production delivery and discovery

1. Remove production debug instrumentation.
2. Optimize images/video and introduce responsive media loading.
3. Add route-level code splitting, compression, and caching.
4. Generate initial route metadata, canonical/social metadata, robots, sitemap, icons, and manifest.
5. Repair pnpm configuration and lockfile integrity.

### Phase 3 — Regression and release

1. Run automated checks and the complete route/viewport interaction matrix.
2. Run manual keyboard and assistive-technology checks.
3. Run browser/device, no-JavaScript metadata, cache, compression, slow-network, and visual-regression checks.
4. Resolve all regressions covered by this PRD and perform production smoke testing.

## Verification plan

### Routes

- `/`
- `/downsizing-services`
- `/aging-in-place`
- `/buying-selling`
- `/resource-center`
- `/meet-mary`
- `/contact`
- A random unknown route
- Case variants and trailing-slash variants of every interior route

### Viewports

- 1440 × 900
- 1280 × 720
- 1180 × 800
- 1024 × 768
- 768 × 1024
- 390 × 844
- 320 × 568

Also test 200% and 400% browser zoom, portrait/landscape rotation on representative mobile devices, increased text size, reduced motion, and forced-colors/high-contrast mode.

### Browsers and assistive technology

- Current and previous major Chrome and Edge
- Current Firefox
- Current macOS Safari and iOS Safari
- Representative Android Chrome
- NVDA with Chrome or Firefox
- VoiceOver with Safari on macOS and iOS
- TalkBack with Android Chrome where device access is available

### Required interaction states

- Every desktop and mobile navigation destination
- Mobile menu open, close, immediate Escape, Escape from inside, route selection, resize, and focus return
- Home carousel previous, next, direct dot selection, first/last wrap, keyboard, and focus visibility
- Aging in Place ten-question evaluation, Back, answer revision, results, Change Answers, and reset
- Resource Center all pathway filters, selected states, reset, all five FAQs, and linked sections
- Contact blank, whitespace-only, malformed email, missing topic/message, valid draft, direct phone, and direct email
- Meet Mary poster, muted state, play, pause, seek, unmute, captions/transcript if required, and replay
- Browser Back/Forward, direct deep links, refresh, and query-preserving redirects

### Automated and delivery checks

- TypeScript check and production build
- Clean frozen-lockfile dependency install
- Automated accessibility scan with manual resolution of incomplete contrast checks
- Broken images, links, duplicate IDs, duplicate H1s, and console errors
- Horizontal overflow, clipped headings, and touch-target measurement
- Initial HTML metadata with JavaScript disabled
- HTTP status and redirect matrix
- Compression and cache-header verification
- Production-output scan for development signatures
- Cold-cache network request and transfer-size capture
- Lighthouse or equivalent performance run using an agreed production-like mobile profile
- Visual snapshots before and after shared-layout and media changes

## Release gates

The remediation release may proceed only when:

- R1 through R14 are fully accepted; no confirmed audit finding may be waived as complete.
- The R10 audio decision and R13 domain/social inputs are completed; neither may be silently deferred for a public launch.
- There are no open critical or serious accessibility defects.
- There are no known broken links, images, routes, controls, validation paths, or horizontal-overflow defects in the verification matrix.
- Production contains correct statuses and metadata, no debugging instrumentation, and passing compression/cache behavior.
- Performance budgets pass.
- A final production smoke pass is completed after deployment rather than relying only on local or preview results.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Shared header/footer refactor creates broad visual regressions | Approve one reference implementation, add snapshots, then roll it out route by route. |
| Image conversion harms Mary's photography or intended texture | Compare original and optimized assets at all rendered sizes before replacing source files. |
| Aggressive caching serves stale assets | Use content-hashed filenames and keep HTML revalidating. |
| Prerender/server metadata diverges from client metadata | Generate both from the same typed route manifest and test raw HTML plus in-app navigation. |
| Route normalization creates loops or drops campaign parameters | Test the complete redirect table and preserve query strings. |
| Video captions require content knowledge unavailable to engineering | Make the content owner responsible for audio classification and transcript approval before release. |
| Final domain is not ready | Keep staging `noindex`; do not ship placeholder canonicals or a production sitemap. |

## Audit-to-requirement traceability

| Audit finding | Covered by |
|---|---|
| Server/client mismatch for case and trailing-slash route variants | R1, R9 |
| Seventeen confirmed contrast-failing nodes | R2 |
| 5.5–17.1 MB cold page loads; eager, nonresponsive images without intrinsic sizes | R3 |
| Manus/debug tooling and source locations in production | R4 |
| No compression, ineffective caching, and one all-route app bundle | R5 |
| Escape fails immediately after opening every mobile menu | R6 |
| Three drifting header/footer systems and inconsistent logo/contact behavior | R7 |
| Whitespace-only Contact Name passes required validation | R8 |
| Deep-route raw HTML always contains Home metadata | R9 |
| Meet Mary caption mismatch, default-mute mismatch, and unresolved audio accessibility | R10 |
| Contact direct phone target is approximately 41 px | R11 |
| Missing favicon, app icons, and manifest | R12 |
| Missing canonical, Open Graph/Twitter, social image, robots, and sitemap | R13 |
| pnpm reports ignored patch/override configuration | R14 |

## Definition of done

Work is complete when every audit finding maps to accepted evidence, all required release gates pass, the code and production deployment both pass the verification plan, and the final QA record includes:

- The requirement ID and implementation reference.
- Before/after evidence for visual, contrast, transfer-size, and production-output changes.
- Automated check results and manual browser/assistive-technology results.
- The approved canonical domain, social image, and Pop video audio decision.
- Any newly discovered risk outside this PRD, its owner, and its follow-up date. A confirmed finding covered by R1 through R14 is not eligible to be recorded as residual in place of a fix.

Passing this definition substantially reduces known UI risk; it does not replace ongoing regression testing after future content, dependency, browser, or hosting changes.
