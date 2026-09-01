import { useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const URLS = [
  '/models/ph/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf',
  '/models/ph/classic_laptop/classic_laptop_1k.gltf',
  '/models/ph/hanging_picture_frame_01/hanging_picture_frame_01_1k.gltf',
  '/models/ph/hanging_picture_frame_02/hanging_picture_frame_02_1k.gltf',
  '/models/ph/potted_plant_04/potted_plant_04_1k.gltf',
  '/models/ph/book_encyclopedia_set_01/book_encyclopedia_set_01_1k.gltf',
  '/models/ph/wooden_display_shelves_01/wooden_display_shelves_01_1k.gltf',
  '/models/ph/book_rows/book_rows.glb',
  '/models/ikea/wood-desk.glb',
  '/models/office-chair.glb',
  '/models/wh/casio-xstand.glb',
  '/models/wh/laptop-open.glb',
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

const fitWrap = (src, height, width, sit, depth) => {
  const box = new THREE.Box3().setFromObject(src);
  const size = box.getSize(new THREE.Vector3());
  src.position.sub(box.getCenter(new THREE.Vector3()));
  if (sit) src.position.y += size.y / 2;
  const wrap = new THREE.Group();
  wrap.add(src);
  const sy = height ? height / Math.max(size.y, 0.01) : 1;
  const sx = width ? width / Math.max(size.x, 0.01) : sy;
  const sz = depth ? depth / Math.max(size.z, 0.01) : sy;
  wrap.scale.set(sx, sy, sz);
  return wrap;
};

export const FitGLB = ({ url, height, width, depth, sit = true, onMat, ...props }) => {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const src = scene.clone(true);
    shadowize(src, onMat);
    return fitWrap(src, height, width, sit, depth);
  }, [scene, height, width, depth, sit, onMat]);
  return <primitive object={root} {...props} />;
};

export const BookRow = ({ name, height = 0.23, ...props }) => {
  const { scene } = useGLTF('/models/ph/book_rows/book_rows.glb');
  const root = useMemo(() => {
    const node = scene.getObjectByName(name);
    if (!node) return new THREE.Group();
    const src = node.clone(true);
    shadowize(src);
    return fitWrap(src, height, undefined, true, undefined);
  }, [scene, name, height]);
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
      const n = `${mat.name || ''}`.toLowerCase();
      if (n.includes('glass')) {
        mat.visible = false;
        mat.opacity = 0;
        mat.transparent = true;
        mat.depthWrite = false;
      }
      if (n.includes('artwork')) {
        mat.map = mapTex;
        mat.color = new THREE.Color('#ffffff');
        mat.roughness = 0.9;
        mat.metalness = 0;
        mat.transparent = false;
        mat.needsUpdate = true;
      }
    });
    return fitWrap(src, height, undefined, false, undefined);
  }, [scene, mapTex, height]);
  return <primitive object={root} {...props} />;
};

export const RoomShell = () => {
  const [floorD, floorN, wallD, wallN] = useTexture([
    '/assets/ph/laminate_floor_03/diff.jpg',
    '/assets/ph/laminate_floor_03/nor_gl.jpg',
    '/assets/ph/painted_plaster_wall/diff.jpg',
    '/assets/ph/painted_plaster_wall/nor_gl.jpg',
  ]);

  useEffect(() => {
    const prep = (tex, repeat, srgb) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    };
    prep(floorD, [5.4, 4.2], true);
    prep(floorN, [5.4, 4.2], false);
    prep(wallD, [2.8, 2.0], true);
    prep(wallN, [2.8, 2.0], false);
  }, [floorD, floorN, wallD, wallN]);

  const wallMat = () => (
    <meshStandardMaterial
      map={wallD}
      color="#e4d3ba"
      normalMap={wallN}
      normalScale={new THREE.Vector2(0.78, 0.78)}
      roughness={0.92}
      metalness={0}
    />
  );

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.05]} receiveShadow>
        <planeGeometry args={[6.2, 4.6]} />
        <meshStandardMaterial
          map={floorD}
          color="#c4a06c"
          normalMap={floorN}
          normalScale={new THREE.Vector2(1.15, 1.15)}
          roughness={0.58}
          metalness={0.02}
        />
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
        <meshStandardMaterial color="#ebe2d2" roughness={0.98} />
      </mesh>
    </>
  );
};
