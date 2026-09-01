import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = 5178;
const OUT = path.join(ROOT, 'public/assets/den');

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const vite = spawn(npx, ['vite', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});

const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('vite timeout')), 40000);
  const onData = (buf) => {
    const text = buf.toString();
    process.stdout.write(text);
    if (text.includes('Local') || text.includes(String(PORT))) {
      clearTimeout(timer);
      resolve();
    }
  };
  vite.stdout.on('data', onData);
  vite.stderr.on('data', onData);
  vite.on('error', reject);
});

await ready;
await new Promise((r) => setTimeout(r, 600));

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
});

const page = await browser.newPage();
page.on('console', (msg) => console.log('BROWSER:', msg.text()));
page.on('pageerror', (err) => console.log('PAGEERR:', err.message));
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/?bake=1`, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__done === true', { timeout: 90000 });
const err = await page.evaluate(() => window.__error || null);
if (err) throw new Error(err);
const bake = await page.evaluate(() => window.__bake);
if (!bake?.color || !bake?.depth) throw new Error('bake empty');

await mkdir(OUT, { recursive: true });
const strip = (data) => Buffer.from(data.split(',')[1], 'base64');
await writeFile(path.join(OUT, 'den-color-raw.png'), strip(bake.color));
await writeFile(path.join(OUT, 'den-depth-raw.png'), strip(bake.depth));
await writeFile(path.join(OUT, 'den-spots.json'), JSON.stringify({ w: bake.w, h: bake.h, spots: bake.spots }, null, 2));
await browser.close();
vite.kill('SIGTERM');
console.log('saved', OUT, bake.w, 'x', bake.h, Object.keys(bake.spots));
setTimeout(() => process.exit(0), 400);
