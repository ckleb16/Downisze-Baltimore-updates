# Asset Manifest

## Included folders

| Folder | Contents | Use |
|---|---|---|
| `assets/webdev-static-assets/` | Curated source images, video, brand marks, textures, and crop scripts used during site production | Use these when migrating the live `/manus-storage/...` asset URLs to another host or storage provider. |
| `attachments/original-uploads/` | Original user-supplied photographs, logos, video, PDFs, screenshots, and text briefs | Preserve as source material. Select only approved assets for public use. |

## Live-site asset references

The current deployed application references public managed assets through `/manus-storage/...` paths. The source files in `assets/webdev-static-assets/` preserve the editable originals but are not automatically served by a standard React host. An incoming developer should upload the needed files to the new host or storage provider and replace the corresponding component URLs.

## Important handling notes

Personal photographs are authentic client-supplied images. Do not apply AI face enhancement or identity-altering edits. The phone-gallery screenshots were cropped only to remove interface chrome before use. The Pop boating video is included as original source material and has an approved short web version referenced in the live site.

The `attachments/original-uploads/` folder may include working briefs, design reference screenshots, and source files that are not intended for public display. Treat it as project history, not as an automatically published public-assets folder.
