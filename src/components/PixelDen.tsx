import React, { useState } from 'react';
import { useLanguage } from '@/App';
import PixelOtter from './PixelOtter';
import InspectPanel from './InspectPanel';

const HOTSPOTS = [
  { id: 'about', left: '41%', top: '4%', width: '16%', height: '8%', panel: 'about' },
  { id: 'books', left: '23%', top: '9%', width: '11%', height: '42%', panel: 'education' },
  { id: 'desk', left: '33%', top: '13%', width: '31%', height: '38%', panel: 'projects' },
  { id: 'mail', left: '7%', top: '48%', width: '8%', height: '6%', panel: 'contact' },
  { id: 'music', left: '72%', top: '46%', width: '18%', height: '9%', href: 'https://samuelogulluk.github.io/lutra/' },
  { id: 'lab', left: '88%', top: '4%', width: '11%', height: '24%', panel: 'experience' },
  { id: 'kit', left: '84%', top: '52%', width: '15%', height: '14%', panel: 'skills' },
  { id: 'tools', left: '85%', top: '66%', width: '7%', height: '8%', view: 'utility' },
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
      <img className="den-art" src="/assets/den.png" alt={t.den.hint} width={1920} height={1080} draggable={false} />

      <div className="fx-steam" aria-hidden="true">
        <span />
        <span />
      </div>

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
