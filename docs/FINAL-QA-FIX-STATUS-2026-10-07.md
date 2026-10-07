# Final QA repair status — October 7, 2026

This follows the 31-item final QA report. It distinguishes repaired product behavior from launch configuration and user-controlled security steps. It is not a guarantee that every device or future third-party service is defect-free.

## Completed product repairs

| QA ID | Resolution |
| --- | --- |
| 001 | The editor, New article, library switching, and other writing actions are locked during saving/uploading. A synchronous guard also prevents double submissions. Unsaved-change confirmations use accessible in-page dialogs. |
| 003 | The known public site's homepage shell now allows indexing. Worker-rendered public metadata follows the indexing setting; publisher/private responses remain non-indexable. |
| 004 | A bounded fragment-navigation observer waits for lazy destinations, then scrolls and focuses the requested section. Back/forward and hash changes are handled. |
| 005 | Authored headlines, previews, summaries and library titles wrap safely. Small-screen article headings are sized to keep ordinary long words readable. |
| 006 | Code blocks scroll within their own area instead of widening the page. Tables and images are contained. |
| 007 | Unexpected HTML, malformed JSON, incomplete records, invalid dates and pagination, and unsafe error-field shapes are rejected at the service boundary. The Resource Center's article feed shows its own recoverable error. |
| 008 | Null, arrays and primitives receive controlled 422 validation responses rather than server errors. |
| 009 | Current and previous article addresses are retained in the database. Old public URLs permanently redirect to the current published address. Draft, scheduled and trashed articles remain unavailable through old addresses. |
| 010 | The archive uses a cursor based on publication time, creation time and ID. Deleting an already-seen article does not skip an unread article. Numeric offsets remain supported for older API clients, but the current interface uses cursors. |
| 011 | Loading more announces the number added and focuses the first added article link, including on the final page. |
| 012 | The mobile editor comes before the library; the library retains a bounded scroll area. |
| 013 | The family video uses a Worker-served media URL with byte ranges, suffix/open-ended ranges, 206/416 responses, and HEAD length/range headers. Its original bytes are preserved. |
| 014 | Page addresses retain intermediate typing and normalize on blur/save. |
| 015 | Reads time out after 20 seconds; writes after 30 seconds. Article requests cancel superseded loads. An uncertain write warns that it may have completed and asks the author to check the library before retrying. |
| 016 | Future-dated published articles are scheduled, not public early. Public list/detail/sitemap queries enforce the date. The editor explains availability at noon UTC and marks scheduled records. |
| 018 | Unfinished writing is automatically saved to private database recovery storage after a brief typing pause. A fresh session offers recovery. The browser stores only a device identifier, not the article. Earlier manually saved article versions are available for restoration into the editor; restoring text does not publish it automatically. |
| 019 | Deletion moves an article to Trash. Restore returns it as a private draft, not a silently republished article. |
| 020 | The publisher can upload PNG/JPEG/WebP images up to 5 MB, supply a description, and insert them in Markdown. Bytes are in object storage and metadata in the database. Draft-only image URLs require admin access; images used in published content become public. SVG uploads are rejected. |
| 021 | Join for Free carries club intent into Contact, preselects the club topic and prepares the request text. The page makes clear that the email must be sent and Mary arranges membership. |
| 022 | Resource pathways now distinguish guides available to read from topics that start with a conversation. |
| 023 | Reported review/blog/admin action labels are larger; secondary dates/metadata remain readable. The small-screen address input has its own full-width writing area. |
| 024 | Cummings Episode 29 appears once as the featured conversation, not again in the lower grid. All distinct supplied video links remain. |
| 026 | Reviews are visibly described as selected five-star Google reviews, not an automatically synchronized recency feed. The five client-approved reviews remain unchanged. Future review changes require an editorial update; no Google API automation was added. |
| 027 | The three guides now have 14 interactive worksheet fields in total (6/4/4). The canonical field trees, values and widget appearances were validated. |
| 028 | Phone, email and website contact details in each guide are clickable. Website links currently lead to the working public Site, not the old domain destination. |
| 029 | All guide metadata titles use their reader-facing names. |
| 030 | All three PDFs are losslessly compressed and linearized for fast web viewing. The final sizes are about 2.50/2.56/2.74 MB; file details on the site match the actual bytes. |
| 031 | Media thumbnails are more visible under a lighter navy overlay, preserving pale text and hover/keyboard/mobile behavior. |

## User-controlled or unresolved launch items

### QA-002 — Domain/hosting configuration

The user clarified that the new site has not been configured on their own hosting and they plan to use GitHub. No old-domain DNS or hosting account is connected here, so no external redirects have been applied.

GitHub can store the source. [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages); this site's existing private publishing dashboard, database and object storage need a compatible backend. Copying only the static files to GitHub Pages would not preserve those functions. A GitHub-backed deployment plan and domain-provider access must be agreed before changing hosting.

The approved routing remains: movewithmarylynch.com should redirect visitors to the new site. Legacy paths need explicit mappings (for example, /rightsizing/ to /downsizing-services), not indiscriminate path preservation. Final HTTPS, canonical origin, domain redirects and PDF website targets must be rechecked after that configuration.

### QA-017 — Password rotation requires the user's secure entry

The user chose to keep the shared Mary account and rotate its password, rather than add named accounts/MFA. A private Change admin password screen now requires the current password and a new passphrase of at least 14 characters, stores only a salted hash, and revokes existing sessions. The original password is not in source or this report.

The actual account password has **not** been changed by the agent. After publication: sign in at /publisher, expand **Change admin password**, enter the replacement privately, confirm it and submit. Keep it in a password manager. Separate accounts/MFA and forgotten-password email recovery are not part of the user's selected shared-account approach.

### QA-025 — Approved media-logo artwork

Existing PBS/WMAR text identifiers and the existing Cummings logo are retained. Official PBS and WMAR artwork was located, but permission to reuse it was not established; newly found artwork was not published. Supply approved media-logo files or confirm the chosen text-identifier treatment before marking this earlier logo request fully complete.

Sources: [PBS Brand](https://www.pbs.org/brand), [WMAR Terms of Use](https://www.wmar2news.com/terms-of-use).

## Verification

- TypeScript check and production build pass.
- 153 isolated checks pass: 72 publisher-security, 71 backend repair, 10 client-response-boundary checks. No test modifies production credentials, posts or uploads.
- Browser checks cover lazy deep-link scroll/focus, 320-pixel editor order/wrapping, intermediate address typing, protected delayed saving, canceling unsaved changes, private draft recovery in a fresh tab, article/code containment, final archive focus/announcement and localized malformed-service errors.
- All 13 main views were checked at 320, 768 and 1280 pixels (39 view/width combinations); no document-wide overflow or completed-but-broken images were detected. This includes the three guide landing pages and a disposable long-headline/code-block article.
- All 17 updated blank PDF pages render pixel-identically to their originals. Filled worksheet examples were also rendered and visually checked; all field values agree with their widget values, and each field has an appearance stream.
- Physical iPhone/Safari/Android playback, a full screen-reader audit, penetration/load testing, and final branded-domain configuration are not certified by these checks.

The intentional filler article, client-approved reviews, original downloads and supplied photography/video are preserved. This change does not create a real club subscription, send email automatically, migrate hosting to GitHub, or grant additional admin users.
