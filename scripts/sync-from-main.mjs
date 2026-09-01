// Copie le contenu portfolio partagé depuis main vers la branche pixel-den.
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const REMOTE = 'https://raw.githubusercontent.com/SamuelOgulluk/SamuelOgulluk.github.io/main';

const SHARED = [
  'constants.ts',
  'src/components/Contact.tsx',
  'src/components/Education.tsx',
  'src/components/Experience.tsx',
  'src/components/Home.tsx',
  'src/components/Projects.tsx',
  'src/components/Skills.tsx',
  'src/components/YoutubeDownloader.tsx',
  'src/components/PdfTools.tsx',
  'src/components/UtilityGate.tsx',
  'public/cv.pdf',
];

const mergeConstants = (mainText, localText) => {
  const denBlock = localText.match(/(\n    den: \{[\s\S]*?\n    \},)/);
  const loutoneBlock = localText.match(/(\n    loutone: \{[\s\S]*?\n    \},)/);
  if (!denBlock || !loutoneBlock) return mainText;
  let out = mainText;
  if (!out.includes('den: {')) out = out.replace(/(\n    utility: \{)/, `${denBlock[1]}$1`);
  if (!out.includes('loutone: {')) out = out.replace(/(\n    utility: \{)/, `${loutoneBlock[1]}$1`);
  return out;
};

for (const rel of SHARED) {
  const dest = path.join(ROOT, rel);
  const url = `${REMOTE}/${rel}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn('skip', rel, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  if (rel === 'constants.ts' && (await readFile(dest, 'utf8').catch(() => null))) {
    const merged = mergeConstants(buf.toString('utf8'), await readFile(dest, 'utf8'));
    await writeFile(dest, merged);
    console.log('merged', rel);
  } else {
    await writeFile(dest, buf);
    console.log('wrote', rel);
  }
}

console.log('sync ok — vérifie les diffs avant commit');
