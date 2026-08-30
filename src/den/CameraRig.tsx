import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FOCI = {
  home: { pos: [0.12, 1.36, 2.72], look: [0.12, 0.92, -0.7], pan: 0.28 },
  laptop: { pos: [0.02, 1.08, 0.92], look: [0.02, 0.98, -1.05], pan: 0.04 },
  diploma: { pos: [-0.7, 1.22, 1.35], look: [-2.05, 0.85, -0.7], pan: 0.05 },
  piano: { pos: [0.45, 1.15, 1.35], look: [1.72, 0.7, -1.15], pan: 0.05 },
  guitar: { pos: [0.35, 1.12, 1.4], look: [1.15, 0.7, -0.85], pan: 0.05 },
  maps: { pos: [0.08, 1.38, 1.15], look: [0, 1.58, -1.48], pan: 0.05 },
};

export const BAKE_CAM = { pos: [0.16, 1.3, 3.08], look: [0.16, 0.9, -0.55] };

const CameraRig = ({ focus, frozen }) => {
  const look = useRef(new THREE.Vector3(0.1, 0.95, -0.55));
  const goal = useRef(new THREE.Vector3());
  const lookGoal = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    if (frozen) {
      state.camera.position.set(...BAKE_CAM.pos);
      state.camera.lookAt(...BAKE_CAM.look);
      return;
    }
    const spec = FOCI[focus] || FOCI.home;
    const k = 1 - Math.exp(-dt * 3.2);
    const pan = spec.pan;
    goal.current.set(spec.pos[0] + state.pointer.x * pan, spec.pos[1] + state.pointer.y * pan * 0.4, spec.pos[2]);
    lookGoal.current.set(spec.look[0] + state.pointer.x * pan * 0.32, spec.look[1] + state.pointer.y * pan * 0.18, spec.look[2]);
    state.camera.position.lerp(goal.current, k);
    look.current.lerp(lookGoal.current, k);
    state.camera.lookAt(look.current);
  });

  return null;
};

export default CameraRig;
