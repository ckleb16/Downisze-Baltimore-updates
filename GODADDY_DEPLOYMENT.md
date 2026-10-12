# GoDaddy deployment

This repository is prepared for GoDaddy Node.js Hosting. The default `npm run build` command creates the React client and the Express server in `dist`, and `npm start` runs the production application on GoDaddy's assigned `PORT`.

## Required private environment values

Never commit the real publisher values to GitHub. For the private GoDaddy preview, paste:

```env
SITE_URL=https://downsizebaltimore.com
SITE_INDEXABLE=false
BLOG_LOGIN_USERNAME=the-private-publisher-email
BLOG_LOGIN_PASSWORD_HASH=the-generated-scrypt-hash
```

When the site is connected to the live domain, use the same values except set `SITE_INDEXABLE=true`.

Generate the password hash locally without putting the password in a command or file:

```powershell
node scripts/hash-publisher-password.mjs
```

The script asks for password JSON on hidden standard input. Enter a JSON object in this form and press Enter:

```json
{"password":"a-long-unique-password"}
```

Copy only the value of `hash` into `BLOG_LOGIN_PASSWORD_HASH`. Store the original password in the owner's password manager.

## GoDaddy dashboard

1. Open GoDaddy Node.js Hosting and choose **Connect GitHub**.
2. Select `ckleb16/Downisze-Baltimore-updates` and branch `main`.
3. Paste the four preview environment values above. Use the generated hash, not a plain password.
4. Select **Import & Deploy**.
5. Review the private preview before publishing.
6. Attach the GoDaddy Web Hosting plan, choose **Publish Now**, and connect `downsizebaltimore.com`.
7. Add the four values to the published environment if GoDaddy did not copy them automatically, change `SITE_INDEXABLE` to `true`, then restart the published app.

## Persistent application data

On GoDaddy, article content, publisher sessions, revisions, recovery drafts, credentials, and uploaded article images are stored in `public/assets/.downsize-baltimore` relative to the project root. GoDaddy documents `public/assets` as persistent between deployments. Express serves the built website from `dist/public`, not the private data directory; only authorized or published article images are exposed through `/media/insights/:id`. Startup fails if the data directory is not writable instead of silently saving articles to temporary storage.

The first start automatically applies the SQLite migrations and installs the sample article. No manual database import is required.

Articles already created in a separate Cloudflare/Sites deployment are not automatically transferred. Export those posts and media before retiring the old deployment. Verify that a saved draft and uploaded image survive a GoDaddy restart and code redeployment, and maintain a backup of the persistent directory.

Hosting requirements: [GoDaddy Node.js app requirements](https://developer.godaddy.com/en/docs/api-users/hosting/app-requirements) and [GitHub deployment and persistent files](https://www.godaddy.com/en-uk/help/deploy-my-cursor-or-claude-app-with-godaddy-nodejs-hosting-42908).

## Verification

Local source integration tests cover sign-in, sessions, article editing, revisions, image upload, persistent data, recovery, Trash/restore, and password changes. Run with Node 22.15+:

```text
node --experimental-strip-types scripts/test-godaddy-source.mjs
```

After `npm ci --omit=dev` and `npm run build`, `node scripts/test-godaddy.mjs` tests the real production server, including video seeking, private image access, and restart persistence. The GitHub workflow repeats this production-only install, build, and test using Node 22 and the committed npm lockfile. The production build and all 30 server checks passed locally on Node 22.23.3 on October 12, 2026.

After deployment, check:

- `/`, every navigation page, and every downloadable guide
- `/media/pop-family-video.mp4` and the Meet Mary video player
- `/insights-advice` and the seeded article
- `/publisher` login, draft save, publish, image upload, password change, and logout
- `/robots.txt`, `/sitemap.xml`, a known deep-link refresh, and a true missing URL
- both `https://downsizebaltimore.com` and `https://www.downsizebaltimore.com`
