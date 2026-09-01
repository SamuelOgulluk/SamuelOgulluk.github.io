export const HOTSPOTS = [
  { id: 'maps', hint: 'maps', x: 0.28, y: 0.12, w: 0.38, h: 0.26, zoom: 0.42 },
  { id: 'diploma', hint: 'diploma', panel: 'education', x: 0.1, y: 0.22, w: 0.16, h: 0.42, zoom: 0.5 },
  { id: 'laptop', hint: 'desk', panel: 'projects', x: 0.396, y: 0.366, w: 0.15, h: 0.11, zoom: 0.72 },
  { id: 'guitar', hint: 'guitar', href: 'https://samuelogulluk.github.io/lutra/', x: 0.67, y: 0.34, w: 0.11, h: 0.44, zoom: 0.48 },
  { id: 'piano', hint: 'piano', panel: 'loutone', x: 0.755, y: 0.55, w: 0.18, h: 0.22, zoom: 0.48 },
  { id: 'about', hint: 'about', panel: 'about', x: 0.2, y: 0.48, w: 0.08, h: 0.16, zoom: 0.4 },
  { id: 'kit', hint: 'kit', panel: 'skills', x: 0.307, y: 0.468, w: 0.05, h: 0.045, zoom: 0.4 },
  { id: 'mail', hint: 'mail', panel: 'contact', x: 0.565, y: 0.47, w: 0.04, h: 0.04, zoom: 0.4 },
  { id: 'lab', hint: 'lab', panel: 'experience', x: 0.12, y: 0.42, w: 0.06, h: 0.06, zoom: 0.4 },
  { id: 'tools', hint: 'tools', utility: true, x: 0.05, y: 0.84, w: 0.07, h: 0.09, zoom: 0.35 },
];

const SIZES = {
  maps: [0.38, 0.26],
  diploma: [0.18, 0.48],
  laptop: [0.15, 0.11],
  guitar: [0.13, 0.4],
  piano: [0.18, 0.22],
  about: [0.08, 0.16],
  kit: [0.08, 0.1],
  mail: [0.04, 0.04],
  lab: [0.08, 0.1],
  tools: [0.07, 0.09],
};

export function applyBakeSpots(spots) {
  if (!spots) return HOTSPOTS;
  return HOTSPOTS.map((h) => {
    const c = spots[h.id];
    if (!c) return h;
    const [w, ht] = SIZES[h.id] || [h.w, h.h];
    return { ...h, x: c.x - w / 2, y: c.y - ht / 2, w, h: ht };
  });
}
