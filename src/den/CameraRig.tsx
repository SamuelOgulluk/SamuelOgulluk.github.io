import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FOCI = {
  home: { pos: [0, 1.38, 3.48], look: [0, 1.02, -0.35], pan: 0.22 },
  laptop: { pos: [0.03, 1.18, 1.52], look: [0.03, 1.06, 0.14], pan: 0.04 },
  diploma: { pos: [-1.2, 1.5, 2.05], look: [-2.45, 1.55, -0.55], pan: 0.05 },
  piano: { pos: [0.82, 1.18, 2.15], look: [1.92, 0.82, -0.22], pan: 0.05 },
  guitar: { pos: [1.0, 1.2, 2.0], look: [2.18, 0.92, 0.4], pan: 0.05 },
  window: { pos: [0, 1.42, 2.12], look: [0, 1.38, -2.6], pan: 0.06 },
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
