import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer, request as httpRequest } from 'node:http';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Tests only source contracts and the real built server on loopback. It does not
// measure browser image selection/reuse, visual parity, LCP, CLS, or font loading.
// Run after building: node --experimental-strip-types scripts/test-performance-resources.mjs
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && context.parentURL && !path.extname(specifier)) {
    const candidate = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
  }
  return nextResolve(specifier, context);
} });
const { ROUTE_HERO_MEDIA } = await import('../client/src/lib/routeMedia.ts');
const { RESPONSIVE_MEDIA, responsiveImageAttributes } = await import('../client/src/lib/responsiveMedia.ts');
const { renderRouteHeroPreload } = await import('../server/resourceHints.ts');
const fontManifest = JSON.parse(await readFile('client/public/fonts/provenance.json', 'utf8'));
const expectedRoutes = {
  '/': { page: 'Home', src: '/manus-storage/AugustwebsiteHOMEphoto_6750abaf.png', sizes: '100vw' },
  '/downsizing-services': { page: 'Downsizing', src: '/manus-storage/downsizing-hero_718d6bc8.jpeg', sizes: '100vw' },
  '/aging-in-place': { page: 'AgingInPlace', src: '/manus-storage/aging-in-place-hero_627154ed.jpg', sizes: '(max-width: 900px) 100vw, 46vw', media: '(min-width: 901px)' },
  '/buying-selling': { page: 'BuyingSelling', src: '/manus-storage/mary-lynch-buying-selling-hero_41a29217.jpg', sizes: '(max-width: 1180px) 100vw, 54vw', media: '(min-width: 1181px)' },
  '/resource-center': { page: 'ResourceCenter', src: '/manus-storage/mary-lynch-resource-center_4f151291.jpg', sizes: '(max-width: 1180px) 100vw, 50vw', media: '(min-width: 1181px)' },
  '/meet-mary': { page: 'MeetMary', src: '/manus-storage/mary-lynch-meet-mary-hero_8902efd8.jpg', sizes: '(max-width: 1180px) 100vw, 50vw', media: '(min-width: 1181px)' },
  '/contact': { page: 'Contact', src: '/manus-storage/mary-lynch-contact-chair_dd829984.jpg', sizes: '(max-width: 1180px) 100vw, 50vw', media: '(min-width: 1181px)' },
};
let checks = 0;
const equal = (actual, expected, label) => { assert.equal(actual, expected, label); checks++; };
const deepEqual = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, 'gi'))].map(match => ({
    offset: match.index,
    attributes: Object.fromEntries([...match[1].matchAll(/([a-z:-]+)\s*=\s*(["'])(.*?)\2/gi)]
      .map(attribute => [attribute[1].toLowerCase(), attribute[3]])),
  }));
}
function imagePreloads(html) {
  return tags(html, 'link').filter(tag => tag.attributes.rel?.split(/\s+/).includes('preload') && tag.attributes.as === 'image');
}
function validateFontLinks(document, context) {
  const head = document.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  equal(typeof head, 'string', `${context}: font delivery is declared in document head`);
  const links = tags(head, 'link');
  const fontStylesheets = links.filter(tag => tag.attributes.rel?.split(/\s+/).includes('stylesheet') && tag.attributes.href?.startsWith('/fonts/'));
  equal(fontStylesheets.length, 1, `${context}: exactly one local font stylesheet`);
  equal(fontStylesheets[0].attributes.href, fontManifest.stylesheet.path, `${context}: current fingerprinted font stylesheet`);
  equal(/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(document), false, `${context}: no external Google font dependency`);
  equal(links.filter(tag => tag.attributes.rel?.split(/\s+/).includes('preload') && tag.attributes.as === 'font').length, 0,
    `${context}: no additional font preloads`);
}
function validateImmutableCache(headers, context) {
  const directives = (headers['cache-control'] ?? '').toLowerCase().split(',').map(value => value.trim());
  equal(directives.includes('public'), true, `${context}: public cache`);
  equal(directives.includes('max-age=31536000'), true, `${context}: one-year cache lifetime`);
  equal(directives.includes('immutable'), true, `${context}: immutable content fingerprint`);
}
function validatePreload(html, route, context) {
  const expected = expectedRoutes[route];
  const preloads = imagePreloads(html);
  equal(preloads.length, 1, `${context}: exactly one image preload`);
  const actual = preloads[0].attributes;
  const shared = responsiveImageAttributes(expected.src, expected.sizes);
  equal(actual.imagesrcset, shared.srcSet, `${context}: same responsive candidates as img`);
  equal(actual.imagesizes, expected.sizes, `${context}: same responsive sizes as img`);
  equal(actual.type, 'image/webp', `${context}: correct preload MIME`);
  equal(actual.fetchpriority, 'high', `${context}: high-priority preload`);
  equal(actual.href, undefined, `${context}: no desktop fallback href to double-download`);
  equal(actual.crossorigin, undefined, `${context}: same-origin request mode matches existing img`);
  equal(actual.media, expected.media, `${context}: exact desktop-only gate where needed`);
}
function webpDimensions(bytes) {
  equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', 'WebP RIFF signature');
  equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', 'WebP format signature');
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const length = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert(data + length <= bytes.length, 'WebP chunk is not truncated'); checks++;
    if (type === 'VP8X') return { width: bytes.readUIntLE(data + 4, 3) + 1, height: bytes.readUIntLE(data + 7, 3) + 1 };
    if (type === 'VP8 ') {
      equal(bytes.subarray(data + 3, data + 6).toString('hex'), '9d012a', 'VP8 frame signature');
      return { width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff };
    }
    if (type === 'VP8L') {
      equal(bytes[data], 0x2f, 'VP8L signature');
      const dimensions = bytes.readUInt32LE(data + 1);
      return { width: (dimensions & 0x3fff) + 1, height: ((dimensions >>> 14) & 0x3fff) + 1 };
    }
    offset = data + length + (length % 2);
  }
  throw new Error('No supported WebP dimensions found');
}

deepEqual(Object.keys(ROUTE_HERO_MEDIA).sort(), Object.keys(expectedRoutes).sort(), 'Only the seven existing priority hero routes are mapped');
const componentSource = await readFile('client/src/components/ResponsiveImage.tsx', 'utf8');
equal(/responsiveImageAttributes\s*\(/.test(componentSource), true, 'ResponsiveImage uses the shared candidate builder');
equal(/loading=\{priority\s*\?\s*["']eager["']\s*:\s*["']lazy["']\}/.test(componentSource), true, 'Priority and below-fold loading behavior is retained');
equal(/fetchPriority=\{priority\s*\?\s*["']high["']\s*:\s*undefined\}/.test(componentSource), true, 'Priority img remains high priority');
for (const [route, expected] of Object.entries(expectedRoutes)) {
  equal(ROUTE_HERO_MEDIA[route].src, expected.src, `${route}: approved asset identity retained`);
  equal(ROUTE_HERO_MEDIA[route].sizes, expected.sizes, `${route}: approved sizes retained`);
  const metadata = RESPONSIVE_MEDIA[expected.src];
  const attributes = responsiveImageAttributes(expected.src, expected.sizes);
  const candidates = metadata.variants.map(width => ({ url: expected.src.replace(/\.(?:png|jpe?g)$/i, `-${width}w.webp`), width }));
  deepEqual(attributes, { src: candidates.at(-1).url, srcSet: candidates.map(candidate => `${candidate.url} ${candidate.width}w`).join(', '),
    sizes: expected.sizes, width: metadata.width, height: metadata.height }, `${route}: shared attributes preserve the original img contract`);
  validatePreload(renderRouteHeroPreload(route), route, `${route} source hint`);
  const pageSource = await readFile(`client/src/pages/${expected.page}.tsx`, 'utf8');
  equal(pageSource.includes('ROUTE_HERO_MEDIA'), true, `${route}: client page consumes shared hero map`);
  equal(pageSource.includes(`ROUTE_HERO_MEDIA["${route}"]`) || pageSource.includes(`ROUTE_HERO_MEDIA['${route}']`), true, `${route}: client references its own map entry`);
  equal(pageSource.includes(expected.src), false, `${route}: no duplicate client hero source literal to drift`);
  const binding = [...pageSource.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*ROUTE_HERO_MEDIA\[(['"])([^'"]+)\2\]/g)]
    .find(match => match[3] === route)?.[1];
  equal(typeof binding, 'string', `${route}: page binds its own hero map entry`);
  const priorityImages = [...pageSource.matchAll(/<ResponsiveImage\b([\s\S]*?)\/>/g)]
    .filter(match => /\bpriority(?:\s|=|$)/.test(match[1]));
  equal(priorityImages.length, 1, `${route}: exactly one priority ResponsiveImage`);
  const escapedBinding = binding.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  equal(new RegExp(`\\bsrc\\s*=\\s*\\{\\s*${escapedBinding}\\.src\\s*\\}`).test(priorityImages[0][1]), true,
    `${route}: priority img source consumes the shared entry`);
  equal(new RegExp(`\\bsizes\\s*=\\s*\\{\\s*${escapedBinding}\\.sizes\\s*\\}`).test(priorityImages[0][1]), true,
    `${route}: priority img sizes consume the shared entry`);
}
const negativePaths = ['/insights-advice', '/insights-advice/where-do-i-start-with-downsizing', '/publisher',
  '/what-do-i-do-with-all-this-stuff', '/should-i-stay-or-should-i-go', '/could-an-adu-work-for-your-family',
  '/404', '/not-a-real-page', '/api/posts', '/media/pop-family-video.mp4', '/robots.txt', '/sitemap.xml'];
for (const route of [...negativePaths, null, undefined, '__proto__', 'constructor']) {
  equal(imagePreloads(renderRouteHeroPreload(route)).length, 0, `${String(route)}: no unrelated fallback hero preload`);
}

const reservation = createServer();
await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
const port = reservation.address().port;
await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
const origin = `http://127.0.0.1:${port}`;
const dataDirectory = await mkdtemp(path.join(tmpdir(), 'downsize-performance-resources-'));
const environment = { ...process.env, NODE_ENV: 'production', PORT: String(port), SITE_URL: origin,
  SITE_INDEXABLE: 'false', APP_DATA_DIR: dataDirectory, BLOG_LOGIN_USERNAME: '', BLOG_LOGIN_PASSWORD_HASH: '' };
let server;
function request(url, { method = 'GET' } = {}) {
  return new Promise((resolve, reject) => {
    const req = httpRequest({ hostname: '127.0.0.1', port, path: url, method }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, bytes: Buffer.concat(chunks) }));
      response.on('error', reject);
    });
    req.setTimeout(8000, () => req.destroy(new Error('Loopback request timed out')));
    req.on('error', reject);
    req.end();
  });
}
async function start() {
  server = spawn(process.execPath, ['dist/index.js'], { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
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

try {
  await start();
  const robots = await request('/robots.txt');
  equal(robots.bytes.toString('utf8').includes('Disallow: /'), true, 'Disposable preview is not crawlable');
  const fontAssets = [
    { ...fontManifest.stylesheet, mime: 'text/css' },
    ...fontManifest.files.map(file => ({ ...file, mime: 'font/woff2' })),
    ...fontManifest.licenses.map(file => ({ ...file, mime: 'text/plain' })),
  ];
  for (const asset of fontAssets) {
    const resource = await request(asset.path);
    equal(resource.status, 200, `${asset.path}: bundled font resource is served`);
    equal(resource.headers.location, undefined, `${asset.path}: font resource needs no redirect`);
    equal(resource.headers['content-type']?.split(';')[0].toLowerCase(), asset.mime, `${asset.path}: correct font resource MIME`);
    equal(resource.bytes.equals(await readFile(path.join('client/public', asset.path))), true, `${asset.path}: served bytes match vendored source`);
    validateImmutableCache(resource.headers, asset.path);
  }
  const validatedCandidates = new Set();
  for (const [route, expected] of Object.entries(expectedRoutes)) {
    for (const suffix of ['', '?utm_source=resource-test']) {
      const response = await request(`${route}${suffix}`);
      equal(response.status, 200, `${route}${suffix}: initial HTML succeeds`);
      const document = response.bytes.toString('utf8');
      validateFontLinks(document, `${route}${suffix}`);
      const head = document.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
      equal(typeof head, 'string', `${route}: server emits document head`);
      validatePreload(head, route, `${route}${suffix} initial HTML`);
      const viewport = tags(head, 'meta').find(tag => tag.attributes.name === 'viewport');
      assert(viewport && viewport.offset < imagePreloads(head)[0].offset, `${route}: viewport precedes responsive preload`); checks++;
      equal(tags(head, 'meta').find(tag => tag.attributes.name === 'robots')?.attributes.content, 'noindex,nofollow', `${route}: preview remains noindex`);
      const body = document.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
      equal(imagePreloads(body).length, 0, `${route}: no duplicate preload in body`);
    }
    const metadata = RESPONSIVE_MEDIA[expected.src];
    for (const width of metadata.variants) {
      const url = expected.src.replace(/\.(?:png|jpe?g)$/i, `-${width}w.webp`);
      if (validatedCandidates.has(url)) continue;
      validatedCandidates.add(url);
      const resource = await request(url);
      equal(resource.status, 200, `${url}: responsive candidate packaged and served`);
      equal(resource.headers.location, undefined, `${url}: candidate needs no redirect`);
      equal(resource.headers['content-type']?.split(';')[0], 'image/webp', `${url}: correct served MIME`);
      const dimensions = webpDimensions(resource.bytes);
      equal(dimensions.width, width, `${url}: intrinsic width matches srcset descriptor`);
      equal(dimensions.height, Math.round(metadata.height * width / metadata.width), `${url}: intrinsic height preserves approved source aspect ratio`);
      equal(resource.bytes.equals(await readFile(path.join('client/public', url))), true, `${url}: served bytes match approved local asset`);
      validateImmutableCache(resource.headers, url);
    }
  }
  for (const route of negativePaths) {
    const response = await request(route, route.endsWith('.mp4') ? { method: 'HEAD' } : {});
    equal(imagePreloads(response.bytes.toString('utf8')).length, 0, `${route}: server never adds another page's hero hint`);
    if (response.headers['content-type']?.startsWith('text/html')) validateFontLinks(response.bytes.toString('utf8'), route);
  }
  console.log(`Performance resource checks passed: ${checks}; ${validatedCandidates.size} responsive candidates verified`);
  console.log('Limits: browser preload reuse/selection, screenshots, accessibility, LCP/CLS and cross-browser measurements are separate release checks.');
} finally {
  await stop();
}
