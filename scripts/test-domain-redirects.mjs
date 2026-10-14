import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { createServer, request as httpRequest } from 'node:http';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Exercise the real built server using only loopback TCP connections. Custom Host
// headers model production; redirects are inspected, never followed externally.
const reservation = createServer();
await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
const port = reservation.address().port;
await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
const localOrigin = `http://127.0.0.1:${port}`;
const canonicalOrigin = 'https://downsizebaltimore.com';
const dataDirectory = await mkdtemp(path.join(tmpdir(), 'downsize-domain-redirects-'));
const username = 'redirect-test@example.test';
const password = randomBytes(24).toString('hex');
const salt = randomBytes(16);
const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 });
const env = { ...process.env, PORT: String(port), NODE_ENV: 'production', SITE_URL: canonicalOrigin,
  SITE_INDEXABLE: 'true', APP_DATA_DIR: dataDirectory, BLOG_LOGIN_USERNAME: username,
  BLOG_LOGIN_PASSWORD_HASH: `scrypt$16384$8$5$${salt.toString('hex')}$${key.toString('hex')}` };
let server;
let cookie = '';
let checks = 0;
const equal = (actual, expected, label) => { assert.equal(actual, expected, label); checks++; };
function request(url, { method = 'GET', host = `127.0.0.1:${port}`, protocol = 'http', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = httpRequest({ hostname: '127.0.0.1', port, path: url, method,
      headers: { Host: host, 'X-Forwarded-Proto': protocol, ...headers } }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString('utf8') }));
      response.on('error', reject);
    });
    req.setTimeout(8000, () => req.destroy(new Error('Loopback request timed out')));
    req.on('error', reject);
    req.end(body);
  });
}
const write = (body, method = 'POST') => ({ method, headers: { Origin: localOrigin, Cookie: cookie,
  'X-Downsize-Publisher': '1', 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
async function start(overrides = {}) {
  server = spawn(process.execPath, ['dist/index.js'], { env: { ...env, ...overrides }, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  let launchError;
  server.on('error', error => { launchError = error; });
  server.stdout.on('data', chunk => { logs += chunk; });
  server.stderr.on('data', chunk => { logs += chunk; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (launchError) throw launchError;
    if (server.exitCode !== null) throw new Error(`Server stopped: ${logs}`);
    try { if ((await request('/api/posts')).status === 200) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start: ${logs}`);
}
async function stop() {
  if (!server || !server.pid || server.exitCode !== null) return;
  const stopped = new Promise(resolve => server.once('exit', resolve));
  server.kill();
  await stopped;
}
async function redirects(url, options, destination) {
  const result = await request(url, options);
  equal(result.status, 308, `Permanent redirect: ${options.method ?? 'GET'} ${options.host} ${url}`);
  equal(result.headers.location, destination, `Destination: ${url}`);
  if (options.method === 'HEAD') equal(result.body, '', 'HEAD redirect has no body');
  const next = new URL(destination, `${options.protocol}://${options.host}`);
  const final = await request(`${next.pathname}${next.search}`, { method: options.method, host: next.host, protocol: next.protocol.slice(0, -1) });
  equal(final.status, 200, `One-hop target succeeds: ${url}`);
  equal(final.headers.location, undefined, `One-hop target does not redirect again: ${url}`);
}

try {
  await start();
  const login = await request('/api/admin/login', write({ username, password }));
  equal(login.status, 200, 'Disposable local publisher login');
  cookie = login.headers['set-cookie'][0].split(';')[0];
  const draft = { title: 'Redirect fixture', slug: 'redirect-fixture-old', excerpt: 'Disposable local test only.',
    body: 'A disposable article.', status: 'published', publishedAt: new Date(Date.now() - 1000).toISOString() };
  const created = await request('/api/admin/posts', write(draft));
  equal(created.status, 201, 'Create isolated published article');
  let post = JSON.parse(created.body).post;
  const renamed = await request(`/api/admin/posts/${post.id}`, write({ ...draft, slug: 'redirect-fixture-new', version: post.version }, 'PUT'));
  equal(renamed.status, 200, 'Rename isolated article');
  post = JSON.parse(renamed.body).post;

  // MIG-07: verify the complete server-emitted public inventory, including guide
  // pages and published articles. A tracking query must not enter head metadata.
  const publicRequest = { host: 'downsizebaltimore.com', protocol: 'https' };
  const sitemap = await request('/sitemap.xml', publicRequest);
  equal(sitemap.status, 200, 'Canonical sitemap succeeds');
  equal(sitemap.headers.location, undefined, 'Canonical sitemap has no redirect');
  const locations = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  equal(new Set(locations).size, locations.length, 'Sitemap URLs are unique');
  const fixedPaths = ['/', '/downsizing-services', '/aging-in-place', '/buying-selling', '/resource-center',
    '/meet-mary', '/contact', '/insights-advice', '/what-do-i-do-with-all-this-stuff',
    '/should-i-stay-or-should-i-go', '/could-an-adu-work-for-your-family'];
  for (const pathname of [...fixedPaths, '/insights-advice/redirect-fixture-new']) {
    equal(locations.includes(`${canonicalOrigin}${pathname}`), true, `Sitemap includes ${pathname}`);
  }
  equal(locations.includes(`${canonicalOrigin}/insights-advice/redirect-fixture-old`), false, 'Sitemap omits renamed article alias');
  equal(locations.includes(`${canonicalOrigin}/publisher`), false, 'Sitemap omits private publisher');
  for (const location of locations) {
    equal(location.startsWith(`${canonicalOrigin}/`), true, `Sitemap uses canonical HTTPS origin: ${location}`);
    const pageUrl = new URL(location);
    equal(pageUrl.search, '', 'Sitemap excludes tracking queries');
    equal(pageUrl.hash, '', 'Sitemap excludes fragments');
    for (const query of ['', '?utm_source=redirect-test&source=old%20site']) {
      const page = await request(`${pageUrl.pathname}${query}`, publicRequest);
      equal(page.status, 200, `Sitemap destination succeeds: ${pageUrl.pathname}${query}`);
      equal(page.headers.location, undefined, 'Sitemap destination does not redirect');
      const head = page.body.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
      equal(typeof head, 'string', 'Server emits a document head');
      const tags = [...head.matchAll(/<(link|meta)\b([^>]*)>/gi)].map(match => ({
        name: match[1].toLowerCase(),
        attributes: Object.fromEntries([...match[2].matchAll(/([a-z:-]+)\s*=\s*(["'])(.*?)\2/gi)]
          .map(attribute => [attribute[1].toLowerCase(), attribute[3]])),
      }));
      const canonicalLinks = tags.filter(tag => tag.name === 'link' && tag.attributes.rel?.split(/\s+/).includes('canonical'));
      equal(canonicalLinks.length, 1, 'Exactly one canonical link');
      equal(canonicalLinks[0].attributes.href, location, 'Canonical matches sitemap without tracking query');
      const openGraphUrls = tags.filter(tag => tag.name === 'meta' && tag.attributes.property === 'og:url');
      equal(openGraphUrls.length, 1, 'Exactly one Open Graph URL');
      equal(openGraphUrls[0].attributes.content, location, 'Open Graph URL matches sitemap without tracking query');
      const robots = tags.filter(tag => tag.name === 'meta' && tag.attributes.name === 'robots');
      equal(robots.length, 1, 'Exactly one robots directive');
      equal(robots[0].attributes.content, 'index,follow', 'Public sitemap page is indexable');
      equal(/chatgpt\.site/i.test(head), false, 'Production head contains no previous preview-host metadata');
    }
  }

  for (const method of ['GET', 'HEAD']) {
    for (const protocol of ['http', 'https']) {
      for (const [url, target] of [['/', '/'], ['/INDEX.HTML?utm_source=old', '/?utm_source=old'], ['/Buying-Selling/?source=old%20site&x=1&x=2', '/buying-selling?source=old%20site&x=1&x=2'], ['/insights-advice/redirect-fixture-old?campaign=x', '/insights-advice/redirect-fixture-new?campaign=x'], ['/insights-advice/REDIRECT-FIXTURE-OLD/?campaign=x', '/insights-advice/redirect-fixture-new?campaign=x'], ['/robots.txt', '/robots.txt'], ['/sitemap.xml', '/sitemap.xml']]) {
        await redirects(url, { method, host: 'www.downsizebaltimore.com', protocol }, `${canonicalOrigin}${target}`);
      }
    }
    await redirects('/contact?next=%2Fresource-center', { method, host: 'downsizebaltimore.com', protocol: 'http' }, `${canonicalOrigin}/contact?next=%2Fresource-center`);
    await redirects('/insights-advice/redirect-fixture-old', { method, host: 'downsizebaltimore.com', protocol: 'https' }, '/insights-advice/redirect-fixture-new');
    for (const url of ['/', '/contact', '/insights-advice/redirect-fixture-new']) {
      const current = await request(url, { method, host: 'downsizebaltimore.com', protocol: 'https' });
      equal(current.status, 200, `Canonical URL remains ${method} 200: ${url}`);
      equal(current.headers.location, undefined, 'No canonical redirect loop');
    }
    for (const host of ['www.downsizebaltimore.com:80', 'www.downsizebaltimore.com:443']) {
      await redirects('/', { method, host, protocol: 'https' }, `${canonicalOrigin}/`);
    }
  }

  for (const host of [`127.0.0.1:${port}`, 'localhost:3189', 'preview.example.test', 'unrelated.example.test']) {
    const result = await request('/', { host, protocol: 'https', headers: { 'X-Forwarded-Host': 'www.downsizebaltimore.com' } });
    equal(result.status, 200, `Preview/local/unknown host stays reachable: ${host}`);
    equal(result.headers.location, undefined, 'Forged forwarded host does not enable redirection');
    await redirects('/CONTACT/?source=preview', { host, protocol: 'https' }, '/contact?source=preview');
    await redirects('/insights-advice/redirect-fixture-old', { host, protocol: 'https' }, '/insights-advice/redirect-fixture-new');
  }
  await redirects('/', { host: 'www.downsizebaltimore.com', protocol: 'https', headers: { 'X-Forwarded-Host': 'attacker.example' } }, `${canonicalOrigin}/`);

  for (const method of ['GET', 'HEAD']) {
    for (const [url, status] of [['/publisher', 200], ['/api/admin/session', 401], ['/api/posts', 200], ['/media/insights/00000000-0000-0000-0000-000000000000', 404], ['/assets/not-a-real-file.js', 404], ['/favicon.svg', 200], ['/not-a-real-page', 404], ['/insights-advice/not-a-real-post', 404], ['/insights-advice/NOT-A-REAL-POST/', 404]]) {
      const result = await request(url, { method, host: 'www.downsizebaltimore.com', protocol: 'http' });
      equal(result.status, status, `${method} private/static/missing path retains state: ${url}`);
      equal(result.headers.location, undefined, `${url} never redirects cross-host`);
    }
    await redirects('/PUBLISHER/?source=old', { method, host: 'www.downsizebaltimore.com', protocol: 'https' }, '/publisher?source=old');
  }
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    const result = await request('/CONTACT/', { method, host: 'www.downsizebaltimore.com', protocol: 'http' });
    equal(result.headers.location, undefined, `${method} public mutation is never redirected`);
    assert(result.status < 300 || result.status >= 400, `${method} is not a redirect`); checks++;
  }
  const privateMutation = await request('/api/admin/posts', { ...write({}), host: 'www.downsizebaltimore.com', protocol: 'https', headers: { Origin: 'https://www.downsizebaltimore.com', 'Content-Type': 'application/json', 'X-Downsize-Publisher': '1' } });
  equal(privateMutation.headers.location, undefined, 'Unauthorized publisher mutation is not redirected');
  equal(privateMutation.status, 401, 'Unauthorized publisher mutation stays protected');

  const unpublished = await request(`/api/admin/posts/${post.id}`, write(undefined, 'DELETE'));
  equal(unpublished.status, 200, 'Unpublish disposable article');
  for (const slug of ['redirect-fixture-old', 'redirect-fixture-new']) {
    const missing = await request(`/insights-advice/${slug}`, { host: 'www.downsizebaltimore.com', protocol: 'http' });
    equal(missing.status, 404, 'Unpublished article and alias return 404 before host redirects');
    equal(missing.headers.location, undefined, 'Unpublished article alias does not leak a redirect');
  }

  for (const settings of [{ SITE_INDEXABLE: 'false' }, { SITE_URL: 'https://preview.example.test' }, { NODE_ENV: 'development' }]) {
    await stop();
    await start(settings);
    const untouched = await request('/', { host: 'www.downsizebaltimore.com', protocol: 'http' });
    equal(untouched.status, 200, `Disabled canonical-host mode remains accessible: ${JSON.stringify(settings)}`);
    equal(untouched.headers.location, undefined, 'Disabled mode does not leave the current host');
    await redirects('/CONTACT/?source=preview', { host: 'www.downsizebaltimore.com', protocol: 'https' }, '/contact?source=preview');
  }
  await stop();
  await start({ SITE_INDEXABLE: undefined });
  await redirects('/', { host: 'www.downsizebaltimore.com', protocol: 'https' }, `${canonicalOrigin}/`);
  console.log(`Domain redirect production checks passed: ${checks}`);
} finally {
  await stop();
}
