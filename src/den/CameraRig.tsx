import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FOCI = {
  home: { pos: [0.15, 1.12, 2.82], look: [0.18, 0.9, -0.32], pan: 0.16 },
  laptop: { pos: [0.02, 1.06, 1.22], look: [0.02, 0.97, 0.22], pan: 0.03 },
  diploma: { pos: [-0.55, 1.22, 1.55], look: [-1.4, 1.42, -1.7], pan: 0.04 },
  piano: { pos: [0.45, 1.02, 1.72], look: [1.15, 0.72, 0.05], pan: 0.04 },
  guitar: { pos: [0.55, 1.04, 1.68], look: [1.28, 0.78, 0.55], pan: 0.04 },
  window: { pos: [0.05, 1.18, 1.62], look: [0, 1.28, -2.4], pan: 0.05 },
};

const CameraRig = ({ focus }) => {
  const look = useRef(new THREE.Vector3(0, 1.02, -0.35));
  const goal = useRef(new THREE.Vector3());
  const lookGoal = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const spec = FOCI[focus] || FOCI.home;
    const k = 1 - Math.exp(-dt * 3.4);
    const pan = spec.pan;
    goal.current.set(spec.pos[0] + state.pointer.x * pan, spec.pos[1] + state.pointer.y * pan * 0.45, spec.pos[2]);
    lookGoal.current.set(spec.look[0] + state.pointer.x * pan * 0.35, spec.look[1] + state.pointer.y * pan * 0.2, spec.look[2]);
    state.camera.position.lerp(goal.current, k);
    look.current.lerp(lookGoal.current, k);
    state.camera.lookAt(look.current);
  });

  return null;
};

export default CameraRig;
