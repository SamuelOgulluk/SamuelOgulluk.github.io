import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/App';

const PLACES = {
  rock: { x: 80, y: 68 },
  dock: { x: 20, y: 68 },
  grass: { x: 62, y: 62 },
  water: { x: 48, y: 82 },
  water2: { x: 70, y: 84 },
};

const PixelOtter = () => {
  const { t } = useLanguage();
  const [pos, setPos] = useState(PLACES.rock);
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
    if (roll < 0.25) return go(PLACES.rock, 'sleep');
    if (roll < 0.48) return go(Math.random() < 0.5 ? PLACES.water : PLACES.water2, 'swim');
    if (roll < 0.7) return go(PLACES.dock, 'walk');
    if (roll < 0.84) return go(PLACES.grass, 'walk');
    return go(PLACES.rock, 'sit');
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
    if (mood === 'sleep') setMood('peek');
    else if (posRef.current.y > 76) setMood('splash');
    else setMood('peek');
    window.setTimeout(() => {
      busy.current = false;
      if (posRef.current.y > 76) setMood('swim');
      else setMood('sit');
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
      <img src="/assets/otter.svg" alt="" width={24} height={16} draggable={false} />
    </button>
  );
};

export default PixelOtter;
