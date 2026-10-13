# PRD 05 — Measurable search and local visibility

Status: proposed; P1 measurement baseline / P2 profile cleanup. Owner: owner-approved SEO/analytics operator + engineer. Dependencies: account access, privacy decision, approved identity facts, PRD 01 URL plan. Estimate: 6–10 hours, excluding account recovery and ongoing monthly work.

## Problem and outcome

PageSpeed does not show search impressions, qualified inquiries, business-profile traffic, or how the migration affected useful old links. Establish honest measurement before claiming SEO results. Account data was not available for this scope; baselines remain unknown rather than zero.

## Requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| MEAS-01 | With authorized access, inspect Search Console for the old and new domains | Record ownership/access, submitted sitemaps, indexed/excluded pages, crawl/render problems and available performance history; do not publish private account exports in GitHub |
| MEAS-02 | Submit the correct canonical sitemap and inspect representative URLs after authorized release | URLs from each template checked; blocked resources/incorrect canonicals investigated; migration tools used only after their prerequisites are satisfied |
| MEAS-03 | Inventory existing analytics before installing anything; choose one approved collection system and privacy approach | No duplicate tags/events; no unapproved tracking/cookies; no new banner or privacy text without approval; public measurement identifiers distinguished from secrets |
| MEAS-04 | Implement an explicit event contract tied to actual actions | Events below occur once per action and exclude form values, email addresses, phone numbers, personal messages and sensitive URL/query values |
| MEAS-05 | Build a simple reporting baseline and change log | Search clicks/impressions, landing pages, available inquiry proxies and deployment dates recorded; brand/non-brand and device/region segmentation where volume supports it |
| LOCAL-01 | Verify business identity and profile ownership before changes | Owner-approved fact sheet: Mary/business/brokerage relationship, public name, phone, URL, address visibility, actual service areas and verified credentials |
| LOCAL-02 | Inventory local profiles/citations and proposed corrections | Existing Google Business Profile and known directories checked for old website URLs or inconsistent verified details; no duplicate profile creation or invented local offices |
| LOCAL-03 | Make authorized profile/citation corrections and record them | Only explicitly approved destinations and facts changed; stable business identity preserved; before/after log and owner access retained |

## Event contract (proposed, not installed)

| Event | Actual trigger | Permitted parameters | What it does NOT prove |
| --- | --- | --- | --- |
| `page_view` | Initial public page and actual completed client-route change | Canonical path, template type | Search indexing or engagement quality |
| `contact_phone_click` | Activation of an existing phone link | Path, UI location, fixed action ID | A completed call |
| `contact_email_click` | Activation of an existing direct email link | Path, UI location | Email sent or received |
| `email_draft_open` | Validated form attempts to open the existing mailto draft | Path, fixed form ID | Draft opened successfully or email sent |
| `booking_outbound_click` | Activation of the existing scheduling destination | Path, fixed destination category | Appointment booked |
| `guide_download_click` | Activation of an existing guide download | Path, fixed guide ID | Download completed or guide read |

Treat these as inquiry-intent indicators, not confirmed leads. If a scheduling provider later offers authorized completion tracking, define a separate verified event. Do not send names, form text, the full `mailto:` URL, phone-link value, article draft paths, publisher activity, or raw campaign query strings to analytics. Deduplicate any automatic enhanced-measurement equivalents.

Apply exclusions to automatic collection too: sanitize/override default `page_location`, `page_referrer` and link URL fields before the first event, or disable automatic events that cannot meet the contract. Disable or explicitly audit enhanced-measurement form events so they cannot capture form values or label an email-draft action as a submitted lead. Strip query strings/fragments and validate any campaign fields against a fixed allowlist; inspect the actual outbound network payload, not just custom event code. Never allow an automatic pageview to run on a publisher or preview route before exclusion logic executes.

No collection before the approved consent/privacy conditions are met. Determine requirements with the owner's appropriate advisor; this PRD is not legal advice. If compliance requires new wording or visible controls, pause that feature for explicit approval rather than silently adding them. Exclude publisher and preview environments from business reporting; document how test events are isolated.

## Local search work boundaries

Check verified Google Business Profile ownership, primary website URL, categories, service areas, contact details, and legitimate supporting profiles. A known research lead is [Mary's TeamSixtyPlus profile](https://teamsixtyplus.com/coach/mary-lynch/); recheck it before proposing an old-domain correction. Its current content/ownership is not established by this document.

Use `client/src/lib/siteConfig.ts` as an existing internal source of contact/brokerage values, not proof of external ownership or eligibility. Reconcile it with owner-confirmed facts; changes to publicly displayed values require approval.

Do not keyword-stuff the business name, create duplicate practitioner/office profiles without eligibility review, add fake locations, buy reviews, gate review requests, or promise a map-pack position. Review-request copy, photos, public replies, and business-description edits are separate approval items. Follow [Google's business representation rules](https://support.google.com/business/answer/3038177).

## Reporting and acceptance

1. Capture all available pre-change Search Console history (prefer up to 90 days when available) and mark migration/deployment dates. Preserve comparable windows; do not mistake missing history for zero traffic.
2. Verify test events and actual network payloads in the approved tool, with exactly one event per activation and no personal-data payload. Include a synthetic sensitive-looking query/referrer to prove automatic fields are sanitized, without using real personal data. Do not submit a genuine inquiry or booking just to test tracking.
3. Confirm no analytics bundle blocks primary content, harms the performance targets, or changes visible output.
4. Review crawl/indexing and errors soon after release, then search and inquiry-intent trends at agreed 30/60/90-day milestones. Scheduling ongoing monitoring requires a separate request; this document creates no automation.
5. Label low-volume, seasonal, or incomplete comparisons honestly. No guaranteed traffic increase. Real-user Core Web Vitals may remain unavailable on a low-traffic site even when the implementation improves.

## Rollback

Disable/revert the new event integration without affecting public content if privacy, duplication, or performance tests fail. Keep account ownership with the client; do not delete historical analytics data. Reverse incorrect authorized profile edits using the recorded previous facts; do not delete listings or revoke owner access.
