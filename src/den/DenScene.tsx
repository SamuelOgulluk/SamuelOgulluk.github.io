import React, { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useCursor, useTexture } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import CameraRig from './CameraRig';
import DenOtter from './DenOtter';
import PixelOutlines from './PixelOutlines';
import { Guitar, GuitarStand, Piano, Plant } from './DenInstruments';

const LUTRA = 'https://samuelogulluk.github.io/lutra/';
const WALL = -1.5;

const linear = (tex, repeat) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
};

const makeDiploma = (title) => {
  const src = document.createElement('canvas');
  src.width = 256;
  src.height = 330;
  const g = src.getContext('2d');
  g.fillStyle = '#c4a056';
  g.fillRect(0, 0, 256, 330);
  g.fillStyle = '#f4ead0';
  g.fillRect(16, 16, 224, 298);
  g.fillStyle = '#6a3a1c';
  g.font = 'bold 28px serif';
  g.textAlign = 'center';
  g.fillText(title.slice(0, 12), 128, 70);
  g.fillStyle = '#5b4630';
  g.font = '22px serif';
  g.fillText('ENS', 128, 130);
  g.fillText('Paris-Saclay', 128, 162);
  g.strokeStyle = '#c9a227';
  g.lineWidth = 3;
  g.beginPath();
  g.arc(128, 240, 28, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#c9a227';
  g.beginPath();
  g.arc(128, 240, 12, 0, Math.PI * 2);
  g.fill();
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

const makePoster = () => {
  const src = document.createElement('canvas');
  src.width = 256;
  src.height = 320;
  const g = src.getContext('2d');
  g.fillStyle = '#efe4ce';
  g.fillRect(0, 0, 256, 320);
  g.fillStyle = '#d7c4a4';
  g.fillRect(18, 48, 220, 250);
  const blocks = [
    ['#8aa07a', 36, 70, 70, 48],
    ['#c4a070', 120, 78, 90, 40],
    ['#7a90a8', 40, 130, 50, 70],
    ['#b87a62', 108, 128, 96, 55],
    ['#6e8a6a', 44, 214, 80, 50],
    ['#d0b07a', 140, 200, 70, 70],
  ];
  blocks.forEach((b) => {
    g.fillStyle = b[0];
    g.fillRect(b[1], b[2], b[3], b[4]);
  });
  g.fillStyle = '#3a2a18';
  g.font = 'bold 26px serif';
  g.textAlign = 'center';
  g.fillText('PARIS', 128, 34);
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

const Dust = () => {
  const ref = React.useRef(null);
  const positions = useMemo(() => {
    const n = 40;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      a[i * 3] = (Math.random() - 0.5) * 2.4;
      a[i * 3 + 1] = 0.5 + Math.random() * 1.4;
      a[i * 3 + 2] = -1.4 + Math.random() * 1.8;
    }
    return a;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffe6c4" size={0.018} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
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
      position={[0.02, 0.87, WALL + 0.52]}
      rotation={[0, 0.03, 0]}
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
      <RoundedBox args={[0.72, 0.02, 0.46]} radius={0.01} castShadow>
        <meshStandardMaterial color="#3c4046" roughness={0.4} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.012, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.64, 0.28]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.5} />
      </mesh>
      <group position={[0, 0.01, -0.21]} rotation={[-0.08, 0, 0]}>
        <RoundedBox args={[0.7, 0.42, 0.016]} radius={0.01} position={[0, 0.21, 0]} castShadow>
          <meshStandardMaterial color="#2f3338" roughness={0.38} metalness={0.12} />
        </RoundedBox>
        <mesh position={[0, 0.21, 0.01]}>
          <planeGeometry args={[0.64, 0.36]} />
          <meshStandardMaterial map={screen} emissive="#10241c" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const DenScene = ({ focus, setFocus, setHint, setPanel, onViewChange }) => {
  const { t } = useLanguage();
  const paris = useTexture('/assets/paris-window.jpg');
  const diplomaTex = useMemo(() => makeDiploma(t.den.degree), [t.den.degree]);
  const posterTex = useMemo(() => makePoster(), []);

  useEffect(() => {
    linear(paris);
  }, [paris]);

  useEffect(
    () => () => {
      diplomaTex.dispose();
      posterTex.dispose();
    },
    [diplomaTex, posterTex]
  );

  const hint = (text) => setHint(text);
  const clear = () => setHint('');

  return (
    <>
      <CameraRig focus={focus} />
      <hemisphereLight args={['#ffd8b0', '#4a382c', 0.85]} />
      <ambientLight intensity={0.62} color="#ffe8d0" />
      <directionalLight
        position={[-2.1, 3.1, 1.2]}
        intensity={1.55}
        color="#ffc080"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.4}
        shadow-camera-far={12}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.001}
      />
      <pointLight position={[0, 1.5, WALL]} intensity={1.35} color="#ff8a3a" distance={7} />
      <pointLight position={[0.4, 1.2, -0.9]} intensity={0.7} color="#ffd19a" distance={3} />

      <mesh position={[0, 1.4, -3.6]}>
        <planeGeometry args={[7.4, 3.6]} />
        <meshBasicMaterial map={paris} />
      </mesh>

      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-2.4 + i * 0.44, 0, -0.15]} receiveShadow>
          <planeGeometry args={[0.42, 4.3]} />
          <meshStandardMaterial color={i % 2 ? '#c9a078' : '#be946c'} roughness={0.7} />
        </mesh>
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={`g${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2.18 + i * 0.44, 0.003, -0.15]}>
          <planeGeometry args={[0.012, 4.3]} />
          <meshStandardMaterial color="#8a6248" roughness={0.75} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.05, 0.014, 0.35]} receiveShadow>
        <planeGeometry args={[1.7, 1.15]} />
        <meshStandardMaterial color="#7a3a32" roughness={0.72} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.05, 0.016, 0.35]}>
        <planeGeometry args={[1.52, 0.98]} />
        <meshStandardMaterial color="#a04a3c" roughness={0.68} />
      </mesh>

      <mesh position={[0, 2.5, -0.15]} receiveShadow>
        <boxGeometry args={[5.4, 0.08, 4.3]} />
        <meshStandardMaterial color="#efe3d0" roughness={0.85} />
      </mesh>
      <mesh position={[-2.68, 1.25, -0.15]} receiveShadow>
        <boxGeometry args={[0.1, 2.5, 4.3]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.85} />
      </mesh>
      <mesh position={[2.68, 1.25, -0.15]} receiveShadow>
        <boxGeometry args={[0.1, 2.5, 4.3]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.85} />
      </mesh>
      <mesh position={[-1.95, 1.25, WALL]} receiveShadow>
        <boxGeometry args={[1.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#eadfcd" roughness={0.85} />
      </mesh>
      <mesh position={[1.95, 1.25, WALL]} receiveShadow>
        <boxGeometry args={[1.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#eadfcd" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.32, WALL]} receiveShadow>
        <boxGeometry args={[2.5, 0.36, 0.1]} />
        <meshStandardMaterial color="#eadfcd" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.42, WALL]} receiveShadow>
        <boxGeometry args={[2.52, 0.84, 0.12]} />
        <meshStandardMaterial color="#eadfcd" roughness={0.85} />
      </mesh>

      <mesh position={[-1.26, 1.52, WALL + 0.04]}>
        <boxGeometry args={[0.07, 1.38, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.5} />
      </mesh>
      <mesh position={[1.26, 1.52, WALL + 0.04]}>
        <boxGeometry args={[0.07, 1.38, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.2, WALL + 0.04]}>
        <boxGeometry args={[2.58, 0.07, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.86, WALL + 0.04]}>
        <boxGeometry args={[2.58, 0.06, 0.1]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.52, WALL + 0.04]}>
        <boxGeometry args={[0.04, 1.26, 0.04]} />
        <meshStandardMaterial color="#f4eee4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.34, WALL + 0.04]}>
        <boxGeometry args={[2.46, 0.03, 0.04]} />
        <meshStandardMaterial color="#f4eee4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.74, WALL + 0.04]}>
        <boxGeometry args={[2.46, 0.03, 0.04]} />
        <meshStandardMaterial color="#f4eee4" roughness={0.5} />
      </mesh>
      <mesh position={[-1.2, 1.5, WALL + 0.12]} rotation={[0, 0.06, 0.03]} castShadow>
        <boxGeometry args={[0.18, 1.4, 0.05]} />
        <meshStandardMaterial color="#e4c49a" roughness={0.55} />
      </mesh>
      <mesh position={[1.2, 1.5, WALL + 0.12]} rotation={[0, -0.06, -0.03]} castShadow>
        <boxGeometry args={[0.18, 1.4, 0.05]} />
        <meshStandardMaterial color="#e4c49a" roughness={0.55} />
      </mesh>

      <Hotspot
        hint={t.den.window}
        onOver={hint}
        onOut={clear}
        onClick={() => setFocus(focus === 'window' ? 'home' : 'window')}
      >
        <mesh position={[0, 1.52, WALL + 0.06]}>
          <planeGeometry args={[2.46, 1.28]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Hotspot>

      <Hotspot
        hint={t.den.diploma}
        onOver={hint}
        onOut={clear}
        onClick={() => {
          setFocus('diploma');
          setPanel('education');
        }}
      >
        <group position={[-1.48, 1.55, WALL + 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.46, 0.03]} />
            <meshStandardMaterial color="#7a4e22" roughness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.28, 0.4]} />
            <meshStandardMaterial map={diplomaTex} roughness={0.6} />
          </mesh>
        </group>
      </Hotspot>

      <group position={[1.52, 1.55, WALL + 0.06]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.5, 0.03]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.32, 0.44]} />
          <meshStandardMaterial map={posterTex} roughness={0.6} />
        </mesh>
      </group>

      <RoundedBox args={[2.52, 0.08, 0.8]} radius={0.012} position={[0, 0.82, WALL + 0.46]} castShadow receiveShadow>
        <meshStandardMaterial color="#8d5a32" roughness={0.55} />
      </RoundedBox>
      {[
        [-1.12, 0.41, WALL + 0.18],
        [1.12, 0.41, WALL + 0.18],
        [-1.12, 0.41, WALL + 0.72],
        [1.12, 0.41, WALL + 0.72],
      ].map((p) => (
        <mesh key={p.join(',')} position={p} castShadow>
          <boxGeometry args={[0.07, 0.78, 0.07]} />
          <meshStandardMaterial color="#6e4226" roughness={0.6} />
        </mesh>
      ))}

      <group position={[-0.38, 0, WALL + 1.18]}>
        <RoundedBox args={[0.4, 0.05, 0.38]} radius={0.012} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color="#6b4428" roughness={0.55} />
        </RoundedBox>
        {[-0.15, 0.15].map((x) =>
          [-0.14, 0.14].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.21, z]} castShadow>
              <boxGeometry args={[0.04, 0.42, 0.04]} />
              <meshStandardMaterial color="#5a3620" roughness={0.6} />
            </mesh>
          ))
        )}
        <RoundedBox args={[0.4, 0.42, 0.05]} radius={0.012} position={[0, 0.66, -0.16]} castShadow>
          <meshStandardMaterial color="#6b4428" roughness={0.55} />
        </RoundedBox>
      </group>

      <Laptop
        t={t}
        onOpen={() => {
          if (focus === 'laptop') setPanel('projects');
          else setFocus('laptop');
        }}
        onHint={hint}
        clearHint={clear}
      />

      <group position={[0.48, 0.88, WALL + 0.62]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.055, 0.04, 16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.16, -0.02]} rotation={[0.35, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.24, 10]} />
          <meshStandardMaterial color="#2f2f2f" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0.02, 0.32, -0.07]} rotation={[1.0, 0, 0]} castShadow>
          <coneGeometry args={[0.07, 0.1, 16]} />
          <meshStandardMaterial color="#d9a05a" roughness={0.45} />
        </mesh>
      </group>

      <Hotspot hint={t.den.about} onOver={hint} onOut={clear} onClick={() => setPanel('about')}>
        <mesh position={[-0.52, 0.89, WALL + 0.6]} castShadow>
          <cylinderGeometry args={[0.032, 0.026, 0.06, 16]} />
          <meshStandardMaterial color="#cfe6dc" roughness={0.4} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.kit} onOver={hint} onOut={clear} onClick={() => setPanel('skills')}>
        <mesh position={[-0.7, 0.87, WALL + 0.42]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.2]} />
          <meshStandardMaterial color="#3d6a8a" roughness={0.5} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.mail} onOver={hint} onOut={clear} onClick={() => setPanel('contact')}>
        <mesh position={[0.6, 0.87, WALL + 0.4]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.11, 0.01, 0.08]} />
          <meshStandardMaterial color="#f4f0e6" roughness={0.5} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.lab} onOver={hint} onOut={clear} onClick={() => setPanel('experience')}>
        <mesh position={[0.68, 0.89, WALL + 0.65]} rotation={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.13, 0.035, 0.16]} />
          <meshStandardMaterial color="#d7c39a" roughness={0.55} />
        </mesh>
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
        <Piano position={[1.85, 0, WALL + 0.38]} rotation={[0, -0.12, 0]} />
      </Hotspot>
      <GuitarStand position={[1.18, 0, WALL + 0.72]} />
      <Hotspot
        hint={t.den.guitar}
        onOver={hint}
        onOut={clear}
        onClick={() => {
          setFocus('guitar');
          window.open(LUTRA, '_blank', 'noopener,noreferrer');
        }}
      >
        <Guitar position={[1.18, 0.62, WALL + 0.74]} rotation={[0.18, 0.62, -0.42]} scale={1.05} />
      </Hotspot>

      <Plant position={[-1.85, 0, WALL + 0.55]} />

      <Hotspot hint={t.den.tools} onOver={hint} onOut={clear} onClick={() => onViewChange('utility')}>
        <group position={[-1.55, 0.14, 0.25]}>
          <RoundedBox args={[0.34, 0.2, 0.24]} radius={0.02} castShadow>
            <meshStandardMaterial color="#6b4428" roughness={0.55} />
          </RoundedBox>
        </group>
      </Hotspot>

      <DenOtter t={t} setHint={setHint} />
      <Dust />
      <EffectComposer depthBuffer multisampling={4}>
        <PixelOutlines pixelSize={4} colorThresh={0.2} depthThresh={0.012} />
      </EffectComposer>
    </>
  );
};

export default DenScene;
