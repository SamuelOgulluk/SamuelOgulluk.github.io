import React, { useState } from 'react';
import { useLanguage } from '@/App';

const HOTSPOTS = [
  { id: 'lab', left: '8%', top: '56%', width: '10%', height: '16%', href: '#experience' },
  { id: 'mail', left: '16%', top: '52%', width: '9%', height: '18%', href: '#contact' },
  { id: 'desk', left: '36%', top: '48%', width: '16%', height: '20%', href: '#projects' },
  { id: 'books', left: '48%', top: '54%', width: '8%', height: '16%', href: '#education' },
  { id: 'music', left: '59%', top: '60%', width: '13%', height: '14%', href: 'https://samuelogulluk.github.io/lutra/', external: true },
  { id: 'tools', left: '71%', top: '60%', width: '10%', height: '16%', view: 'utility' },
  { id: 'otter', left: '78%', top: '64%', width: '16%', height: '18%' },
];

const PixelDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const [hint, setHint] = useState('');

  const labelFor = (id) => {
    if (id in t.den) return t.den[id];
    return t.den.hint;
  };

  const activate = (spot) => {
    if (spot.view) {
      onViewChange(spot.view);
      return;
    }
    if (spot.external) {
      window.open(spot.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (spot.href) {
      const node = document.querySelector(spot.href);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pixel-den" onMouseLeave={() => setHint('')}>
      <img src="/assets/den.svg" alt={t.den.hint} width={160} height={90} draggable={false} />
      {HOTSPOTS.map((spot) => (
        <button
          key={spot.id}
          type="button"
          className="den-hotspot"
          style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }}
          aria-label={labelFor(spot.id)}
          onMouseEnter={() => setHint(labelFor(spot.id))}
          onFocus={() => setHint(labelFor(spot.id))}
          onClick={() => activate(spot)}
        />
      ))}
      <p className="den-hint">{hint || t.den.hint}</p>
    </div>
  );
};

export default PixelDen;
