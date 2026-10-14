# Downsize Baltimore: SEO and performance PRD package

Date: October 12, 2026

Status: **Planning package. Technical implementation requested October 13, 2026; see the [sequential implementation tracker](implementation/README.md). Design/writing approval gates remain in force. No deployment is authorized by these documents.**

Repository: [ckleb16/Downisze-Baltimore-updates](https://github.com/ckleb16/Downisze-Baltimore-updates)

Source baseline: `ca05ae273af207e41a268b13634a7a747d9c1ccb`

Production: <https://downsizebaltimore.com/>

Owner/approver: repository owner; Mary/client supplies business facts and content sign-off through the owner.

## Executive recommendation

Protect the old-to-new domain migration, improve mobile loading, and make existing content easier to discover and measure. Preserve the approved website. A redesign is neither needed nor included in this scope.

The supplied homepage report scores **81 mobile performance / 98 desktop performance**, with **100 Accessibility, Best Practices, and SEO** on both. Mobile LCP is 3.7 seconds; desktop LCP is 1.0 second. These are single-run laboratory results, not proof of real-user Core Web Vitals or search rankings. The report has no real-user data.

The highest-value findings outside the score are five sampled old-domain pages returning 404, a two-step old-homepage redirect, JavaScript-dependent page bodies, a potential public-article crawl dependency blocked by robots rules, and incomplete client-side metadata synchronization. Existing server-generated titles, descriptions, canonical tags, sitemap, responsive images, and production tests should be preserved and extended, not replaced indiscriminately.

## Non-negotiable approval contract

The user's instruction is: **Do not change anything appearance-wise or writing-wise without explicit approval.** This takes precedence over conflicting recommendations in older audit/PRD files.

- Locked: layout, fonts and font metrics, colors, spacing, image identity/crops, logos, navigation, section order, carousel behavior, testimonials, headings, body copy, button text, accessible labels, alt text, article/PDF content, title tags, descriptions, and social-preview wording.
- A technical optimization may propose a different implementation of the same approved output. It must pass visual, text, and behavior parity checks before release. A score improvement does not justify an unapproved difference.
- Intentional differences require an item-specific written approval that identifies the affected route(s), current versus proposed text or screenshots, and reason. Silence, a broad instruction to optimize SEO, or approval of this planning PR is not approval of those differences.
- Hosting/DNS changes, account configuration, tracking installation, new data collection, business-profile edits, and deployments require the appropriate owner authorization. Do not infer it from this scope document.
- The original planning commit (`4524e14`) changed documentation only. Subsequent technical implementation is tracked separately and does not grant permission to merge/deploy, change DNS, or edit public profiles. Do not merge application changes into the deployment branch merely by accepting the PRDs.

## Read in this order

| Document | Purpose | Priority |
| --- | --- | --- |
| [Baseline and evidence](00-baseline-and-evidence.md) | Verified measurements, source findings, limitations, complete current sitemap inventory | Reference |
| [PRD 01: Domain migration](PRD-01-migration-and-canonical-hosts.md) | Legacy URL inventory, relevant redirects, HTTPS/canonical hosts | P1 |
| [PRD 02: Mobile performance](PRD-02-mobile-performance.md) | Hero discovery, images, fonts, CSS/JS delivery | P1 |
| [PRD 03: Technical SEO and rendering](PRD-03-rendering-and-technical-seo.md) | Crawl access, metadata parity, rendering decision, structured data | P1/P2 |
| [PRD 04: Accessibility and runtime resilience](PRD-04-accessibility-and-runtime.md) | Carousel semantics, manual checks, cache/header and failure handling | P2 |
| [PRD 05: Measurement and local search](PRD-05-measurement-and-local-search.md) | Search Console, meaningful events, business listing consistency | P1/P2; access-dependent |
| [PRD 06: Approval-gated growth](PRD-06-approval-gated-growth.md) | Content, metadata rewrites, local pages, conversion proposals; no implementation permission | Deferred |
| [PRD 07: Release validation](PRD-07-release-validation.md) | All-route/view/state preservation, automated checks, rollout/rollback | Required for every release |
| [GitHub implementation backlog](github-backlog.md) | Issue-ready work packages and dependency order | Execution reference |

P1 = first delivery sequence, not a claim of a production outage. P2 = follow-on work. A newly discovered data exposure, broken public route, or publisher regression becomes a release blocker regardless of its original priority.

## Delivery sequence and scope boundaries

1. Establish the immutable visual/text baseline and obtain read access to Search Console and relevant hosting configuration. Record production source/version uncertainty.
2. Prepare old-URL mapping and hosting plan. Implement only approved mappings when external configuration authority is available; no blanket homepage forwarding.
3. On separate implementation branches, fix resource discovery and delivery, route metadata consistency, crawler dependencies, and semantic defects. Test each change in isolation.
4. Prototype same-content server rendering/prerendering. Choose the smallest viable approach only after measured comparison; do not commit to a framework migration in advance.
5. Add approved measurement and verified structured business facts; reconcile local listings with owner-authorized access.
6. Release small, independently reversible batches only after parity checks and deployment authorization. Review search/lead outcomes after adequate data accumulates.

Not included by default: redesign, rewritten messaging, new landing pages, recurring blogging, paid ads, paid backlinks, a CRM, a replacement contact form, a new hosting purchase, or moving away from GoDaddy. No guaranteed rankings, leads, rich results, or score of 100.

## Planning estimate, not a client quote

| Workstream | Engineering hours | Assumption |
| --- | ---: | --- |
| PRD 01 | 6–12 | Up to 20 approved legacy mappings; access available; no recovered content rebuild |
| PRD 02 | 10–18 | Existing React/Vite/Express application and approved media preserved |
| PRD 03, phase A | 6–10 | Metadata, crawl rules, structured-data preparation and rendering decision |
| PRD 04 | 4–8 | Semantic/cache/failure-handling corrections; no security redesign |
| PRD 05 | 6–10 | One authorized analytics property and business profile; no lengthy ownership recovery |
| PRD 07 | 8–14 | Shared QA and one release cycle, assuming reusable capture tooling and device access; not duplicated per PRD |
| **Foundation total** | **40–72** | Includes package-specific unit checks plus shared release QA |
| Optional PRD 03 phase B | +16–30 | Approved same-content rendering implementation and dynamic article invalidation |
| Optional PRD 06 discovery | +3–5 | Approval-ready copy/design proposals only; implementation separately estimated |

These are planning ranges, not measured work logs or a promised fixed price. Re-estimate after account access, URL inventory, and the rendering prototype. Confirm reusable screenshot tooling and device access before accepting the QA allowance; building a new harness or obtaining full device coverage may exceed it. Waiting for access, client approvals, search engines, and hosting support is excluded. An earlier limited SEO quote should not be treated as covering every optional item here.

## Required decisions before execution

- Confirm whether the entire old domain is being retired, and supply its sitemap/export and any Search Console URL/link reports.
- Confirm who may change GoDaddy redirects/cache settings while protecting existing email records and publisher data.
- Authorize the specific technical implementation batch. Approve any requested visual/text deviations individually.
- Confirm analytics/privacy preferences and the actual business identity, brokerage relationship, service area, and public contact details before emitting structured claims or editing listings.
- Decide whether to fund the rendering phase after its prototype and evidence review.

## Definition of done for this planning package

The baseline distinguishes observed facts from hypotheses; each PRD has requirements, acceptance checks, dependencies, exclusions, and rollback; every implementation ticket points to its PRD; no application or live configuration changes accompany the package. Completion of these documents is **not** completion of the proposed fixes.
