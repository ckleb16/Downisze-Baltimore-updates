import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const home = await readFile('client/src/pages/Home.tsx', 'utf8');
const css = await readFile('client/src/index.css', 'utf8');
let checks = 0;
const slide = home.match(/<(\w+)\s+className="questions-carousel__slide"[\s\S]*?role="group"[\s\S]*?aria-roledescription="slide"[\s\S]*?<\/\1>/);
assert.ok(slide, 'Carousel slides use a permitted group container'); checks++;
assert.equal(slide[1], 'div', 'Article elements must not be given role=group'); checks++;

const color = css.match(/\.resource-closing \.site-closing-strip__heading>h2 i\s*\{\s*color:\s*(#[0-9a-f]{6})/i)?.[1];
assert.ok(color, 'Resource Center closing heading has a scoped text color'); checks++;
const channel = value => {
  const normal = value / 255;
  return normal <= 0.04045 ? normal / 12.92 : ((normal + 0.055) / 1.055) ** 2.4;
};
const luminance = hex => {
  const [red, green, blue] = [1, 3, 5].map(index => channel(parseInt(hex.slice(index, index + 2), 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const foreground = luminance(color);
const background = luminance('#f0e9dd');
const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
assert.ok(contrast >= 4.5, `Resource Center heading contrast is ${contrast.toFixed(2)}:1`); checks++;

assert.match(css, /\.route-loading\s*\{[^}]*min-height:\s*100svh/s,
  'Route fallback keeps the footer below the first viewport'); checks++;
assert.match(css, /\.insight-article-shell\[aria-busy="true"\]\s*\{\s*min-height:\s*100svh\s*\}/,
  'Article loading state keeps the footer below the first viewport'); checks++;

console.log(`Audit fix checks passed: ${checks}; Resource Center text contrast ${contrast.toFixed(2)}:1`);
