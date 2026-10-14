import assert from 'node:assert/strict';
import { canonicalRedirect } from '../server/canonicalRedirect.ts';

// Pure source tests: no server, credentials, data files, or external requests.
// Run with Node 22: node --experimental-strip-types scripts/test-canonical-redirects.mjs
const origin = 'https://downsizebaltimore.com';
const base = {
  method: 'GET', host: 'www.downsizebaltimore.com', protocol: 'https',
  originalUrl: '/', canonicalPath: '/', siteOrigin: origin, enabled: true,
};
let checks = 0;
function check(overrides, expected, label) {
  assert.equal(canonicalRedirect({ ...base, ...overrides }), expected, label);
  checks++;
}

for (const method of ['GET', 'HEAD']) {
  for (const protocol of ['http', 'https']) {
    for (const host of ['www.downsizebaltimore.com', 'www.downsizebaltimore.com:80', 'www.downsizebaltimore.com:443']) {
      check({ method, protocol, host }, `${origin}/`, `${method} ${protocol} ${host} normalizes`);
      check({ method, protocol, host, originalUrl: '/Buying-Selling/?utm_source=old%20site&x=1&x=2', canonicalPath: '/buying-selling' },
        `${origin}/buying-selling?utm_source=old%20site&x=1&x=2`, `${method} combines host and path in one hop`);
    }
  }
  check({ method, host: 'downsizebaltimore.com', protocol: 'http' }, `${origin}/`, `${method} upgrades HTTP`);
  check({ method, host: 'downsizebaltimore.com' }, null, `${method} canonical root has no loop`);
  check({ method, host: 'downsizebaltimore.com', originalUrl: '/contact?source=old', canonicalPath: '/contact' }, null, `${method} canonical query URL has no loop`);
  check({ method, originalUrl: '/INDEX.HTML?campaign=a', canonicalPath: '/' }, `${origin}/?campaign=a`, `${method} index.html normalizes in one hop`);
  check({ method, originalUrl: '/insights-advice/old-name?source=x', canonicalPath: '/insights-advice/new-name' }, `${origin}/insights-advice/new-name?source=x`, `${method} resolved article alias normalizes`);
  for (const pathname of ['/robots.txt', '/sitemap.xml']) {
    check({ method, originalUrl: pathname, canonicalPath: pathname }, `${origin}${pathname}`, `${method} ${pathname} normalizes host`);
  }
}

for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE']) {
  check({ method, originalUrl: '/CONTACT/', canonicalPath: '/contact' }, null, `${method} must not redirect`);
}
for (const host of [undefined, '', '127.0.0.1:3189', 'localhost:3189', 'preview.example.test', 'attacker.example', 'www.downsizebaltimore.com.attacker.example', 'downsizebaltimore.com:444', 'www.downsizebaltimore.com:444', 'downsizebaltimore.com@attacker.example']) {
  check({ host }, null, `Unrecognized host ${host} has no host redirect`);
  check({ host, originalUrl: '/CONTACT/?source=old', canonicalPath: '/contact' }, '/contact?source=old', `Unrecognized host ${host} retains a relative alias only`);
}
for (const disabled of [{ enabled: false }, { siteOrigin: 'https://preview.example.test' }, { siteOrigin: 'http://downsizebaltimore.com' }, { siteOrigin: 'https://www.downsizebaltimore.com' }]) {
  check(disabled, null, `Disabled canonical origin ${JSON.stringify(disabled)}`);
  check({ ...disabled, originalUrl: '/CONTACT/?source=old', canonicalPath: '/contact' }, '/contact?source=old', 'Disabled host normalization retains relative aliases');
}
for (const protocol of ['', 'ftp', 'javascript', 'https,http', 'HTTPS']) {
  check({ protocol }, null, `Unrecognized protocol ${protocol} cannot generate absolute redirect`);
}
for (const canonicalPath of [null, '', '//attacker.example', '/\\attacker.example', '/contact?next=bad', '/contact#bad', '/contact\r\nLocation: bad', '/contact\u0000', '/a/%2f/b', '/a/%2F/b', '/a/%5c/b', '/a/%5C/b', '/a/%252f/b', '/a/../contact', '/./contact', 'https://attacker.example', 'contact']) {
  check({ originalUrl: '/old', canonicalPath }, null, `Invalid canonical path ${JSON.stringify(canonicalPath)} is rejected`);
}
for (const pathname of ['/publisher', '/api/posts', '/api/admin/session', '/media/insights/00000000-0000-0000-0000-000000000000']) {
  check({ originalUrl: pathname, canonicalPath: pathname }, null, `Private resource ${pathname} stays on its host`);
}
for (const pathname of ['/media/pop-family-video.mp4', '/assets/index-test.js', '/manus-storage/image.webp']) {
  // The route resolver deliberately does not classify static files as page routes.
  check({ originalUrl: pathname, canonicalPath: null }, null, `Static resource ${pathname} stays on its host`);
}
check({ originalUrl: '/PUBLISHER/?source=old', canonicalPath: '/publisher' }, '/publisher?source=old', 'Publisher alias is relative even on www');
check({ host: 'downsizebaltimore.com', originalUrl: '/BUYING-SELLING/?x=%2F%26&next=https%3A%2F%2Fexample.test', canonicalPath: '/buying-selling' },
  '/buying-selling?x=%2F%26&next=https%3A%2F%2Fexample.test', 'Already canonical host preserves query bytes in a relative path correction');

console.log(`Canonical redirect source checks passed: ${checks}`);
