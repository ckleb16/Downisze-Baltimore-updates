# Client sign-ups: implementation sections

Status: review branch only. Constant Contact is the chosen email service, but the account destinations and authorization are not ready. Do not merge or publish yet.

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

## 4. Constant Contact connection

The server now has a Constant Contact V3 integration. It rejects requests until all destination IDs and an authorized account connection are configured. It reports success only after Constant Contact accepts the contact and (for Club interest) the tagging activity request. The UI branch is **not ready for production**.

The owner has said an existing, informal newsletter list exists but cannot provide its exact name yet; there is no Club list. Before launch:

1. Confirm which existing Constant Contact list is **The Anchored Home** destination. Do not guess from the account's other lists.
2. Create a separate `Downsizers Club` list and tag. Create six contact custom fields for signup source, mailing address, timing, planning for, part of town, and time of day. Use text fields that can store the site's answers. Record their IDs.
3. Create a Constant Contact V3 OAuth app with `contact_data` and `offline_access` scope. Register the exact HTTPS redirect URI shown in `.env.example`. Add the credentials and list/tag/field IDs to GoDaddy's private environment settings; do not commit values or paste secrets into chat.
4. Sign in to the site's publisher account and visit `/api/admin/constant-contact/connect` on the live domain. Authorize Mary's Constant Contact account. Access and refresh tokens are kept in the app's persistent private database; refresh-token rotation is saved there.
5. Approve the form consent/privacy presentation and confirm Constant Contact's Confirmed Opt-In setting before enabling public signups. The sign-up endpoint can give explicit permission to an address that was previously unsubscribed, so the account setting and real consent must be reviewed.
6. Complete a supervised end-to-end test with owner-controlled addresses only. Check newsletter, Club only, Club plus newsletter, repeat submission, and a failed provider response. Confirm the Club tag activity completes and every optional answer appears in Constant Contact.

The server does not send a schedule automatically. It puts Club contacts on the dedicated list and requests the tag so Mary can send the 2027 schedule when it is ready. The guide PDFs remain free and open immediately regardless of signup.

Expected delivery behavior:

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
