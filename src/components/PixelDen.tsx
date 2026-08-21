import React, { useState } from 'react';
import { useLanguage } from '@/App';
import PixelOtter from './PixelOtter';
import InspectPanel from './InspectPanel';

const HOTSPOTS = [
  { id: 'lab', left: '8%', top: '56%', width: '10%', height: '16%', panel: 'experience' },
  { id: 'mail', left: '16%', top: '52%', width: '9%', height: '18%', panel: 'contact' },
  { id: 'about', left: '24%', top: '50%', width: '10%', height: '22%', panel: 'about' },
  { id: 'desk', left: '36%', top: '48%', width: '14%', height: '20%', panel: 'projects' },
  { id: 'books', left: '48%', top: '54%', width: '8%', height: '16%', panel: 'education' },
  { id: 'kit', left: '54%', top: '46%', width: '8%', height: '14%', panel: 'skills' },
  { id: 'music', left: '59%', top: '60%', width: '13%', height: '14%', href: 'https://samuelogulluk.github.io/lutra/' },
  { id: 'tools', left: '71%', top: '60%', width: '10%', height: '16%', view: 'utility' },
];

const PixelDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const [hint, setHint] = useState('');
  const [panel, setPanel] = useState(null);

  const labelFor = (id) => {
    if (id in t.den) return t.den[id];
    return t.den.hint;
  };

  const activate = (spot) => {
    if (spot.view) {
      onViewChange(spot.view);
      return;
    }
    if (spot.href) {
      window.open(spot.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (spot.panel) setPanel(spot.panel);
  };

  return (
    <div className="den-world">
      <img className="den-art" src="/assets/den.svg" alt={t.den.hint} width={160} height={90} draggable={false} />

      <div className="fx-stars" aria-hidden="true" />
      <div className="fx-window" aria-hidden="true" />
      <div className="fx-smoke" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="fx-water" aria-hidden="true" />

      {HOTSPOTS.map((spot) => (
        <button
          key={spot.id}
          type="button"
          className="den-hotspot"
          style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }}
          aria-label={labelFor(spot.id)}
          onMouseEnter={() => setHint(labelFor(spot.id))}
          onFocus={() => setHint(labelFor(spot.id))}
          onMouseLeave={() => setHint('')}
          onClick={() => activate(spot)}
        />
      ))}

      <PixelOtter />

      {!panel && <p className="den-hint">{hint || t.den.hint}</p>}

      {panel && <InspectPanel panel={panel} onClose={() => setPanel(null)} />}
    </div>
  );
};

export default PixelDen;
