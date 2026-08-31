# Downsize Baltimore — Client Feedback PRD 08: Resolved Ambiguities

## Document status

- Product: Downsize Baltimore marketing website
- Scope: Final decisions for previously deferred Pastel comments
- Decision date: August 31, 2026
- Source: Pastel review plus the client's consolidated answers
- Status: Approved for implementation
- Supersedes: The deferred portions of PRDs 01, 02, 03, 05, 06, and 07

## Objective

Close the ten-item ambiguity register without guessing. Implement the six approved visible changes, publish the three client-supplied testimonials, and record Comments 39, 40, and 44 as explicit no-change decisions. Preserve the existing design language, shared components, accessibility behavior, and all previously approved work.

## Approved decision matrix

| Original item | Approved decision | Implementation outcome |
| --- | --- | --- |
| [Comment 1](https://usepastel.com/link/4lgrqj03/comment/12355178/) | The words inside all seven navigation tabs should be larger, including Home and Downsizing Services. | Increase the shared desktop navigation label size and weight while preserving the tab system. |
| [Comment 5](https://usepastel.com/link/4lgrqj03/comment/12355197/) | Testimonials are supplied in Comments 46–48. | Publish all three exact quotes and attributions in the reserved homepage location. |
| [Comment 7](https://usepastel.com/link/4lgrqj03/comment/12355212/) | Approve the existing circular Cummings & Co. logo. | Add it beside the brokerage details in the shared footer. |
| [Comment 8](https://usepastel.com/link/4lgrqj03/comment/12355232/) | Match the complete Homepage hero. | Apply the Homepage hero's outer height, alignment, and content-spacing system to Downsizing Services. |
| [Comment 20](https://usepastel.com/link/4lgrqj03/comment/12355278/) | Keep the colors and add the recommended tan divider. | Separate the adjacent navy Aging in Place topics with a narrow decorative tan band. |
| [Comment 36](https://usepastel.com/link/4lgrqj03/comment/12355349/) | Change the wording to “Join for Free.” | Change only the label and preserve the current `/contact` destination. |
| [Comment 39](https://usepastel.com/link/4lgrqj03/comment/12355366/) | Leave as is. | Preserve the historical photograph exactly as currently presented. |
| [Comment 40](https://usepastel.com/link/4lgrqj03/comment/12355371/) | Leave as is. | Preserve the current enlarged, centered, muted, captioned video and transcript treatment. |
| [Comment 44](https://usepastel.com/link/4lgrqj03/comment/12355406/) | Leave as is. | Preserve the Contact form's position, styling, fields, and behavior. |
| [Comment 45](https://usepastel.com/link/4lgrqj03/comment/12355420/) | Approve the recommendation. | Remove repeated contact links from the pre-footer panel and add a labeled link to the shared footer contact details. |

## Requirements

### R1 — Enlarge the shared navigation labels

- Apply to Home, Downsizing Services, Aging in Place, Buying & Selling, Resource Center, Meet Mary, and Contact.
- Increase desktop labels responsively from approximately 10.5px at the compact desktop breakpoint to 12px at the 1512px reference width.
- Use 700 weight and slightly tighter letter spacing so the larger words remain readable inside the existing equal-width tabs.
- Increase tab height only slightly, from 49px to approximately 52px.
- Preserve the active-page underline, hover and focus treatments, shared route data, and mobile menu behavior.
- Do not enlarge the logo or **Talk to Mary** action under this requirement.

### R2 — Publish approved Testimonials 46–48

- Source the testimonial copy and attribution exactly from:
  - [Comment 46](https://usepastel.com/link/4lgrqj03/comment/12355923/): Gloria & Tom Tanton;
  - [Comment 47](https://usepastel.com/link/4lgrqj03/comment/12355928/): Eddie Wiseman; and
  - [Comment 48](https://usepastel.com/link/4lgrqj03/comment/12355935/): Carol & Gerry Lavender.
- Place the section immediately after **Why Families Choose Mary** and before **Resources for the Road Ahead**.
- Retain the heading **Kind Words From People I’ve Helped**.
- Render exactly three semantic `figure`, `blockquote`, and `figcaption` entries with no carousel or automatic rotation.
- Preserve paragraph breaks, punctuation, capitalization, and attribution as supplied. Do not paraphrase, shorten, proofread, or invent context.
- Use three balanced cards at wide viewports and a single-column stack on smaller screens.

### R3 — Add the approved brokerage logo

- Use `/manus-storage/cummings-and-co-realtors-circle.png`.
- Place it immediately beside the Cummings & Co. brokerage/address group in the shared footer.
- Render it at approximately 64px desktop and 56px mobile.
- Treat it as decorative because the visible brokerage name supplies the accessible text.
- Preserve the current brokerage/address scale, office number, Mary’s direct phone/email hierarchy, footer navigation, legal copy, and scheduling action.
- Apply identically to every public route through `SiteFooter`.

### R4 — Match the complete Downsizing hero geometry

- Reuse the Homepage hero’s current desktop height system: `clamp(47.5rem, 84svh, 56.25rem)`.
- Match the Homepage hero’s vertical alignment, 7vw horizontal inset, top padding, bottom padding, content measure, headline rhythm, and responsive mobile geometry.
- Match the hero eyebrow’s scale and spacing to the Homepage reference.
- Preserve the Downsizing photograph, overlay, exact copy, **Start With a Conversation** action, and approved number-free photo caption.
- Supersede the former short-laptop rule that compressed only the Downsizing hero.

### R5 — Add the Aging in Place divider

- Keep both adjacent navy sections and their content unchanged.
- Add a full-width, content-free tan separator at the top of the self-evaluation section.
- Use a 6px band on larger screens and 4px on mobile.
- Treat it as purely decorative; do not create an additional DOM section, heading, or focus stop.
- Preserve the `#self-evaluation` target and the evaluation’s full behavior.

### R6 — Rename the club action

- Change only **Ask About the Club** to exactly **Join for Free**.
- Preserve the existing `/contact` destination, light treatment, arrow, visible focus, and minimum activation target.
- Do not add a signup workflow, account, enrollment confirmation, query state, or new destination.

### R7 — Preserve the historical photograph

- Resolve Comment 39 as an explicit no-change decision.
- Preserve the current source, crop, frame, caption, alternative text, placement, and responsive behavior.
- Do not correct, replace, retouch, perspective-adjust, or regenerate the image.

### R8 — Preserve the existing video treatment

- Resolve Comment 40’s remaining media questions as an explicit no-change decision.
- Retain the already implemented enlarged and centered layout.
- Preserve the current MP4, poster, forced-muted behavior, native controls, caption track, visible description, and transcript.
- Do not add music, alter audio, replace the media, autoplay, loop, or remove accessibility content.

### R9 — Preserve the Contact form

- Resolve Comment 44 as an explicit no-change decision.
- Preserve the Hero → Topics → Form → Direct Contact order.
- Preserve all form copy, fields, required/optional states, validation, email-draft behavior, fallback address, styling, and keyboard sequence.
- Do not move or restyle the form or reinterpret the Name field.

### R10 — Remove repeated direct contacts and link to the footer

- In **Sometimes It’s Just Easier**, remove only the duplicated phone and email links.
- Preserve the eyebrow, headline, and supporting paragraph.
- Add a labeled, keyboard-operable **Phone or email Mary below** action with a downward arrow.
- Link it to a stable `#site-footer-contact` target on the shared footer’s contact group.
- Keep the action at least 44px tall with a visible focus state.
- Preserve Mary’s phone and email in the shared footer.

## Responsive, accessibility, and regression acceptance

- Verify affected layouts at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- All seven routes inherit the enlarged shared navigation labels and approved brokerage logo.
- Navigation labels never clip, collide, or cause horizontal page overflow.
- Exactly three testimonials render, in Comment 46–48 order, with the submitted quote and attribution text unchanged.
- Homepage and Downsizing hero outer heights and major content insets visually match at the two desktop reference sizes.
- The Aging divider is visible without becoming a new content section.
- **Join for Free** links to `/contact`; **Ask About the Club** is absent from the club action.
- The Contact pre-footer panel contains no `tel:` or `mailto:` duplicates; its new fragment link reaches the visible shared-footer contact group.
- Comments 39, 40, and 44 remain behaviorally unchanged apart from inherited shared-header/footer changes.
- No duplicate ID, broken destination, horizontal overflow, content overlap, clipped text, keyboard trap, focus regression, or page-level browser error is introduced.
- Type-check and production build pass.

## Non-goals

- Editing testimonial wording or adding photographs, ratings, or a carousel.
- Changing the Downsizing hero copy, image, overlay, action, or caption.
- Recoloring the Aging in Place sections.
- Building a club signup or membership system.
- Editing the historical photograph, video media, transcript, or Contact form.
- Removing contact details from the shared footer.
- Publishing a new Site version without the required approval for the existing public access level.

## Definition of done

This decision round is complete when R1–R10 are reflected in the documentation and implementation; the six approved visible changes pass responsive and functional checks; the three explicit no-change decisions remain intact; every former ambiguity is recorded as resolved; and a verified review version is saved for publication approval.
