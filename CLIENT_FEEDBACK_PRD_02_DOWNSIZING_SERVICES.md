# Downsize Baltimore — Client Feedback PRD 02: Downsizing Services

## Document status

- Product: Downsize Baltimore marketing website
- Section: Downsizing Services (`/downsizing-services`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 8–11
- Status: Clear requirements implemented and verified; Comment 8 remains deferred in the linked ambiguity register
- Dependency: Reuses the homepage header, closing-strip, hero-caption, and footer standards defined in PRD 01

## Objective

Bring the confirmed areas of the Downsizing Services page into the same visual system as the homepage: its image-bottom caption, compact closing banner, and shared footer. Preserve the page’s content and editorial character while removing the page-number treatment and redundant closing call to action identified by the client. The opening-hero geometry remains unchanged until Comment 8’s scope is confirmed.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 8 | Downsizing Services opening hero | Match the size and spacing used on the first page. | Deferred. It is unclear whether this applies to the complete hero geometry or only the selected label and nearby spacing. See the [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md#comment-8--scope-of-the-homepage-match) and [original Pastel comment](https://usepastel.com/link/4lgrqj03/comment/12355232/). |
| 9 | “One Conversation Can Make the Whole Thing Feel More Manageable” closing panel | Make bottom banners similar across the site, use the page-one rectangular treatment, and remove **Schedule a Conversation**. | Reuse the compact horizontal closing-strip system established by Homepage requirement H6, preserve this page’s copy, and remove the button inside this strip. |
| 10 | Downsizing Services footer | Use the same footer across the site and follow the page-one notes. | Continue using the shared footer component with every approved Homepage H7 change; do not create a Downsizing-specific footer variation. |
| 11 | Lower-right hero caption: “01 Destination first. Plan second. Stuff third.” | Match the homepage photo-footer style and remove “01.” | Use the homepage hero-caption size, backing, spacing, and low-right placement. Display only “Destination first. Plan second. Stuff third.” with no replacement number. |

## Pre-implementation observation

At the client’s 1212×799 reference size, the homepage hero was approximately 760px tall while the Downsizing Services hero compressed to approximately 574px. The former Downsizing closing area was approximately 936px tall. The closing-area observation informed the confirmed Comment 9 fix; the hero-height difference was not acted on because Comment 8 remains ambiguous.

## Requirements

### D1 — Preserve the hero pending clarification

- Keep the existing Downsizing Services photograph, heading, body copy, **Start With a Conversation** action, hero height, content inset, and internal spacing unchanged.
- Do not infer whether “match size and spacing” means the complete hero or only the selected label.
- Revisit this requirement only after Comment 8 is resolved in the ambiguity register.

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
- Inherit the confirmed Homepage H7 changes: Mary’s 24px bold direct phone number, 16px direct email, unchanged brokerage/address scale, and the retained footer conversation action.
- Keep the Cummings & Co. logo deferred until the approved asset or variant is identified in the ambiguity register.
- Preserve the active Downsizing Services state in footer navigation while keeping all other footer geometry identical.
- Remove or leave unused any legacy Downsizing-only footer styles; they must not affect the rendered page.

### D5 — Shared header inheritance

- Continue rendering the common site header.
- If Homepage H1 is approved, the larger and bolder navigation labels must appear on this page automatically through the shared header rather than a page-specific override.
- Preserve the active Downsizing Services navigation state and gold underline.

## Responsive and accessibility acceptance criteria

- Verify the page at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- Preserve the existing Downsizing hero geometry and spacing while Comment 8 is deferred; no accidental hero resizing or re-spacing may be introduced by the confirmed changes.
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

- **Comment 8 scope:** Hero resizing and re-spacing remain deferred. The exact client wording, Pastel link, unresolved choice, and protected scope are recorded in the [separate ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md#comment-8--scope-of-the-homepage-match).
- **Comment 11 is not deferred:** The caption keeps only the remaining sentence, with no replacement gold label or number.

## Implementation and verification record

- Comment 9: implemented through the shared Homepage/Downsizing closing-strip layout; Downsizing copy is preserved and the local conversation button is removed.
- Comment 10: verified through the shared footer component, including the approved phone and email hierarchy; the footer conversation action remains available.
- Comment 11: implemented with the exact remaining sentence, Homepage-matched backing and placement, no “01,” and matching mobile visibility behavior.
- Verified at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568 with no horizontal overflow, caption/content collision, closing-strip content collision, or browser runtime errors.

## Definition of done

The confirmed Section 2 work is complete when Comments 9–11 are implemented through shared systems, the caption uses the homepage treatment without “01,” the closing area uses the compact button-free strip, the shared footer matches every other route, and the responsive/accessibility checks pass without regressions. Comment 8 remains intentionally incomplete until its scope is resolved.
