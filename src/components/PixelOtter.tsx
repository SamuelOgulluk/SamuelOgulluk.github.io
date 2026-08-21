import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/App';

const PATH = [
  { x: 18, y: 28, z: 'back', mood: 'walk', wait: 2600 },
  { x: 50, y: 26, z: 'back', mood: 'walk', wait: 2400 },
  { x: 78, y: 30, z: 'back', mood: 'sit', wait: 3000 },
  { x: 50, y: 26, z: 'back', mood: 'walk', wait: 2200 },
  { x: 18, y: 32, z: 'back', mood: 'walk', wait: 2200 },
  { x: 16, y: 72, z: 'front', mood: 'walk', wait: 2600 },
  { x: 82, y: 86, z: 'front', mood: 'play', wait: 4200 },
  { x: 92, y: 78, z: 'front', mood: 'sit', wait: 3000 },
  { x: 50, y: 90, z: 'front', mood: 'walk', wait: 2600 },
  { x: 46, y: 78, z: 'front', mood: 'sleep', wait: 4800 },
];

const BALL_HOME = { x: 78.1, y: 86.6 };

const PixelOtter = () => {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState('sit');
  const [facing, setFacing] = useState(1);
  const [line, setLine] = useState('');
  const [step, setStep] = useState(0);
  const posRef = useRef(PATH[0]);
  const busy = useRef(false);
  const iRef = useRef(0);

  const here = PATH[idx];

  const speak = (text) => {
    setLine(text);
    window.setTimeout(() => setLine(''), 2400);
  };

  useEffect(() => {
    const walk = window.setInterval(() => setStep((n) => n + 1), 180);
    let live = true;
    let wait = 0;
    const loop = () => {
      wait = window.setTimeout(() => {
        if (!live) return;
        if (!busy.current) {
          const next = (iRef.current + 1) % PATH.length;
          const dest = PATH[next];
          setFacing(dest.x >= posRef.current.x ? 1 : -1);
          posRef.current = dest;
          iRef.current = next;
          setIdx(next);
          setMood(dest.mood);
        }
        loop();
      }, PATH[iRef.current].wait + 400);
    };
    loop();
    return () => {
      live = false;
      window.clearInterval(walk);
      window.clearTimeout(wait);
    };
  }, []);

  const poke = () => {
    busy.current = true;
    const lines = t.den.otterLines;
    speak(lines[Math.floor(Math.random() * lines.length)]);
    setMood('peek');
    window.setTimeout(() => {
      busy.current = false;
      setMood(PATH[iRef.current].mood);
    }, 900);
  };

  const ball = mood === 'play' ? { x: here.x + 3, y: here.y + 4 } : BALL_HOME;

  return (
    <>
      <button
        type="button"
        className={`den-otter is-${mood} is-${here.z} ${step % 2 ? 'is-step' : ''}`}
        style={{ left: `${here.x}%`, top: `${here.y}%`, ['--face']: facing }}
        onClick={poke}
        aria-label={t.den.otter}
      >
        {line && <span className="otter-bubble">{line}</span>}
          <img src="/assets/otter.png" alt="" width={48} height={36} draggable={false} />
      </button>
      <img
        className={`den-ball ${mood === 'play' ? 'is-play' : ''}`}
        src="/assets/ball.svg"
        alt=""
        width={12}
        height={12}
        draggable={false}
        style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
      />
    </>
  );
};

export default PixelOtter;
