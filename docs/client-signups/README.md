# Client sign-ups: implementation sections

Status: review branch only. Do not merge or publish while the email service is unknown.

## 1. Free guides and optional Anchored Home invitation

- Keep all three PDFs publicly accessible without an email field or sign-up gate.
- The primary guide action opens the PDF in a new tab immediately; the guide page then offers the exact optional newsletter invitation supplied by Mary.
- The invitation has Name, Email, `Sign me up`, and `No thanks, just the guide`. Closing it does not affect access to the PDF.
- A failed sign-up must show an error, never success.

## 2. Downsizers Club schedule interest

- Use the existing Club section of `/resource-center`; no new route or page.
- Navy heading, Mary's existing photo, white form, large readable controls.
- The 2027 schedule notice and thank-you text follow Mary's supplied wording.
- Name and Email are required. Mailing address, phone, all checkbox groups, part of town, and time of day are optional.
- The newsletter checkbox starts unchecked. Club interest and Anchored Home subscription are separate choices.
- Older Club contact links redirect visitors to the new section.

## 3. Consistent site pathways

- Add a Downsizers Club link and small Anchored Home form to the shared footer on public pages.
- Keep the header's `Talk to Mary` action.
- Downsizing links to the Club section and the two specified guides. Aging in Place links to the ADU and Stay/Go guides. Resource Center already lists all three guides. Buying & Selling keeps its booking path. Meet Mary gets the shared footer subscription form. Contact retains its main inquiry form without the old Club prefill or a competing hero booking button.

## 4. Email service connection: blocked by missing provider choice

The website has no existing newsletter integration. `/api/signups` currently returns HTTP 503 and stores nothing. This is intentional: no visitor may see a false success message. The UI branch is **not ready for production**.

Before launch, Mary or the site owner must identify the email platform and its client-owned lists/segments, grant a secure integration method, and approve the exact consent/privacy presentation. Then implement server-side delivery with the provider's API and test:

1. Newsletter sign-ups from the guide box and footer reach The Anchored Home list once, with source attribution.
2. Club sign-ups reach the `Downsizers Club` segment with optional answers intact.
3. Club sign-ups reach The Anchored Home only when its separate checkbox is checked.
4. Duplicate addresses, provider errors, retries, and unsubscribed addresses follow that platform's rules. No API key is exposed to browser code or committed to Git.
5. No real person's address is used in test submissions. Production launch waits for an owner-supervised end-to-end test.

## Review gates

- Confirm responsive layout, contrast, keyboard focus, and form labels at desktop and mobile sizes.
- Confirm guide PDFs open without submitting, `No thanks` closes, and direct PDF URLs remain accessible.
- Confirm the footer Club link lands at the form from each public page, and the old Club contact URL reaches it.
- Run the production build and relevant existing tests. Record any baseline failures separately.
- Recheck the current SEO implementation branch before merging so the two changes do not overwrite one another.
