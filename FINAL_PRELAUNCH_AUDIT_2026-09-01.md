# Downsize Baltimore — Final Pre-Launch Audit

**Audit date:** September 1, 2026  
**Candidate:** Version 12
**Current public version:** Version 10  
**Audit outcome:** All 18 confirmed launch, UI, accessibility, and copy findings are resolved in the Version 12 candidate. The candidate passed the complete route, viewport, interaction, and build verification described below. Version 10 remains public until Version 12 is explicitly published.

## Remediation status

- **LB-01 resolved:** Sites production environment revision 1 now sets `SITE_URL` to the current public `chatgpt.site` origin and enables indexing. These values take effect when the Version 12 candidate is deployed.
- **UI-01 through UI-07 resolved:** Mobile hero reading order now matches the document order; navigation uses 13 px single-line labels through the 901 px desktop boundary; short-desktop split images fill their rows; contact fields have a high-contrast two-tone focus ring; orphan numbers are removed; footer copy is 13 px; and the 404 view uses the shared header and footer.
- **A11Y-01 through A11Y-04 resolved:** Visual collections now use list semantics, statistic regions and the Meet Mary video have accessible names, and decorative icons are consistently hidden from assistive technology.
- **COPY-01 through COPY-06 resolved:** Grammar, process sequencing, venue naming, credentials, client-facing resource wording, repeated copy, and the approved testimonial corrections are implemented consistently.
- **Additional final-pass hardening:** Preserved list announcements in Safari/VoiceOver, removed a default list margin, restored the intended Contact topic breakpoint, prevented the mobile Contact note icon from collapsing, and hid the decorative error-boundary reload icon.

The findings below are retained as the historical audit baseline. The remediation status above supersedes their original recommendations.

## Requested change completed

- Removed the full visible line `02 / A CONVERSATION IN CONTEXT` from the Aging in Place story image.
- Kept the image, image crop, section spacing, adjacent content, and responsive behavior unchanged.
- Verified the removal at desktop and mobile sizes with no resulting layout shift.

## Original launch blocker

### LB-01 — The current public hostname is excluded from search engines

**Where:** Entire site on `https://downsize-baltimore-mary-lynch.ckleb16.chatgpt.site/`  
**Evidence:** The live homepage emits `meta name="robots" content="noindex,nofollow"`, and the live `/robots.txt` returns `User-agent: *` followed by `Disallow: /`. The Sites project currently has no production environment variables configured.  
**Cause:** `server/worker.ts` treats only the configured `SITE_URL` hostname as indexable and otherwise falls back to `https://downsizebaltimore.com`.  
**Recommendation:** If the `chatgpt.site` address is the final public address, set `SITE_URL` to that origin and enable indexing before publishing. If the final launch address will be `downsizebaltimore.com`, keep the preview blocked, connect the custom domain, and recheck both the page metadata and `robots.txt` on that domain before announcing launch.

## Original medium-priority issues

### UI-01 — Mobile hero CTA order conflicts with the reading order

**Where:** All seven standard routes at widths through 700 px.  
**Observed:** CSS visually moves each hero CTA above the explanatory paragraphs while the document and screen-reader order remains paragraphs first, CTA last. Sighted mobile users and assistive-technology users therefore receive different content sequences.  
**Source:** `client/src/index.css:1083-1106`.  
**Recommendation:** Keep the same meaningful order in the document and on screen. The simplest fix is to leave the CTA after the explanatory copy on mobile.

### UI-02 — Compact-desktop navigation becomes too small and wraps

**Where:** All standard routes around the desktop/mobile boundary; confirmed at 821 px wide.  
**Observed:** Navigation labels render at approximately 10.5 px, and long labels such as “Downsizing Services,” “Buying & Selling,” and “Resource Center” wrap to two lines. This is difficult to scan, particularly for the site’s older audience.  
**Source:** `client/src/index.css:1768-1785`.  
**Recommendation:** Switch to the mobile navigation at a slightly larger breakpoint or rebalance spacing so desktop labels remain at least 12–14 px on one line.

### UI-03 — Split-hero images leave uneven blank strips on short desktops

**Where:** Most visible on Meet Mary and Contact at 1212 × 799; smaller gaps also appear on Buying & Selling and Resource Center depending on width.  
**Observed:** The copy determines the grid-row height, but the short-desktop rule fixes the image to 32 rem. Confirmed gaps at 1212 × 799 were approximately 60 px on Meet Mary and 47 px on Contact.  
**Source:** `client/src/index.css:1057-1078`.  
**Recommendation:** Let the image fill the grid row with a controlled minimum height and `object-fit: cover`, rather than giving it a fixed short-desktop height.

### UI-04 — Contact-field keyboard focus is too subtle

**Where:** Contact form on all viewports.  
**Observed:** Focus removes the native outline and leaves only a thin gold border plus a low-opacity gold shadow against the cream field background. This is easy to miss during keyboard navigation.  
**Source:** `client/src/index.css:125, 792`; form at `client/src/pages/Contact.tsx:63`.  
**Recommendation:** Restore a clearly visible 2–3 px focus ring with sufficient contrast and separation from the field border.

### A11Y-01 — Several visual lists do not expose list semantics

**Where:** Downsizing Services, Aging in Place, Buying & Selling, Resource Center, Meet Mary, and Contact.  
**Observed:** Multiple numbered, bulleted, or grouped sets are built from generic `div` and `span` elements. Screen readers therefore do not announce list boundaries or item counts.  
**Representative source:** `Downsizing.tsx:39,41,47,49`; `AgingInPlace.tsx:100`; `BuyingSelling.tsx:66`; `ResourceCenter.tsx:96`; `MeetMary.tsx:39,56`; `Contact.tsx:61`.  
**Recommendation:** Use `ul`/`ol` with `li`, preserving the current visual styling.

### COPY-01 — Aging in Place heading is grammatically incorrect

**Where:** Aging in Place, NAIPC section.  
**Current:** “Connected to the Right People Matters.”  
**Recommendation:** “Being Connected to the Right People Matters.” or “Connections to the Right People Matter.”

### COPY-02 — Downsizing process describes settling twice

**Where:** Downsizing Services, eight-step process.  
**Observed:** Step 06 says “Prepare, Sell, and Get Settled,” step 07 is the transition, and step 08 again says “Settle Into What’s Next.” The sequence implies the client is settled before the transition.  
**Recommendation:** Rename step 06 to cover preparation and sale only, leaving settling to step 08.

### UI-05 — Two remaining section numbers are orphaned

**Where:** Downsizing Services and Meet Mary.  
**Observed:** `02 / A POSSIBLE NEXT HOME` appears without a visible page-level 01, and a lone `04` appears on Meet Mary without visible 01–03 markers. The inconsistency is more noticeable now that the equivalent Aging in Place marker has been removed.  
**Source:** `Downsizing.tsx:41`; `MeetMary.tsx:54`.  
**Recommendation:** Remove both orphaned numbers or introduce a deliberate, complete numbering system.

## Original low-priority issues

### UI-06 — Footer copy is undersized

Footer navigation and legal text render at approximately 10.4 px on every viewport. Increase the floor to at least 12–14 px for the intended audience. Source: `client/src/index.css:1870-1889`.

### A11Y-02 — Aging in Place statistic articles are unnamed

The two statistic cards use `article` landmarks without headings or accessible labels, so assistive technology encounters two indistinguishable article regions. Source: `AgingInPlace.tsx:94`.

### A11Y-03 — Meet Mary video has a description but no accessible name

The video has controls, captions, a full transcript, and `aria-describedby`, but no `aria-label` or `aria-labelledby`. Give it a concise name such as “Pop driving the boat.” Source: `MeetMary.tsx:49`.

### A11Y-04 — Decorative icons are not consistently hidden

Many inline Lucide arrows, checks, and category icons repeat adjacent text but do not consistently use `aria-hidden="true"`. Header and footer icons are already handled correctly. Add the attribute to decorative icons across the page components.

### UI-07 — The 404 page omits the shared navigation and footer

The error page is functional, styled, returns a true HTTP 404, and its “Take Me Home” link works. It is nevertheless the only route without the shared header and footer, which can make it feel disconnected and removes alternate recovery paths.

### COPY-03 — Minor wording and capitalization inconsistencies remain

- `Retirement Community` is singular and title-cased inside an otherwise plural, sentence-case list.
- `yardwork` conflicts with “Yard work” elsewhere.
- Meet Mary image alt text says “Orioles Park”; the venue name should be verified, likely “Oriole Park.”
- Mary’s credentials and title are phrased differently across Home, Aging in Place, and Meet Mary.

### COPY-04 — Two passages read like internal product notes

- Resource Center: “Answers should be easy to find, useful on their own, and able to grow as the Resource Center grows.”
- Downsizing Services: “New tools will be added only after they are ready to use.”

Rewrite these as client-facing guidance rather than notes about how the site or resource library will evolve.

### COPY-05 — Adjacent copy repeats itself

- “Destination first. Plan second. Stuff third.” appears twice in adjacent Downsizing sections.
- Contact uses “Sometimes It’s Just Easier” in the heading and repeats “Sometimes it’s just easier…” immediately below.

### COPY-06 — Submitted testimonials contain editorial errors that require client approval

The approved quotes contain `BelAir/ Harford`, a sentence with mismatched parallel structure, and `estate- there`. These were preserved exactly because they are client-supplied testimonials. Treat them as approval items, not implementation defects, and edit only with the quoted clients’/client’s permission.

## Approved limitations that are not bugs

- “Join for Free” continues to open the general Contact page without a dedicated club-signup workflow. This matches the previously approved label-only change.
- The client-approved testimonial corrections are now applied; no additional editorial changes were made.
- The removed Aging in Place line left only harmless unused CSS selector fragments; there is no visible or functional residue.

## Test coverage

### Routes and views

All seven standard routes plus the explicit 404 and an unknown URL were tested at:

- 1512 × 799
- 1212 × 799
- 1024 × 768
- 901 × 900
- 900 × 900
- 821 × 900
- 820 × 900
- 768 × 1024
- 390 × 844
- 320 × 568

This produced 90 route/view combinations, supplemented by focused screenshots and boundary checks at 1180/1181 px and 800/801 px.

### Interactive flows

- Desktop and mobile navigation, including menu open, Escape close, focus restoration, active state, and route navigation.
- Homepage question carousel: next, previous, and direct question controls.
- Ten-question Aging in Place self-evaluation: completion, result calculation, focus movement, back/change-answer path, and full reset.
- Resource Center pathway filtering, “Show all resources,” and FAQ open/close behavior.
- Contact form required-state, whitespace-only rejection, invalid-data focus, and footer contact jump. A valid submission was intentionally not triggered because it opens the user’s external email application.
- Meet Mary video controls, caption track, transcript open/close, poster, and supporting description.
- Unknown-route 404 rendering and “Take Me Home” recovery.

### Passed checks

- All canonical routes render and all internal route/hash destinations resolve.
- Unknown routes return a true HTTP 404; canonical redirects preserve query strings.
- No page-level horizontal overflow, direct-section overlap, duplicate IDs, broken loaded images, missing image alternatives, missing main landmarks, multiple/missing H1s, or missing document language were found.
- All 28 referenced local images, video files, captions, and supporting assets exist.
- Form controls have associated labels; required and optional states are visible; required whitespace-only values are rejected.
- Video captions cover the full clip and match the available transcript.
- No application errors or warnings appeared in the browser console during the interactive run.
- Calendly and AARP destinations responded during external-link checks. The Harvard source blocked automated access, but no malformed URL was found.

## Residual risk

This is a comprehensive finite audit, not a mathematical guarantee that no unknown issue can exist. Remaining risk is concentrated in physical-device/browser rendering differences, temporary third-party availability, external email-client behavior, and future content changes. The confirmed findings above are the complete issues observed in the audited candidate and scope.
