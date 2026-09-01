import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCursor, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import CameraRig from './CameraRig';
import BakeCapture from './BakeCapture';
import { Guitar } from './DenInstruments';
import { FitGLB, FramedMap, RoomShell, BookRow } from './KenneyProp';

const LUTRA = 'https://samuelogulluk.github.io/lutra/';
const WALL = -1.5;

const PH = {
  desk: '/models/ikea/micke-desk.glb',
  lamp: '/models/ph/desk_lamp_arm_01/desk_lamp_arm_01_1k.gltf',
  laptop: '/models/ph/classic_laptop/classic_laptop_1k.gltf',
  frameA: '/models/ph/hanging_picture_frame_01/hanging_picture_frame_01_1k.gltf',
  frameB: '/models/ph/hanging_picture_frame_02/hanging_picture_frame_02_1k.gltf',
  plant: '/models/ph/potted_plant_04/potted_plant_04_1k.gltf',
  books: '/models/ph/book_encyclopedia_set_01/book_encyclopedia_set_01_1k.gltf',
  shelf: '/models/ph/wooden_display_shelves_01/wooden_display_shelves_01_1k.gltf',
};

const lampMat = (mat) => {
  if (`${mat.name || ''}`.toLowerCase().includes('light')) {
    mat.emissive = new THREE.Color('#ffe6a8');
    mat.emissiveIntensity = 3.6;
    mat.toneMapped = false;
  }
};

const deskMat = (mat) => {
  mat.map = null;
  mat.normalMap = null;
  mat.roughnessMap = null;
  mat.metalnessMap = null;
  mat.aoMap = null;
  mat.color = new THREE.Color('#f1eee8');
  mat.metalness = 0.04;
  mat.roughness = 0.48;
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

const makeDawScreen = () => {
  const src = document.createElement('canvas');
  src.width = 640;
  src.height = 400;
  const g = src.getContext('2d');
  g.fillStyle = '#071018';
  g.fillRect(0, 0, 640, 400);
  g.fillStyle = '#0c2430';
  g.fillRect(0, 0, 640, 44);
  g.fillStyle = '#7ee0c8';
  g.font = '26px monospace';
  g.fillText('Loutone', 16, 30);
  g.fillStyle = '#3ecf8e';
  g.fillRect(520, 12, 18, 18);
  const rows = ['#2a6b8a', '#3ecf8e', '#e8a872', '#6aa8d1'];
  for (let i = 0; i < 4; i += 1) {
    g.fillStyle = '#102028';
    g.fillRect(16, 64 + i * 72, 608, 64);
    g.fillStyle = rows[i];
    g.fillRect(88, 80 + i * 72, 40 + i * 70, 32);
    g.fillStyle = '#8fd6ff';
    g.font = '18px monospace';
    g.fillText(`ch ${i + 1}`, 24, 102 + i * 72);
  }
  const tex = new THREE.CanvasTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
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
        spot.current.target.position.set(0.02, 0.76, WALL + 0.45);
    spot.current.target.updateMatrixWorld();
  }, []);
  return (
    <>
      <spotLight
        ref={spot}
        position={[0.42, 1.22, WALL + 0.62]}
        angle={0.92}
        penumbra={0.62}
        intensity={48}
        color="#ffb66a"
        castShadow
        distance={9}
        decay={1.35}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00035}
        shadow-camera-near={0.15}
        shadow-camera-far={8}
      />
      <pointLight position={[0.42, 1.14, WALL + 0.58]} intensity={4.4} color="#ffc070" distance={4.2} decay={2} />
      <pointLight position={[0.42, 1.18, WALL + 0.58]} intensity={0.85} color="#ffe4b8" distance={1.4} />
    </>
  );
};

const KeyboardStation = ({ hint, onHint, clearHint, onClick }) => {
  const screen = useMemo(() => makeDawScreen(), []);
  useEffect(() => () => screen.dispose(), [screen]);
  return (
    <Hotspot hint={hint} onOver={onHint} onOut={clearHint} onClick={onClick}>
      <group position={[1.86, 0, WALL + 0.58]} rotation={[0, -0.38, 0]}>
        <FitGLB url="/models/keyboard.glb" height={0.13} />
        <group position={[-0.22, 0.13, -0.06]} rotation={[0, 0.12, 0]}>
          <FitGLB url={PH.laptop} height={0.11} />
          <mesh position={[0, 0.06, -0.006]} rotation={[-0.22, 0, 0]}>
            <planeGeometry args={[0.155, 0.09]} />
            <meshStandardMaterial map={screen} emissive="#0a2430" emissiveIntensity={0.85} roughness={0.28} />
          </mesh>
        </group>
      </group>
    </Hotspot>
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
      position={[0.0, 0.75, WALL + 0.52]}
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
      <hemisphereLight args={['#fff1dc', '#4a3220', 0.55]} />
      <ambientLight intensity={0.46} color="#fff4e4" />
      <directionalLight
        position={[0.25, 2.9, 3.1]}
        intensity={0.62}
        color="#ffe9d0"
        castShadow={false}
      />
      <pointLight position={[0.1, 2.05, 1.15]} intensity={9} color="#ffe4c4" distance={10} decay={2} />
      <LampKey />

      <RoomShell />

      <WallMaps
        hint={t.den.maps}
        onHint={hint}
        clearHint={clear}
        onClick={() => setFocus(focus === 'maps' ? 'home' : 'maps')}
      />

      <FitGLB url={PH.desk} height={0.75} width={1.52} position={[0.02, 0, WALL + 0.48]} rotation={[0, Math.PI, 0]} onMat={deskMat} />
      <FitGLB url="/models/office-chair.glb" height={0.98} position={[-0.06, 0, WALL + 1.18]} rotation={[0, Math.PI, 0]} />

      <Laptop
        t={t}
        onOpen={() => {
          if (focus === 'laptop') setPanel('projects');
          else setFocus('laptop');
        }}
        onHint={hint}
        clearHint={clear}
      />

      <FitGLB url={PH.lamp} height={0.48} position={[0.42, 0.75, WALL + 0.5]} onMat={lampMat} />

      <group position={[-2.12, 0, WALL + 0.04]} rotation={[0, -Math.PI / 2, 0]}>
        <Hotspot hint={t.den.diploma} onOver={hint} onOut={clear} onClick={() => setPanel('education')}>
          <FitGLB url={PH.shelf} height={1.48} />
        </Hotspot>
        <Hotspot hint={t.den.kit} onOver={hint} onOut={clear} onClick={() => setPanel('skills')}>
          <BookRow name="book_row_0" height={0.22} position={[0.03, 0.38, -0.34]} rotation={[0, Math.PI / 2, 0]} />
          <BookRow name="book_row_1" height={0.22} position={[0.03, 0.38, 0]} rotation={[0, Math.PI / 2, 0]} />
          <BookRow name="book_row_2" height={0.22} position={[0.03, 0.38, 0.34]} rotation={[0, Math.PI / 2, 0]} />
        </Hotspot>
        <Hotspot hint={t.den.lab} onOver={hint} onOut={clear} onClick={() => setPanel('experience')}>
          <BookRow name="book_row_3" height={0.22} position={[0.03, 0.75, -0.34]} rotation={[0, Math.PI / 2, 0]} />
          <BookRow name="book_row_4" height={0.22} position={[0.03, 0.75, 0]} rotation={[0, Math.PI / 2, 0]} />
          <FitGLB url={PH.books} height={0.22} width={0.3} sit position={[0.03, 0.75, 0.34]} rotation={[0, Math.PI / 2, 0]} />
        </Hotspot>
        <Hotspot hint={t.den.diploma} onOver={hint} onOut={clear} onClick={() => setPanel('education')}>
          <BookRow name="book_row_5" height={0.22} position={[0.03, 1.12, -0.34]} rotation={[0, Math.PI / 2, 0]} />
          <BookRow name="book_row_6" height={0.22} position={[0.03, 1.12, 0]} rotation={[0, Math.PI / 2, 0]} />
          <BookRow name="book_row_7" height={0.22} position={[0.03, 1.12, 0.34]} rotation={[0, Math.PI / 2, 0]} />
        </Hotspot>
      </group>

      <Hotspot hint={t.den.about} onOver={hint} onOut={clear} onClick={() => setPanel('about')}>
        <FitGLB url={PH.plant} height={0.72} position={[-1.38, 0, WALL + 0.36]} />
      </Hotspot>

      <Hotspot hint={t.den.mail} onOver={hint} onOut={clear} onClick={() => setPanel('contact')}>
        <FitGLB url="/models/kenney/radio.glb" height={0.12} sit={false} position={[0.48, 0.8, WALL + 0.32]} rotation={[0, -0.4, 0]} />
      </Hotspot>

      <KeyboardStation
        hint={t.den.piano}
        onHint={hint}
        clearHint={clear}
        onClick={() => {
          setFocus('piano');
          setPanel('loutone');
        }}
      />

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

      <Hotspot hint={t.den.tools} onOver={hint} onOut={clear} onClick={() => onViewChange('utility')}>
        <FitGLB url="/models/kenney/cardboardBoxClosed.glb" height={0.28} position={[-1.18, 0, 0.42]} rotation={[0, 0.35, 0]} />
      </Hotspot>
    </>
  );
};

export default DenScene;
