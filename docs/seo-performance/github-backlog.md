# GitHub implementation backlog

Status: proposed tickets only; no issues, application changes, DNS changes, account edits or deployment are created by this document. Use this as an issue-ready breakdown after the owner authorizes implementation. Each ticket inherits the [approval contract](README.md#non-negotiable-approval-contract).

## Recommended issue sequence

| Ticket / suggested title | Priority | Requirements | Depends on | Completion proof |
| --- | --- | --- | --- | --- |
| SEO-100: Freeze approved visual/text and route baseline | P1 | QA-01, QA-02 | None | Current route inventory; all required viewport/state captures; text/metadata baseline |
| SEO-110: Audit Search Console and legacy URLs | P1 | MIG-01, MIG-02, MEAS-01 | Authorized read access | Reviewed source-to-target inventory; unknowns and approval decisions |
| SEO-120: Repair approved migration redirects and canonical hosts | P1 | MIG-03–MIG-07 | SEO-110, hosting authorization | Complete GET/HEAD matrix; protected email/auth config; relevant final URLs |
| SEO-130: Expose responsive hero discovery in initial HTML | P1 | PERF-01 | SEO-100 | Request waterfall and no duplicate download; correct per-route hero |
| SEO-140: Optimize approved image delivery | P1 | PERF-02, PERF-06 | SEO-100 | Byte/dimension report; DPR/crop/quality parity; no media regression |
| SEO-150: Optimize exact-font and CSS delivery | P1 | PERF-03, PERF-04 | SEO-100 | Font provenance and typography parity; all-route CSS coverage/diffs |
| SEO-160: Reduce measured public JS overhead | P2 | PERF-05 | SEO-100 | Actual bundle comparison; unchanged lazy routes/publisher isolation |
| SEO-170: Synchronize metadata and protect indexability | P1 | SEO-01, SEO-03–SEO-05 | SEO-100; coordinate SEO-120 | Direct/client-navigation metadata matrix; sitemap/private-state checks |
| SEO-180: Resolve crawler dependencies and document rendering choice | P1 | SEO-02, SEO-06 | SEO-100; access when available | Raw/rendered evidence; public API/robots plan; costed decision record |
| SEO-190: Fix carousel semantics and complete manual accessibility review | P2 | A11Y-01–A11Y-03 | SEO-100 | Known role issue gone; keyboard/reader checks; visual issues queued for approval |
| SEO-200: Correct SEO caching and transient-failure behavior | P1/P2 | RUN-01–RUN-03 | Hosting access; SEO-170 | Origin/edge headers; simulated DB failure tests; no draft exposure |
| SEO-210: Restore publisher header parity and review runtime compatibility | P2 | RUN-04–RUN-06 | SEO-100 | Verified publisher framing/referrer protections; header/dependency register; focused tested changes only |
| SEO-220: Add approved measurement events and baseline reporting | P2 | MEAS-02–MEAS-05 | Privacy/tool approval | Deduplicated events; no personal-data payload; reports distinguish clicks from leads |
| SEO-230: Verify business entities and local profile corrections | P2 | LOCAL-01–LOCAL-03, SEO-07 | Owner facts/profile access | Approved fact sheet, schema validation, authorized profile change log |
| SEO-240: Release technical foundation with preservation evidence | Required gate | PERF-07, QA-03–QA-07 | Agreed foundation batch | Passing checks, median/range metrics, explicit deployment authorization, rollback |
| SEO-250: Implement approved same-content rendering | Optional | RENDER-01–RENDER-05 | SEO-180 decision, explicit phase-B authorization | No-JS body + hydration parity; fresh published content; no private leak |
| SEO-260: Prepare item-specific content/conversion proposals | Deferred | GROW-01–GROW-07 | Search/lead evidence; owner requests | Exact current/proposed review artifacts; no automatic implementation |

The number of tickets is not the number of mandatory separate PRs. Group small related changes only when they remain independently reviewable and reversible. SEO-240 is a repeating gate for approved batches, not permission to hold all fixes for one large release.

## Copy-ready issue body

```markdown
## Problem and evidence
Describe the observed issue; cite evidence ID(s) and the relevant PRD.

## Scope
- Requirement IDs:
- Routes/files/configuration:
- Dependencies and authorized accounts:
- Explicit exclusions:

## Approval boundaries
Appearance, wording, media composition and behavior remain locked.
Identify any proposed deviation with the exact before/after artifact.
No deviation or external configuration change is authorized by this issue alone.

## Acceptance checklist
- [ ] Requirement-specific tests pass with attached evidence.
- [ ] Visual and text baselines are unchanged, or each difference has explicit approval.
- [ ] Relevant route/device/state coverage is complete; gaps disclosed.
- [ ] No credentials, personal information or private content enter code/artifacts.
- [ ] Performance and indexability are verified where affected.
- [ ] Rollback procedure is tested/documented.
- [ ] Deployment authorization is recorded separately.
```

## Suggested labels and milestones

Labels: `seo`, `performance`, `accessibility`, `hosting`, `analytics`, `docs`, `needs-owner-input`, `requires-copy-approval`, `requires-design-approval`, `no-visible-change`. These are proposed labels; do not create repository settings automatically from this document.

Milestone 1: baseline + migration plan + measurement access. Milestone 2: approved technical foundation. Milestone 3: optional rendering. Milestone 4: individually approved growth work. No calendar deadline is promised until access and scope are confirmed.

## PR review rule

Every application PR links requirement IDs, test evidence, and any approval record. A documents-only PR can be reviewed without approving implementation. Merging a later PR to `main` may trigger hosting deployment; explicitly verify the deployment integration and authorization before merging.
