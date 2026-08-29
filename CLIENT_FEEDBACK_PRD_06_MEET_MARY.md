# Downsize Baltimore — Client Feedback PRD 06: Meet Mary

## Document status

- Product: Downsize Baltimore marketing website
- Section: Meet Mary (`/meet-mary`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 37–42, including the reply attached to comment 38
- Status: Draft ready for layout implementation; final historical-photo and video changes depend on approved client assets
- Dependencies: Reuses the homepage hero-caption, compact closing-strip, shared-header, and shared-footer standards defined in PRD 01

## Objective

Improve the Meet Mary page’s visual storytelling by removing unnecessary sequence numbers, pairing the career story with a larger correctly cropped family photograph, correcting personal-media presentation, enlarging and centering the Pop video, and converting the final panel to the shared shallow closing strip. Preserve Mary’s exact story and the authenticity of her personal media.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 37 | Hero-photo label: “01 / Meet Mary Lynch” | Remove “01.” | Remove only `01 /` and retain “Meet Mary Lynch” in the lower-photo caption treatment. |
| 38 | Career-story section containing the `02` aside and Orioles family photo | Remove `02`, place text left and photo right, and enlarge the photo area so heads are not cut off. | Replace the mostly empty numbered-aside layout with a true two-column story: biography and credentials left, large portrait-oriented Orioles photo right. The current source contains every head; the website’s forced landscape crop causes the defect. |
| 39 | Historical Mary-and-Pop Polaroid | Correct the visibly “wonky” photo; Mary asks whether she should fix and upload it. | Yes. Prefer a clean client-supplied scan/crop of the intended photograph. Preserve the keepsake frame and HTML caption; do not generatively reconstruct faces or missing content. |
| 40 | Pop boat video and visible transcript | Make the video larger and centered, remove the current sound and transcript, add music, and determine whether it should be edited off-site. | Use a final off-site-edited, licensed, music-only MP4, then display it as a large centered media row. Remove the visible transcript only after the final file contains no speech; preserve an accurate accessible description/caption and native controls. |
| 41 | Two photos in “Mary outside of work” | Correct their sizing/cropping; Mary asks how she can help. | Give the Chesapeake/Frenchies and family-travel images separate aspect-ratio rules, enlarge and level them, preserve every face, and remove the blank band embedded in the travel source. Existing originals are adequate for most layout fixes; a clean travel original is preferred. |
| 42 | Final “Let’s Talk About What Comes Next” panel | Make it a long skinny rectangle, keep all words, use a large headline, and remove the scheduler. | Reuse the shared compact closing-strip system, retain every existing word, keep the headline at the upper end of the shared scale, and remove only the panel’s internal scheduling action. |

## Current media diagnosis

- The Orioles and Chesapeake source images are portrait photographs at approximately a 3:4 ratio, but the website forces them into a 1.55:1 landscape frame with `object-fit: cover`. That rule—not the source images—cuts off heads.
- The Orioles image is currently capped at approximately 22rem, despite the requested larger right-side photo treatment.
- The Chesapeake and travel frames are capped at approximately 20rem and 18rem.
- The family-travel source includes a large blank white band above the usable photograph.
- The historical Pop source is a phone photograph of an album page containing blue backing, another overlapping photograph, and perspective skew. A clean scan will retain materially more detail than a CSS crop.
- The 18-second video is currently capped at approximately 32rem, right-aligned inside the copy column, forcibly muted, and accompanied by both WebVTT captions and a visible transcript.

## Requirements

### M1 — Simplify the hero caption

- Change the visible caption to exactly “Meet Mary Lynch.”
- Remove `01 /` and number-specific spacing with no replacement number.
- Keep the existing lower-left photo placement and shared navy-backed caption styling.
- Match the shared approximately 12px caption scale and mobile visibility rule.
- Do not remove or change the hero photograph, headline, supporting copy, or **Let’s Talk About What Comes Next** action.

### M2 — Rebuild the career-story section around text and photo

- Remove the visible `02` from the DOM and accessibility tree.
- Eliminate the oversized empty aside produced by the current numbered layout.
- Place the **The work behind the work** eyebrow, career headline, all three biography paragraphs, and four credentials in the left column.
- Move the Orioles family figure out of the bottom of the copy container and into a dedicated right media column.
- Use an approximate 54–58% copy / 42–46% photo desktop grid, with a photo width of approximately 420–520px depending on viewport.
- Render the photo at its natural approximately 3:4 ratio using `height: auto` or an equivalent non-destructive treatment. Do not reuse the 1.55:1 landscape crop.
- Keep all four heads fully visible at every supported width.
- On tablet and mobile, stack copy before photo and allow the figure to use the available content width.
- Retain the current meaningful alternative text unless the asset changes.
- If the anchor is retained, integrate it quietly into the shared anchor-and-line label system; do not preserve a standalone empty ornament column.

### M3 — Replace or carefully correct the historical Pop photograph

- Preserve the keepsake/Polaroid presentation and exact visible caption: “Me & Pop. Long before I knew where this would lead.”
- Preferred final path: replace the current source with an approved clean scan or crop supplied by Mary.
- If Mary does not supply a replacement, a best-effort local correction may:
  - crop to the intended Mary-and-Pop photograph;
  - remove the blue album backing and unrelated photograph above it;
  - correct perspective and visible skew; and
  - apply only mild color/exposure correction.
- Do not generate, reconstruct, retouch, or materially alter faces or missing image content.
- Fit the corrected image without clipping Mary or Pop.
- Use semantic `figure` and `figcaption` markup where practical, and preserve the meaningful alternative text.
- Keep the current original asset available as a recoverable source/reference during implementation.

### M4 — Enlarge, center, and replace the Pop video media

- Move the video out of the constrained copy column and make it a centered media row within the Pop section, after the written reflection and before the chapter section.
- Target a desktop width of `min(100%, 56–60rem)` while retaining 16:9.
- Center the video and its visible caption as one media figure.
- Preserve native controls, visible keyboard focus, `playsInline`, and metadata-only preload.
- Do not autoplay or loop.
- Recommended content handoff: Mary or her editor supplies the final off-site-edited video as a music-only MP4, with the original speech, engine, and wind removed if “remove sound” means replacing the complete original track.
- Once that approved file is installed, remove the forced-muted state so user-initiated playback can play the music. Keep native mute and volume controls.
- Retain “Our guy, Pop. Still happiest at the helm.” as the visible description unless replacement copy is supplied.
- Remove the visible transcript accordion only after confirming the replacement contains no spoken words.
- Replace the current speech captions with an accurate music-only cue such as `[Instrumental music]` when applicable.
- If any intelligible speech or lyrics remain, synchronized captions remain required and the transcript cannot be removed without an equivalent accessible alternative.

### M5 — Correct the outside-work photographs

- Apply comment 41 to the two photographs in the selected **Mary outside of work** section; comments 38 and 39 govern the other personal images.
- Remove the shared forced 1.55:1 landscape ratio from both images.
- Chesapeake/Frenchies image:
  - use its natural approximately 3:4 portrait ratio;
  - enlarge to approximately 24–28rem desktop width; and
  - keep both people’s complete heads and all three dogs visible.
- Family-travel image:
  - remove the blank band before responsive variants are generated;
  - preserve its natural wide/selfie composition, approximately 4:3 after cleanup;
  - enlarge to approximately 28–34rem where the right column permits; and
  - keep all four faces visible.
- Level both frames by default (`transform: none`) so decorative rotation is not mistaken for another sizing or skew defect.
- On mobile, use fluid image widths, natural height, and no fixed crop that can remove faces.
- Preserve or update meaningful alternative text to match the final assets.

### M6 — Reuse the compact closing-strip system

- Retain every existing word in the final panel:
  - “Empowered, not overwhelmed.”
  - “Let’s Talk About What Comes Next.”
  - all three supporting paragraphs.
- Remove the panel’s **Schedule a Conversation** action from the rendered page and keyboard order.
- Reuse the shared horizontal two-column closing-strip component or style defined in Homepage H6.
- Target approximately 300–360px content-driven desktop height.
- Keep the headline prominent at the upper end of the shared scale, approximately 56–64px, without forcing the strip back into a tall square.
- Preserve the paper texture and restrained border/diamond motif only where they do not add material height.
- Stack the content groups on tablet and mobile.
- Retain the true shared footer immediately below it, including its separate scheduling action and all Homepage H7 changes.

### M7 — Preserve shared site chrome and untouched story sections

- Continue using the common header with Meet Mary marked active and inherit any approved Homepage H1 navigation change.
- Continue using the common footer with all Homepage H7 requirements.
- Preserve the **3 A.M. and Unprepared**, **From experience to purpose**, and **Mary outside of work** narrative copy and order.
- Do not remove the visible `04` from **From experience to purpose** unless it is approved separately in the consolidated decision round.

## Client asset handoff specifications

### Historical Pop photograph

- Upload a clean original scan or direct photograph, not a screenshot.
- Acceptable formats: JPEG, PNG, or TIFF in sRGB.
- Minimum 1200×1500px; ideal 1600×2000px or larger.
- Supply the intended Mary-and-Pop photograph only, without album backing, overlapping photographs, glare, UI, or burned-in caption text.
- If possible, supply both an uncropped original and Mary’s preferred crop.
- The website will render the caption separately.

### Orioles and Chesapeake photographs

- The existing 1206px-wide sources are adequate for the proposed display sizes when their natural ratios are used; replacements are not required solely to fix the head cropping.
- If replacements are supplied, use originals at least 1200px wide with complete heads and modest safe space around the group.
- Do not resize them smaller before upload.

### Family-travel photograph

- A clean original without the blank band is preferred.
- If unavailable, the existing file can be cropped locally to its usable photo area without generative extension.
- Do not add artificial sky or reconstruct canvas content.

### Pop video

- Recommended final attachment: MP4 container, H.264 video, AAC audio, 16:9.
- Preferred resolution is 1920×1080; 1280×720 is acceptable.
- Preserve approximately the current 18-second duration unless Mary intentionally re-edits it.
- Use an approved instrumental track without lyrics and supply the track title/source plus license or written permission for website use.
- Remove residual speech, boat engine, and wind if the intention is a complete music replacement.
- Use short clean audio fades and web-appropriate compression; approximately 4–8 Mbps video and 128–192 kbps audio is sufficient for this short clip.
- Supply or approve a clean 16:9 poster frame. The current Pop-at-the-helm poster remains suitable if the visual edit is unchanged.

## Responsive, media, and accessibility acceptance criteria

- Verify at 1512×799, 1212×799, 1024×768, 821×900, 820×900, 768×1024, 390×844, and 320×568.
- The hero caption reads “Meet Mary Lynch”; no `01` or dangling slash remains.
- The career-story section contains no `02`; biography is left and the enlarged Orioles photo is right on desktop.
- All four Orioles-photo heads remain fully visible at every breakpoint.
- The historical Pop image is straight, clean, and limited to the intended photograph; its caption and subjects remain intact.
- The Pop video is visibly larger, horizontally centered, 16:9, and fully keyboard operable.
- A visible transcript is removed only after the approved speech-free replacement is installed.
- The final video contains only the approved/licensed mix, and its captions/description accurately represent the media.
- The outside-work photographs are larger, undistorted, level, free of blank source padding, and retain every face.
- The closing strip contains all existing copy, no scheduler, and matches the shared shallow rectangular geometry.
- The footer retains its separate scheduling action.
- No horizontal scrolling, overlap, cumulative layout shift, broken heading order, cropped media, or keyboard trap is introduced.
- Decorative frames, lines, anchors, and diamonds are hidden from assistive technology.

## Non-goals

- Rewriting biography, Pop story, credentials, chapter, purpose, outside-work, or closing copy.
- Removing the hero action or shared-footer action.
- Replacing the Meet Mary hero photograph.
- Reordering or deleting the chapter, purpose, or outside-work sections.
- Generatively reconstructing photo content or altering faces.
- Selecting or licensing music on Mary’s behalf without explicit approval.
- Removing captions or equivalent accessibility text while speech remains.
- Treating the pre-footer strip as a replacement for the true shared footer.
- Automatically removing the visible `04` in **From experience to purpose** without approval.

## Deferred clarification log

These items are recorded for the consolidated question round at the end:

1. **Comment 37 scope:** The recommended interpretation removes only `01 /` and retains “Meet Mary Lynch.”
2. **Comment 38 ornament:** Confirm whether the anchor should remain as part of the shared anchor-and-line label or disappear with `02`.
3. **Remaining `04`:** Removing `01` and `02` leaves `04` as the page’s only visible section number. It was not targeted, so the PRD preserves it pending direction.
4. **Comment 38 photo:** The recommended right-side image is the existing Orioles family photo currently nested at the bottom of the biography.
5. **Comment 39 handoff:** Confirm whether Mary will provide a clean scan/corrected historical photo or wants a best-effort local crop and perspective correction.
6. **Comment 40 placement:** The recommended interpretation is a centered media row spanning the Pop section, not merely a larger video inside the current right column.
7. **Comment 40 audio:** Confirm that “remove sound” means remove all original speech, engine, and wind and replace them with approved instrumental music only.
8. **Comment 40 ownership:** Confirm whether Mary will supply the final edited MP4 and music-use evidence or wants the implementation team to mix a separately approved track.
9. **Comment 41 scope:** The recommended scope is the two outside-work photos because other personal images have their own comments.
10. **Frame tilt:** The recommended correction levels the two outside-work frames; confirm if the scrapbook-style rotations should remain.

## Definition of done

This section is complete when comments 37–42 are implemented as approved, all targeted numbers are removed without leaving empty layouts, every personal photograph uses an intentional non-destructive presentation, the approved music video is centered and accessible, the final panel becomes a large-headline button-free strip, the shared footer remains intact, and all responsive, media, keyboard, and accessibility checks pass without regressions.
