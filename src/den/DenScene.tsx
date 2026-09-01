import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCursor, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import CameraRig from './CameraRig';
import BakeCapture from './BakeCapture';
import { Guitar } from './DenInstruments';
import { FitGLB, FramedMap, RoomShell } from './KenneyProp';

const LUTRA = 'https://samuelogulluk.github.io/lutra/';
const WALL = -1.5;

const PH = {
  desk: '/models/ph/metal_office_desk/metal_office_desk_1k.gltf',
  lamp: '/models/ph/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf',
  laptop: '/models/ph/classic_laptop/classic_laptop_1k.gltf',
  frameA: '/models/ph/hanging_picture_frame_01/hanging_picture_frame_01_1k.gltf',
  frameB: '/models/ph/hanging_picture_frame_02/hanging_picture_frame_02_1k.gltf',
  plant: '/models/ph/potted_plant_04/potted_plant_04_1k.gltf',
  books: '/models/ph/book_encyclopedia_set_01/book_encyclopedia_set_01_1k.gltf',
  shelf: '/models/ph/wooden_bookshelf_worn/wooden_bookshelf_worn_1k.gltf',
};

const lampMat = (mat) => {
  if (`${mat.name || ''}`.toLowerCase().includes('light')) {
    mat.emissive = new THREE.Color('#ffe6a8');
    mat.emissiveIntensity = 3.6;
    mat.toneMapped = false;
  }
};

const WallMaps = ({ onHint, clearHint, onClick, hint }) => {
  const [paris, france] = useTexture(['/assets/maps/paris.png', '/assets/maps/france.png']);
  useEffect(() => {
    [paris, france].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.flipY = true;
    });
  }, [paris, france]);
  return (
    <Hotspot hint={hint} onOver={onHint} onOut={clearHint} onClick={onClick}>
      <group position={[-0.48, 1.62, WALL + 0.03]}>
        <FramedMap url={PH.frameA} mapUrl="/assets/maps/france.png" height={0.64} />
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.36, 0.5]} />
          <meshStandardMaterial map={france} roughness={0.88} metalness={0} />
        </mesh>
      </group>
      <group position={[0.44, 1.58, WALL + 0.03]}>
        <FramedMap url={PH.frameB} mapUrl="/assets/maps/paris.png" height={0.5} />
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.52, 0.36]} />
          <meshStandardMaterial map={paris} roughness={0.88} metalness={0} />
        </mesh>
      </group>
    </Hotspot>
  );
};

const makeScreen = (titles) => {
  const src = document.createElement('canvas');
  src.width = 640;
  src.height = 400;
  const g = src.getContext('2d');
  g.fillStyle = '#07140f';
  g.fillRect(0, 0, 640, 400);
  g.fillStyle = '#0e2a20';
  g.fillRect(0, 0, 640, 48);
  g.fillStyle = '#8fd6ff';
  g.font = '28px monospace';
  g.fillText('~/projects', 18, 34);
  g.font = '32px monospace';
  titles.forEach((name, i) => {
    g.fillStyle = '#3ecf8e';
    g.fillText('>', 22, 100 + i * 52);
    g.fillStyle = '#d4f6e2';
    g.fillText(name.slice(0, 18), 52, 100 + i * 52);
  });
  const tex = new THREE.CanvasTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Hotspot = ({ hint, onOver, onOut, onClick, children }) => {
  const [h, setH] = useState(false);
  useCursor(h);
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setH(true);
        onOver(hint);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setH(false);
        onOut();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </group>
  );
};

const LampKey = () => {
  const spot = useRef(null);
  useLayoutEffect(() => {
    if (!spot.current) return;
    spot.current.target.position.set(0.04, 0.78, WALL + 0.42);
    spot.current.target.updateMatrixWorld();
  }, []);
  return (
    <>
      <spotLight
        ref={spot}
        position={[0.58, 1.26, WALL + 0.7]}
        angle={0.92}
        penumbra={0.62}
        intensity={42}
        color="#ffb56a"
        castShadow
        distance={9}
        decay={1.35}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00035}
        shadow-camera-near={0.15}
        shadow-camera-far={8}
      />
      <pointLight position={[0.58, 1.18, WALL + 0.66]} intensity={2.8} color="#ffc27a" distance={3.4} decay={2} />
      <pointLight position={[0.58, 1.22, WALL + 0.66]} intensity={0.55} color="#fff1c8" distance={1.1} />
    </>
  );
};

const Laptop = ({ t, onOpen, onHint, clearHint }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const titles = t.projects.items.map((p) => p.title);
  const screen = useMemo(() => makeScreen(titles), [titles.join('|')]);
  useEffect(() => () => screen.dispose(), [screen]);

  return (
    <group
      position={[0.04, 0.76, WALL + 0.5]}
      rotation={[0, 0.04, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHint(t.den.desk);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        clearHint();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <FitGLB url={PH.laptop} height={0.2} />
      <mesh position={[0, 0.11, -0.01]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[0.28, 0.16]} />
        <meshStandardMaterial map={screen} emissive="#10241c" emissiveIntensity={0.7} roughness={0.32} />
      </mesh>
    </group>
  );
};

const DenScene = ({ focus, setFocus, setHint, setPanel, onViewChange, bake }) => {
  const { t } = useLanguage();
  const hint = (text) => setHint(text);
  const clear = () => setHint('');

  return (
    <>
      <CameraRig focus={focus} frozen={bake} />
      <BakeCapture enabled={bake} />
      <hemisphereLight args={['#ffc090', '#1a100c', 0.22]} />
      <ambientLight intensity={0.16} color="#ffd2a8" />
      <directionalLight
        position={[-1.6, 2.4, 1.8]}
        intensity={0.18}
        color="#c8b49a"
        castShadow={false}
      />
      <LampKey />

      <RoomShell />

      <WallMaps
        hint={t.den.maps}
        onHint={hint}
        clearHint={clear}
        onClick={() => setFocus(focus === 'maps' ? 'home' : 'maps')}
      />

      <FitGLB url={PH.desk} height={0.76} width={1.92} position={[0.02, 0, WALL + 0.5]} />
      <FitGLB url="/models/office-chair.glb" height={0.98} position={[-0.1, 0, WALL + 1.32]} rotation={[0, Math.PI, 0]} />

      <Laptop
        t={t}
        onOpen={() => {
          if (focus === 'laptop') setPanel('projects');
          else setFocus('laptop');
        }}
        onHint={hint}
        clearHint={clear}
      />

      <FitGLB url={PH.lamp} height={0.5} position={[0.58, 0.76, WALL + 0.62]} onMat={lampMat} />

      <Hotspot hint={t.den.kit} onOver={hint} onOut={clear} onClick={() => setPanel('skills')}>
        <FitGLB url={PH.books} height={0.16} sit={false} position={[-0.62, 0.84, WALL + 0.42]} rotation={[0, 0.18, 0]} />
      </Hotspot>

      <Hotspot hint={t.den.diploma} onOver={hint} onOut={clear} onClick={() => setPanel('education')}>
        <FitGLB url={PH.shelf} height={1.22} position={[-1.88, 0, WALL + 1.02]} rotation={[0, 0.55, 0]} />
      </Hotspot>

      <Hotspot hint={t.den.about} onOver={hint} onOut={clear} onClick={() => setPanel('about')}>
        <FitGLB url={PH.plant} height={0.72} position={[-1.55, 0, WALL + 0.38]} />
      </Hotspot>

      <Hotspot hint={t.den.mail} onOver={hint} onOut={clear} onClick={() => setPanel('contact')}>
        <FitGLB url="/models/kenney/radio.glb" height={0.12} sit={false} position={[0.78, 0.82, WALL + 0.36]} rotation={[0, -0.4, 0]} />
      </Hotspot>

      <Hotspot
        hint={t.den.piano}
        onOver={hint}
        onOut={clear}
        onClick={() => {
          setFocus('piano');
          window.open(LUTRA, '_blank', 'noopener,noreferrer');
        }}
      >
        <FitGLB url="/models/piano.glb" height={1.08} position={[1.95, 0, WALL + 0.42]} rotation={[0, -0.55, 0]} />
      </Hotspot>

      <Hotspot
        hint={t.den.guitar}
        onOver={hint}
        onOut={clear}
        onClick={() => {
          setFocus('guitar');
          window.open(LUTRA, '_blank', 'noopener,noreferrer');
        }}
      >
        <group position={[1.16, 0.58, WALL + 0.68]} rotation={[-0.18, 0.92, 0.06]}>
          <Guitar />
        </group>
      </Hotspot>

      <Hotspot hint={t.den.lab} onOver={hint} onOut={clear} onClick={() => setPanel('experience')}>
        <FitGLB url={PH.books} height={0.14} sit={false} position={[-1.78, 0.7, WALL + 1.08]} rotation={[0, 0.55, 0]} />
      </Hotspot>

      <Hotspot hint={t.den.tools} onOver={hint} onOut={clear} onClick={() => onViewChange('utility')}>
        <FitGLB url="/models/kenney/cardboardBoxClosed.glb" height={0.28} position={[-1.18, 0, 0.42]} rotation={[0, 0.35, 0]} />
      </Hotspot>
    </>
  );
};

export default DenScene;
