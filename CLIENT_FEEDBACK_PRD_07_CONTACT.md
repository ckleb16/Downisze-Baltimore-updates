# Downsize Baltimore — Client Feedback PRD 07: Contact

## Document status

- Product: Downsize Baltimore marketing website
- Section: Contact (`/contact`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 43–45
- Status: Comment 43 and the clear layout portion of Comment 45 implemented and verified; Comment 44 and Comment 45’s repetition/arrow decisions deferred
- Dependencies: Reuses the homepage hero-caption, shared-header, and shared-footer standards defined in PRD 01

## Objective

Apply the unambiguous Contact-page feedback without guessing at the client’s unresolved form or direct-contact intent. The revision should horizontalize and de-number the hero caption, place the direct-contact headline straight across with its supporting text beneath it, and preserve the existing form order, duplicate contact details, and arrow-free behavior until Comments 44 and 45 are resolved.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 43 | Vertical hero-photo plaque: “01 / A conversation can be the beginning.” | Move it horizontally and remove “01.” | Retain the sentence as a shared horizontal lower-photo caption with no number. |
| 44 | Complete “A quieter way to reach out / Rather Send Me a Note?” form section | “Can we make this the name block?” | Defer the complete comment. Preserve the current section order and form styling because “name” versus “main,” and move versus emphasis, remain unresolved. |
| 45 | “Sometimes It’s Just Easier” panel immediately above the footer | Put the headline straight across, text underneath, consider an arrow toward phone/email below, and reduce repetition. | Implement only the clear hierarchy: one uninterrupted headline and supporting text beneath it. Preserve the existing phone/email and do not add an arrow or footer target until those decisions are approved. |

## Preserved page order while Comment 44 is deferred

1. Hero with horizontal, number-free photo caption
2. **What Can We Talk About?** topic index
3. **Rather Send Me a Note?** form section
4. **Sometimes It’s Just Easier** direct-contact panel
5. Unchanged shared contact/legal footer

## Requirements

### C1 — Horizontal, number-free hero caption

- Remove `01 /` with no replacement number, badge, or empty gap.
- Preserve the exact remaining sentence: “A conversation can be the beginning.”
- Remove vertical writing mode and rotation.
- Place the caption horizontally along the lower edge of the hero photograph using the shared approximately 12px navy-backed caption treatment.
- Keep it clear of Mary’s face, hands, and chair.
- Follow the same mobile visibility rule as the other approved hero captions.
- Do not change the hero photograph, heading, copy, **Schedule a Conversation** action, or no-pressure note.

### C2 — Defer the note-form hierarchy change

- Do not move, enlarge, restyle, or reinterpret the form from Comment 44 until “name block” versus “main block” and the intended behavior are approved.
- Preserve the current DOM and visual order: topic index before form.
- Preserve the complete form-section content:
  - **A quieter way to reach out** eyebrow;
  - **Rather Send Me a Note?** heading;
  - explanatory paragraph;
  - email-draft behavior notice and fallback address;
  - Name, Email, Phone, topic, and message fields;
  - required/optional states;
  - validation messages;
  - **Open Email Draft** action; and
  - post-action status message.
- Retain the current desktop intro/form split and mobile stacked layout.
- Keep the **What Can We Talk About?** topic index intact before the form.
- Do not change the individual Name field unless the client confirms that “name block” was literal and supplies the intended field change.

### C3 — Preserve the form’s functional contract

- Continue creating a reviewable draft in the visitor’s local email application; do not imply that the website sends the form automatically.
- Preserve trimmed values, custom whitespace validation for Name and Message, required email/topic validation, and phone optionality.
- Preserve the generated email subject and inclusion of every submitted field.
- Keep labels programmatically associated with controls and retain appropriate `autocomplete` values.
- Keep a visible fallback `mailto:` address if no email application opens.
- Preserve visible focus, browser validation, and the existing logical keyboard sequence.

### C4 — Apply only the confirmed direct-contact hierarchy

- Retain the eyebrow **Prefer to call or email?** and exact headline **Sometimes It’s Just Easier.**
- Remove the forced line break so the headline renders straight across on one line at 1212px and 1512px.
- Preserve the existing navy/gold serif treatment unless the client requests a single-color headline.
- Place the existing supporting copy immediately beneath the headline: “Sometimes it’s just easier to pick up the phone. You’re always welcome to reach out directly.”
- Preserve the panel’s existing phone number and email address while the repetition decision is deferred.
- Do not add an arrow, cue, or footer-target link while its behavior is deferred.
- Convert the current two-column content hierarchy to a single-column rectangular flow so the supporting text and existing contact details sit beneath the headline.
- Preserve the paper texture and restrained border while reducing avoidable height.
- On tablet and mobile, allow the headline to wrap naturally and keep the existing contact details close to the supporting text.

### C5 — Preserve the shared footer and site header

- Do not add a Contact-specific footer target until the down-link is approved.
- Continue rendering Mary’s phone and email once in the shared footer with the approved Homepage H7 hierarchy.
- Retain the footer’s brokerage details, navigation, legal copy, and **Schedule a Conversation** action.
- Do not create a Contact-specific footer variant or remove contact details from other routes.
- Continue using the common header with Contact marked active and inherit any approved Homepage H1 navigation change.

## Responsive, form, and accessibility acceptance criteria

- Verify at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- No `01`, vertical writing, or number-related gap remains in the hero caption.
- The topic index remains before the note form while Comment 44 is deferred.
- Form labels, required/optional states, validation, keyboard sequence, generated email content, and status messaging remain correct.
- **What Can We Talk About?** remains intact before the form and keeps all six topics.
- **Sometimes It’s Just Easier.** occupies one line at 1212px and 1512px, with no clipping or horizontal overflow.
- The direct-contact panel continues to show its existing phone and email while the repetition decision is deferred.
- No arrow cue or footer-target behavior is introduced.
- Phone and email remain clearly available in the identical shared footer used on every route.
- No overlap, focus-order regression, cumulative layout shift, clipped text, or horizontal scrolling is introduced.

## Non-goals

- Removing or rewriting the six-topic index.
- Converting the email-draft form into a server-submitted form or CRM integration.
- Changing the individual Name field without clarification.
- Removing the hero or footer scheduling actions.
- Removing phone/email from the shared footer.
- Creating a Contact-specific footer variation.
- Rewriting the hero, form, topic, or direct-contact copy.
- Removing the **Sometimes It’s Just Easier** transition entirely.
- Moving or restyling the form before Comment 44 is resolved.
- Removing duplicate contact details or adding an arrow/footer target before Comment 45 is resolved.

## Deferred clarification log

These items remain in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md):

1. **Comment 44:** “Name block” versus “main block,” plus whether the intended result is reordering or stronger emphasis.
2. **Comment 45 repetition:** Whether the pre-footer phone/email should be removed.
3. **Comment 45 arrow:** Whether a labeled functional footer link or a decorative cue is intended.

The clear part of Comment 45 is implemented independently: remove the forced headline break while preserving the existing navy/gold emphasis, then place the supporting copy beneath it.

## Definition of done

The confirmed portion of this section is complete when Comment 43 and the straight-across/text-underneath portion of Comment 45 are implemented, Comments 44 and 45’s unresolved aspects remain unchanged, the form retains its functional contract and current order, and all responsive, form, keyboard, focus, and accessibility checks pass.

## Implementation and verification record

- Implemented the confirmed scope on August 31, 2026.
- Replaced the numbered vertical hero caption with the shared horizontal caption and removed `01 /`.
- Removed the forced direct-contact headline break and placed the supporting text and existing contact details beneath it in a single-column rectangular flow.
- Preserved the existing Hero → Topics → Form → Direct Contact DOM order and all form content because Comment 44 remains deferred.
- Preserved the direct panel’s phone/email duplication and introduced no arrow or footer target because those parts of Comment 45 remain deferred.
- Verified the established eight responsive viewports plus the exact 800/801px caption breakpoint, one-line direct-contact heading at 1212px and 1512px, zero page overflow, form field order and whitespace validation, required/optional states, fallback email destination, mobile-menu Escape handling, link destinations, image/background loading, shared-footer contacts, touch targets, and an error-free browser console.
