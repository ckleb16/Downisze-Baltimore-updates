# Downsize Baltimore — Client Feedback PRD 02: Downsizing Services

## Document status

- Product: Downsize Baltimore marketing website
- Section: Downsizing Services (`/downsizing-services`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 8–11
- Status: Draft ready for implementation after the consolidated end-of-review decisions
- Dependency: Reuses the homepage header, closing-strip, hero-caption, and footer standards defined in PRD 01

## Objective

Bring the Downsizing Services page into the same visual rhythm as the homepage by aligning its opening hero, image-bottom caption, compact closing banner, and shared footer. Preserve the page’s content and editorial character while removing the page-number treatment and redundant closing call to action identified by the client.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 8 | Downsizing Services opening hero | Match the size and spacing used on the first page. | Match the homepage hero’s overall height, content inset, type scale, and vertical rhythm at the same viewport. The shared header already supplies the same structural header; the requested change is interpreted as the photographic hero beneath it. |
| 9 | “One Conversation Can Make the Whole Thing Feel More Manageable” closing panel | Make bottom banners similar across the site, use the page-one rectangular treatment, and remove **Schedule a Conversation**. | Reuse the compact horizontal closing-strip system established by Homepage requirement H6, preserve this page’s copy, and remove the button inside this strip. |
| 10 | Downsizing Services footer | Use the same footer across the site and follow the page-one notes. | Continue using the shared footer component with every approved Homepage H7 change; do not create a Downsizing-specific footer variation. |
| 11 | Lower-right hero caption: “01 Destination first. Plan second. Stuff third.” | Match the homepage photo-footer style and remove “01.” | Use the homepage hero-caption size, backing, spacing, and low-right placement. Display only “Destination first. Plan second. Stuff third.” with no replacement number. |

## Measured baseline

At the client’s 1212×799 reference size, the current homepage hero is approximately 760px tall while the Downsizing Services hero compresses to approximately 574px. The Downsizing closing area is approximately 936px tall. These differences explain why the page feels tighter at the top and substantially larger/squarer at the bottom than the homepage reference.

## Requirements

### D1 — Match the homepage hero rhythm

- Keep the existing Downsizing Services photograph, heading, body copy, and **Start With a Conversation** action.
- At desktop widths, use the homepage hero as the source of truth for overall height, left content inset, vertical anchoring, and spacing between the eyebrow, heading, paragraphs, and button.
- At the 1212×799 reference viewport, target an overall hero height of approximately 740–760px rather than the current approximately 574px.
- Remove the short-laptop rule that compresses only the Downsizing hero relative to the homepage, or replace it with a shared rule that produces equivalent geometry on both pages.
- Use the homepage hero’s approved eyebrow treatment after PRD 01 is implemented: 13px at the reference desktop width, 700 weight, uppercase, and the same line-and-label spacing.
- Keep the Downsizing heading in the same apparent 76–80px range as the homepage heading at the reference width, with matching line-height and spacing below it.
- Use the same approximately 7vw left inset as the homepage at the reference width.
- The longer Downsizing copy must fit without crowding, clipping, or overlapping the lower-right caption.
- On mobile, preserve the established content-first hierarchy and allow content-driven height. Do not force the desktop height onto small screens.

### D2 — Match the homepage hero-caption treatment

- Remove the visible “01” from the lower-right hero caption.
- Keep the exact remaining copy: “Destination first. Plan second. Stuff third.”
- Match the homepage caption’s approximately 12px sans-serif type, letter spacing, navy translucent backing, compact padding, and low-right placement.
- Keep the caption visually subordinate to the hero heading and action.
- Hide the caption at the same mobile breakpoint as the homepage caption so the two pages behave consistently and the label does not compete with mobile hero content.
- Do not remove numbering from step cards, later image labels, or other sequential content. Comment 11 applies only to this hero caption.

### D3 — Reuse the compact closing-strip system

- Replace the current large centered closing panel with the same compact horizontal strip specified in Homepage requirement H6.
- Preserve this page’s eyebrow, headline, and two supporting paragraphs.
- Remove the **Schedule a Conversation** button inside this closing strip.
- On desktop, use the same two-column arrangement, border treatment, type scale, content width, and approximately 300–360px target height as the homepage strip.
- Reduce the closing headline from its current oversized presentation to the shared responsive 48–64px range.
- Keep the paper texture and restrained antique-gold detailing.
- On tablet and mobile, stack the content groups and use content-driven height without recreating a large square panel.
- Implement the homepage and Downsizing strips from a shared component or shared layout class so later pages can adopt the same geometry without visual drift.

### D4 — Use the approved shared footer

- Render the same shared footer used on the homepage with no Downsizing-specific content, spacing, or typography overrides.
- Inherit the pending Homepage H7 changes: approved Cummings & Co. logo beside the brokerage details, Mary’s 24px bold direct phone number, 16px direct email, unchanged brokerage/address scale, and the retained footer conversation action.
- Preserve the active Downsizing Services state in footer navigation while keeping all other footer geometry identical.
- Remove or leave unused any legacy Downsizing-only footer styles; they must not affect the rendered page.

### D5 — Shared header inheritance

- Continue rendering the common site header.
- If Homepage H1 is approved, the larger and bolder navigation labels must appear on this page automatically through the shared header rather than a page-specific override.
- Preserve the active Downsizing Services navigation state and gold underline.

## Responsive and accessibility acceptance criteria

- Verify the page at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- At equivalent desktop widths, the homepage and Downsizing heroes must feel like the same system: overall height within approximately 16px, equivalent left inset, matched eyebrow scale, and aligned vertical rhythm.
- Hero text and the photo caption must not overlap at short desktop heights.
- The hero caption contains no “01” and disappears at the same mobile breakpoint as the homepage caption.
- The closing strip contains no conversation button and is materially shallower than the current panel.
- The footer retains its separate **Schedule a Conversation** action.
- The footer structure, contact hierarchy, logo treatment, spacing, and responsive stacking match the homepage exactly.
- No horizontal scrolling, clipping, or unintended text truncation may be introduced.
- All remaining links and buttons retain visible keyboard focus and at least 44×44px activation targets.

## Non-goals

- Rewriting the Downsizing Services hero, body, or closing copy.
- Removing the hero **Start With a Conversation** action.
- Removing numbered steps, question numbers, or later image labels.
- Redesigning the page’s plan, possibilities, steps, support-network, reflection-question, or resource sections.
- Creating a unique Downsizing footer.
- Applying changes to later pages before their own feedback is mapped.

## Deferred clarification log

These items are recorded for the consolidated question round at the end and do not block drafting the next section:

1. **Comment 8 scope:** The recommended interpretation is that “match size and spacing” applies to the complete photographic hero beneath the shared header, not merely the “Downsizing Services” eyebrow or the header itself.
2. **Comment 11 styling after removing “01”:** The recommended implementation keeps only the remaining sentence, with no replacement gold label or number.

## Definition of done

This section is complete when comments 8–11 are implemented through shared systems, the Downsizing hero matches the homepage’s opening rhythm, the caption uses the homepage treatment without “01,” the closing area uses the compact button-free strip, the shared footer matches every other route, and the responsive/accessibility checks pass without regressions.
