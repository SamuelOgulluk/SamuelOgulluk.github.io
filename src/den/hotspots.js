export const HOTSPOTS = [
  { id: 'window', hint: 'window', x: 0.29, y: 0.12, w: 0.36, h: 0.3, zoom: 0.42 },
  { id: 'diploma', hint: 'diploma', panel: 'education', x: 0.162, y: 0.18, w: 0.075, h: 0.15, zoom: 0.55 },
  { id: 'laptop', hint: 'desk', panel: 'projects', x: 0.386, y: 0.325, w: 0.17, h: 0.19, zoom: 0.72 },
  { id: 'guitar', hint: 'guitar', href: 'https://samuelogulluk.github.io/lutra/', x: 0.67, y: 0.34, w: 0.11, h: 0.44, zoom: 0.48 },
  { id: 'piano', hint: 'piano', href: 'https://samuelogulluk.github.io/lutra/', x: 0.755, y: 0.37, w: 0.14, h: 0.4, zoom: 0.45 },
  { id: 'about', hint: 'about', panel: 'about', x: 0.338, y: 0.46, w: 0.045, h: 0.055, zoom: 0.4 },
  { id: 'kit', hint: 'kit', panel: 'skills', x: 0.307, y: 0.468, w: 0.05, h: 0.045, zoom: 0.4 },
  { id: 'mail', hint: 'mail', panel: 'contact', x: 0.565, y: 0.47, w: 0.04, h: 0.04, zoom: 0.4 },
  { id: 'lab', hint: 'lab', panel: 'experience', x: 0.582, y: 0.466, w: 0.05, h: 0.05, zoom: 0.4 },
  { id: 'tools', hint: 'tools', utility: true, x: 0.0, y: 0.78, w: 0.08, h: 0.12, zoom: 0.35 },
  { id: 'otter', hint: 'otter', x: 0.44, y: 0.36, w: 0.08, h: 0.1, zoom: 0.3 },
];

const SIZES = {
  window: [0.36, 0.3],
  diploma: [0.075, 0.15],
  laptop: [0.17, 0.19],
  guitar: [0.11, 0.44],
  piano: [0.14, 0.4],
  about: [0.045, 0.055],
  kit: [0.05, 0.045],
  mail: [0.04, 0.04],
  lab: [0.05, 0.05],
  tools: [0.08, 0.1],
  otter: [0.08, 0.1],
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
