# Downsize Baltimore — Client Feedback PRD 03: Aging in Place

## Document status

- Product: Downsize Baltimore marketing website
- Section: Aging in Place (`/aging-in-place`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 12–22
- Status: Confirmed requirements implemented and verified; Comment 20 remains deferred in the linked ambiguity register
- Dependencies: Reuses the homepage hero-caption, compact closing-strip, shared-header, and shared-footer standards defined in PRD 01
- Cross-page impact: Comment 13 establishes a shared anchor-and-line section-label treatment for every route that uses that motif

## Objective

Make the Aging in Place page feel more visually connected to the first two pages, simplify its middle and lower flow, and improve the prominence of key editorial statements. The revised page should preserve its educational value while removing the redundant program block, standardizing photo captions and section markers, and converting the closing area to the shared compact banner system.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 12 | Hero planning note: “01 Plan early. Understand the whole picture.” | Put the note along the lower part of the photo like pages one and two, and remove “01.” | Move the remaining sentence out of the copy panel and onto the bottom of the hero photograph using the shared photo-caption treatment. Do not replace the number. |
| 13 | Anchor, gold line, and “The gap between…” label above the statistics | Make anchor-line labels slightly larger and consistent throughout the website. | Create one shared anchor-and-line label pattern and use it anywhere this same motif appears. Increase the icon, rule, and label together by one restrained scale step. |
| 14 | National sources below the two statistics | Make the source area smaller and stretch it beneath both statistics. | Turn the source into a compact full-width row below both statistic columns, reducing its vertical footprint while keeping the links readable and unchanged. |
| 15 | Mary-and-Pop visual and “Planning before the pressure” plaque | Make the photo(s) a little larger and higher; remove the complete plaque and anchor. | Remove the overlaid seal in full, enlarge the existing framed photograph, and align it closer to the top of the personal-story section. |
| 16 | Story pull quote: “Aging in place is not simply a renovation project…” | Make the blurb larger. | Increase the pull-quote scale and spacing while retaining its gold left rule and italic editorial style. |
| 17 | “Accessible homes” in the second pathway card | Replace the item with “Retirement Community.” | Make the exact supplied copy replacement in the move pathway list. |
| 18 | “Should I Stay or Should I Go?” educational-program block | Remove the entire section. | Delete the full tan program block, including its heading, connected-professionals list, and both actions. Do not remove the separate self-evaluation that follows it. |
| 19 | Bottom sentence below the two pathway cards | Make the blurb larger. | Increase the centered italic note so it functions as a clear concluding statement rather than fine print. |
| 20 | Boundary between the ADU topic and self-evaluation after comment 18 | Decide whether the colors should change or a tan line should separate the two topics. | Deferred. The client has not selected either treatment, so neither is implemented. See the [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md#comment-20--section-boundary-treatment) and [original Pastel comment](https://usepastel.com/link/4lgrqj03/comment/12355278/). |
| 21 | Final “The Goal Is Not to Stay at All Costs” panel | Match the earlier rectangular closing banners and remove **Schedule a Conversation**. | Reuse the compact horizontal closing-strip system established in Homepage H6, retain the Aging in Place copy, and remove its internal button. |
| 22 | Aging in Place footer | Keep the footer consistent throughout the website. | Use the same currently approved shared footer component; do not create a page-specific variation or resolve the separate Comment 7 logo-asset ambiguity. |

## Requirements

### A1 — Move and simplify the hero photo caption

- Remove the planning note from the right-side copy panel.
- Remove the visible “01” with no replacement number, icon, or empty decorative badge.
- Preserve the exact remaining sentence: “Plan early. Understand the whole picture.”
- Position the sentence along the lower edge of the hero photograph, in a corner that does not cover Mary’s face or other meaningful image content.
- Match the homepage and Downsizing photo-caption system: approximately 12px sans-serif text, compact spacing, restrained navy backing, gold accent treatment where applicable, and consistent distance from the image edges.
- Keep the caption visually subordinate to the hero heading and **Schedule a Conversation** action.
- At stacked mobile widths, hide the caption at the same breakpoint used by the homepage and Downsizing hero captions rather than placing it back inside the copy panel.

### A2 — Establish the shared anchor-and-line label system

- Create one reusable anchor-and-line label component or shared style rather than maintaining page-specific approximations.
- Increase the anchor from the current 15px to approximately 18–20px.
- Increase the horizontal rule from approximately 40px to 48–52px.
- Increase the uppercase label to a responsive 12–13px range, retaining the existing bold weight, gold color, and editorial letter spacing.
- Keep icon, rule, and label vertically centered with consistent gaps.
- Allow long labels to wrap cleanly on small screens without overlapping the anchor or creating horizontal scrolling.
- Apply the approved pattern to equivalent anchor-and-line section labels across the website. Do not enlarge decorative anchors, logos, standalone icons, or icons inside unrelated cards.

### A3 — Compress and widen the national-source row

- Keep the existing source wording and both destination URLs unchanged.
- Place the source immediately below both statistics as a row spanning the complete two-column statistics grid.
- Use the same maximum content width and left/right edges as the two statistics together.
- Reduce the source block’s vertical footprint by approximately 25–35% through wider line measure and tighter—but still readable—spacing.
- Keep source text at least 12px with a minimum 1.45 line height; do not satisfy “smaller” by creating inaccessible fine print.
- Retain visible link differentiation, keyboard focus, and sufficiently large inline-link hit areas.
- On mobile, allow natural wrapping beneath the stacked statistics with no clipping or overlap.

### A4 — Enlarge and raise the personal-story photograph

- Remove the entire **Planning before the pressure** seal, including its anchor, navy plaque, border rule, and reserved overlay space.
- Preserve the existing Mary-and-Pop image, frame, crop, rotation, alternative text, and keepsake character unless a later asset change is requested.
- Increase the desktop visual width from the current approximately 21rem to approximately 25–27rem, subject to maintaining a balanced copy column.
- Align the visual toward the top of the personal-story section rather than vertically centering it; target an apparent upward shift of approximately 40–60px at the reference desktop width.
- Rebalance the section grid so the enlarged image does not squeeze, overlap, or cause awkward line lengths in the story copy.
- On tablet and mobile, use a fluid width up to the available content width and remove any offset that could crop the frame or create horizontal scrolling.

### A5 — Increase the story pull quote

- Keep the exact sentence: “Aging in place is not simply a renovation project. It is a plan for the life around the house.”
- Increase the current approximately 21px quote to a responsive 28–30px range on desktop and 22–24px on mobile.
- Retain the italic serif style, warm-gold color, and left rule.
- Increase the rule weight or contrast only as needed to remain visible at the new scale.
- Keep the quote within its copy column and prevent single-word orphan lines at the tested desktop widths where practical.

### A6 — Update the pathways content and concluding note

- Replace only the list item **Accessible homes** with the exact supplied wording **Retirement Community**.
- Preserve the order and wording of all other pathway items.
- Do not change the card numbers “01” and “02”; they identify the two genuine pathway choices and were not targeted by the client.
- Increase “Aging in place does not always mean remaining in the same house forever.” from its current approximately 20px to a responsive 28–32px range on desktop and 22–24px on mobile.
- Retain the centered, italic serif treatment and provide sufficient space above and below for it to read as the pathways conclusion.

### A7 — Remove the educational-program block without resolving Comment 20

- Delete the complete tan **An educational starting point / Should I Stay or Should I Go?** section.
- Remove its connected-professionals list, **Ask About Upcoming Programs** button, and **Take the Self-Evaluation** button.
- Remove any now-unused data, layout rules, and imports associated only with this deleted block during implementation.
- Preserve the separate navy **A connected possibility** ADU section above it.
- Preserve the separate navy **A practical next step** self-evaluation section below it, including its interactive evaluation.
- Preserve the existing colors and boundary treatments on the two adjacent sections after the deletion.
- Do not add a tan divider, recolor either navy section, or introduce another separating treatment until Comment 20 is resolved in the ambiguity register.

### A8 — Reuse the compact closing-strip system

- Remove **Schedule a Conversation** from the final Aging in Place panel only.
- Retain the eyebrow, headline, both supporting paragraphs, paper texture, border treatment, and restrained anchor motif.
- Convert the centered framed panel to the shared horizontal two-column closing strip defined in Homepage H6.
- Target a content-driven desktop height of approximately 300–360px and the shared responsive 48–64px heading range.
- Keep the decorative anchor only if it fits the shared geometry without adding material height; it may sit beside the eyebrow.
- On tablet and mobile, stack the content groups and retain comfortable content-driven spacing.
- The separate footer **Schedule a Conversation** action remains available.

### A9 — Use the approved shared site chrome

- Continue rendering the common site header and preserve the active Aging in Place navigation state.
- Inherit any approved navigation-scale change from Homepage H1 through the shared header.
- Render the same shared footer used on every route, with no Aging-specific spacing, typography, or content overrides.
- Inherit the implemented Homepage H7 changes: Mary’s 24px bold direct phone, 16px direct email, unchanged brokerage/address scale, and retained footer conversation action.
- Do not add a Cummings & Co. logo until the approved public asset is identified under Comment 7 in the ambiguity register.

## Responsive, interaction, and accessibility acceptance criteria

- Verify the page at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- The hero planning caption appears on the photograph at desktop/tablet presentation widths, contains no “01,” never covers Mary’s face, and follows the shared mobile visibility rule.
- The anchor-and-line label has the same icon size, rule length, type scale, gaps, and wrap behavior wherever the shared motif appears.
- The national-source row visibly spans both desktop statistic columns and remains legible on mobile.
- The Mary-and-Pop visual is larger and higher, with no remaining plaque, anchor, overlap, clipping, or horizontal overflow.
- Both enlarged blurbs retain readable line lengths and do not collide with adjacent content.
- The pathway list contains **Retirement Community** and no **Accessible homes** entry.
- The deleted educational-program section, its professional list, and its two actions are absent from the rendered page and keyboard order.
- No new divider or recoloring appears between the adjacent navy ADU and self-evaluation sections while Comment 20 is deferred.
- The self-evaluation remains fully usable by keyboard, retains its labels and results, and is not removed with the program block.
- The final closing strip contains no conversation button; the footer retains its separate action.
- No horizontal scrolling, clipped text, layout shift, broken focus order, or touch target smaller than 44×44px is introduced.

## Non-goals

- Rewriting the hero, statistics, personal story, assessment, ADU, self-evaluation, NAIPC, or final-panel copy.
- Removing the hero **Schedule a Conversation** action or footer conversation action.
- Removing the self-evaluation because it shares “Should I Stay or Should I Go?” wording with the deleted educational-program section.
- Removing the story image label “02 / A Conversation in Context” or pathway-card numbers.
- Changing the cited source destinations or the factual statistics.
- Replacing the Mary-and-Pop photograph.
- Applying the anchor scale to every anchor icon regardless of context.

## Ambiguity handling

- **Comment 20 only:** The section-boundary choice remains intentionally unresolved and is maintained in the [separate ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md#comment-20--section-boundary-treatment).
- Comments 13, 15, and 17 are treated as confirmed: the equivalent anchor-line label motif is standardized, the single displayed Mary-and-Pop visual is enlarged with its plaque removed, and the exact supplied wording **Retirement Community** is used.
- The separate Comment 7 footer-logo ambiguity remains deferred and is not changed by Comment 22.

## Implementation and verification record

- Implemented August 31, 2026.
- Comments 12–19 and 21–22 are implemented. Comment 20 remains intentionally untouched and linked to its original Pastel comment in the separate ambiguity register.
- Responsive layout was verified at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568 with no horizontal overflow.
- The mobile navigation was opened and closed, including Escape-key closing and focus return to the menu control.
- The self-evaluation was completed through all ten questions, including answer selection, Back, changing a prior answer, results totals, focus movement, returning from results, and a full reset.
- The shared anchor-and-line label was regression-checked on the Downsizing page at desktop, breakpoint, and mobile widths.
- Browser error and warning logs were empty after the responsive and interaction passes.

## Definition of done

The confirmed Section 3 work is complete when Comments 12–19 and 21–22 are implemented, the page flows cleanly after removal of the program block, its key editorial blurbs and personal image have the requested prominence, shared caption/anchor/closing/footer systems are consistent across routes, the self-evaluation remains intact, and all responsive, interaction, and accessibility checks pass without regressions. Comment 20 remains intentionally incomplete until the client selects a boundary treatment.
