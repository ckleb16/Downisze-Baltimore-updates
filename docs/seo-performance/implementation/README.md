# Sequential implementation tracker

Updated October 26, 2026. User request: implement the PRDs one by one and fix the issues found in the follow-up audit. Each batch remains independently reviewable. The Resource Center contrast correction was explicitly requested; other approved wording and design remain unchanged. No production deployment or external account change has been made.

| PRD | State | Next requirement |
| --- | --- | --- |
| 01 — Migration | Repository redirect policy and tests implemented; old site retirement confirmed | [Detailed status](PRD-01-status.md); old-host access, individual URL mapping and authorized deployment |
| 02 — Performance | First technical batch implemented; release checks incomplete | [Detailed status](PRD-02-status.md); controlled measurements, image/CSS follow-up and full parity gates |
| 03 — Technical SEO | Phase A metadata/crawler work implemented locally; not deployed | [Detailed status](PRD-03-status.md); browser parity, Search Console access, rendering/business-fact decisions |
| 04 — Accessibility/runtime | Carousel semantics and database type mismatch fixed locally | Browser/accessibility parity, dependency review, release gates |
| 05 — Measurement/local | Queued; account/privacy decisions needed | Authorized accounts and measurement preferences; no unapproved tracking |
| 06 — Content/conversion | Approval-gated proposals only | Exact proposal approval before any writing/design change |
| 07 — Release gates | Applied to each batch proportionately | No deployment until relevant checks and external configuration review pass |

## Additional findings queued before release

- The previous TypeScript error in `server/sqliteD1.ts` was corrected by providing real SQLite size and changed-database metadata. The full type check now passes; browser/runtime parity remains a separate release gate.
- October 13 dependency audit: 23 advisory package entries overall (2 critical, 7 high, 8 moderate, 6 low); production-only audit reports 6 low and zero moderate/high/critical entries. Critical/high findings are in development tooling, including Vitest/Tinypool and the Cloudflare development chain. This is not evidence of a critical live-site exploit. PRD 04 should validate reachability, remove unused packages or make targeted compatible updates, then rerun both audits and tests. No automatic force-fix or lockfile change was made during PRD 01.

The missing old-host redirects remain a separate unresolved production issue. A successful application test does not prove those external rules have been changed.
