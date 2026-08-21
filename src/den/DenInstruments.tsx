import { useMemo, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const bassShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.4);
  s.bezierCurveTo(0.24, -0.4, 0.34, -0.22, 0.33, -0.06);
  s.bezierCurveTo(0.32, 0.04, 0.18, 0.06, 0.16, 0.12);
  s.bezierCurveTo(0.14, 0.2, 0.26, 0.2, 0.27, 0.3);
  s.bezierCurveTo(0.28, 0.4, 0.16, 0.46, 0.05, 0.48);
  s.lineTo(-0.05, 0.48);
  s.bezierCurveTo(-0.16, 0.46, -0.28, 0.4, -0.27, 0.3);
  s.bezierCurveTo(-0.26, 0.2, -0.14, 0.2, -0.16, 0.12);
  s.bezierCurveTo(-0.18, 0.06, -0.32, 0.04, -0.33, -0.06);
  s.bezierCurveTo(-0.34, -0.22, -0.24, -0.4, 0, -0.4);
  return s;
};

const guardShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0.02, -0.28);
  s.bezierCurveTo(0.2, -0.26, 0.22, -0.08, 0.2, 0.04);
  s.bezierCurveTo(0.16, 0.14, 0.08, 0.16, 0.04, 0.18);
  s.lineTo(-0.1, 0.16);
  s.bezierCurveTo(-0.18, 0.1, -0.2, -0.02, -0.18, -0.16);
  s.bezierCurveTo(-0.14, -0.28, -0.04, -0.3, 0.02, -0.28);
  return s;
};

export const Guitar = (props) => {
  const body = useMemo(
    () =>
      new THREE.ExtrudeGeometry(bassShape(), {
        depth: 0.048,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2,
        curveSegments: 16,
      }),
    []
  );
  const guard = useMemo(
    () =>
      new THREE.ExtrudeGeometry(guardShape(), {
        depth: 0.006,
        bevelEnabled: false,
        curveSegments: 12,
      }),
    []
  );
  useEffect(
    () => () => {
      body.dispose();
      guard.dispose();
    },
    [body, guard]
  );

  return (
    <group {...props}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial color="#d7c09a" roughness={0.36} metalness={0.08} />
      </mesh>
      <mesh geometry={guard} position={[0, -0.02, 0.05]} castShadow>
        <meshStandardMaterial color="#efe6d4" roughness={0.55} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.04, 0.058]}>
        <circleGeometry args={[0.038, 20]} />
        <meshStandardMaterial color="#1a120e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, 0.056]}>
        <boxGeometry args={[0.09, 0.028, 0.012]} />
        <meshStandardMaterial color="#2a2420" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, -0.16, 0.056]}>
        <boxGeometry args={[0.1, 0.022, 0.012]} />
        <meshStandardMaterial color="#2a2420" roughness={0.4} metalness={0.35} />
      </mesh>
      {[-0.05, 0, 0.05].map((x) => (
        <mesh key={x} position={[x, -0.24, 0.062]}>
          <cylinderGeometry args={[0.012, 0.012, 0.014, 12]} />
          <meshStandardMaterial color="#c9a05a" roughness={0.3} metalness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 0.03]} castShadow>
        <boxGeometry args={[0.055, 0.52, 0.022]} />
        <meshStandardMaterial color="#c4a06a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.74, 0.044]} castShadow>
        <boxGeometry args={[0.048, 0.5, 0.01]} />
        <meshStandardMaterial color="#3a2418" roughness={0.65} />
      </mesh>
      {[-0.18, -0.08, 0.02, 0.12, 0.22].map((y) => (
        <mesh key={y} position={[0, 0.58 + y, 0.05]}>
          <boxGeometry args={[0.05, 0.004, 0.004]} />
          <meshStandardMaterial color="#1c120c" />
        </mesh>
      ))}
      <mesh position={[0, 1.08, 0.03]} castShadow>
        <boxGeometry args={[0.078, 0.12, 0.02]} />
        <meshStandardMaterial color="#c4a06a" roughness={0.5} />
      </mesh>
      {[-0.028, -0.01, 0.01, 0.028].map((x, i) => (
        <mesh key={x} position={[x, 1.12, 0.018]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.028, 8]} />
          <meshStandardMaterial color="#d0d4d8" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      {[-0.012, -0.004, 0.004, 0.012].map((x) => (
        <mesh key={x} position={[x, 0.62, 0.054]} rotation={[0.02, 0, 0]}>
          <boxGeometry args={[0.003, 0.92, 0.003]} />
          <meshStandardMaterial color="#e8e0d4" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

export const GuitarStand = (props) => (
  <group {...props}>
    <mesh position={[0, 0.02, 0]} rotation={[0.9, 0, 0.35]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 0.72, 8]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.02, 0]} rotation={[0.9, 0, -0.35]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 0.72, 8]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.22, -0.12]} rotation={[-0.55, 0, 0]} castShadow>
      <cylinderGeometry args={[0.01, 0.01, 0.55, 8]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.52, 0.02]} rotation={[0.2, 0, 0]}>
      <boxGeometry args={[0.16, 0.018, 0.04]} />
      <meshStandardMaterial color="#141414" roughness={0.4} />
    </mesh>
  </group>
);

export const Piano = (props) => {
  const whites = Array.from({ length: 14 }, (_, i) => i);
  const blacks = [0, 1, 3, 4, 5, 7, 8, 10, 11];
  return (
    <group {...props}>
      <RoundedBox args={[0.92, 0.78, 0.34]} radius={0.02} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a2a22" roughness={0.48} />
      </RoundedBox>
      <mesh position={[0, 0.9, 0.02]} castShadow>
        <boxGeometry args={[0.88, 0.04, 0.32]} />
        <meshStandardMaterial color="#2e221c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0.18]}>
        <boxGeometry args={[0.78, 0.08, 0.04]} />
        <meshStandardMaterial color="#4a3428" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.618, 0.2]}>
        <boxGeometry args={[0.72, 0.02, 0.14]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      {whites.map((i) => (
        <mesh key={i} position={[-0.31 + i * 0.048, 0.632, 0.2]} castShadow>
          <boxGeometry args={[0.042, 0.016, 0.13]} />
          <meshStandardMaterial color="#f3eee6" roughness={0.4} />
        </mesh>
      ))}
      {blacks.map((i) => (
        <mesh key={i} position={[-0.286 + i * 0.048, 0.642, 0.175]}>
          <boxGeometry args={[0.026, 0.02, 0.08]} />
          <meshStandardMaterial color="#161210" roughness={0.35} />
        </mesh>
      ))}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.18, 0.08]} castShadow>
          <boxGeometry args={[0.06, 0.36, 0.06]} />
          <meshStandardMaterial color="#2c201a" />
        </mesh>
      ))}
      <mesh position={[0, 1.08, -0.02]}>
        <boxGeometry args={[0.42, 0.28, 0.02]} />
        <meshStandardMaterial color="#4a3428" roughness={0.55} />
      </mesh>
    </group>
  );
};

export const Plant = (props) => (
  <group {...props}>
    <mesh position={[0, 0.08, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.06, 0.16, 12]} />
      <meshStandardMaterial color="#8a4a32" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.07, 0.075, 0.04, 12]} />
      <meshStandardMaterial color="#6e3a26" roughness={0.55} />
    </mesh>
    {[
      [0.08, 0.42, 0.02, 0.4, 0.2],
      [-0.1, 0.48, 0.04, -0.5, 0.1],
      [0.02, 0.55, -0.08, 0.15, -0.4],
      [-0.06, 0.38, -0.06, -0.3, -0.25],
      [0.12, 0.34, -0.02, 0.7, 0.05],
    ].map((v, i) => (
      <mesh key={i} position={[v[0], v[1], v[2]]} rotation={[v[4], 0.2, v[3]]} scale={[1.35, 0.16, 0.85]} castShadow>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color={i % 2 ? '#3f8f55' : '#2f7344'} roughness={0.55} />
      </mesh>
    ))}
  </group>
);
