import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PATH = [
  { p: [-0.95, 0.98, -1.72], mood: 'walk', wait: 2600 },
  { p: [0.05, 0.98, -1.72], mood: 'sit', wait: 2800 },
  { p: [0.9, 0.98, -1.72], mood: 'walk', wait: 2200 },
  { p: [1.35, 0.02, 0.15], mood: 'walk', wait: 2400 },
  { p: [1.05, 0.02, 1.2], mood: 'play', wait: 4200 },
  { p: [0.15, 0.02, 1.4], mood: 'walk', wait: 2200 },
  { p: [-1.25, 0.02, 1.05], mood: 'walk', wait: 2400 },
  { p: [-0.55, 0.78, 0.42], mood: 'sleep', wait: 4600 },
  { p: [-1.55, 0.02, -0.15], mood: 'walk', wait: 2200 },
];

const BALL = new THREE.Vector3(1.22, 0.05, 1.28);

const DenOtter = ({ t, setHint }) => {
  const group = useRef(null);
  const ball = useRef(null);
  const map = useTexture('/assets/otter-cute.png');
  const target = useRef(new THREE.Vector3(...PATH[0].p));
  const iRef = useRef(0);
  const busy = useRef(false);
  const [mood, setMood] = useState('sit');
  const [face, setFace] = useState(1);
  const [line, setLine] = useState('');
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  }, [map]);

  useEffect(() => {
    let live = true;
    let timer = 0;
    const loop = () => {
      timer = window.setTimeout(() => {
        if (!live || busy.current) {
          loop();
          return;
        }
        const next = (iRef.current + 1) % PATH.length;
        const dest = PATH[next];
        setFace(dest.p[0] >= target.current.x ? 1 : -1);
        target.current.set(dest.p[0], dest.p[1], dest.p[2]);
        iRef.current = next;
        setMood(dest.mood);
        loop();
      }, PATH[iRef.current].wait + 500);
    };
    loop();
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, []);

  useFrame(({ camera, clock }, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.lerp(target.current, 1 - Math.exp(-dt * 1.7));
    if (mood === 'play') g.position.y += Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.05;
    if (mood === 'sleep') g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -0.7, 0.08);
    else g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, 0.12);
    g.lookAt(camera.position.x, g.position.y, camera.position.z);
    const bounce = mood === 'walk' ? 1 + Math.sin(clock.elapsedTime * 10) * 0.04 : 1;
    g.scale.set(0.34 * face, 0.26 * bounce, 1);
    if (ball.current) {
      const playing = mood === 'play';
      ball.current.position.lerp(playing ? new THREE.Vector3(g.position.x + 0.18, 0.06 + Math.abs(Math.sin(clock.elapsedTime * 7)) * 0.12, g.position.z + 0.08) : BALL, 0.12);
    }
  });

  const poke = (e) => {
    e.stopPropagation();
    busy.current = true;
    const lines = t.den.otterLines;
    setLine(lines[Math.floor(Math.random() * lines.length)]);
    setMood('peek');
    window.setTimeout(() => {
      setLine('');
      busy.current = false;
      setMood(PATH[iRef.current].mood);
    }, 2200);
  };

  return (
    <>
      <group
        ref={group}
        position={PATH[0].p}
        onClick={poke}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHint(t.den.otter);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setHint('');
        }}
      >
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial map={map} alphaTest={0.12} roughness={0.8} metalness={0} />
        </mesh>
        {line ? (
          <Html center sprite position={[0, 0.7, 0]} style={{ pointerEvents: 'none' }}>
            <div className="otter-bubble">{line}</div>
          </Html>
        ) : null}
      </group>
      <mesh ref={ball} position={BALL.toArray()} castShadow>
        <sphereGeometry args={[0.045, 16, 12]} />
        <meshStandardMaterial color="#e6c14a" roughness={0.45} />
      </mesh>
    </>
  );
};

export default DenOtter;
