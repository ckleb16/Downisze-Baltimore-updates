import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Pure metadata/serialization checks; no database, browser, or network.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && context.parentURL) {
    const candidate = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
  }
  return nextResolve(specifier, context);
} });
const { PAGE_ROUTES, NOT_FOUND_METADATA } = await import('../client/src/lib/siteRoutes.ts');
const { resolvePageMetadata, resolveNavigationMetadata, initialMetadataInput, metadataFields, publicRobots, SOCIAL_IMAGE_ALT } = await import('../client/src/lib/siteMetadata.ts');
const { renderPageMetadata, serializeMetadataContext } = await import('../server/pageMetadata.ts');
const template = readFileSync(new URL('../client/index.html', import.meta.url), 'utf8');
const origin = 'https://downsizebaltimore.com';
const context = { siteOrigin: origin, requestOrigin: origin, indexable: true,
  initialPath: '/', initialResolvedPath: '/', initialArticle: null };
let checks = 0;
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };

for (const route of PAGE_ROUTES) {
  const result = resolvePageMetadata(context, { path: route.path });
  equal(result.title, route.title, `${route.path}: approved title unchanged`);
  equal(result.description, route.description, `${route.path}: approved description unchanged`);
  equal(result.canonical, origin + route.path, `${route.path}: canonical`);
  equal(result.robots, route.indexable === false ? 'noindex,nofollow' : 'index,follow', `${route.path}: robots`);
  equal(result.ogType, 'website', `${route.path}: no stale article type`);
  equal(result.publishedAt, null, `${route.path}: no stale publication date`);
  const fields = metadataFields(result);
  equal(new Set(fields.map(f => `${f.attribute}:${f.key}`)).size, fields.length, 'Unique field definitions');
  equal(fields.find(f => f.key === 'og:image:alt').value, SOCIAL_IMAGE_ALT, 'Approved social alt unchanged');
}

const post = { slug: 'first-post', title: 'First article', excerpt: 'Approved article summary.', publishedAt: '2026-01-01T12:00:00.000Z' };
const articlePath = '/insights-advice/first-post';
const articleContext = { ...context, initialPath: articlePath, initialResolvedPath: articlePath, initialArticle: post };
const ready = resolvePageMetadata(context, { path: articlePath, articleState: 'ready', article: post });
equal(ready.title, 'First article | Downsize Baltimore', 'Published article title');
equal(ready.description, post.excerpt, 'Published article excerpt');
equal(ready.robots, 'index,follow', 'Published article indexability');
equal(ready.publishedAt, post.publishedAt, 'Published article actual date');
equal(resolveNavigationMetadata(articleContext, { path: articlePath, articleState: 'loading' }, true), ready,
  'Direct published head remains intact while first fetch loads');
equal(resolvePageMetadata(articleContext, initialMetadataInput(articleContext)), ready, 'Server and client initial models agree');

for (const state of ['loading', 'missing', 'error']) {
  const result = resolveNavigationMetadata(articleContext, { path: articlePath, articleState: state, article: post }, false);
  equal(result.canonical, null, `${state}: no stale canonical even with old post attached`);
  equal(result.publishedAt, null, `${state}: no stale date`);
  equal(result.ogType, 'website', `${state}: not a falsely published article`);
  equal(result.robots, 'noindex,nofollow', `${state}: no indexing unresolved content`);
  if (state === 'missing') equal(result.title, NOT_FOUND_METADATA.title, 'Missing article uses existing not-found metadata');
}
const second = { ...post, slug: 'second-post', title: 'Second article', publishedAt: '2026-02-01T12:00:00.000Z' };
const sequence = [
  { path: '/', expected: origin + '/' },
  { path: '/downsizing-services', expected: origin + '/downsizing-services' },
  { path: articlePath, articleState: 'ready', article: post, expected: origin + articlePath },
  { path: '/insights-advice/second-post', articleState: 'loading', expected: null },
  { path: '/insights-advice/second-post', articleState: 'ready', article: second, expected: origin + '/insights-advice/second-post' },
  { path: '/missing', expected: null },
  { path: '/publisher', expected: origin + '/publisher' },
  { path: articlePath, articleState: 'loading', expected: null },
  { path: articlePath, articleState: 'ready', article: post, expected: origin + articlePath },
];
for (const step of sequence) equal(resolveNavigationMetadata(articleContext, step, false).canonical, step.expected, `Synthetic navigation ${step.path}/${step.articleState}`);
equal(resolvePageMetadata(context, { path: '/contact?campaign=qa#contact-club-form' }).canonical, origin + '/contact', 'Query/fragment excluded from canonical');
equal(resolvePageMetadata(context, { path: '/insights-advice/former-slug', articleState: 'ready', article: post }).canonical, origin + articlePath, 'Article alias uses returned canonical slug');

const preview = { ...context, indexable: false, requestOrigin: 'https://preview.example.test' };
for (const route of PAGE_ROUTES) {
  const result = resolvePageMetadata(preview, { path: route.path });
  equal(result.robots, 'noindex,nofollow', `${route.path}: preview stays private from indexing`);
  equal(result.canonical, preview.requestOrigin + route.path, `${route.path}: preview origin`);
}
equal(resolvePageMetadata({ ...context, initialPath: '/publisher', initialResolvedPath: '/publisher' }, { path: '/contact' }).robots,
  'index,follow', 'Site context, not initial private page robots, controls public transitions');

const hostile = { ...post, title: 'Mary’s "tips" & <script> $&', excerpt: 'Literal </script><script>alert(1)</script> and \u2028 \u2029 $` $\'' };
const hostileContext = { ...articleContext, initialArticle: hostile };
const json = serializeMetadataContext(hostileContext);
equal(/[<>&\u2028\u2029]/.test(json), false, 'Embedded JSON cannot terminate its script');
equal(JSON.parse(json), hostileContext, 'Safe JSON preserves exact words');
const rendered = renderPageMetadata(template, hostileContext);
equal(rendered.includes('content="Mary’s &quot;tips&quot; &amp; &lt;script&gt; $&amp; | Downsize Baltimore"'), true, 'HTML escaping preserves dollar substitution characters');
equal(rendered.includes('</script><script>alert(1)</script>'), false, 'Article content cannot inject a script');
equal((rendered.match(/id="site-metadata-context"/g) ?? []).length, 1, 'One public context');
equal(rendered.includes('ckleb16.chatgpt.site'), false, 'No old preview URLs after template replacement');
equal(rendered.split('<body>')[1], template.split('<body>')[1], 'Head transformation leaves visible root/body bytes unchanged');

const rules = publicRobots(true, origin);
function allowed(path) {
  const matches = rules.split('\n').map(line => line.match(/^(Allow|Disallow): (.+)$/)).filter(Boolean)
    .map(([, kind, rule]) => ({ kind, rule, regex: new RegExp('^' + rule.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')) }))
    .filter(entry => entry.regex.test(path)).sort((a, b) => b.rule.length - a.rule.length || (a.kind === 'Allow' ? -1 : 1));
  return matches[0]?.kind !== 'Disallow';
}
for (const path of ['/api/posts', '/api/posts?limit=20', '/api/posts?limit=20&cursor=abc', '/api/posts/first-post', '/api/posts/first-post?source=test']) equal(allowed(path), true, `${path}: required public fetch permitted`);
for (const path of ['/api/admin/session', '/api/admin/posts', '/api/admin/login', '/api/posts-admin', '/api/posts.json', '/publisher', '/publisher?next=home']) equal(allowed(path), false, `${path}: no broad API/private exception`);
equal(publicRobots(false, origin), 'User-agent: *\nDisallow: /\n', 'Preview has no public exceptions');
console.log(`Page metadata source checks passed: ${checks}`);
