import { useMemo } from 'react';
import { RoundedBox, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/guitar-round.glb');

export const Guitar = (props) => {
  const { scene } = useGLTF('/models/guitar-round.glb');
  const [bodyTex, detailTex] = useTexture(['/assets/sprites/guitar-body.png', '/assets/sprites/guitar-details.png']);
  bodyTex.flipY = false;
  bodyTex.colorSpace = THREE.SRGBColorSpace;
  detailTex.flipY = false;
  detailTex.colorSpace = THREE.SRGBColorSpace;
  const root = useMemo(() => {
    const src = scene.clone(true);
    src.traverse((o) => {
      if (!o.isMesh) return;
      const n = `${o.name || ''}`.toLowerCase();
      if (n.includes('cube')) {
        o.visible = false;
        return;
      }
      const mat = o.material?.clone?.();
      if (!mat) return;
      const nm = `${o.name} ${mat.name || ''}`.toLowerCase();
      mat.map = /head|tuner|logo|material/.test(nm) ? detailTex : bodyTex;
      mat.roughness = 0.42;
      mat.metalness = 0.04;
      mat.needsUpdate = true;
      o.material = mat;
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    });
    const box = new THREE.Box3().setFromObject(src);
    src.position.sub(box.getCenter(new THREE.Vector3()));
    const size = box.getSize(new THREE.Vector3());
    const wrap = new THREE.Group();
    wrap.add(src);
    wrap.scale.setScalar(1.18 / Math.max(size.y, 0.01));
    return wrap;
  }, [scene, bodyTex, detailTex]);
  return <primitive object={root} {...props} />;
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
