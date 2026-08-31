# Downsize Baltimore — Client Feedback PRD 06: Meet Mary

## Document status

- Product: Downsize Baltimore marketing website
- Section: Meet Mary (`/meet-mary`)
- Source: Pastel export dated August 28, 2026
- Client comments covered: 37–42, including the reply attached to comment 38
- Status: Comments 37, 38, 41, 42 and the layout-only portion of Comment 40 implemented and verified; Comment 39 and Comment 40’s media/audio changes deferred
- Dependencies: Reuses the homepage hero-caption, compact closing-strip, shared-header, and shared-footer standards defined in PRD 01

## Objective

Improve the Meet Mary page’s visual storytelling by removing the targeted sequence numbers, pairing the career story with a larger uncropped family photograph, correcting the two outside-work photo presentations, enlarging and centering the existing Pop video without changing its media or accessibility support, and converting the final panel to the shared shallow closing strip. Preserve Mary’s exact story and leave all unresolved historical-photo, audio, music, caption, and transcript decisions untouched.

## Client intent, mapped comment by comment

| Comment | Screenshot target | Client intent | Product interpretation |
| --- | --- | --- | --- |
| 37 | Hero-photo label: “01 / Meet Mary Lynch” | Remove “01.” | Remove only `01 /` and retain “Meet Mary Lynch” in the lower-photo caption treatment. |
| 38 | Career-story section containing the `02` aside and Orioles family photo | Remove `02`, place text left and photo right, and enlarge the photo area so heads are not cut off. | Replace the mostly empty numbered-aside layout with a true two-column story: biography and credentials left, large portrait-oriented Orioles photo right. The current source contains every head; the website’s forced landscape crop causes the defect. |
| 39 | Historical Mary-and-Pop Polaroid | Correct the visibly “wonky” photo; Mary asks whether she should fix and upload it. | Defer all image changes. Preserve the current source and presentation until Mary chooses a clean-asset handoff or authorizes a best-effort local correction. |
| 40 | Pop boat video and visible transcript | Make the video larger and centered, remove the current sound and transcript, add music, and determine whether it should be edited off-site. | Implement only the clear layout portion: move the existing video to a large centered media row. Preserve the current MP4, forced-muted behavior, captions, description, and transcript until final approved media and music-use evidence are supplied. |
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

### M3 — Defer the historical Pop photograph change

- Preserve the keepsake/Polaroid presentation and exact visible caption: “Me & Pop. Long before I knew where this would lead.”
- Preserve the current image source, crop, frame, caption, and alternative text in this implementation.
- Do not crop, replace, perspective-correct, regenerate, reconstruct, or retouch the photograph until the handoff method is approved in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).
- A later approved implementation may use a clean client-supplied scan or an explicitly authorized best-effort local correction, but it is not part of the confirmed scope.

### M4 — Enlarge and center the existing Pop video without changing its media

- Move the video out of the constrained copy column and make it a centered media row within the Pop section, after the written reflection and before the chapter section.
- Target a desktop width of `min(100%, 56–60rem)` while retaining 16:9.
- Center the video and its visible caption as one media figure.
- Preserve native controls, visible keyboard focus, `playsInline`, and metadata-only preload.
- Do not autoplay or loop.
- Preserve the exact current MP4 source, poster, forced-muted behavior, caption track, visible description, and transcript.
- Retain “Our guy, Pop. Still happiest at the helm.” as the visible description.
- Do not add music, replace or remix audio, remove the transcript, or change caption content until the final approved media and music-use evidence are supplied under Comment 40 in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md).

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
- The historical Pop image remains unchanged while Comment 39 is deferred; its caption and subjects remain intact.
- The Pop video is visibly larger, horizontally centered, 16:9, and fully keyboard operable.
- The current MP4, muted behavior, captions, description, and visible transcript remain unchanged while Comment 40’s media decision is deferred.
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
- Altering the historical Pop photograph before Comment 39’s handoff method is approved.
- Replacing the Pop video, changing its audio, or removing its transcript before Comment 40 is resolved.
- Treating the pre-footer strip as a replacement for the true shared footer.
- Automatically removing the visible `04` in **From experience to purpose** without approval.

## Deferred clarification log

The authoritative blockers remain in the separate [ambiguity register](./CLIENT_FEEDBACK_AMBIGUITY_REGISTER.md):

1. **Comment 39:** clean client-supplied historical photo versus explicitly authorized best-effort local correction.
2. **Comment 40:** ownership of the final edit, the approved/licensed music, and the intended treatment of all original audio.

The remaining layout choices are implemented from the clear screenshot targets and shared approved systems: retain “Meet Mary Lynch,” retain the anchor without `02`, preserve the untargeted `04`, use the existing Orioles photo at its natural ratio, center the existing video as a full media row, level the two outside-work frames, and treat those two photos independently.

## Definition of done

The confirmed portion of this section is complete when Comments 37, 38, 41, 42 and Comment 40’s layout-only request are implemented; Comments 39 and 40’s unresolved media aspects remain unchanged; all targeted numbers are removed without leaving empty layouts; the confirmed photographs use non-destructive presentations; the existing video is centered and accessible; the final panel becomes a large-headline button-free strip; and all responsive, media, keyboard, and accessibility checks pass without regressions.

## Implementation and verification record

- Implemented the confirmed scope on August 31, 2026.
- Removed `01 /` from the hero caption and `02` from the career story while retaining the anchor-and-line ornament and the untargeted `04`.
- Rebuilt the career story as copy-left/photo-right on desktop and a logical copy-before-photo stack on tablet and mobile.
- Restored the Orioles and Chesapeake photographs to their natural portrait ratios and presented the travel photograph as a level 4:3 visual crop with no white source band or face loss.
- Moved the existing Pop video into a centered 16:9 media figure while preserving its exact source, poster, forced-muted behavior, caption track, description, and transcript.
- Replaced the tall final panel with the shared button-free closing strip while retaining every word and the shared-footer scheduling action.
- Left the historical Pop photograph unchanged under Comment 39 and left all unresolved Comment 40 media/audio decisions unchanged.
- Verified the established eight responsive viewports, the exact 800/801px caption breakpoint, the 1024px stacked story treatment, zero page overflow, natural media ratios, transcript disclosure behavior, mobile-menu Escape handling, complete image loading, deferred backgrounds, footer adjacency, and an error-free browser console.
