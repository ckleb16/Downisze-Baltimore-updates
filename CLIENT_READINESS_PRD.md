# Downsize Baltimore — Client Readiness Remediation PRD

## Document status

- Product: Downsize Baltimore marketing website
- Status: Approved for implementation by the August 19, 2026 client-readiness request
- Scope: All public routes, responsive layouts, interactive states, shared navigation/footer systems, and the 404 view
- Primary audience: Baltimore-area older adults, adult children, caregivers, and families making housing decisions

## Problem statement

The current site has a strong editorial identity and stable responsive structure, but the final design audit identified several issues that could reduce trust or make the site appear unfinished in a client presentation. The highest-risk problems are low-contrast navigation and calls to action, one invisible Downsizing link, incomplete testimonial/resource areas, a contact form that behaves differently from its promise, overly delayed mobile hero messages, and card interactions that imply functionality without revealing anything.

## Product objective

Deliver a calm, polished, accessible client-review build that:

1. Preserves the established navy, cream, antique-gold, and editorial-serif visual direction.
2. Keeps Mary and her guidance—not interface decoration—as the focus.
3. Makes every meaningful label, link, and call to action readable for an older audience.
4. Shows only approved, ready content.
5. Makes interactive behavior explicit, useful, keyboard accessible, and reversible.
6. Introduces the page purpose and a next step early on small screens.

## Non-goals

- Inventing testimonials, reviewer names, event dates, downloadable resources, or credentials.
- Adding an external form vendor, CRM, analytics provider, or email-delivery service without account credentials and approval.
- Rebranding the site or replacing the approved photography.
- Making the Cummings & Co. mark a primary visual element.

## Requirements

### R1 — Contrast and legibility

- Normal text and meaningful controls must target at least 4.5:1 contrast; large display text must target at least 3:1.
- Active navigation must remain clearly visible on both cream and navy menus.
- Gold buttons must use navy text, including inside mobile menus and footers.
- Text placed on photography must have a dependable dark backing or text treatment.
- Standalone action labels must be at least 12px and have a minimum 44px touch target.

### R2 — Responsive hierarchy

- On stacked tablet/mobile heroes, editorial copy must appear before the supporting photograph.
- At 320px, hero headings must not create a multi-screen wall of type or overflow their intended column.
- At a 1280×720 laptop viewport, either the hero action or the persistent header action must be immediately available and visually clear.
- No page may introduce horizontal scrolling at 320, 390, 768, 1024, 1180, 1280, or 1440px widths.

### R3 — Honest content readiness

- Testimonials render only when approved quotes and attribution exist.
- In-development resources and undated events do not appear in the client-review build.
- No placeholder, skeleton, “more to come,” or empty testimonial treatment is visible.

### R4 — Interaction clarity

- Cards whose full content is already visible remain static and do not present as buttons.
- The Aging in Place evaluation supports moving back to revise the previous answer.
- Resource filters expose a clear selected state; FAQ controls identify their answer panels.
- Decorative arrows must not imply that static Contact topics are clickable.

### R5 — Contact behavior

- The site must explicitly state that the current form prepares an email in the visitor’s email application.
- The submission control must say “Open Email Draft,” not imply server-side delivery.
- Name, email, topic, and message are required before preparing the draft.
- A future direct-submission integration remains a launch follow-up requiring an approved provider and credentials.

### R6 — Navigation, metadata, and accessibility

- Every page exposes a skip link and a stable `main-content` target.
- Every route receives a unique browser title and description.
- Keyboard focus remains visible on links, buttons, fields, carousel controls, and evaluation controls.
- The 404 view remains responsive and its home action works.

## Page-specific acceptance criteria

### Home

- The question carousel shows exactly one question, supports previous/next and direct selection, and does not autoplay.
- The empty testimonial reserve is not rendered until approved material exists.
- The hero remains readable at wide, short, and mobile aspect ratios.

### Downsizing Services

- “Learn About the Downsizers Club” is clearly visible on the navy resource section.
- Step cards are static editorial cards rather than nonfunctional accordions.
- The closing headline stays within its frame at 320px.
- The support-section eyebrow and headline are not duplicates.

### Aging in Place

- The split-hero caption is readable on cream.
- Gold text links and the outline evaluation action meet contrast requirements.
- Assessment cards are static.
- The evaluation supports Back, completion, results, and reset.

### Buying & Selling

- The stacked hero shows the headline and primary action before the image.
- Buying/Selling exploration links are readable and have 44px targets.
- Small supporting copy is at least 12px with adequate contrast.

### Resource Center

- Only available resources are shown.
- Undated events are withheld.
- Filter reset and event/status treatments never use dark-on-dark colors.
- FAQ buttons identify their answer regions.

### Meet Mary

- The video poster and 18-second MP4 load with native controls.
- Photo captions remain legible across image crops.
- Interest labels and chapter metadata meet readable contrast and size targets.

### Contact

- The email-draft behavior is explicit before submission.
- Static conversation topics do not resemble links.
- The direct email address is readable on paper.

## Verification matrix

- Viewports: 1440×900, 1280×720, 1180×800, 1024×768, 768×1024, 390×844, 320×568
- Routes: `/`, `/downsizing-services`, `/aging-in-place`, `/buying-selling`, `/resource-center`, `/meet-mary`, `/contact`, and an unknown route
- States: every mobile menu, carousel first/next/last/wrap, all Resource filters and reset, all FAQ items, assessment cards, the full ten-question evaluation including Back/reset, contact validation, and video readiness
- Automated checks: TypeScript, broken images, document overflow, visible offscreen elements, heading overflow, touch-target size, unique H1, route title/description, and browser errors

## Definition of done

The client-review build is complete when all high-priority findings above are resolved, no unfinished content is visible, no critical contrast failures remain, all tested widths are free of clipping and horizontal scrolling, interactions pass the verification matrix, and remaining launch dependencies are documented rather than simulated.

## Implementation status

The client-review remediation is implemented across all seven published pages plus the 404 and recovery views. The final verification covers the viewport and route matrix above, responsive navigation, the one-question carousel, Resource Center filters and FAQs, the ten-question Aging in Place evaluation, Contact validation, media readiness, broken assets, overflow, metadata, and browser errors.

## Public-launch dependencies

- Client testimonials remain hidden until Mary supplies and approves the exact quote and attribution for each entry.
- The Meet Mary video audio has been classified and supplied with synchronized English captions plus an adjacent transcript. Public launch still requires the content owner to approve and sign [MEET_MARY_VIDEO_ACCESSIBILITY_RECORD.md](MEET_MARY_VIDEO_ACCESSIBILITY_RECORD.md).
- The Contact form intentionally prepares an email draft in the visitor's email application. Direct in-page submission requires a separately approved form provider and credentials.
- A canonical production URL, social-sharing image, and any analytics service should be configured only after the final hosting domain and account ownership are confirmed.
