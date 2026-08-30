import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = `
varying float vViewZ;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewZ = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = `
varying float vViewZ;
uniform float uNear;
uniform float uFar;
void main() {
  float t = clamp((vViewZ - uNear) / (uFar - uNear), 0.0, 1.0);
  float d = 1.0 - t;
  gl_FragColor = vec4(d, d, d, 1.0);
}
`;

const ANCHORS = {
  window: [0, 1.52, -1.44],
  diploma: [-1.48, 1.55, -1.44],
  laptop: [0.02, 1.08, -0.9],
  guitar: [1.18, 0.7, -0.8],
  piano: [1.85, 0.62, -1.12],
  about: [-0.52, 0.89, -0.9],
  kit: [-0.7, 0.87, -1.08],
  mail: [0.6, 0.87, -1.1],
  lab: [0.68, 0.89, -0.85],
  tools: [-1.28, 0.24, 0.35],
  otter: [0.0, 0.92, -0.92],
};

const toDataUrl = (canvas) => canvas.toDataURL('image/png');

const BakeCapture = ({ enabled }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (!enabled) return;
    let dead = false;
    const depthMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uNear: { value: 1.15 }, uFar: { value: 6.8 } },
    });

    const run = async () => {
      await new Promise((r) => setTimeout(r, 4500));
      if (dead) return;
      const hidden = [];
      scene.traverse((o) => {
        if (o.userData?.bakeHide && o.visible) {
          o.visible = false;
          hidden.push(o);
        }
      });
      gl.render(scene, camera);
      const color = toDataUrl(gl.domElement);
      const prev = scene.overrideMaterial;
      scene.overrideMaterial = depthMat;
      gl.render(scene, camera);
      const depth = toDataUrl(gl.domElement);
      scene.overrideMaterial = prev;
      hidden.forEach((o) => {
        o.visible = true;
      });
      gl.render(scene, camera);
      const spots = {};
      const v = new THREE.Vector3();
      Object.entries(ANCHORS).forEach(([name, p]) => {
        v.set(p[0], p[1], p[2]).project(camera);
        spots[name] = { x: (v.x + 1) / 2, y: 1 - (v.y + 1) / 2 };
      });
      window.__bake = {
        color,
        depth,
        spots,
        w: gl.domElement.width,
        h: gl.domElement.height,
      };
      window.__done = true;
    };

    run().catch((err) => {
      window.__error = String(err);
      window.__done = true;
    });
    return () => {
      dead = true;
      depthMat.dispose();
    };
  }, [enabled, gl, scene, camera]);

  return null;
};

export default BakeCapture;
