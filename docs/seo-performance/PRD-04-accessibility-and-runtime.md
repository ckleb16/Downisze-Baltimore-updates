# PRD 04 — Semantic accessibility and runtime resilience

Status: proposed; P2, with regressions treated as release blockers. Owner: implementation engineer + accessibility/QA reviewer. Dependencies: PRD 07 baseline; hosting access for edge behavior. Evidence: E07, E08, E12, E14. Estimate: 4–8 hours; extensive security remediation is separately scoped if discovered.

## Outcome

Correct the known carousel semantics and protect crawl behavior, content privacy, and availability during optimization. Preserve existing appearance, copy, keyboard behavior, and publisher functionality. Lighthouse 100 does not constitute a full accessibility or security certification.

## Requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| A11Y-01 | Resolve the incompatible `article role="group"` question-slide markup using a compatible semantic structure | The reported role violation no longer appears; existing class styling, question wording, slide labels, order and controls are unchanged |
| A11Y-02 | Verify carousels, menus, tabs and forms with keyboard and screen reader, not automated checks alone | Active slide is announced sensibly; inactive content is not focusable/duplicatively announced; focus does not disappear; reduced-motion behavior remains; keyboard can reach and leave all controls |
| A11Y-03 | Inspect text contrast, zoom/reflow and focus visibility across templates and interaction states | Log any failure with exact route/state/screenshot. Semantic fixes may preserve visuals; any needed visible contrast/font/spacing/focus-style change is submitted for explicit approval, not silently implemented |
| RUN-01 | Reconcile origin versus edge cache policy for robots and other mutable SEO documents | Live robots cache lifetime meets the agreed target (initial target ≤3,600 seconds); provenance of any override documented; staging-to-production indexability cannot be stuck behind the observed 31-day cache |
| RUN-02 | Keep public versioned assets efficiently cached and private/user-specific output uncached | Fingerprinted files immutable; mutable HTML revalidates; publisher/session responses private/no-store; media authorization intact; no private DB/files served as static content |
| RUN-03 | Treat backend failure separately from missing content | In tests, article DB failure yields appropriate transient 5xx/retry behavior rather than false 404; sitemap fails safely or serves an explicitly last-known-good complete copy, never a misleading partial 200 caused by query failure |
| RUN-04 | Review security headers/integrations and dependencies proportionately | Record deployed headers and compatibility gaps, assess production dependency advisories, and propose bounded remediation; no claim that unscored audit prompts are confirmed exploits |
| RUN-05 | Preserve persistent publisher content through future releases | Existing auth/session/upload/restart tests pass using disposable data; backup/restore procedure and storage boundaries documented; no tests modify real client posts |
| RUN-06 | Restore verified publisher response-header protections that existed in the older worker deployment | `/publisher` has tested framing denial and an appropriate referrer policy on the GoDaddy HTML response; authentication, editor preview and same-origin flows still work; existing session/origin/rate-limit protections remain intact |

## Header review, not blanket policy changes

Inventory external fonts, video/embed origins, booking links/windows, media, inline styles/scripts and editor behavior before considering CSP. Start in report-only mode with an approved, privacy-conscious report destination when enforcement could break integrations. Do not add a telemetry endpoint without approval.

Review `frame-ancestors`/X-Frame-Options, Referrer-Policy, MIME protection, HSTS and COOP in the actual hosting environment. Do not enable HSTS preload or `includeSubDomains` without TLS/service inventory and separate authorization; those changes can have long-lived effects. Do not force COOP/Trusted Types merely to satisfy an unscored prompt if it breaks booking, preview or publisher flows. Optional upgrades must be minimal and tested; no indiscriminate major-version update.

## Required manual checks

- Questions: first, middle, last, wraparound; arrows/dots; focus and announcements; existing slide timing preserved.
- Testimonials: all existing cards/states, source links, arrows/dots and focus. No quote edits or removal.
- Header: desktop and mobile navigation, open/close, Escape, active item, focus return; skip link and fragment navigation.
- Forms: existing required-field validation and status announcements. Do not send a real email or change labels to claim sending.
- Zoom: 200% and 400%; narrow 320 CSS-pixel reflow; landscape mobile; no loss of essential functionality. Any existing visual problem goes into the approval queue.
- Error handling: unpublished/missing article versus network/database failure; publisher unauthorized and session expiration; no stack traces, credentials or personal data in public error output.

## Touchpoints and rollback

`client/src/pages/Home.tsx`, shared navigation/components, `server/index.ts`, `server/godaddyApi.ts`, article/archive components, production integration scripts, and GoDaddy cache/header settings. Separate semantic, cache, failure-policy and header commits.

Restore prior compatible headers/cache settings if a new policy breaks requests, without weakening unrelated existing protections. Revert application behavior independently. Do not delete or replace the persistent application-data directory. Visible error-copy changes, if required, need PRD 06 approval.
