import { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
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
