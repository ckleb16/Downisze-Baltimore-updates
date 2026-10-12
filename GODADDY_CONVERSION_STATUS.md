# GoDaddy conversion status — October 12, 2026

The source is converted for GoDaddy Node.js Hosting. The default build produces a React site and Express server, including the article publisher, image uploads, SQLite persistence, article metadata, sitemap, and video streaming. All earlier local website improvements are included in this repository update.

## Verified locally

Verified on Node 22.23.3 with npm 10.9.9:

- Production-only dependency installation and full production build passed.
- 30 running production-server checks: public pages, HTTP publisher login/session, uploads, draft/publish, private images, article metadata, sitemap, video seeking, private database access, restart persistence, Trash, and logout.
- 22 source integration checks: real SQLite adapter, migrations, login/session, draft/publish, conflicting edits, revision history, uploads, reopening persistent data, recovery, Trash/restore, and password changes.
- 72 existing publisher security checks.
- 71 existing QA regression checks.
- 10 client API response checks.
- Changed server/config syntax checks and Git whitespace checks.

These are 205 distinct passing checks. The existing security/QA suites exercise the preserved Cloudflare worker; the new source and production checks exercise the GoDaddy implementation. `package-lock.json` records the npm dependency versions used for the successful build.

## Still required

1. Import or pull the latest main branch from `ckleb16/Downisze-Baltimore-updates` in GoDaddy.
2. Enter real publisher credentials in GoDaddy, deploy the preview, and check restart/redeployment persistence before launch.
3. Connect the production domain and enable indexing only for the live site.

This repository update does not itself publish the website on GoDaddy. Content stored in a separate Cloudflare/Sites database needs a separate export and import before retiring that deployment.

## Repeat the production verification

Open a terminal in this project folder:

```powershell
npm ci --omit=dev
npm run build
node scripts/test-godaddy.mjs
```

The GitHub production workflow runs these checks on Node 22 after updates to main. No real credentials or private database files are committed. Follow `GODADDY_DEPLOYMENT.md` for the environment values and preview checks.
