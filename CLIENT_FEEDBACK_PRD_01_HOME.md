# Downsize Baltimore — Client Feedback PRD 01: Homepage

## Document status

- Product: Downsize Baltimore marketing website
- Section: Homepage (`/`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 1–7
- Status: Clear requirements implemented; unresolved items remain deferred in the separate ambiguity register
- Implementation scope: Homepage-specific changes plus the shared footer change requested from the homepage

## Objective

Refine the homepage so its navigation, opening hierarchy, section labels, testimonials, closing banner, and footer better match Mary Lynch’s preferred scale and visual rhythm while preserving the established navy, cream, antique-gold, and editorial-serif direction.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 1 | Desktop header/navigation | Make “the buttons” larger and closer to the size/boldness of **Talk to Mary**. | Recommended interpretation: enlarge and bold the seven desktop navigation labels. The navigation controls already have nearly the same height as **Talk to Mary**; the visible difference is primarily label size and weight. This interpretation requires confirmation before implementation. |
| 2 | Hero eyebrow: “Baltimore-area real estate guidance” | Move the line slightly higher and make it slightly larger. | Increase the label by one restrained type step and add more separation below it so the label moves upward without displacing the headline or body copy. |
| 3 | Lower-right hero experience caption | Use this size, font, and spacing more consistently on other pages. | Treat the homepage hero caption as the visual reference for equivalent image-bottom captions on later page PRDs. No homepage redesign is required for this comment. |
| 4 | “Three ways to begin” label | Make the label a little larger. | Increase the section label from 12px to 14px while retaining its uppercase, bold, letter-spaced style. |
| 5 | End of “Why Families Choose Mary,” before Resources | Add a testimonial area and advise how many testimonials to provide. | Add a static testimonial section in this exact location. Recommend three approved testimonials for launch; support one or two gracefully and hide the section when none are approved. |
| 6 | Closing “Your Next Step Deserves an Experienced Guide” panel | Remove its **Schedule a Conversation** button and make the area a shallow horizontal strip rather than a large square panel. | Convert the closing panel into the homepage reference pattern for a compact, full-width closing banner. Remove only the button inside this banner; retain the separate footer call to action. |
| 7 | Shared footer contact/brokerage block | Add the Cummings & Co. logo beside the address. Make Mary’s phone and email larger, with the phone bold. Keep brokerage/address text at its current size. | Add the existing circular Cummings & Co. logo beside the brokerage details, enlarge Mary’s direct phone and email only, and preserve the current brokerage/address typography. Apply through the shared footer so it stays consistent across the site. |

## Requirements

### H1 — Desktop navigation emphasis

- On desktop, increase the seven primary-navigation labels to a responsive 10.5–12px range, reaching 12px at the client’s 1512px-wide reference viewport.
- Use a 700 font weight so the labels visually relate to **Talk to Mary**.
- Increase the navigation control height only slightly, from 49px to approximately 52px; do not make the header materially taller.
- Preserve the existing active-page gold indicator, hover treatment, equal-width navigation cells, and centered alignment.
- Labels must remain on one line without clipping between the desktop breakpoint and the 1512px reference width.
- The mobile menu must retain at least 48px tap targets and use a 12px, 700-weight label treatment.

### H2 — Hero eyebrow position and scale

- Keep the exact copy: “Baltimore-area real estate guidance.”
- At desktop sizes, increase the label from 12px to 13px.
- Increase the space between the label and the headline by approximately 8px. Because the hero content is bottom-anchored, this raises the label while leaving the headline and body-copy position substantially unchanged.
- Preserve the gold rule, uppercase treatment, and contrast over the photograph.
- At small-screen widths, keep the label at least 12px and prevent collision with the header or headline.

### H3 — Cross-page caption reference

- Preserve the homepage’s lower-right hero caption as the reference treatment: restrained navy backing, gold experience lead-in, light supporting copy, compact sans-serif typography, and low-right image placement.
- Later page PRDs should match this caption’s approximate 12px size, spacing, and typographic tone where the client calls for consistency.
- Do not force this pattern onto unrelated content or change the homepage caption wording under this requirement.

### H4 — “Three ways to begin” label

- Increase the visible label from 12px to 14px.
- Retain 700 weight, uppercase styling, the existing antique-gold color, and editorial letter spacing.
- Keep the accessible hidden heading in place so the section continues to expose a proper heading to assistive technology.
- The label must remain on one line at 320px and wider.

### H5 — Testimonials

- Insert the testimonial section immediately after **Why Families Choose Mary** and before **Resources for the Road Ahead**.
- Launch with three client-approved testimonials. Three is the recommended quantity because it creates a balanced desktop row without requiring a carousel and gives visitors more than one perspective.
- Use a static three-card layout on desktop and a single-column stack on mobile. Do not autoplay, rotate, or hide quotes inside a carousel.
- Use the working section title **Kind Words From People I’ve Helped** unless the client supplies replacement copy.
- Each entry must support:
  - an approved quote, ideally 25–60 words;
  - an approved display name or privacy-safe attribution;
  - an optional short context such as “Downsizing client” or “Baltimore County family”; and
  - confirmation that the person has approved public website use.
- If one or two approved quotes are available, center them without empty placeholder cards. If no approved quotes are available, do not render the section.
- Do not invent, paraphrase, or silently shorten testimonial wording.
- Photographs are optional and should not be required for launch.

### H6 — Compact closing banner

- Remove **Schedule a Conversation** from the closing banner only.
- Retain the eyebrow, headline, supporting paragraph, paper texture, and restrained border motif.
- On desktop, change the centered square-like composition to a horizontal two-column strip: headline group on the left and supporting copy on the right.
- Target a content-driven height of approximately 300–360px at the 1512px reference width, reduced from the current approximately 654px.
- Reduce the desktop heading from approximately 79px to a responsive 48–64px range so it fits the shallower strip without crowding.
- Keep the decorative anchor only if it fits without adding material height; it may sit beside the eyebrow rather than above the content.
- On tablet and mobile, stack the two content groups, use content-driven height, and retain comfortable spacing without reintroducing an oversized panel.
- This homepage banner becomes the reference geometry for equivalent bottom banners in later page PRDs.

### H7 — Shared footer contact and brokerage presentation

- Place the existing circular Cummings & Co. Realtors logo immediately beside the brokerage name/address group.
- Keep the visible brokerage name, address, city, and office phone at their current approximate 12–13px scale.
- Treat the adjacent logo as decorative when the brokerage name remains visible, avoiding duplicate screen-reader output.
- Increase Mary’s direct phone from 20px to 24px and retain 700 weight.
- Increase Mary’s email from approximately 13px to 16px. Use medium weight for clarity without competing with the phone number.
- Preserve at least 44px tap targets for the phone and email links.
- Prevent the phone number or email address from clipping or wrapping at desktop and common mobile widths.
- Retain the footer’s **Schedule a Conversation** button. Comment 6 removes the button in the closing banner, not the footer action.
- Because the footer is shared, the approved result must appear identically on every public route.

## Testimonial intake recommendation for the client

The simplest handoff is one document or spreadsheet with one row per testimonial and these fields: exact quote, display name, optional context/location, permission confirmed, and optional photo filename. Three approved entries are recommended for launch; up to five can be kept for future rotation or selection.

## Responsive and accessibility acceptance criteria

- Verify the homepage at 1512×799, 1280×720, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- No horizontal scrolling, clipped labels, overlapping content, or unintended text wrapping may be introduced.
- Header, testimonial links if any, phone, email, and footer call to action retain visible keyboard focus.
- All interactive targets remain at least 44×44px.
- Decorative images expose empty alternative text when equivalent visible text already supplies the meaning.
- The testimonial section is absent when approved content is absent.
- The closing banner contains no conversation button, while the footer continues to contain one.

## Non-goals

- Rewriting the homepage hero, Mary biography, resource copy, or closing-banner copy.
- Removing the header **Talk to Mary**, hero **Schedule a Conversation**, or footer **Schedule a Conversation** actions.
- Inventing testimonial quotes or attribution.
- Applying inner-page caption and closing-banner changes before those page-specific comments are mapped in their own PRDs.
- Changing the size of the Cummings & Co. address or office contact text.

## Open decisions

Comments 1, 5, and the logo portion of comment 7 remain deferred. Their exact client wording, Pastel links, and required answers are maintained in [the separate ambiguity register](CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).

## Definition of done

The homepage section is complete when comments 1–7 are implemented as approved, the testimonial content rule prevents unpublished or invented endorsements, the closing area reads as a shallow horizontal strip, the shared footer reflects the approved contact and brokerage hierarchy on every route, and the responsive/accessibility checks pass without regression.
