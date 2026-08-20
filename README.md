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

The implementation and client-readiness acceptance criteria are documented in [CLIENT_READINESS_PRD.md](CLIENT_READINESS_PRD.md).

## Content approval notes

- Testimonials stay hidden until Mary approves the exact quotations and attributions.
- Confirm whether the Meet Mary video contains meaningful speech; if it does, add approved captions or a transcript before public launch.
- The current Contact form opens an email draft on the visitor's device. Direct in-page submission requires a separately approved form provider and credentials.
