# Downsize Baltimore

Client-ready website for Downsize Baltimore and Mary Lynch, covering downsizing, aging in place, buying and selling, educational resources, and contact pathways for Greater Baltimore families.

## Local development

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

The development site is available at `http://127.0.0.1:3000/` by default.

## Quality checks

```bash
pnpm check
pnpm build
```

The comprehensive remediation requirements and verification record are documented in [COMPREHENSIVE_AUDIT_REMEDIATION_PRD.md](COMPREHENSIVE_AUDIT_REMEDIATION_PRD.md). [CLIENT_READINESS_PRD.md](CLIENT_READINESS_PRD.md) remains the earlier client-readiness baseline.

## Content approval notes

- Testimonials stay hidden until Mary approves the exact quotations and attributions.
- The Meet Mary video has been classified by engineering and now includes synchronized English captions plus an adjacent transcript. Content-owner approval of that wording is still required before public launch; see [MEET_MARY_VIDEO_ACCESSIBILITY_RECORD.md](MEET_MARY_VIDEO_ACCESSIBILITY_RECORD.md).
- The production domain and generated 1200 × 630 social-sharing image require owner approval, and the audited build must be deployed before the live-site smoke test.
- The current Contact form opens an email draft on the visitor's device. Direct in-page submission requires a separately approved form provider and credentials.
