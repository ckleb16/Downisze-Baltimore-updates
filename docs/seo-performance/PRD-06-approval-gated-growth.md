# PRD 06 — Content and conversion opportunities requiring approval

Status: **Deferred / not authorized for implementation.** Owner: repository owner approves; Mary/client verifies claims and desired positioning. Discovery estimate: 3–5 hours; implementation quoted only after item-specific approval.

## Purpose

Separate potential growth ideas from technical maintenance so an SEO project cannot quietly redesign or rewrite the website. The present scope identifies opportunities and an approval process; it does not supply replacement copy as if already approved.

## Opportunity register

| ID | Hypothesis to validate | Evidence needed | Approval artifact |
| --- | --- | --- | --- |
| GROW-01 | Selected title/description wording may better match local search intent | Search Console queries, existing click-through rate, actual services and competitor/search-result context | Per-URL current/proposed exact metadata, character counts as guidance not a ranking formula, and rationale |
| GROW-02 | Missing legacy service/local content may deserve a relevant destination instead of a generic redirect | Old page content, backlinks/traffic, Mary's current scope of practice and geographic coverage | Mapping plus complete proposed page/section copy and layout preview |
| GROW-03 | Existing resources/articles may support a focused content plan | Real client questions, search demand, existing coverage and qualified author review | Prioritized briefs; sources and intended audience; each finished article separately approved |
| GROW-04 | Internal links may make relevant existing guidance easier to find | Crawl depth, relevant page relationships, user journeys | Exact placement, destination, anchor wording and screenshot |
| GROW-05 | A server-delivered contact form may reduce reliance on visitors' email apps | Actual drop-off/inquiry evidence and owner preference | Full workflow, labels/messages, delivery provider, anti-spam/privacy/retention plan and cost |
| GROW-06 | Accessibility findings may need visible changes to contrast, focus styling, spacing or targets | Route/state-specific manual evidence | Before/after screenshot and exact design change, including mobile |
| GROW-07 | New pagination/breadcrumbs or additional structured-data facts may be useful | Crawlability/schema needs and verified business facts | Proposed visible output and exact claims; no hidden keyword additions |

These are hypotheses, not assertions that current approved writing is poor. Do not change the questions carousel, testimonials, Mary positioning, brokerage emphasis, hero composition, or section structure under this PRD without an explicit approved proposal.

## Approval workflow

1. Create one review item per coherent change. Identify route, element, current state, exact proposal, evidence, tradeoffs, implementation estimate and rollback.
2. Include desktop/mobile before-and-after previews for design changes, and exact text diffs for wording changes. Metadata, alt text, accessible labels and PDF wording count as writing.
3. Receive the repository owner's explicit approval of the identified version. Client business facts must be verified, especially brokerage relationships, certifications, services, testimonials and locality claims.
4. Record approver, date, approved version and boundaries in the implementation issue/PR without exposing private correspondence.
5. Implement only the approved item, rerun PRD 07 tests, and seek renewed approval if the delivered design/text differs materially.

## Special constraints

- Do not create thin, duplicated city pages or imply local offices that do not exist.
- Do not rewrite client reviews, fabricate testimonials, invent certifications, or expand Mary's professional scope without verification.
- Do not turn informational aging-in-place/probate content into individualized medical, legal or financial advice.
- Do not replace the email-draft form while leaving text that describes the old flow; the workflow and wording must be approved together.
- Do not add a cookie banner, review widget, chat widget, popup or lead magnet as an incidental analytics/SEO change.
- Do not promise ranking position, lead count, schema stars, or specific revenue.

## Acceptance and rollback

No item reaches implementation without its explicit approval record. The final diff matches the approved copy/design; all existing behavior outside the item remains intact. Each change has a reversible commit and content backup. Unapproved ideas stay in the backlog, not in production.
