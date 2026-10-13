# PRD 01 — Preserve domain migration value

Status: proposed; P1. Owner: implementation engineer + domain/hosting owner. Dependencies: hosting authority, legacy URL inventory, PRD 07 baseline. Evidence: E08–E09. Estimate: 6–12 hours for up to 20 mappings, excluding content recovery and account delays.

## Problem and outcome

The old homepage forwards, but five sampled deep links return 404. Visitors and existing links can lose their intended destination. The new www host also serves a separate 200 response, while canonical tags point to the apex. Make intended migration paths direct, relevant, testable, and reversible without altering the approved website.

## Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| MIG-01 | Inventory legacy URLs from old sitemap/CMS export, Search Console pages/links, available logs, and known campaigns. Record source, status, traffic/backlinks when known, proposed target, relevance rationale, and approval | P1 |
| MIG-02 | Give every inventory entry a disposition: exact equivalent, approved relevant consolidation, retained old content, new content awaiting approval, or intentional 404/410. Unknown does not mean redirect to Home | P1 |
| MIG-03 | Implement approved permanent 301/308 redirects at a layer that actually receives old-domain requests. New-app rules alone cannot repair requests still handled by old hosting | P1 |
| MIG-04 | Old root redirects directly to `https://downsizebaltimore.com/`. Normalize www/HTTP new-site variants to final HTTPS apex for public GET/HEAD requests; combine host and recognized-path normalization where feasible | P1 |
| MIG-05 | Preserve meaningful path/query values without reflecting arbitrary hosts or allowing open redirects. Protect publisher/API methods and authentication from unexpected cross-origin redirects | P1 |
| MIG-06 | Keep old-domain registration/TLS/redirect service functioning through migration. Plan redirects for at least one year, and longer where useful; do not cancel old hosting until its redirect replacement is tested | P1 |
| MIG-07 | Keep canonical tags, sitemap URLs, approved internal destinations and social URL fields aligned. No title, description, or visible link-label rewrites | P2 |

## Initial mapping worksheet (not an approved map)

| Legacy path | Current evidence | Candidate disposition |
| --- | --- | --- |
| `/` | 301 to HTTP new root | Direct permanent redirect to HTTPS new root |
| `/buying-selling/` | 404 | Review old content for equivalence with `/buying-selling` |
| `/sellers/decide-to-sell/` | 404 | Review relevance before consolidating into `/buying-selling` |
| `/probate/` | 404 | No confirmed equivalent; owner/content decision required |
| `/attorneys/` | 404 | No confirmed equivalent; do not assume a consumer service page matches |
| `/bel-air/` | 404 | Location-page intent requires review; no automatic homepage redirect |

Expand to all discovered URLs, including old posts, images/PDFs with links, listing routes, and www variants. Expired listings with no replacement may legitimately remain 404/410. Do not fabricate equivalent content merely to eliminate every 404.

## Implementation and safety

- Touchpoints: GoDaddy/old host redirect configuration; `server/index.ts`; `client/src/lib/siteRoutes.ts`; production integration tests. Choose one authoritative redirect layer and document it.
- Export the current relevant DNS/forwarding configuration before changing it. Preserve MX, SPF, DKIM, DMARC, verification TXT, and unrelated subdomains. Do not delete the old site or replace nameservers as an incidental fix.
- Confirm TLS coverage for both domains and www variants before routing traffic. Use allowlisted host/proxy assumptions, not unsanitized forwarded headers.
- If old content must remain live, carve out an explicit routing plan; do not silently migrate every service to the new brand/site.

## Acceptance tests

1. A committed mapping inventory has a reviewed disposition for every entry in the agreed batch; undecided entries are not deployed.
2. For each approved source, GET and HEAD reach the approved final 200 destination via one redirect where the host platform permits it; any unavoidable extra hop has a documented owner-accepted exception. No loops, HTTPS downgrade, unrelated targets, or broken fragments.
3. Test HTTP/HTTPS and apex/www on both domains, case/trailing slash aliases, encoded paths, and a benign campaign query. Unknown paths remain genuine 404/410, not soft-404 Home responses.
4. Test existing contact, booking, download, login, logout, publisher API, and image/video URLs without real production content changes. No authentication or email-DNS regression.
5. Sitemap/canonicals use only final approved indexable URLs. Capture before/after HTTP chains as release evidence.
6. After authorized release, use Search Console migration tools only if the full site-move prerequisites are satisfied; monitor relevant crawl/indexing reports. A successful redirect is not a promise of immediate ranking transfer.

## Exclusions and rollback

No new probate/local/service page, copy rewrite, domain purchase, mailbox migration, or bulk content deletion. Those require separate approval. Back up and restore the exact previous redirect configuration if traffic or authentication breaks; revert the application redirect commit independently. Preserve the mapping and verification evidence even if the release is rolled back.
