# Downsize Baltimore — Client Feedback PRD 04: Buying & Selling

## Document status

- Product: Downsize Baltimore marketing website
- Section: Buying & Selling (`/buying-selling`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 23–30
- Status: Implemented and verified; awaiting publication approval
- Dependencies: Reuses the homepage hero-caption, compact closing-strip, shared-header, and shared-footer standards defined in PRD 01

## Objective

Simplify the Buying & Selling page’s hierarchy by removing the sideways hero label, promoting the 30-year experience note to the photograph, widening and shortening the path introduction, correcting the main section sequence, and consolidating two lower-page panels into one compact pre-footer closing strip.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 23 | Photo caption: “01 / The move, handled well.” | Remove the sideways blurb. | Delete the complete caption from the hero photograph, including “01,” its text, and any reserved space. |
| 24 | “30 years of helping Baltimore-area families…” note in the hero copy | Add this consistently across the bottom of the photo. | Move—not duplicate—the experience note onto the lower edge of the hero photo using the shared homepage photo-caption pattern. |
| 25 | “When the decision is clear, the next step can be too.” introduction | Carry the headline across the page and shorten the box. | Remove the narrow intro constraint and forced headline break, let the heading use the full content width, and reduce the introduction band’s vertical footprint before the two choice cards. |
| 26 | Buying detail marker: “02 / BUYING” | Renumber it “01 / Buying.” | Change the main Buying section marker to `01 / BUYING`, preserving the page’s uppercase marker style. |
| 27 | Selling detail marker: “03 / SELLING” | Renumber it “02 / Selling.” | Change the main Selling section marker to `02 / SELLING`, preserving the page’s uppercase marker style. |
| 28 | “You Don’t Need to Figure It Out Alone” closing box | Remove the entire box. | Delete this full paper-textured panel, including its copy, frame, and conversation button. |
| 29 | “Real estate is the transaction. The plan is the bigger picture.” section | Make this the lower footer, remove **Schedule a Conversation**, and make it more rectangular. | Make this content the page’s final compact pre-footer closing strip. Preserve the true shared contact/legal footer below it. |
| 30 | “04” in the experienced-guidance section | Remove “04.” | Delete the visible section number with no replacement number; the new shared closing-strip geometry may retain only a non-numbered decorative motif if needed. |

## Requirements

### B1 — Replace the hero’s sideways label with the experience caption

- Remove the complete “01 / The move, handled well.” caption from the hero photo.
- Remove any vertical writing mode, rotation, absolute-position rule, or spacing used only by that caption.
- Move the existing experience message from the left copy panel to the lower edge of the hero photograph.
- Preserve its meaning and wording: **30 years of helping Baltimore-area families make thoughtful real estate decisions.**
- Use **30 YEARS** as the compact gold lead-in and the remaining phrase as the light supporting caption, matching the homepage reference treatment.
- Match the shared photo-caption system’s approximately 12px type, navy backing, spacing, and distance from the photo edges.
- Place it where it does not cover Mary’s face, laptop, or other meaningful visual content.
- Render the message once only; no duplicate experience note may remain in the copy panel.
- Hide it at the same mobile breakpoint used by the shared homepage, Downsizing, and Aging in Place photo captions.

### B2 — Widen and shorten the path introduction

- Let the “When the decision is clear, the next step can be too.” heading use the complete main content width, aligned with the two-card grid beneath it.
- Remove the hard line break after “clear,” and allow responsive CSS to determine wrapping.
- Increase the intro container from its current approximately 42rem maximum to the shared section width of approximately 1100–1180px.
- Keep the supporting paragraph to a readable measure of approximately 34–40rem; the paragraph does not need to stretch the full width.
- Reduce the introduction band’s top/bottom space and margin before the choice cards by approximately 25–35% so the section reads as a shorter lead-in rather than a separate oversized box.
- Preserve the **Choose your path** eyebrow and both choice cards.
- Do not reduce the heading to fit one line at all costs; natural wrapping is acceptable when required by the viewport.

### B3 — Correct the main section sequence

- Change the Buying detail marker from `02 / BUYING` to `01 / BUYING`.
- Change the Selling detail marker from `03 / SELLING` to `02 / SELLING`.
- Preserve the current marker typography, slash spacing, colors, and alignment.
- Keep the two choice-card numbers as `01` and `02`; they already match Buying and Selling and should remain unchanged.
- Keep the internal topic numbers in each detail grid unchanged because they enumerate content within each section.
- Confirm through rendered-text and accessibility-tree checks that `03 / SELLING` and the lower-page `04` are no longer exposed.

### B4 — Remove the obsolete final panel

- Delete the complete **A thoughtful next step / You Don’t Need to Figure It Out Alone** panel.
- Remove its heading, paragraph, frame, background treatment, **Schedule a Conversation** button, and reserved layout space.
- Remove any component code, data attributes, styles, imports, or image references used only by this deleted panel.
- Do not carry its copy into the replacement closing strip; comment 29 identifies the experienced-guidance content as the desired ending.
- After deletion, the new experienced-guidance closing strip must flow directly into the shared site footer with no empty gap or duplicated paper panel.

### B5 — Convert experienced guidance into the final compact closing strip

- Retain the eyebrow: **Experienced guidance, without pressure**.
- Retain the headline: **Real estate is the transaction. The plan is the bigger picture.**
- Retain the supporting paragraph beginning “Mary brings 30 years of residential real estate experience…”
- Remove the section’s **Schedule a Conversation** button.
- Remove the visible “04” with no replacement number.
- Convert the section from its current tall, narrow composition to the shared horizontal closing-strip system defined in Homepage H6.
- On desktop, use a full-width rectangular two-column layout: eyebrow/headline group on the left and supporting paragraph on the right.
- Target the shared content-driven height of approximately 300–360px and responsive 48–64px headline range.
- Retain the subtle paper texture and restrained gold detailing where they align with the shared component.
- If a decorative mark is retained, it must be non-numbered, visually quiet, and must not add material height.
- On tablet and mobile, stack the two content groups with content-driven height and no replacement action button.
- Implement this through the same shared closing-strip component or layout class used by the other approved pages to prevent visual drift.

### B6 — Preserve the true shared footer and header

- “Make this the lower footer” means the experienced-guidance content becomes the final pre-footer banner; it does not replace the website’s contact, brokerage, navigation, legal, and accessibility footer.
- Continue rendering the common site footer immediately after the new closing strip.
- Keep the currently approved shared footer treatment: 24px bold direct phone, 16px direct email, unchanged brokerage/address scale, and the retained footer conversation action.
- Do not add or replace a Cummings & Co. logo until the approved public asset is identified under Comment 7 in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).
- Continue rendering the common site header and preserve the active Buying & Selling navigation state.
- Inherit any approved Homepage H1 navigation-scale changes without page-specific overrides.

## Responsive, interaction, and accessibility acceptance criteria

- Verify the page at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- The hero contains no “01 / The move, handled well.” label, vertical writing, or unexplained empty space.
- The 30-year message appears exactly once, across the lower part of the photo, never covering Mary or critical photo content, and follows the shared mobile visibility rule.
- The path-introduction headline aligns to the full card-grid width and uses natural wrapping without clipping or overflow.
- The shortened intro creates a visibly tighter transition into the choice cards without crowding the eyebrow, headline, paragraph, or cards.
- The main detail markers render as `01 / BUYING` and `02 / SELLING`.
- The obsolete **You Don’t Need to Figure It Out Alone** panel and its button are absent from the rendered page and keyboard order.
- The experienced-guidance strip contains no “04” and no conversation button, and is materially shallower and wider than the current section.
- The shared footer remains directly below the closing strip and retains its separate **Schedule a Conversation** action.
- The existing hero action, Buying outline action, Selling action, in-page links, header, and footer links remain operable with mouse, touch, and keyboard.
- No horizontal scrolling, overlap, clipped heading, broken focus order, or touch target smaller than 44×44px is introduced.

## Non-goals

- Rewriting the hero, choice-card, Buying, Selling, or experienced-guidance copy.
- Removing the hero **Let’s Talk About Your Plan**, Buying **Talk Through the Possibilities**, Selling **Create a Selling Plan**, or footer conversation actions.
- Removing the two path cards or their `01` and `02` numbers.
- Renumbering the internal Buying and Selling topic grids.
- Moving the deleted **You Don’t Need to Figure It Out Alone** copy elsewhere.
- Replacing the site’s shared contact/legal footer with the experienced-guidance content.
- Changing the hero photograph or its crop except as needed to keep the new caption clear of meaningful content.

## Implementation interpretation and ambiguity handling

- Comments 23–30 contain no Section 4-specific blocker when read together with their screenshots and the established sitewide patterns.
- Comment 24 moves the existing 30-year message to the photograph rather than duplicating it.
- Comment 25 applies to the complete **Choose your path** introduction band, not either choice card.
- Comment 29 creates a final pre-footer closing strip while preserving the true shared footer required across the site.
- Comment 30 removes the visible `04` without a replacement number.
- The inherited Comment 7 footer-logo question remains deferred in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md) and is not changed by this implementation.

## Implementation and verification record

- Implemented all confirmed requirements from comments 23–30 on `/buying-selling`.
- Verified the completed page at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568, plus the exact 801/800px caption breakpoint.
- Confirmed zero horizontal overflow; aligned path-introduction and card-grid widths; natural, unclipped headline wrapping; correct `01 / BUYING` and `02 / SELLING` markers; and no obsolete sideways label, `04` section marker, or removed final panel.
- Confirmed the photo caption appears once, remains inside the photo, and hides at 800px and below.
- Confirmed the new desktop closing strip remains approximately 320–359px high, contains no action, touches the shared footer with no gap, and stacks responsively on smaller screens.
- Confirmed both in-page path links, mobile-menu open/Escape/focus restoration, all retained Calendly destinations, footer action separation, deferred texture loading, and image loading.
- Passed the TypeScript check and production Sites build with no browser console warnings or errors.

## Definition of done

This section is complete when comments 23–30 are implemented as approved, the hero uses one consistent bottom-photo experience caption with no sideways blurb, the path introduction is wider and shorter, the main Buying/Selling sequence reads `01` then `02`, the two current ending panels are consolidated into one compact button-free closing strip, the shared footer remains intact, and all responsive, interaction, and accessibility checks pass without regressions.
