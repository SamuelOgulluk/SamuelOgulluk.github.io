import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import path from 'path';

const ROOT = '/workspace';
const PORT = 8791;
const OUT = '/tmp/guitar-raw.png';

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const file = path.join(ROOT, url === '/' ? '/public/render-guitar.html' : url.replace(/^\//, ''));
    const data = await readFile(file);
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('missing');
  }
});

await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/local/bin/google-chrome',
});
const page = await browser.newPage();
page.on('console', (msg) => console.log('BROWSER:', msg.text()));
page.on('pageerror', (err) => console.log('PAGEERR:', err.message));
await page.setViewport({ width: 960, height: 1200, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/public/render-guitar.html`, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('window.__done === true', { timeout: 60000 });
const err = await page.evaluate(() => window.__error || null);
if (err) throw new Error(err);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: OUT, omitBackground: false });
await browser.close();
server.close();
console.log('saved', OUT);
