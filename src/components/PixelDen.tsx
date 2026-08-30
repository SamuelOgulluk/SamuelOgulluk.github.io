import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import InspectPanel from './InspectPanel';
import { createParallax } from '../den/parallax';
import { HOTSPOTS as FALLBACK_SPOTS, applyBakeSpots } from '../den/hotspots';

const DenScene = lazy(() => import('../den/DenScene'));

const baking = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('bake');

const BakeDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const [hint, setHint] = useState('');
  const [panel, setPanel] = useState(null);
  const [focus, setFocus] = useState('home');

  useEffect(() => {
    document.body.classList.add('is-bake');
    return () => document.body.classList.remove('is-bake');
  }, []);

  return (
    <div className="den-world">
      <Canvas
        className="den-canvas"
        shadows
        dpr={1}
        camera={{ fov: 38, position: [0.16, 1.3, 3.08], near: 0.08, far: 40 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NoToneMapping }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <color attach="background" args={['#1c1410']} />
        <Suspense fallback={null}>
          <DenScene
            bake
            focus={focus}
            setFocus={setFocus}
            setHint={setHint}
            setPanel={setPanel}
            onViewChange={onViewChange}
          />
        </Suspense>
      </Canvas>
      <p className="den-hint">{hint || t.den.hint}</p>
    </div>
  );
};

const ParallaxDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const wrap = useRef(null);
  const api = useRef(null);
  const nodes = useRef({});
  const spotsRef = useRef(FALLBACK_SPOTS);
  const [spots, setSpots] = useState(FALLBACK_SPOTS);
  const [hint, setHint] = useState('');
  const [panel, setPanel] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    spotsRef.current = spots;
  }, [spots]);

  useEffect(() => {
    fetch('/assets/den/den-spots.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.spots) setSpots(applyBakeSpots(data.spots));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const px = createParallax(wrap.current, {
      colorURL: '/assets/den/den-color.webp',
      depthURL: '/assets/den/den-depth.webp',
      aspect: 16 / 9,
      strength: reduce ? 0.006 : 0.018,
    });
    api.current = px;
    px.onReady(() => setReady(true));

    const onMove = (e) => {
      px.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', onMove);

    let raf = 0;
    const loop = (ms) => {
      px.render(ms / 1000);
      spotsRef.current.forEach((h) => {
        const el = nodes.current[h.id];
        if (!el) return;
        const r = px.projectImageRect(h);
        el.style.left = `${r.x}px`;
        el.style.top = `${r.y}px`;
        el.style.width = `${r.w}px`;
        el.style.height = `${r.h}px`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setPanel(null);
      px.zoomOut();
      px.clearHover();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey);
      px.dispose();
      api.current = null;
    };
  }, []);

  const aim = (h) => ({ x: h.x + h.w / 2, y: h.y + h.h / 2 });

  const onEnter = (h, e) => {
    setHint(t.den[h.hint] || '');
    const box = h;
    const rect = e.currentTarget.getBoundingClientRect();
    const u = box.x + ((e.clientX - rect.left) / Math.max(rect.width, 1)) * box.w;
    const v = 1 - (box.y + ((e.clientY - rect.top) / Math.max(rect.height, 1)) * box.h);
    api.current?.setHover(u, v, box.x, 1 - box.y - box.h, box.x + box.w, 1 - box.y);
  };

  const onLeave = () => {
    setHint('');
    api.current?.clearHover();
  };

  const onClick = (h) => {
    const a = aim(h);
    if (h.utility) {
      onViewChange('utility');
      return;
    }
    if (h.href) {
      api.current?.zoomTo(a.x, a.y, h.zoom);
      window.open(h.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (h.panel) {
      api.current?.zoomTo(a.x, a.y, h.zoom);
      setPanel(h.panel);
      return;
    }
    if (h.id === 'otter') {
      setHint(t.den.otter);
      return;
    }
    api.current?.zoomTo(a.x, a.y, h.zoom);
  };

  return (
    <div
      className="den-world"
      ref={wrap}
      onPointerDown={(e) => {
        if (e.target !== wrap.current && e.target !== api.current?.renderer?.domElement) return;
        setPanel(null);
        api.current?.zoomOut();
        api.current?.clearHover();
      }}
    >
      <div className={`den-hotspots${ready ? ' is-on' : ''}`}>
        {spots.map((h) => (
          <button
            key={h.id}
            type="button"
            className="den-hotspot"
            ref={(el) => {
              nodes.current[h.id] = el;
            }}
            aria-label={t.den[h.hint] || h.id}
            onPointerEnter={(e) => onEnter(h, e)}
            onPointerMove={(e) => onEnter(h, e)}
            onPointerLeave={onLeave}
            onClick={(e) => {
              e.stopPropagation();
              onClick(h);
            }}
          />
        ))}
      </div>
      {!panel && <p className="den-hint">{hint || t.den.hint}</p>}
      {panel && (
        <InspectPanel
          panel={panel}
          onClose={() => {
            setPanel(null);
            api.current?.zoomOut();
          }}
        />
      )}
    </div>
  );
};

const PixelDen = ({ onViewChange }) => (baking() ? <BakeDen onViewChange={onViewChange} /> : <ParallaxDen onViewChange={onViewChange} />);

export default PixelDen;
