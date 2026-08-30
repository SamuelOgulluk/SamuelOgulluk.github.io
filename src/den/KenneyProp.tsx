import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const URLS = [
  '/models/kenney/desk.glb',
  '/models/kenney/chairRounded.glb',
  '/models/kenney/laptop.glb',
  '/models/kenney/lampRoundTable.glb',
  '/models/kenney/pottedPlant.glb',
  '/models/kenney/plantSmall1.glb',
  '/models/kenney/plantSmall2.glb',
  '/models/kenney/books.glb',
  '/models/kenney/rugRectangle.glb',
  '/models/kenney/cardboardBoxClosed.glb',
  '/models/kenney/radio.glb',
  '/models/kenney/speaker.glb',
  '/models/kenney/speakerSmall.glb',
  '/models/kenney/bookcaseOpenLow.glb',
  '/models/kenney/pillow.glb',
  '/models/kenney/sideTable.glb',
  '/models/kenney/bear.glb',
];

URLS.forEach((u) => useGLTF.preload(u));

export const FitGLB = ({ url, height, width, sit = true, ...props }) => {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const src = scene.clone(true);
    src.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
      if (!o.material) return;
      const mat = o.material.clone();
      mat.roughness = Math.max(mat.roughness ?? 0.65, 0.58);
      mat.metalness = Math.min(mat.metalness ?? 0, 0.06);
      o.material = mat;
    });
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
  }, [scene, height, width, sit]);
  return <primitive object={root} {...props} />;
};
