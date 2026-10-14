import { readFile } from 'node:fs/promises';

// Read-only, bounded audit of known URLs. Never submit forms or authenticated data.
// Run explicitly: node scripts/audit-migration.mjs --live
if (process.argv.length !== 3 || process.argv[2] !== '--live') {
  console.error('Usage: node scripts/audit-migration.mjs --live (read-only public GET/HEAD checks)');
  process.exit(1);
}
const inventory = JSON.parse(await readFile(new URL('../docs/seo-performance/implementation/legacy-url-inventory.json', import.meta.url), 'utf8'));
const hosts = ['downsizebaltimore.com', 'www.downsizebaltimore.com', 'movewithmarylynch.com', 'www.movewithmarylynch.com'];
const urls = new Set(inventory.entries.map(entry => new URL(entry.path, inventory.legacyOrigin).href));
for (const host of hosts) {
  for (const protocol of ['http:', 'https:']) urls.add(`${protocol}//${host}/`);
  urls.add(`https://${host}/?utm_source=migration-audit`);
}
for (const host of hosts.slice(0, 2)) {
  for (const pathname of ['/Buying-Selling/?utm_source=migration-audit', '/does-not-exist-migration-audit', '/robots.txt', '/sitemap.xml']) {
    urls.add(`https://${host}${pathname}`);
  }
}
const tasks = [...urls].flatMap(url => ['GET', 'HEAD'].map(method => ({ url, method })));
const results = new Array(tasks.length);
let nextIndex = 0;
async function trace({ url, method }) {
  const visited = new Set();
  const hops = [];
  let current = url;
  for (let i = 0; i < 6; i++) {
    const parsed = new URL(current);
    if (!hosts.includes(parsed.hostname) || !['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.port) {
      return { url, method, hops, stopped: 'Destination outside allowed public origins' };
    }
    if (visited.has(current)) return { url, method, hops, stopped: 'Redirect loop' };
    visited.add(current);
    try {
      const response = await fetch(current, { method, redirect: 'manual', signal: AbortSignal.timeout(10000) });
      const location = response.headers.get('location');
      hops.push({ url: current, status: response.status, location });
      await response.body?.cancel();
      if (![301, 302, 303, 307, 308].includes(response.status) || !location) return { url, method, hops };
      current = new URL(location, current).href;
    } catch (error) {
      return { url, method, hops, stopped: error.message, cause: error.cause?.code ?? error.cause?.message };
    }
  }
  return { url, method, hops, stopped: 'Redirect limit reached' };
}
await Promise.all(Array.from({ length: 4 }, async () => {
  while (nextIndex < tasks.length) {
    const index = nextIndex++;
    results[index] = await trace(tasks[index]);
  }
}));
console.log(JSON.stringify({ observedAt: new Date().toISOString(), mode: 'read-only; no deployment', requests: tasks.length, results }, null, 2));
if (results.some(result => result.stopped)) process.exitCode = 1;
