import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Requires the current production build. All writes go to a new disposable DB.
// node --experimental-strip-types scripts/test-technical-seo.mjs
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && context.parentURL) {
    const candidate = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
  }
  return nextResolve(specifier, context);
} });
const { PAGE_ROUTES, NOT_FOUND_METADATA } = await import('../client/src/lib/siteRoutes.ts');
const probe = createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const storage = await mkdtemp(path.join(tmpdir(), 'downsize-seo-'));
const password = randomBytes(24).toString('hex');
const salt = randomBytes(16);
const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 });
const environment = { ...process.env, NODE_ENV: 'production', PORT: String(port), APP_DATA_DIR: storage,
  SITE_URL: origin, SITE_INDEXABLE: 'true', BLOG_LOGIN_USERNAME: 'seo-test@example.test',
  BLOG_LOGIN_PASSWORD_HASH: `scrypt$16384$8$5$${salt.toString('hex')}$${key.toString('hex')}` };
let server, cookie = '', checks = 0;
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const request = (url, options) => fetch(origin + url, { redirect: 'manual', ...options });
const write = (body, method = 'POST') => ({ method, headers: { Origin: origin, 'Content-Type': 'application/json',
  'X-Downsize-Publisher': '1', Cookie: cookie }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
async function start() {
  server = spawn(process.execPath, ['dist/index.js'], { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  server.stdout.on('data', chunk => { logs += chunk; });
  server.stderr.on('data', chunk => { logs += chunk; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Isolated SEO server stopped: ${logs}`);
    try { if ((await request('/api/posts')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Isolated SEO server did not start.');
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const stopped = new Promise(resolve => server.once('exit', resolve));
  server.kill();
  await stopped;
}
function decode(value) {
  return value.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>').replaceAll('&amp;', '&');
}
function inspect(html) {
  const head = html.split('</head>')[0];
  const tags = [...head.matchAll(/<meta\s+(name|property)="([^"]+)"\s+content="([^"]*)"\s*\/?>/g)]
    .map(([, attribute, key, value]) => ({ attribute, key, value: decode(value) }));
  const canonicals = [...head.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/g)].map(match => decode(match[1]));
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map(match => decode(match[1]));
  const contexts = [...head.matchAll(/<script id="site-metadata-context" type="application\/json">([\s\S]*?)<\/script>/g)];
  equal(titles.length, 1, 'One title');
  equal(contexts.length, 1, 'One explicit public context');
  equal(new Set(tags.map(tag => `${tag.attribute}:${tag.key}`)).size, tags.length, 'No duplicate head tags');
  equal(head.includes('ckleb16.chatgpt.site'), false, 'No old preview origin in production response');
  const context = JSON.parse(contexts[0][1]);
  equal(Object.keys(context).sort(), ['siteOrigin', 'requestOrigin', 'indexable', 'initialPath', 'initialResolvedPath', 'initialArticle'].sort(), 'Only public context fields serialized');
  return { head, title: titles[0], canonical: canonicals, context,
    meta: key => tags.find(tag => tag.key === key)?.value ?? null };
}
async function page(url, status = 200) {
  const response = await request(url);
  equal(response.status, status, `HTTP ${url}`);
  return inspect(await response.text());
}
async function unavailable(slug) {
  const result = await page(`/insights-advice/${slug}`, 404);
  equal(result.title, NOT_FOUND_METADATA.title, 'Missing/draft article has existing not-found title');
  equal(result.meta('robots'), 'noindex,nofollow', 'Missing/draft article noindex');
  equal(result.canonical, [], 'Missing/draft article has no false canonical');
  equal(result.meta('article:published_time'), null, 'Missing/draft article has no stale date');
  equal(result.context.initialArticle, null, 'Private/missing article absent from public context');
}
async function sitemap() {
  const response = await request('/sitemap.xml');
  equal(response.status, 200, 'Sitemap available');
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
  equal(urls.length, new Set(urls).size, 'Sitemap has no duplicates');
  equal(urls.some(url => url.includes('?') || url.includes('/publisher')), false, 'Sitemap excludes query/private routes');
  return { xml, urls };
}
try {
  await start();
  for (const route of PAGE_ROUTES) {
    const result = await page(route.path);
    equal(result.title, route.title, `${route.path}: exact existing title`);
    equal(result.meta('description'), route.description, `${route.path}: exact existing description`);
    equal(result.meta('og:title'), route.title, `${route.path}: social title matches`);
    equal(result.meta('twitter:description'), route.description, `${route.path}: Twitter description matches`);
    equal(result.canonical, [origin + route.path], `${route.path}: correct canonical`);
    equal(result.meta('robots'), route.indexable === false ? 'noindex,nofollow' : 'index,follow', `${route.path}: indexability`);
    equal(result.meta('article:published_time'), null, `${route.path}: no stale article date`);
    equal(result.context.indexable, true, 'Site-level context remains true on private pages');
    equal(result.context.initialResolvedPath, route.path, 'Resolved server route recorded');
  }
  const missing = await page('/technical-seo-missing', 404);
  equal(missing.canonical, [], 'Unknown URL is not canonicalized to Home');
  equal(missing.meta('robots'), 'noindex,nofollow', 'Unknown URL noindex');
  await unavailable('technical-seo-missing');
  const query = await page('/contact?topic=downsizers-club');
  equal(query.canonical, [origin + '/contact'], 'Query does not leak into canonical');
  equal((await request('/downsize-baltimore-social-share.jpg')).status, 200, 'Existing social image resolves');
  equal((await request('/api/posts')).headers.get('x-robots-tag'), 'noindex', 'Public API crawlable but not indexable');
  equal((await request('/api/admin/session')).status, 401, 'Anonymous publisher API remains protected');
  const robots = await (await request('/robots.txt')).text();
  for (const rule of ['Disallow: /api/', 'Disallow: /publisher', 'Allow: /api/posts$', 'Allow: /api/posts?', 'Allow: /api/posts/']) equal(robots.includes(rule + '\n'), true, `Required robots rule ${rule}`);
  const initialMap = await sitemap();
  for (const route of PAGE_ROUTES.filter(route => route.indexable !== false)) equal(initialMap.urls.includes(origin + route.path), true, `${route.path}: sitemap coverage`);
  for (const url of initialMap.urls) equal((await request(new URL(url).pathname)).status, 200, `Sitemap destination ${new URL(url).pathname}`);

  const login = await request('/api/admin/login', write({ username: environment.BLOG_LOGIN_USERNAME, password }));
  equal(login.status, 200, 'Disposable publisher login');
  cookie = login.headers.get('set-cookie').split(';')[0];
  const title = 'Mary’s "tips" & <script> $&';
  const excerpt = 'Literal </script><script>alert(1)</script> and \u2028 \u2029.';
  let input = { title, excerpt, slug: 'seo-fixture-old', body: 'Disposable test article. Never published to the live site.', status: 'draft', publishedAt: null };
  const created = await request('/api/admin/posts', write(input));
  equal(created.status, 201, 'Create isolated draft');
  let post = (await created.json()).post;
  await unavailable(input.slug);
  equal((await sitemap()).urls.includes(origin + '/insights-advice/' + input.slug), false, 'Draft excluded from sitemap');
  async function update(changes) {
    input = { ...input, ...changes };
    const response = await request('/api/admin/posts/' + post.id, write({ ...input, version: post.version }, 'PUT'));
    equal(response.status, 200, 'Update disposable article');
    post = (await response.json()).post;
  }
  await update({ status: 'published', publishedAt: new Date(Date.now() + 86400000).toISOString() });
  await unavailable(input.slug);
  equal((await sitemap()).urls.includes(origin + '/insights-advice/' + input.slug), false, 'Future article excluded');
  await update({ publishedAt: new Date(Date.now() - 86400000).toISOString() });
  const published = await page('/insights-advice/' + input.slug);
  equal(published.title, title + ' | Downsize Baltimore', 'Editable title escapes without changing words');
  equal(published.meta('description'), excerpt, 'Editable excerpt escapes without changing words');
  equal(published.meta('og:type'), 'article', 'Published article type');
  equal(published.meta('article:published_time'), input.publishedAt, 'Actual publication time');
  equal(published.context.initialArticle, { slug: input.slug, title, excerpt, publishedAt: input.publishedAt }, 'Public bootstrap has metadata only, no article body/author email');
  equal(published.head.includes('</script><script>alert(1)</script>'), false, 'Editable text cannot escape its script');
  equal((await sitemap()).xml.includes(`<lastmod>${post.updatedAt}</lastmod>`), true, 'Sitemap uses actual saved modification date');
  equal((await request('/insights-advice/' + input.slug, { method: 'HEAD' })).status, 200, 'Article HEAD succeeds');
  await update({ slug: 'seo-fixture-current' });
  const alias = await request('/insights-advice/seo-fixture-old');
  equal(alias.status, 308, 'Old article address redirects');
  equal(alias.headers.get('location'), '/insights-advice/seo-fixture-current', 'Alias resolves to current article');
  const renamedMap = await sitemap();
  equal(renamedMap.urls.includes(origin + '/insights-advice/seo-fixture-old'), false, 'Alias excluded from sitemap');
  equal(renamedMap.urls.includes(origin + '/insights-advice/seo-fixture-current'), true, 'Current published address included');
  await update({ status: 'draft', publishedAt: null });
  await unavailable(input.slug);
  equal((await sitemap()).urls.includes(origin + '/insights-advice/' + input.slug), false, 'Unpublish reflected in sitemap');
  await update({ status: 'published', publishedAt: new Date(Date.now() - 86400000).toISOString() });
  equal((await request('/api/admin/posts/' + post.id, write(undefined, 'DELETE'))).status, 200, 'Trash isolated article');
  await unavailable(input.slug);
  equal((await sitemap()).urls.includes(origin + '/insights-advice/' + input.slug), false, 'Trash reflected in sitemap');

  await stop();
  environment.SITE_INDEXABLE = 'false';
  environment.SITE_URL = 'https://downsizebaltimore.com';
  await start();
  equal(await (await request('/robots.txt')).text(), 'User-agent: *\nDisallow: /\n', 'Preview robots has no allow exceptions');
  for (const pathname of ['/', '/contact', '/publisher', '/insights-advice/where-do-i-start-with-downsizing']) {
    const result = await page(pathname);
    equal(result.meta('robots'), 'noindex,nofollow', `${pathname}: preview noindex`);
    equal(result.context.indexable, false, 'Preview context is explicit');
    equal(result.context.siteOrigin, 'https://downsizebaltimore.com', 'Configured origin independent of request origin');
    equal(result.context.requestOrigin, origin, 'Preview request origin preserved');
    equal(result.canonical, [origin + pathname], 'Preview canonical does not falsely identify live content');
  }
  console.log(`Technical SEO production checks passed: ${checks}`);
} finally { await stop(); }
