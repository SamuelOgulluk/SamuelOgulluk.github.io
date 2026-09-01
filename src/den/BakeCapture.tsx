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
  maps: [0, 1.62, -1.47],
  diploma: [-1.88, 0.8, -0.48],
  laptop: [0.04, 0.9, -1.0],
  guitar: [1.16, 0.7, -0.82],
  piano: [1.82, 0.22, -0.92],
  about: [-1.55, 0.45, -1.12],
  kit: [-0.62, 0.86, -1.08],
  mail: [0.78, 0.86, -1.14],
  lab: [-1.78, 0.72, -0.42],
  tools: [-1.18, 0.2, 0.42],
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
      await new Promise((r) => setTimeout(r, 8000));
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
