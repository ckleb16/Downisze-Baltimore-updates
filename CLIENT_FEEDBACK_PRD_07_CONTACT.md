# Downsize Baltimore — Client Feedback PRD 07: Contact

## Document status

- Product: Downsize Baltimore marketing website
- Section: Contact (`/contact`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 43–45
- Status: Draft ready for implementation after confirmation that comment 44 means “main block” rather than “Name block”
- Dependencies: Reuses the homepage hero-caption, shared-header, and shared-footer standards defined in PRD 01

## Objective

Make the Contact page’s interaction hierarchy clearer and less repetitive. The revision should horizontalize and de-number the hero caption, promote the note form to the primary section, and simplify the repeated direct-contact panel into a compact transition that leads visitors to the phone and email already present in the shared footer.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 43 | Vertical hero-photo plaque: “01 / A conversation can be the beginning.” | Move it horizontally and remove “01.” | Retain the sentence as a shared horizontal lower-photo caption with no number. |
| 44 | Complete “A quieter way to reach out / Rather Send Me a Note?” form section | “Can we make this the name block?” | The marker selects the full section, not the Name field. Recommended interpretation: “name” is a typo for “main”; move the complete form directly below the hero and make it the page’s primary content block. This requires confirmation. |
| 45 | “Sometimes It’s Just Easier” panel immediately above the footer | Put the headline straight across, text underneath, consider an arrow toward phone/email below, and reduce repetition. | Convert the panel to a shallow one-column transition. Remove its duplicate phone/email, retain those details in the shared footer, and add a labeled down-link to the footer contact group. |

## Recommended page order

1. Hero with horizontal, number-free photo caption
2. Main note-form section
3. Supporting **What Can We Talk About?** topic index
4. Compact **Sometimes It’s Just Easier** transition strip
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

### C2 — Make the note form the primary content block

- Pending confirmation that **name block** means **main block**, move the complete form section directly below the hero in both DOM and visual order.
- Move the section before **What Can We Talk About?**; do not simulate reordering with CSS while leaving an illogical keyboard or screen-reader order.
- Retain the complete form-section content:
  - **A quieter way to reach out** eyebrow;
  - **Rather Send Me a Note?** heading;
  - explanatory paragraph;
  - email-draft behavior notice and fallback address;
  - Name, Email, Phone, topic, and message fields;
  - required/optional states;
  - validation messages;
  - **Open Email Draft** action; and
  - post-action status message.
- Retain the current desktop intro/form split and mobile stacked layout, with increased prominence coming from page order rather than oversized type or fields.
- Keep the **What Can We Talk About?** topic index intact as supporting orientation after the form.
- Do not change the individual Name field unless the client confirms that “name block” was literal and supplies the intended field change.

### C3 — Preserve the form’s functional contract

- Continue creating a reviewable draft in the visitor’s local email application; do not imply that the website sends the form automatically.
- Preserve trimmed values, custom whitespace validation for Name and Message, required email/topic validation, and phone optionality.
- Preserve the generated email subject and inclusion of every submitted field.
- Keep labels programmatically associated with controls and retain appropriate `autocomplete` values.
- Keep a visible fallback `mailto:` address if no email application opens.
- Preserve visible focus, browser validation, and a logical keyboard sequence after the section is moved.

### C4 — Simplify the direct-contact panel into a transition strip

- Retain the eyebrow **Prefer to call or email?** and exact headline **Sometimes It’s Just Easier.**
- Remove the forced line break so the headline renders straight across on one line at 1212px and 1512px.
- Preserve the existing navy/gold serif treatment unless the client requests a single-color headline.
- Place the existing supporting copy immediately beneath the headline: “Sometimes it’s just easier to pick up the phone. You’re always welcome to reach out directly.”
- Remove the duplicate phone number and email address from this panel.
- Retain phone and email in the shared footer, which must remain identical across routes under Homepage H7.
- Add a visible cue such as **Call or email Mary below** with a downward arrow after the supporting text.
- Make the cue a keyboard-accessible link to a stable, identified footer contact region; do not use an unlabeled decorative arrow as the only instruction.
- Convert the current large two-column framed panel to a shallow full-width rectangular transition, targeting approximately 240–300px content-driven desktop height.
- Preserve the paper texture and a restrained border without recreating another large square panel.
- On tablet and mobile, allow the headline to wrap naturally and keep the arrow cue close to the supporting text.

### C5 — Preserve the shared footer and site header

- Add a stable destination identifier to the shared footer contact group for the down-link in C4.
- Continue rendering Mary’s phone and email once in the shared footer with the approved Homepage H7 hierarchy.
- Retain the footer’s brokerage details, navigation, legal copy, and **Schedule a Conversation** action.
- Do not create a Contact-specific footer variant or remove contact details from other routes.
- Continue using the common header with Contact marked active and inherit any approved Homepage H1 navigation change.

## Responsive, form, and accessibility acceptance criteria

- Verify at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- No `01`, vertical writing, or number-related gap remains in the hero caption.
- The note form is the first major section after the hero in both DOM and visual order when the main-block interpretation is approved.
- Form labels, required/optional states, validation, keyboard sequence, generated email content, and status messaging remain correct.
- **What Can We Talk About?** remains intact after the form and keeps all six topics.
- **Sometimes It’s Just Easier.** occupies one line at 1212px and 1512px, with no clipping or horizontal overflow.
- The transition strip no longer repeats phone or email.
- Phone and email remain clearly available in the identical shared footer used on every route.
- The arrow cue has understandable visible text, visible focus, a minimum 44×44px target, and a valid footer-contact destination.
- Activating the cue moves focus or scroll position predictably without hiding the destination beneath browser chrome.
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

## Deferred clarification log

These items are recorded for the consolidated question round at the end:

1. **Comment 44 wording:** Confirm that “name block” means **main block**. If it literally refers to the Name field, the screenshot does not specify the desired field change.
2. **Meaning of main:** The recommended interpretation moves the complete form directly below the hero, before the topic index, rather than merely enlarging it.
3. **Comment 45 repetition:** The recommended resolution removes phone/email from the pre-footer panel and retains them in the shared footer, because the footer is the approved sitewide contact source.
4. **Arrow behavior:** The recommended arrow is a labeled functional down-link to the footer contact group, not a decorative arrow.
5. **Headline styling:** “Straight across” is interpreted as removing the forced line break while preserving the existing navy/gold serif emphasis.

## Definition of done

This section is complete when comments 43–45 are implemented as approved, the form is established as the page’s main action without functional regression, the hero caption follows the shared horizontal number-free treatment, the pre-footer area no longer duplicates footer contact details, and all responsive, form, keyboard, focus, and accessibility checks pass.
