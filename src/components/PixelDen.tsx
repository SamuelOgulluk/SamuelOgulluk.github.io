import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import InspectPanel from './InspectPanel';

const DenScene = lazy(() => import('../den/DenScene'));

const PixelDen = ({ onViewChange }) => {
  const { t } = useLanguage();
  const [hint, setHint] = useState('');
  const [panel, setPanel] = useState(null);
  const [focus, setFocus] = useState('home');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setPanel(null);
      setFocus('home');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="den-world">
      <Canvas
        className="den-canvas"
        shadows
        dpr={[1, 1.5]}
        camera={{ fov: 42, position: [0.12, 1.42, 3.28], near: 0.08, far: 40 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.BasicShadowMap;
        }}
        onPointerMissed={() => {
          setPanel(null);
          setFocus('home');
        }}
      >
        <color attach="background" args={['#1c1410']} />
        <Suspense fallback={null}>
          <DenScene
            focus={focus}
            setFocus={setFocus}
            setHint={setHint}
            setPanel={setPanel}
            onViewChange={onViewChange}
          />
        </Suspense>
      </Canvas>
      {!panel && <p className="den-hint">{hint || t.den.hint}</p>}
      {panel && (
        <InspectPanel
          panel={panel}
          onClose={() => {
            setPanel(null);
            setFocus('home');
          }}
        />
      )}
    </div>
  );
};

export default PixelDen;
