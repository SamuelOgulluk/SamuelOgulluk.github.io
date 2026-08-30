import { useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const URLS = [
  '/models/ph/metal_office_desk/metal_office_desk_1k.gltf',
  '/models/ph/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf',
  '/models/ph/classic_laptop/classic_laptop_1k.gltf',
  '/models/ph/hanging_picture_frame_01/hanging_picture_frame_01_1k.gltf',
  '/models/ph/hanging_picture_frame_02/hanging_picture_frame_02_1k.gltf',
  '/models/ph/potted_plant_04/potted_plant_04_1k.gltf',
  '/models/ph/book_encyclopedia_set_01/book_encyclopedia_set_01_1k.gltf',
  '/models/ph/wooden_bookshelf_worn/wooden_bookshelf_worn_1k.gltf',
  '/models/office-chair.glb',
  '/models/piano.glb',
  '/models/kenney/cardboardBoxClosed.glb',
  '/models/kenney/radio.glb',
];

URLS.forEach((u) => useGLTF.preload(u));

const shadowize = (src, onMat) => {
  src.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    o.frustumCulled = false;
    const list = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    const next = list.map((m) => {
      const mat = m.clone();
      if (onMat) onMat(mat, o);
      return mat;
    });
    if (next.length === 1) o.material = next[0];
    else if (next.length > 1) o.material = next;
  });
};

const fitWrap = (src, height, width, sit) => {
  const box = new THREE.Box3().setFromObject(src);
  const size = box.getSize(new THREE.Vector3());
  src.position.sub(box.getCenter(new THREE.Vector3()));
  if (sit) src.position.y += size.y / 2;
  const wrap = new THREE.Group();
  wrap.add(src);
  const sy = height ? height / Math.max(size.y, 0.01) : 1;
  const sx = width ? width / Math.max(size.x, 0.01) : sy;
  wrap.scale.set(sx, sy, sy);
  return wrap;
};

export const FitGLB = ({ url, height, width, sit = true, onMat, ...props }) => {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const src = scene.clone(true);
    shadowize(src, onMat);
    return fitWrap(src, height, width, sit);
  }, [scene, height, width, sit, onMat]);
  return <primitive object={root} {...props} />;
};

export const FramedMap = ({ url, mapUrl, height = 0.62, ...props }) => {
  const { scene } = useGLTF(url);
  const mapTex = useTexture(mapUrl);
  const root = useMemo(() => {
    mapTex.colorSpace = THREE.SRGBColorSpace;
    mapTex.flipY = false;
    mapTex.anisotropy = 8;
    const src = scene.clone(true);
    shadowize(src, (mat) => {
      if (`${mat.name || ''}`.toLowerCase().includes('artwork')) {
        mat.map = mapTex;
        mat.roughness = 0.88;
        mat.metalness = 0;
        mat.needsUpdate = true;
      }
    });
    return fitWrap(src, height, undefined, false);
  }, [scene, mapTex, height]);
  return <primitive object={root} {...props} />;
};

export const RoomShell = () => {
  const [floorD, floorN, floorA, wallD, wallN, wallA] = useTexture([
    '/assets/ph/herringbone_parquet/diff.jpg',
    '/assets/ph/herringbone_parquet/nor_gl.jpg',
    '/assets/ph/herringbone_parquet/arm.jpg',
    '/assets/ph/painted_plaster_wall/diff.jpg',
    '/assets/ph/painted_plaster_wall/nor_gl.jpg',
    '/assets/ph/painted_plaster_wall/arm.jpg',
  ]);

  useEffect(() => {
    const prep = (tex, repeat, srgb) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
      tex.anisotropy = 8;
      if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    };
    prep(floorD, [5, 4], true);
    prep(floorN, [5, 4], false);
    prep(floorA, [5, 4], false);
    prep(wallD, [3, 2], true);
    prep(wallN, [3, 2], false);
    prep(wallA, [3, 2], false);
  }, [floorD, floorN, floorA, wallD, wallN, wallA]);

  const wallMat = () => (
    <meshStandardMaterial map={wallD} normalMap={wallN} roughnessMap={wallA} roughness={0.92} metalness={0.02} />
  );

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.05]} receiveShadow>
        <planeGeometry args={[6.2, 4.6]} />
        <meshStandardMaterial map={floorD} normalMap={floorN} roughnessMap={floorA} roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh position={[0, 1.28, -1.56]} receiveShadow>
        <planeGeometry args={[6.2, 2.56]} />
        {wallMat()}
      </mesh>
      <mesh position={[-3.08, 1.28, -0.1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4.6, 2.56]} />
        {wallMat()}
      </mesh>
      <mesh position={[3.08, 1.28, -0.1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4.6, 2.56]} />
        {wallMat()}
      </mesh>
      <mesh position={[0, 2.56, -0.1]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.2, 4.6]} />
        <meshStandardMaterial color="#f3ebe0" roughness={0.95} />
      </mesh>
    </>
  );
};
