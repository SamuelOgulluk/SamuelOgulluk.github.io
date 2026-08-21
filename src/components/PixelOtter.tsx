import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/App';

const PLACES = {
  chair: { x: 44, y: 68 },
  sill: { x: 11, y: 50 },
  rug: { x: 50, y: 88 },
  desk: { x: 58, y: 53 },
  bench: { x: 86, y: 68 },
};

const PixelOtter = () => {
  const { t } = useLanguage();
  const [pos, setPos] = useState(PLACES.chair);
  const [mood, setMood] = useState('sit');
  const [facing, setFacing] = useState(-1);
  const [line, setLine] = useState('');
  const [step, setStep] = useState(0);
  const posRef = useRef(pos);
  const busy = useRef(false);

  posRef.current = pos;

  const speak = (text) => {
    setLine(text);
    window.setTimeout(() => setLine(''), 2400);
  };

  const go = (place, nextMood) => {
    setFacing(place.x >= posRef.current.x ? 1 : -1);
    posRef.current = place;
    setPos(place);
    setMood(nextMood);
  };

  const wander = () => {
    const roll = Math.random();
    if (roll < 0.28) return go(PLACES.chair, 'sleep');
    if (roll < 0.46) return go(PLACES.sill, 'sit');
    if (roll < 0.64) return go(PLACES.rug, 'walk');
    if (roll < 0.8) return go(PLACES.desk, 'sit');
    if (roll < 0.9) return go(PLACES.bench, 'walk');
    return go(PLACES.chair, 'sit');
  };

  useEffect(() => {
    const walk = window.setInterval(() => setStep((n) => n + 1), 180);
    let live = true;
    let wait = 0;
    const loop = () => {
      wait = window.setTimeout(() => {
        if (!live) return;
        if (!busy.current) wander();
        loop();
      }, 4200 + Math.random() * 3800);
    };
    loop();
    return () => {
      live = false;
      window.clearInterval(walk);
      window.clearTimeout(wait);
    };
  }, []);

  const onArrive = () => {
    if (mood === 'walk') setMood('sit');
  };

  const poke = () => {
    busy.current = true;
    const lines = t.den.otterLines;
    speak(lines[Math.floor(Math.random() * lines.length)]);
    setMood(mood === 'sleep' ? 'peek' : 'peek');
    window.setTimeout(() => {
      busy.current = false;
      setMood('sit');
    }, 900);
  };

  return (
    <button
      type="button"
      className={`den-otter is-${mood} ${step % 2 ? 'is-step' : ''}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, ['--face']: facing }}
      onClick={poke}
      onTransitionEnd={onArrive}
      aria-label={t.den.otter}
    >
      {line && <span className="otter-bubble">{line}</span>}
      <img src="/assets/otter.svg" alt="" width={32} height={20} draggable={false} />
    </button>
  );
};

export default PixelOtter;
