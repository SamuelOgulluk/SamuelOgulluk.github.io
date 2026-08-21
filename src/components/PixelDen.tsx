import React, { useState } from 'react';
import { useLanguage } from '@/App';
import PixelOtter from './PixelOtter';
import InspectPanel from './InspectPanel';

const HOTSPOTS = [
  { id: 'window', left: '12%', top: '2%', width: '76%', height: '32%', z: 5 },
  { id: 'diploma', left: '1%', top: '4%', width: '7%', height: '19%', panel: 'education', z: 6 },
  { id: 'desk', left: '31%', top: '34%', width: '39%', height: '64%', panel: 'projects', z: 6 },
  { id: 'piano', left: '79%', top: '67%', width: '13%', height: '29%', href: 'https://samuelogulluk.github.io/lutra/', z: 6 },
  { id: 'guitar', left: '91.5%', top: '59%', width: '8%', height: '34%', href: 'https://samuelogulluk.github.io/lutra/', z: 6 },
  { id: 'about', left: '58%', top: '72%', width: '8%', height: '12%', panel: 'about', z: 6 },
  { id: 'kit', left: '22%', top: '78%', width: '8%', height: '10%', panel: 'skills', z: 6 },
  { id: 'lab', left: '70%', top: '8%', width: '18%', height: '18%', panel: 'experience', z: 5 },
  { id: 'mail', left: '32%', top: '78%', width: '6%', height: '8%', panel: 'contact', z: 6 },
];

const PixelDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const [hint, setHint] = useState('');
  const [panel, setPanel] = useState(null);

  const labelFor = (id) => {
    if (id.startsWith('window')) return t.den.window;
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
      <div className="fx-dusk" aria-hidden="true" />

      <img className="den-laptop" src="/assets/den-laptop.png" alt="" width={1920} height={1080} draggable={false} />

      <div className="den-screen" aria-hidden="true">
        <div className="den-screen-bar">~/projects</div>
        <ul>
          {t.projects.items.map((project) => (
            <li key={project.title}>{project.title}</li>
          ))}
        </ul>
      </div>

      <div className="den-degree" aria-hidden="true">
        {t.den.degree}
      </div>

      {HOTSPOTS.map((spot) => (
        <button
          key={spot.id}
          type="button"
          className="den-hotspot"
          style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height, zIndex: spot.z }}
          aria-label={labelFor(spot.id)}
          onMouseEnter={() => setHint(labelFor(spot.id))}
          onFocus={() => setHint(labelFor(spot.id))}
          onMouseLeave={() => setHint('')}
          onClick={() => activate(spot)}
        />
      ))}

      <PixelOtter />

      <img className="den-corners" src="/assets/den-corners.png" alt="" width={1920} height={1080} draggable={false} />

      {!panel && <p className="den-hint">{hint || t.den.hint}</p>}

      {panel && <InspectPanel panel={panel} onClose={() => setPanel(null)} />}
    </div>
  );
};

export default PixelDen;
