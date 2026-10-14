# PRD 01 implementation and hosting handoff

Date: October 13, 2026. Status: repository redirect implementation and functional tests complete; **not deployed and not complete end-to-end**. The October 13 request authorizes sequential technical implementation. It does not override the approval requirement for design/writing changes or authorize unreviewed legacy-page consolidations.

## Application policy

- Public recognized pages on the exact apex/www production hosts normalize to the configured HTTPS apex in a single 308, combining host, case/trailing slash and `/index.html` correction.
- Published article aliases resolve to the current published slug before the redirect is chosen. Missing articles and unknown pages retain real 404 responses rather than redirecting to Home.
- Host redirects are enabled only in production, unless `SITE_INDEXABLE=false`, and only when `SITE_URL` resolves to `https://downsizebaltimore.com`. No new environment value is required.
- Preview/local/unknown hosts are not redirected to production. Existing relative path-only alias normalization remains available there.
- No cross-host redirect is applied to API, publisher, private article media, static assets, or non-GET/HEAD requests. Publisher path aliases retain existing same-origin normalization. HTTPS for excluded resources remains a hosting/edge responsibility.
- Destinations use a fixed approved origin, never `Host`, `Forwarded`, or `X-Forwarded-Host`. Query parameters are preserved; arbitrary destination query values cannot become redirect targets.
- The existing Express `trust proxy: 1` behavior is unchanged. Hosting must overwrite forwarded protocol headers and provide the expected proxy hop before this is released; do not infer trust from arbitrary request headers. See [Express proxy guidance](https://expressjs.com/en/guide/behind-proxies/).

Only server routing, tests, CI and implementation records are in this batch. Frontend layout, styles, copy, metadata wording and assets remain unchanged from `4524e14`.

## Legacy-host findings and unresolved decisions

[The machine-readable inventory](legacy-url-inventory.json) records 21 discovered legacy URLs. This is a sample, not a complete migration inventory. Search Console, old CMS exports, traffic/backlinks and hosting access are still unavailable.

Owner confirmed on October 13 that the old website is retired and its URL redirects. Keep the old domain as redirect infrastructure; no old-site retention is requested. This confirms retirement, not an automatic approval to redirect unrelated former service/listing pages to Home.

Old root GET requests currently take two hops through HTTP; the initial forwarding drops a benign campaign query. Old root HEAD responds 405. Known deep pages return edge 404 responses; this does not establish that WordPress content has been deleted.

The old domain does not currently reach this application's redirect middleware. Installing rules only in the new app cannot repair those responses. No speculative legacy mapping is active. `/bel-air/` was an IDX results page, and the new Resource Center's probate disclaimer is not an equivalent probate service destination.

## Hosting checklist — do not apply without authority and review

1. Retirement is confirmed; obtain approved deep-link dispositions for the inventory. Export the old sitemap/CMS and Search Console link/page reports if available.
2. Export existing DNS, forwarding, proxy/TLS and hosting settings. Preserve email MX/SPF/DKIM/DMARC records, verification records, unrelated subdomains and old-domain registration.
3. Confirm which service answers each old-domain variant and whether it can perform path-specific permanent redirects. Verify TLS on both domains and www variants before redirect changes.
4. Configure the old root to the final HTTPS apex, preserving intended query parameters. For deep URLs, deploy only individually approved relevant mappings; leave unresolved paths unchanged. Do not blanket-forward to Home.
5. Deploy this application branch only after review and explicit release authorization. Verify the actual hosting proxy protocol/header behavior and compare GET/HEAD chains at the edge; platform-enforced extra hops must be documented.
6. Confirm contact/booking/download links, publisher sign-in/logout, draft/image privacy, video seeking and public article deep links. Do not modify real client content for smoke tests.
7. Keep functioning old-domain redirects for at least one year and longer where valuable. Do not cancel old hosting until its replacement redirect service is independently verified. Use Search Console migration tools only when their full-site-move prerequisites hold.

## Verification commands

Use Node 22.15+ and the repository's installed dependencies:

```text
npm run check
npm run build
node --experimental-strip-types scripts/test-canonical-redirects.mjs
node scripts/test-domain-redirects.mjs
node scripts/test-godaddy.mjs
node --experimental-strip-types scripts/test-godaddy-source.mjs
node scripts/audit-migration.mjs --live
```

The first tests use disposable local data. The live auditor performs only bounded public GET/HEAD requests against known URLs, follows only the four approved public domain variants, and does not alter configuration. Its output represents current deployment state, not the local implementation. Do not expect production to pass new redirect requirements until an authorized deployment/hosting change occurs.

## Requirement status

| Requirement | Status |
| --- | --- |
| MIG-01 | 21 public URLs recorded; complete account-backed inventory pending |
| MIG-02 | Candidate relevance documented; owner decisions pending |
| MIG-03 | Blocked on old-host configuration and approved mappings; not deployed |
| MIG-04 | New-host application normalization implemented locally; old-root fix remains external |
| MIG-05 | Guards and query-preserving tests pass locally; production verification pending |
| MIG-06 | Hosting retention/TLS checklist documented; owner/provider confirmation pending |
| MIG-07 | Existing canonical/sitemap/social URL source retained; application checks and production verification required |

## Rollback

Revert the dedicated PRD 01 implementation commit to restore prior application redirects; no database migration or content update is involved. Restore only the exact reviewed forwarding settings if an external change causes trouble; never delete old hosting, nameserver records or persistent publisher data as a rollback. A code rollback cannot undo third-party forwarding and vice versa.

## Test results

Verified on Node 22.23.3:

- Production build: pass; generated client asset hashes are unchanged from the original PageSpeed/source baseline for the main CSS/JS, and no `client/` source/assets were edited.
- Canonical redirect source suite: 103 assertions pass.
- New production redirect suite: 621 assertions pass, using loopback-only requests and a disposable database/account. Includes renamed/unpublished articles, GET/HEAD, query preservation, private routes, missing routes, spoofed forwarded-host values, preview/development/indexability modes, and full sitemap route/canonical/OG/indexability verification with tracking queries.
- Existing GoDaddy production suite: 30 checks pass.
- Existing GoDaddy source integration suite: 22 checks pass.
- Diff whitespace check: pass.
- Read-only live audit: 80 GET/HEAD cases attempted. Confirmed the old-root two-hop HTTPS downgrade/upgrade chain and HEAD 405, and the new www root still returning 200. Nineteen listing-path requests had transport errors in this batch, so this is not a clean full-inventory verification; preserve the earlier sampled observations and recheck those paths before any mapping decision.
- Full TypeScript check: fails on the existing, unchanged SQLite adapter `D1Result` metadata assertion (`server/sqliteD1.ts:82`, missing `size_after` / `changed_db`). See the [tracker](README.md); release remains gated until this is resolved.

The GoDaddy workflow now runs both new redirect suites as well as the existing production suite, including on this implementation branch. Tests do not change live content or domain configuration. Full cross-device visual QA is not claimed for this server-routing-only batch; byte-unchanged frontend sources and unchanged client bundle hashes establish that no design/copy implementation was introduced.
