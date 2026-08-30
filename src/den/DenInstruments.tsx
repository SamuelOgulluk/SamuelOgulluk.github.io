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
  const whites = Array.from({ length: 11 }, (_, i) => i);
  const blacks = [0, 1, 3, 4, 6, 7, 8];
  const wood = { color: '#5a3a28', roughness: 0.72, metalness: 0 };
  const dark = { color: '#3a261c', roughness: 0.7, metalness: 0 };
  return (
    <group {...props}>
      <RoundedBox args={[0.98, 0.86, 0.38]} radius={0.04} position={[0, 0.52, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...wood} />
      </RoundedBox>
      <RoundedBox args={[0.94, 0.08, 0.36]} radius={0.03} position={[0, 0.96, 0.01]} castShadow>
        <meshStandardMaterial {...dark} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.1, 0.06]} radius={0.02} position={[0, 0.74, 0.18]}>
        <meshStandardMaterial color="#6a4430" roughness={0.68} />
      </RoundedBox>
      <mesh position={[0, 0.64, 0.2]}>
        <boxGeometry args={[0.76, 0.03, 0.15]} />
        <meshStandardMaterial color="#1c1410" roughness={0.55} />
      </mesh>
      {whites.map((i) => (
        <RoundedBox key={i} args={[0.058, 0.022, 0.14]} radius={0.006} position={[-0.3 + i * 0.06, 0.658, 0.2]} castShadow>
          <meshStandardMaterial color="#f6efe4" roughness={0.45} />
        </RoundedBox>
      ))}
      {blacks.map((i) => (
        <RoundedBox key={i} args={[0.034, 0.028, 0.09]} radius={0.004} position={[-0.27 + i * 0.06, 0.672, 0.175]}>
          <meshStandardMaterial color="#1a1210" roughness={0.4} />
        </RoundedBox>
      ))}
      {[-0.36, 0.36].map((x) => (
        <RoundedBox key={x} args={[0.08, 0.4, 0.08]} radius={0.02} position={[x, 0.2, 0.06]} castShadow>
          <meshStandardMaterial {...dark} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.46, 0.32, 0.04]} radius={0.02} position={[0, 1.14, -0.02]}>
        <meshStandardMaterial color="#6e4632" roughness={0.7} />
      </RoundedBox>
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
