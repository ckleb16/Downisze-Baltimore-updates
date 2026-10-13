# PRD 07 — Preservation, testing and release gates

Status: required for future implementation; no release authorized by this document. Owner: engineer + reviewer; repository owner authorizes deployment and any exceptions. Estimate: 8–14 shared QA/release hours for the foundation, excluding optional rendering-specific tests, conditional on reusable capture tooling and device access. Building a new screenshot harness or expanding device coverage requires re-estimation; do not reduce the promised test coverage to fit this allowance.

## Release principle

Prove that technical improvements preserve the approved website before the client sees a new version. A green score or successful build alone is insufficient. Establish baseline evidence before editing application code; never regenerate baselines merely to make an unapproved difference pass.

## Coverage matrix

All current public routes are enumerated in [the evidence register](00-baseline-and-evidence.md#e09-current-public-url-inventory). Reconcile this list with source routing, sitemap and published content before each release.

| Surface | Required views / states |
| --- | --- |
| All 12 current public URLs and all changed/new published templates | 320, 390, 768, 1024, 1440 and 1920 CSS-pixel widths; appropriate portrait heights; full-page and above-fold captures; desktop and touch interactions |
| Home | Hero at load/after fonts; each of 3 question slides; all testimonial states; cards, anchors and CTAs |
| Service pages | Every section; expanded/tabbed states if present; sticky header and bottom-of-page spacing |
| Resource hub + 3 guide routes | Cards/categories if present; guide links and download types; external resource destinations; long content/anchors |
| Meet Mary | Approved portrait/crops, brokerage marks, video poster, controls, play/pause and seeking without forced autoplay |
| Contact | Default and club entry state, invalid/valid input, keyboard errors/status, direct email/phone/booking links; no real send/book action |
| Archive and article | Published, empty, loading, error/retry; >20 posts and load more; long title/body/image; missing/unpublished; metadata on direct and client navigation |
| Header/footer | Every responsive variant; menu closed/open; active destination; Escape/focus return; keyboard skip link; no overlap |
| Publisher | Logged out, authorized disposable test account, expired session, draft/preview/publish/unpublish, image access, logout; never expose or edit real production drafts |
| Routing | Unknown page/article, HTTP/www aliases, trailing slash/case aliases, query and fragment navigation; meaningful HTTP status |

At minimum, real-device smoke checks on iOS Safari and Android Chrome for Home, menu, contact, guide and video. Record unavailable devices explicitly rather than claiming universal device coverage. Desktop browser smoke checks include current Chrome/Edge, Firefox and Safari where available. Automated screenshots may be Chromium-first, but do not substitute for all browser interactions.

## Requirements

| ID | Requirement | Acceptance artifact |
| --- | --- | --- |
| QA-01 | Capture production/source baseline before application edits, including fonts/media completion and route metadata | Version/timestamp, route/view/state manifest, screenshots and text snapshots; document if production commit cannot be verified |
| QA-02 | Compare approved output against each proposed build | Automated pixel/text diff plus human review; no unexplained crop, spacing, line-wrap, color, section, logo or copy difference |
| QA-03 | Test real production build and existing regression suites in isolated storage | Build/type-check results; server/auth/API/media/persistence test results; failure logs redacted; no production data touched |
| QA-04 | Add deterministic tests for each new requirement | Redirect map, metadata parity, resource discovery, robots/sitemap/404/5xx, schema and private/public boundaries |
| QA-05 | Repeat performance measurement under consistent conditions | Three-run median/range on Home, a service, resources, Meet Mary, contact, archive and article for mobile/desktop; route-specific network evidence where changes affect media |
| QA-06 | Make implementation PRs small and independently reversible | PR requirement IDs, changed files, before/after evidence, approvals if applicable, deployment notes and rollback instructions |
| QA-07 | Verify the authorized deployment against the approved artifact | Host/routes/headers/links/media and publisher read-only smoke checks; no secret values in reports; production version identified where feasible |

## Visual and content comparison method

Use the same browser build, viewport, DPR, OS font environment, scroll position, loaded content and carousel state. Wait for `document.fonts.ready` and relevant images before steady-state comparisons; separately inspect cold-load flashes and layout shifts. Stabilize timestamps/animations in the test harness only, not by changing production behavior.

Compare both full pages and meaningful frames/interaction states. Normalize only proven nondeterministic antialiasing or timestamps; never mask text blocks, hero areas, navigation or entire carousels to hide differences. Use computed typography and bounding-box checks where raster differences are ambiguous. Preserve pixel-sensitive branding and human review of lossy media. If there is an intended visible change, attach the approval and a new approved baseline only for that item.

Snapshot headings, paragraphs, button/link labels, alt text, accessible names, title/description and social text. Decode HTML entities and normalize insignificant whitespace for comparison; do not erase meaningful punctuation, capitalization or content differences. Structured-data additions must match approved facts.

## Existing tooling and proposed CI additions

Existing GoDaddy workflow builds with Node 22 and runs `scripts/test-godaddy.mjs`. Preserve that production-only install/build check. Add a separate development-dependency job for `npm run check` and browser/semantic tests as needed; do not expect TypeScript/browser test tools after `npm ci --omit=dev`.

Relevant existing suites include `scripts/test-godaddy-source.mjs`, `scripts/test-publisher-auth.mjs`, `scripts/test-insights-response.mjs`, and `scripts/test-qa-repairs.mjs`; inspect their environment assumptions before execution. Use temporary databases/accounts and trusted runtimes. No publishing test fixture to the actual client's website.

Save Lighthouse reports, bundle manifests, HTTP matrices and visual diffs as controlled CI artifacts. Do not publish credentials, cookies, form values, private posts, account exports or raw authenticated logs. A documents-only planning PR does not require running or modifying the application build; validate its Markdown links and changed-file scope instead.

## Go/no-go gate

Release is blocked by any unapproved appearance/wording/behavior difference, wrong canonical/indexability, broken meaningful redirect, missing image/download, serious keyboard regression, private-content exposure, persistent-data loss, or new runtime/build failure. Performance target exceptions require a documented reason and owner acceptance; do not quietly lower budgets.

Required record per implementation PR:

```text
Requirement IDs:
Source/deployment version:
Routes/views/states tested:
Existing visible/text output preserved: yes / no (approval reference required)
Before/after measurements:
Automated/manual test evidence:
Known limits and accepted exceptions:
Hosting/config/data implications:
Deployment authorization:
Rollback owner and exact procedure:
```

## Rollout and rollback

1. Separate documentation from application/configuration changes. Work on `codex/` implementation branches; never push an unreviewed fix directly to the deployment branch.
2. Back up persistent application data before changes that touch rendering/cache/publisher behavior. Use a consistent SQLite snapshot with its corresponding uploaded-media files (not an arbitrary live copy that can omit uncheckpointed WAL data). Verify a restore into an isolated location, checking article records, revisions and media references without overwriting real data. Record backup/restore evidence; do not assume an unverified backup procedure guarantees recovery.
3. Review in an unindexed preview with its own configuration and disposable test content. Do not expose secrets in client code or commits.
4. Deploy one approved batch, retain the last known-good artifact/configuration, and check the real HTTPS hosts immediately.
5. Roll back the exact batch if a blocker appears; restore compatible HTML/assets/cache settings together. Database restore is a deliberate recovery action, not an automatic code rollback that could erase new client work.
6. Record the release and recheck search/crawl results at agreed follow-up intervals. Search-engine processing is not instantaneous, and low traffic may prevent field metrics from appearing.

## Completion report

Report what changed, which PRD requirements passed, actual measured results, any approved deviations, deployment/version, and unresolved access-dependent work. Never claim every view passed if some were not inspected. Separate implemented fixes from recommendations still awaiting approval.
