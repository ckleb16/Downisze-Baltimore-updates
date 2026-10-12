import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Test the real production server with disposable credentials and storage.
const dataDirectory = await mkdtemp(path.join(tmpdir(), 'downsize-godaddy-'));
const origin = 'http://127.0.0.1:3187';
const password = randomBytes(24).toString('hex');
const salt = randomBytes(16);
const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 });
const environment = { ...process.env, PORT: '3187', NODE_ENV: 'production', SITE_URL: origin,
  SITE_INDEXABLE: 'false', APP_DATA_DIR: dataDirectory, BLOG_LOGIN_USERNAME: 'test@example.test',
  BLOG_LOGIN_PASSWORD_HASH: `scrypt$16384$8$5$${salt.toString('hex')}$${key.toString('hex')}` };
let server;
let cookie = '';
let checks = 0;
const equal = (actual, expected, label) => { assert.equal(actual, expected, label); checks++; };
const request = (url, options) => fetch(origin + url, options);
const mutation = (body, method = 'POST') => ({ method, headers: { 'Content-Type': 'application/json',
  Origin: origin, 'X-Downsize-Publisher': '1', Cookie: cookie }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
async function start() {
  server = spawn(process.execPath, ['dist/index.js'], { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  server.stdout.on('data', chunk => { logs += chunk; });
  server.stderr.on('data', chunk => { logs += chunk; });
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Server stopped: ${logs}`);
    try { if ((await request('/api/posts')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start: ${logs}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const stopped = new Promise(resolve => server.once('exit', resolve));
  server.kill();
  await stopped;
}
try {
  await start();
  for (const route of ['/', '/downsizing-services', '/aging-in-place', '/buying-selling', '/resource-center', '/meet-mary', '/contact', '/publisher', '/insights-advice']) {
    equal((await request(route)).status, 200, `Page ${route}`);
  }
  equal((await request('/does-not-exist')).status, 404, 'Missing page');
  equal((await request('/api/admin/session')).status, 401, 'Anonymous session');
  assert((await (await request('/robots.txt')).text()).includes('Disallow: /'));
  const login = await request('/api/admin/login', mutation({ username: environment.BLOG_LOGIN_USERNAME, password }));
  equal(login.status, 200, 'Sign in');
  cookie = login.headers.get('set-cookie').split(';')[0];
  equal((await request('/api/admin/session', { headers: { Cookie: cookie } })).status, 200, 'Session');
  const image = new FormData();
  image.set('image', new File([await readFile('client/public/media-thumbnails/pbs-empowering-seniors.jpg')], 'test.jpg', { type: 'image/jpeg' }));
  const upload = await request('/api/admin/images', { method: 'POST', headers: { Origin: origin, 'X-Downsize-Publisher': '1', Cookie: cookie }, body: image });
  equal(upload.status, 201, 'Upload');
  const imageUrl = (await upload.json()).url;
  equal((await request(imageUrl)).status, 404, 'Unpublished image private');
  equal((await request(imageUrl, { headers: { Cookie: cookie } })).status, 200, 'Image preview');
  const input = { title: 'Production smoke test', slug: 'production-smoke-test', excerpt: 'Disposable test article.', body: `![Test image](${imageUrl})`, status: 'draft', publishedAt: null };
  const created = await request('/api/admin/posts', mutation(input));
  equal(created.status, 201, 'Save draft');
  let post = (await created.json()).post;
  equal((await request('/api/posts/' + post.slug)).status, 404, 'Draft private');
  const publish = await request('/api/admin/posts/' + post.id, mutation({ ...input, status: 'published', version: post.version, publishedAt: new Date(Date.now() - 1000).toISOString() }, 'PUT'));
  equal(publish.status, 200, 'Publish');
  post = (await publish.json()).post;
  equal((await request(imageUrl)).status, 200, 'Published image public');
  assert((await (await request('/insights-advice/' + post.slug)).text()).includes('Production smoke test | Downsize Baltimore'));
  assert((await (await request('/sitemap.xml')).text()).includes(post.slug));
  const video = await request('/media/pop-family-video.mp4', { headers: { Range: 'bytes=0-1023' } });
  equal(video.status, 206, 'Video seeking');
  equal((await video.arrayBuffer()).byteLength, 1024, 'Video range length');
  equal((await request('/assets/.downsize-baltimore/content.sqlite')).status, 404, 'Database is private');
  await stop(); await start();
  equal((await request('/api/posts/' + post.slug)).status, 200, 'Article persists after restart');
  equal((await request(imageUrl)).status, 200, 'Upload persists after restart');
  equal((await request('/api/admin/session', { headers: { Cookie: cookie } })).status, 200, 'Session persists after restart');
  equal((await request('/api/admin/posts/' + post.id, mutation(undefined, 'DELETE'))).status, 200, 'Trash article');
  equal((await request('/api/posts/' + post.slug)).status, 404, 'Trashed article private');
  equal((await request(imageUrl)).status, 404, 'Trashed article image private');
  equal((await request('/api/admin/logout', mutation())).status, 200, 'Sign out');
  console.log(`GoDaddy production checks passed: ${checks}`);
} finally { await stop(); }
