import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

const PATH = [
  { p: [-0.55, 0.94, -0.95], mood: 'walk', wait: 2400 },
  { p: [0.1, 0.94, -0.95], mood: 'sit', wait: 2800 },
  { p: [0.55, 0.94, -1.0], mood: 'walk', wait: 2200 },
  { p: [1.05, 0.14, -0.15], mood: 'walk', wait: 2400 },
  { p: [0.72, 0.14, 0.55], mood: 'play', wait: 4000 },
  { p: [0.05, 0.14, 0.6], mood: 'walk', wait: 2200 },
  { p: [-0.7, 0.14, 0.35], mood: 'walk', wait: 2200 },
  { p: [-0.42, 0.5, 0.05], mood: 'sleep', wait: 4400 },
];

const BALL = new THREE.Vector3(0.78, 0.05, 0.52);
const fur = '#8a5a38';
const belly = '#f0d8b4';

const OtterMesh = ({ mood }) => (
  <group rotation={mood === 'sleep' ? [0.15, 0, 1.15] : [0, 0, 0]} position={mood === 'sleep' ? [0, 0.02, 0] : [0, 0, 0]}>
    <mesh scale={[1.2, 0.72, 0.9]} castShadow>
      <sphereGeometry args={[0.09, 18, 14]} />
      <meshStandardMaterial color={fur} roughness={0.62} />
    </mesh>
    <mesh position={[0, -0.01, 0.04]} scale={[0.9, 0.55, 0.55]} castShadow>
      <sphereGeometry args={[0.085, 16, 12]} />
      <meshStandardMaterial color={belly} roughness={0.55} />
    </mesh>
    <mesh position={[0, 0.07, 0.1]} castShadow>
      <sphereGeometry args={[0.062, 16, 14]} />
      <meshStandardMaterial color={fur} roughness={0.62} />
    </mesh>
    <mesh position={[0, 0.055, 0.15]} scale={[0.72, 0.52, 0.85]}>
      <sphereGeometry args={[0.04, 12, 10]} />
      <meshStandardMaterial color={belly} roughness={0.55} />
    </mesh>
    <mesh position={[0, 0.058, 0.185]}>
      <sphereGeometry args={[0.012, 10, 8]} />
      <meshStandardMaterial color="#1a1010" roughness={0.4} />
    </mesh>
    {[-0.028, 0.028].map((x) => (
      <mesh key={x} position={[x, 0.085, 0.145]}>
        <sphereGeometry args={[0.009, 10, 8]} />
        <meshStandardMaterial color="#1a1210" />
      </mesh>
    ))}
    {[-0.038, 0.038].map((x) => (
      <mesh key={x} position={[x, 0.11, 0.09]} scale={[0.7, 0.85, 0.55]}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <meshStandardMaterial color="#7a4e32" roughness={0.6} />
      </mesh>
    ))}
    <mesh position={[0, -0.02, -0.12]} rotation={[0.5, 0, 0]} scale={[0.45, 0.4, 1.1]} castShadow>
      <sphereGeometry args={[0.07, 12, 10]} />
      <meshStandardMaterial color={fur} roughness={0.62} />
    </mesh>
    {[
      [-0.05, -0.05, 0.05],
      [0.05, -0.05, 0.05],
      [-0.05, -0.05, -0.04],
      [0.05, -0.05, -0.04],
    ].map((p, i) => (
      <mesh key={i} position={p} scale={[0.7, 0.45, 0.85]}>
        <sphereGeometry args={[0.032, 10, 8]} />
        <meshStandardMaterial color="#7a4a30" roughness={0.6} />
      </mesh>
    ))}
  </group>
);

const DenOtter = ({ t, setHint }) => {
  const group = useRef(null);
  const ball = useRef(null);
  const target = useRef(new THREE.Vector3(...PATH[0].p));
  const iRef = useRef(0);
  const busy = useRef(false);
  const [mood, setMood] = useState('sit');
  const [line, setLine] = useState('');
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

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
        target.current.set(dest.p[0], dest.p[1], dest.p[2]);
        iRef.current = next;
        setMood(dest.mood);
        loop();
      }, PATH[iRef.current].wait + 400);
    };
    loop();
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.lerp(target.current, 1 - Math.exp(-dt * 1.8));
    const dx = target.current.x - g.position.x;
    const dz = target.current.z - g.position.z;
    if (Math.hypot(dx, dz) > 0.03) {
      const want = Math.atan2(dx, dz);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, want, 6, dt);
    }
    if (mood === 'walk') {
      g.position.y += Math.sin(state.clock.elapsedTime * 10) * 0.002;
    }
    if (ball.current) {
      const playing = mood === 'play';
      ball.current.position.lerp(
        playing
          ? new THREE.Vector3(g.position.x + 0.14, 0.05, g.position.z + 0.08)
          : BALL,
        0.14
      );
    }
  });

  const poke = (e) => {
    e.stopPropagation();
    busy.current = true;
    const lines = t.den.otterLines;
    setLine(lines[Math.floor(Math.random() * lines.length)]);
    window.setTimeout(() => {
      setLine('');
      busy.current = false;
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
        <OtterMesh mood={mood} />
        {line ? (
          <Html center sprite position={[0, 0.28, 0]} style={{ pointerEvents: 'none' }}>
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
