# GitHub Upload Guide

This package is a source-only export of the Downsize Baltimore website. It includes the React application, configuration, server source, project documentation, the original user uploads, and the working media source files used to publish persistent `/manus-storage/...` assets.

## Upload to GitHub

Create a new empty repository on GitHub. Extract the ZIP locally, open a terminal in the extracted `downsize-baltimore` folder, and run:

```bash
git init
git add .
git commit -m "Initial Downsize Baltimore website export"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

Do not upload `node_modules`, `dist`, `.manus`, `.manus-logs`, or local environment files. They are intentionally excluded from the package.

## Install and run

Use Node.js 22 or later and pnpm:

```bash
pnpm install
pnpm run dev
```

Run `pnpm run check` for TypeScript validation and `pnpm run build` for the production build.

## Asset handling

The live Manus site references images and video through persistent `/manus-storage/...` URLs. The matching original source files are included in `assets/webdev-static-assets/`, and the user-supplied attachments are preserved in `attachments/original-uploads/` for the incoming developer. If the site moves to another host, upload the intended source files to the new provider and replace the `/manus-storage/...` URLs in the relevant page components.

See `DEVELOPER_HANDOFF.md` for routes, current functionality, known intentional empty states, and implementation notes.
