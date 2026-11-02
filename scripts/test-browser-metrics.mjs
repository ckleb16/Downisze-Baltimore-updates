import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

// A local Chrome smoke check, not a replacement for production Lighthouse or real-user data.
// Usage: node scripts/test-browser-metrics.mjs [absolute Chrome path]
const chromePath = process.argv[2] ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const probe = createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const temp = await mkdtemp(path.join(tmpdir(), 'downsize-browser-audit-'));
let server;
let chrome;
let socket;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(callback, label, attempts = 100) {
  for (let count = 0; count < attempts; count++) {
    const result = await callback().catch(() => null);
    if (result) return result;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

try {
  server = spawn(process.execPath, ['dist/index.js'], {
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), APP_DATA_DIR: path.join(temp, 'data'),
      SITE_URL: origin, SITE_INDEXABLE: 'true' }, stdio: 'ignore',
  });
  await until(async () => (await fetch(`${origin}/api/posts`)).ok, 'local application');
  chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${path.join(temp, 'chrome')}`, 'about:blank'], { stdio: 'ignore' });
  const devtoolsPort = Number((await until(async () => (await readFile(path.join(temp, 'chrome', 'DevToolsActivePort'), 'utf8')).split('\n')[0], 'Chrome debugger')));
  const tabs = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json`)).json();
  const page = tabs.find(tab => tab.type === 'page');
  if (!page) throw new Error('Chrome did not open a page');
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (!message.id) return;
    const callback = pending.get(message.id);
    pending.delete(message.id);
    callback?.(message);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, message => message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result));
    socket.send(JSON.stringify({ id: key, method, params }));
  });
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 });
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__audit = { shifts: [], lcp: null };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput)
      window.__audit.shifts.push({value: entry.value, sources: entry.sources?.map(source => source.node?.className || source.node?.tagName)}); })
      .observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__audit.lcp = entry.startTime; })
      .observe({type:'largest-contentful-paint',buffered:true});
  ` });

  for (const route of ['/', '/resource-center', '/insights-advice/where-do-i-start-with-downsizing']) {
    await send('Network.clearBrowserCache');
    await send('Page.navigate', { url: origin + route });
    await until(async () => await evaluate(`document.readyState === 'complete' && !!document.querySelector('#main-content') && !document.querySelector('.route-loading') && !document.querySelector('[aria-busy="true"]')`), `${route} settled`, 200);
    await sleep(1000);
    const result = await evaluate(`(() => ({
      title: document.title,
      heading: document.querySelector('h1')?.textContent?.trim(),
      shift: window.__audit.shifts.reduce((sum, item) => sum + item.value, 0),
      shifts: window.__audit.shifts,
      lcp: window.__audit.lcp,
      contrastColor: document.querySelector('.resource-closing h2 i') ?
        getComputedStyle(document.querySelector('.resource-closing h2 i')).color : null,
      carouselSlideTag: document.querySelector('.questions-carousel__slide')?.tagName ?? null,
      footerTop: document.querySelector('.site-footer-v2')?.getBoundingClientRect().top ?? null,
    }))()`);
    console.log(JSON.stringify({ route, ...result }));
  }
} finally {
  socket?.close();
  chrome?.kill();
  server?.kill();
  await sleep(300);
  if (path.basename(temp).startsWith('downsize-browser-audit-') && path.dirname(temp) === tmpdir())
    await rm(temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
