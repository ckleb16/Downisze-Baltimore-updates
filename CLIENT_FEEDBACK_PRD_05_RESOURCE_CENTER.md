# Downsize Baltimore — Client Feedback PRD 05: Resource Center

## Document status

- Product: Downsize Baltimore marketing website
- Section: Resource Center (`/resource-center`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 31–36
- Status: Confirmed comments 31–35 implemented and verified; Comment 36 deferred
- Dependencies: Reuses the homepage hero-caption, compact closing-strip, shared-header, and shared-footer standards defined in PRD 01

## Objective

Make the Resource Center’s major signposts shorter, simpler, and consistent with the approved cross-page patterns. The revision should horizontalize and de-number the hero caption, compress the question-pathway introduction, remove the Learn With Mary section, simplify the Downsizers Club marker, and convert the final panel into the shared compact closing strip without disrupting the resource filtering or FAQ interactions. The club-action rename remains deferred until its destination is approved.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 31 | Vertical hero-photo plaque: “01 / Start with the question.” | Make the box horizontal and remove “01 /”. | Convert the caption plaque—not the full photo container—to the shared horizontal photo-caption treatment. Retain only “Start with the question.” |
| 32 | “What Can I Help You Figure Out?” pathway introduction | Put the heading on one line and shorten the header space. | Remove the forced line break, widen the section-heading container, make the heading one line at the 1212px reference width, and reduce the intro band’s vertical footprint. This does not refer to the global site header. |
| 33 | “Learn with Mary / Prefer to Learn Together?” | Remove the entire section. | Delete the full visible Learn With Mary section, its six topic labels, paragraph, and action. Preserve the separate conditional Upcoming Classes & Events feature unless the client expands the scope. |
| 34 | “You Don’t Need to Know Which Door to Open” panel | Make it a long rectangle and remove the schedule button. | Reuse the shared compact horizontal pre-footer strip and remove its internal **Schedule a Conversation** action. Preserve the true shared footer below it. |
| 35 | “03” beside the Downsizers Club content | Remove number 3. | Remove only the club’s visible `03`; retain the anchor and vertical rule as a non-numbered decorative marker. |
| 36 | Club action: “Ask About the Club” | Change the label to “Join for Free.” | Defer the complete enrollment-action change because its destination and enrollment behavior are unresolved in the separate ambiguity register. Keep the current label and `/contact` destination unchanged for now. |

## Requirements

### R1 — Horizontal, number-free hero caption

- Remove the visible `01 /` with no replacement number, badge, or empty gap.
- Preserve the exact remaining copy: “Start with the question.”
- Remove the desktop vertical writing mode and rotation.
- Render the caption as a content-width horizontal plaque along the lower part of the hero photograph; do not turn it into a full-photo-width bar.
- Match the shared homepage reference treatment: approximately 12px sans-serif text, compact navy backing, restrained padding, and consistent photo-edge inset.
- Place the plaque where it does not cover Mary’s face, laptop, or other meaningful image content.
- Hide it at the same mobile breakpoint used by the approved shared hero-caption system.
- Do not change the hero photograph, copy, crop, or **Start With Your Question** action.

### R2 — One-line, shorter question-pathway introduction

- Change the heading markup to one uninterrupted phrase: “What Can I Help You Figure Out?”
- Preserve italic emphasis on “Figure Out?”
- Remove the current approximately 42rem heading constraint and align the intro with the approximately 1080–1200px pathway grid.
- At the client’s 1212px reference width and at 1512px, the complete heading must render on one line.
- Below the available width needed for an accessible type size, allow natural wrapping rather than shrinking the heading excessively or causing overflow.
- Reduce the introduction’s vertical footprint by approximately 25–35%:
  - reduce the current 8rem desktop section padding to approximately 5.5–6rem; and
  - reduce the current 4rem heading-to-grid margin to approximately 2.5–3rem.
- Keep the supporting paragraph at a readable measure of approximately 34–40rem rather than stretching it across the page.
- Preserve the **Start with your question** eyebrow, decorative contour detail, and all six pathway cards.

### R3 — Remove the Learn With Mary section

- Delete the complete visible **Learn with Mary / Prefer to Learn Together?** section.
- Remove its community-education paragraph, six topic labels, and **Ask About Classes & Events** action.
- Remove styles and imports used only by this deleted section.
- Close its reserved space so no empty cream band or excessive margin remains.
- The FAQ should flow to the next remaining content: the conditional Upcoming Classes & Events section when populated, otherwise the educational disclaimer.
- Preserve the FAQ, educational disclaimer, and conditional Upcoming Classes & Events capability unless the client explicitly extends comment 33 to those elements.

### R4 — Simplify the Downsizers Club marker

- Remove the club marker’s `03` element from the DOM and accessibility tree.
- Retain the anchor and vertical line, then close the gap left by the deleted number.
- Keep the decorative marker aligned with the club copy on desktop.
- On mobile, ensure the retained ornament does not create an oversized left gutter or separate empty row.
- Do not remove the club section, its heading, paragraphs, or topic list.
- Do not remove or renumber the six question-pathway cards; comment 35 applies only to the club’s `03`.

### R5 — Defer the club enrollment-action change

- Leave **Ask About the Club** and its current `/contact` destination unchanged in this implementation.
- Do not publish **Join for Free** until the approved destination and enrollment behavior are recorded under Comment 36 in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).
- Do not invent a signup URL, imply completed enrollment, add a club-specific Contact state, or build a membership workflow without that decision.
- Preserve the existing action’s light treatment, arrow, keyboard focus, and minimum 44×44px activation target.

### R6 — Reuse the compact closing-strip system

- Retain the exact eyebrow, headline, and supporting sentence:
  - “Still not sure where to start?”
  - “You Don’t Need to Know Which Door to Open.”
  - “Sometimes the best first step is simply a conversation.”
- Remove the internal **Schedule a Conversation** button and its empty wrapper.
- Reuse the shared horizontal closing-strip implementation defined in Homepage H6 rather than creating another page-specific approximation.
- On desktop, use the shared two-column arrangement with the headline group left and supporting copy right.
- Target a content-driven height of approximately 300–360px and responsive 48–64px headline scale.
- Preserve the paper texture and restrained border/diamond motif only where they do not add material height.
- On tablet and mobile, stack the content groups with content-driven height.
- Keep the true shared site footer directly below the strip, including its separate conversation action.

### R7 — Preserve shared site chrome and page interactions

- Continue using the common header with Resource Center marked active and inherit any approved Homepage H1 navigation change.
- Continue using the currently approved common footer, including the approved phone/email sizing and separate footer conversation action.
- Do not add or replace a Cummings & Co. logo until the approved public asset is identified under Comment 7 in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).
- Preserve pathway selection and filtering, including correct scroll/focus movement to the resource library and accurate `aria-pressed` state.
- Preserve FAQ keyboard controls, `aria-expanded` values, controlled-panel relationships, and the current default-open behavior.
- Removal of the Learn With Mary section must not break in-page hashes, focus movement, or the conditional events rendering path.

## Responsive, interaction, and accessibility acceptance criteria

- Verify at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- The hero caption is horizontal, contains no `01`, and never covers Mary’s face.
- At 1212px and 1512px, “What Can I Help You Figure Out?” occupies one line with no clipping or horizontal overflow.
- At narrower widths, the heading wraps naturally and remains legible.
- The question-pathway introduction is visibly shallower while all six cards remain present and aligned.
- The Learn With Mary section and its action are absent from the rendered page, keyboard order, and accessibility tree.
- The club section contains no visible or accessible `03`; its retained anchor/line remains balanced.
- The existing **Ask About the Club** action remains unchanged and keyboard operable while Comment 36 is deferred.
- The final strip contains no conversation button and is materially wider and shallower than the current framed panel.
- The footer retains its separate **Schedule a Conversation** action.
- Pathway filtering and FAQ disclosures behave exactly as before.
- No overlap, focus-order regression, cumulative layout shift, clipped text, or horizontal scrolling is introduced.
- Every remaining interactive target is at least 44×44px with visible keyboard focus.

## Non-goals

- Rewriting Resource Center, pathway, featured-resource, club, FAQ, disclaimer, or closing-strip copy.
- Removing or renumbering the six pathway-card numbers.
- Removing the Downsizers Club, its anchor, or vertical rule.
- Removing the featured self-evaluation/resource library or FAQ.
- Removing the separately conditional Upcoming Classes & Events feature without confirmation.
- Changing the hero image or crop.
- Building a membership account, payment flow, registration system, or new signup page.
- Renaming or rerouting **Ask About the Club** before Comment 36’s destination is approved.
- Removing the header, hero, or shared-footer calls to action.
- Replacing the true contact/legal footer with the compact closing strip.

## Implementation interpretation and ambiguity handling

- Comments 31–35 are implementable from their screenshots and the established cross-page patterns without a Section 5-specific blocker.
- Comment 31 applies to the vertical caption plaque, not the photograph container.
- Comment 32 applies to the question-pathway introduction, not the global header; its one-line requirement is desktop-only.
- Comment 33 removes the visible **Learn With Mary** section. The separate conditional events capability remains because it is not visible in the screenshot and has no current entries.
- Comment 35 removes only the visible `03`, while retaining the anchor and line as a non-numbered ornament.
- Comment 36 remains deferred in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md); neither its label nor destination is changed in this implementation.

## Definition of done

This section is complete when confirmed comments 31–35 are implemented, Comment 36 remains explicitly deferred, the hero and closing strip use shared cross-page systems, the pathway introduction is one line at the reference desktop width and materially shorter, the Learn With Mary section is gone without a layout gap, the club marker no longer exposes `03`, and all existing resource filtering, FAQ, responsive, and accessibility behavior passes without regression.

## Implementation and verification record

- Implemented the confirmed scope for Comments 31–35 on August 31, 2026.
- Replaced the numbered vertical hero caption with the shared compact horizontal caption and removed `01 /`.
- Removed the forced pathway-heading line break, widened its desktop measure, and reduced the introduction spacing.
- Removed the complete visible **Learn With Mary** section while retaining the empty-data Upcoming Classes & Events capability.
- Removed the club marker’s `03` while retaining the anchor and rule.
- Replaced the tall framed final panel with the shared compact closing strip and removed its internal action.
- Preserved **Ask About the Club** with its existing `/contact` destination because Comment 36 remains deferred.
- Verified the required eight responsive viewports plus the exact 800/801px caption breakpoint with no horizontal page overflow.
- Verified pathway selection/reset, direct `?path=stay` entry, library focus, FAQ disclosure controls, hero anchor navigation, mobile-menu open/Escape-close focus restoration, deferred background loading, destination links, image completion, and the absence of page-level console errors or warnings.
