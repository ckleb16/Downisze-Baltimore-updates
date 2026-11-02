# Client sign-ups: implementation sections

Status: review branch. Sign-ups are stored in the website's persistent database and exported as CSV files from the private publisher dashboard. There is no Constant Contact API connection or webhook.

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

## 4. Private lists and CSV exports

Submitting a form saves it in the app's persistent database. The `/publisher` dashboard shows an Anchored Home list and a Downsizers Club list, with counts, recent names, and separate CSV download buttons. Only a signed-in publisher can access the lists or exports. No email is sent automatically.

- Newsletter submissions go to the Anchored Home list.
- Club submissions go to the Club list with all optional answers. If the separate newsletter checkbox is checked, the same address also enters the Anchored Home list. If unchecked, Club submission does not add a newsletter entry.
- Repeated submissions update the existing row for that email rather than create duplicate CSV rows. The original sign-up date remains available.
- CSV exports include all rows, with UTF-8 encoding and spreadsheet formula injection protection. The Club export includes the newsletter choice. CSVs are generated on demand, not written to a public file.
- The guide PDFs still open immediately and require no sign-up.

Mary can manually import the Anchored Home CSV into the correct Constant Contact list after she identifies it. The Club CSV can be kept as a schedule-interest list or imported separately when a Club list is created. Importing a CSV is a manual action; the site does not synchronize contacts, handle unsubscribes, or send the schedule.

The GoDaddy `APP_DATA_DIR` must remain persistent across publishes. The existing publisher sign-in remains required for CSV downloads. For a launch check, use owner-controlled email addresses only and verify the list counts, CSV contents, duplicate behavior, and the separate newsletter choice before importing anything into Constant Contact.

## Review gates

- Confirm responsive layout, contrast, keyboard focus, and form labels at desktop and mobile sizes.
- Confirm guide PDFs open without submitting, `No thanks` closes, and direct PDF URLs remain accessible.
- Confirm the footer Club link lands at the form from each public page, and the old Club contact URL reaches it.
- Run the production build and relevant existing tests. Record any baseline failures separately.
- Recheck the current SEO implementation branch before merging so the two changes do not overwrite one another.
