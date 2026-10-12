import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync } from 'node:crypto';

// Allows this dependency-free test to exercise source imports on Node 22.15+.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && context.parentURL) {
    const candidate = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
  }
  return nextResolve(specifier, context);
} });
const { openApplicationDatabase } = await import('../server/sqliteD1.ts');
const { handleGodaddyApi } = await import('../server/godaddyApi.ts');
const data = mkdtempSync(path.join(tmpdir(), 'downsize-source-test-'));
const salt = randomBytes(16), password = randomBytes(24).toString('hex');
const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 });
const env = { DB: openApplicationDatabase(data), mediaDirectory: path.join(data, 'media'),
  BLOG_LOGIN_USERNAME: 'test@example.test', BLOG_LOGIN_PASSWORD_HASH: `scrypt$16384$8$5$${salt.toString('hex')}$${key.toString('hex')}` };
const origin = 'https://test.example';
let cookie = '', count = 0;
const call = (url, options) => handleGodaddyApi(new Request(origin + url, options), env);
const equal = (actual, expected, label) => { assert.equal(actual, expected, label); count++; };
const write = (body, method = 'POST') => ({ method, headers: { Origin: origin, 'X-Downsize-Publisher': '1', 'Content-Type': 'application/json', Cookie: cookie }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
equal((await call('/api/admin/session')).status, 401, 'Anonymous session');
equal((await call('/api/admin/login', { ...write({}), headers: { Origin: 'https://other.test' } })).status, 403, 'Cross-origin login');
const login = await call('/api/admin/login', write({ username: env.BLOG_LOGIN_USERNAME, password }));
equal(login.status, 200, 'Sign in with real SQLite adapter');
cookie = login.headers.get('set-cookie').split(';')[0];
equal((await call('/api/admin/session', { headers: { Cookie: cookie } })).status, 200, 'Session');
const input = { title: 'Test article', slug: 'test-article', excerpt: 'Test summary', body: 'Test content', status: 'draft', publishedAt: null };
const created = await call('/api/admin/posts', write(input));
equal(created.status, 201, 'Create');
let post = (await created.json()).post;
equal((await call('/api/posts/test-article')).status, 404, 'Draft is private');
const published = await call('/api/admin/posts/' + post.id, write({ ...input, status: 'published', publishedAt: new Date().toISOString(), version: post.version }, 'PUT'));
equal(published.status, 200, 'Publish');
post = (await published.json()).post;
equal((await call('/api/posts/test-article')).status, 200, 'Public article');
equal((await call('/api/admin/posts/' + post.id, write({ ...input, version: 1 }, 'PUT'))).status, 409, 'Stale version blocked');
const revisions = await call('/api/admin/posts/' + post.id + '/revisions', { headers: { Cookie: cookie } });
equal((await revisions.json()).revisions.length, 1, 'Revision preserved');
const uploadBody = new FormData();
uploadBody.set('image', new File([new Uint8Array([137,80,78,71,13,10,26,10,0])], 'test.png', { type: 'image/png' }));
const uploaded = await call('/api/admin/images', { method: 'POST', headers: { Origin: origin, 'X-Downsize-Publisher': '1', Cookie: cookie }, body: uploadBody });
equal(uploaded.status, 201, 'Image upload');
const imageUrl = (await uploaded.json()).url;
assert(existsSync(path.join(data, 'media', imageUrl.split('/').at(-1)))); count++;
env.DB = openApplicationDatabase(data);
equal((await call('/api/posts/test-article')).status, 200, 'Database persists and migrations repeat safely');
const device = crypto.randomUUID();
equal((await call('/api/admin/recovery/' + device, write({ snapshot: { form: { body: 'unfinished' } }, writtenAt: Date.now() }, 'PUT'))).status, 200, 'Recovery save');
equal((await (await call('/api/admin/recovery/' + device, { headers: { Cookie: cookie } })).json()).recovery.form.body, 'unfinished', 'Recovery load');
equal((await call('/api/admin/posts/' + post.id, write(undefined, 'DELETE'))).status, 200, 'Trash');
equal((await call('/api/posts/test-article')).status, 404, 'Trash private');
equal((await call('/api/admin/posts/' + post.id + '/restore', write())).status, 200, 'Restore');
equal((await call('/api/posts/test-article')).status, 404, 'Restore remains draft');
equal((await call('/api/admin/password', write({ currentPassword: password, newPassword: password + '-new' }))).status, 200, 'Password change');
equal((await call('/api/admin/session', { headers: { Cookie: cookie } })).status, 401, 'Password change revokes session');
equal((await call('/api/admin/login', write({ username: env.BLOG_LOGIN_USERNAME, password: password + '-new' }))).status, 200, 'New password works');
console.log(`GoDaddy source integration checks passed: ${count}`);
