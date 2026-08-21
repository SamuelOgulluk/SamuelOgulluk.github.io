import React, { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox, useCursor, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/App';
import CameraRig from './CameraRig';
import DenOtter from './DenOtter';

const LUTRA = 'https://samuelogulluk.github.io/lutra/';

const makeDiploma = (title) => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const g = c.getContext('2d');
  g.fillStyle = '#f4e6c4';
  g.fillRect(0, 0, 512, 640);
  g.strokeStyle = '#b08a3e';
  g.lineWidth = 20;
  g.strokeRect(24, 24, 464, 592);
  g.strokeStyle = '#d4b46a';
  g.lineWidth = 4;
  g.strokeRect(40, 40, 432, 560);
  g.fillStyle = '#6a3a1c';
  g.font = '600 48px Georgia, serif';
  g.textAlign = 'center';
  g.fillText(title, 256, 150);
  g.fillStyle = '#5b4630';
  g.font = '22px Georgia, serif';
  g.fillText('École Normale Supérieure', 256, 250);
  g.fillText('Paris-Saclay', 256, 286);
  g.font = '18px Georgia, serif';
  g.fillText('Electrical Engineering · CS · Maths', 256, 340);
  g.beginPath();
  g.arc(256, 470, 52, 0, Math.PI * 2);
  g.fillStyle = '#c9a227';
  g.fill();
  g.beginPath();
  g.arc(256, 470, 36, 0, Math.PI * 2);
  g.fillStyle = '#efe0a8';
  g.fill();
  g.fillStyle = '#7a4a18';
  g.font = 'bold 20px Georgia, serif';
  g.fillText('ENS', 256, 478);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
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
    const n = 90;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      a[i * 3] = (Math.random() - 0.5) * 2.4;
      a[i * 3 + 1] = 0.5 + Math.random() * 1.5;
      a[i * 3 + 2] = -1.6 + Math.random() * 2.2;
    }
    return a;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffe6c4" size={0.018} transparent opacity={0.42} depthWrite={false} sizeAttenuation />
    </points>
  );
};

const Piano = () => (
  <group position={[1.32, 0, 0.02]} rotation={[0, -0.48, 0]} scale={0.74}>
    <RoundedBox args={[1.02, 0.92, 0.4]} radius={0.02} position={[0, 0.52, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#2b1b14" roughness={0.55} />
    </RoundedBox>
    <mesh position={[0, 1.02, -0.02]} castShadow>
      <boxGeometry args={[1.02, 0.08, 0.42]} />
      <meshStandardMaterial color="#23150f" roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.62, 0.18]}>
      <boxGeometry args={[0.9, 0.045, 0.15]} />
      <meshStandardMaterial color="#f3eee6" roughness={0.4} />
    </mesh>
    {[-0.34, -0.22, -0.08, 0.04, 0.16, 0.3].map((x) => (
      <mesh key={x} position={[x, 0.65, 0.16]}>
        <boxGeometry args={[0.045, 0.028, 0.1]} />
        <meshStandardMaterial color="#14110f" />
      </mesh>
    ))}
    <mesh position={[0, 0.78, 0.02]}>
      <boxGeometry args={[0.7, 0.22, 0.02]} />
      <meshStandardMaterial color="#1a120e" />
    </mesh>
    {[-0.42, 0.42].map((x) => (
      <mesh key={x} position={[x, 0.16, 0.12]} castShadow>
        <boxGeometry args={[0.08, 0.32, 0.08]} />
        <meshStandardMaterial color="#2b1b14" />
      </mesh>
    ))}
  </group>
);

const Guitar = () => (
  <group position={[1.02, 0.5, 0.62]} rotation={[0.12, 0.15, -0.38]} scale={0.95}>
    <mesh scale={[1.05, 1.22, 0.22]} castShadow>
      <sphereGeometry args={[0.155, 24, 16]} />
      <meshStandardMaterial color="#c57a38" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.16, 0]} scale={[0.78, 0.68, 0.2]} castShadow>
      <sphereGeometry args={[0.145, 24, 16]} />
      <meshStandardMaterial color="#b86c30" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.02, 0.04]}>
      <circleGeometry args={[0.04, 20]} />
      <meshStandardMaterial color="#1a100c" />
    </mesh>
    <mesh position={[0, 0.48, 0]} castShadow>
      <boxGeometry args={[0.034, 0.55, 0.028]} />
      <meshStandardMaterial color="#5c3a22" roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.78, 0]}>
      <boxGeometry args={[0.068, 0.1, 0.028]} />
      <meshStandardMaterial color="#4a2e1a" />
    </mesh>
    {[-0.01, 0.01].map((x) => (
      <mesh key={x} position={[x, 0.32, 0.018]}>
        <boxGeometry args={[0.004, 0.62, 0.002]} />
        <meshStandardMaterial color="#d8d0c4" metalness={0.6} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

const makeScreen = (titles) => {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 640;
  const g = c.getContext('2d');
  g.fillStyle = '#07140f';
  g.fillRect(0, 0, 1024, 640);
  g.fillStyle = '#0e2a20';
  g.fillRect(0, 0, 1024, 72);
  g.fillStyle = '#8fd6ff';
  g.font = '600 36px ui-monospace, monospace';
  g.fillText('~/projects', 36, 48);
  g.fillStyle = '#d4f6e2';
  g.font = '44px ui-monospace, monospace';
  titles.forEach((name, i) => {
    g.fillStyle = '#3ecf8e';
    g.fillText('▸', 36, 150 + i * 88);
    g.fillStyle = '#d4f6e2';
    g.fillText(name, 84, 150 + i * 88);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
};

const Laptop = ({ t, onOpen, onHint, clearHint }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const titles = t.projects.items.map((p) => p.title);
  const screen = useMemo(() => makeScreen(titles), [titles.join('|')]);
  useEffect(() => () => screen.dispose(), [screen]);

  return (
    <group
      position={[0.02, 0.765, 0.2]}
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
      <RoundedBox args={[0.7, 0.018, 0.46]} radius={0.012} castShadow>
        <meshStandardMaterial color="#3c4046" metalness={0.55} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, 0.011, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.62, 0.28]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.6} />
      </mesh>
      <group position={[0, 0.01, -0.21]} rotation={[-0.1, 0, 0]}>
        <RoundedBox args={[0.68, 0.42, 0.014]} radius={0.01} position={[0, 0.21, 0]} castShadow>
          <meshStandardMaterial color="#2f3338" metalness={0.5} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0.21, 0.008]}>
          <planeGeometry args={[0.62, 0.36]} />
          <meshStandardMaterial map={screen} emissive="#14352a" emissiveIntensity={0.35} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
};

const DenScene = ({ focus, setFocus, setHint, setPanel, onViewChange }) => {
  const { t } = useLanguage();
  const [paris, wood, rug, plaster] = useTexture([
    '/assets/paris-window.jpg',
    '/assets/wood.jpg',
    '/assets/rug.jpg',
    '/assets/plaster.jpg',
  ]);
  const diplomaTex = useMemo(() => makeDiploma(t.den.degree), [t.den.degree]);

  useEffect(() => {
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    wood.anisotropy = 8;
    wood.repeat.set(4, 3);
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(2.2, 1.4);
    plaster.anisotropy = 4;
    wood.colorSpace = THREE.SRGBColorSpace;
    paris.colorSpace = THREE.SRGBColorSpace;
    rug.colorSpace = THREE.SRGBColorSpace;
    plaster.colorSpace = THREE.SRGBColorSpace;
    wood.needsUpdate = true;
  }, [wood, paris, rug, plaster]);

  useEffect(() => () => diplomaTex.dispose(), [diplomaTex]);

  const hint = (text) => setHint(text);
  const clear = () => setHint('');

  return (
    <>
      <CameraRig focus={focus} />
      <hemisphereLight args={['#ffd8b0', '#3a2a20', 0.55]} />
      <ambientLight intensity={0.42} color="#ffe8d0" />
      <directionalLight
        position={[0.15, 2.25, -2.55]}
        intensity={2.55}
        color="#ffb066"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.4}
        shadow-camera-far={12}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <pointLight position={[0, 1.55, -1.95]} intensity={2.6} color="#ff8a3a" distance={9} />
      <pointLight position={[0.4, 1.18, 0.28]} intensity={1.35} color="#ffd19a" distance={3.4} />
      <pointLight position={[0, 1.7, 2.4]} intensity={0.28} color="#fff3e4" distance={7} />

      <mesh position={[0, 1.45, -4.15]}>
        <planeGeometry args={[8.2, 4.0]} />
        <meshBasicMaterial map={paris} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.15]} receiveShadow>
        <planeGeometry args={[5.5, 4.4]} />
        <meshStandardMaterial map={wood} roughness={0.82} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.55]} receiveShadow>
        <planeGeometry args={[2.15, 1.45]} />
        <meshStandardMaterial map={rug} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.56, 0.1]} receiveShadow>
        <boxGeometry args={[5.5, 0.06, 4.4]} />
        <meshStandardMaterial map={plaster} color="#f2e6d4" roughness={0.95} />
      </mesh>

      <mesh position={[-2.72, 1.28, 0.1]} receiveShadow>
        <boxGeometry args={[0.1, 2.56, 4.4]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[2.72, 1.28, 0.1]} receiveShadow>
        <boxGeometry args={[0.1, 2.56, 4.4]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[-1.98, 1.28, -1.95]} receiveShadow>
        <boxGeometry args={[1.48, 2.56, 0.1]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[1.98, 1.28, -1.95]} receiveShadow>
        <boxGeometry args={[1.48, 2.56, 0.1]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.38, -1.95]} receiveShadow>
        <boxGeometry args={[2.5, 0.36, 0.1]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.44, -1.95]} receiveShadow>
        <boxGeometry args={[2.5, 0.88, 0.1]} />
        <meshStandardMaterial map={plaster} roughness={0.92} />
      </mesh>

      <mesh position={[0, 0.9, -1.82]} castShadow receiveShadow>
        <boxGeometry args={[2.62, 0.08, 0.22]} />
        <meshStandardMaterial color="#f3ece0" roughness={0.7} />
      </mesh>
      <mesh position={[-1.28, 1.56, -1.88]}>
        <boxGeometry args={[0.07, 1.4, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.55} />
      </mesh>
      <mesh position={[1.28, 1.56, -1.88]}>
        <boxGeometry args={[0.07, 1.4, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.24, -1.88]}>
        <boxGeometry args={[2.62, 0.07, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.94, -1.88]}>
        <boxGeometry args={[2.62, 0.07, 0.08]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.56, -1.88]}>
        <boxGeometry args={[0.045, 1.28, 0.04]} />
        <meshStandardMaterial color="#f4eee4" />
      </mesh>
      <mesh position={[0, 1.38, -1.88]}>
        <boxGeometry args={[2.5, 0.035, 0.04]} />
        <meshStandardMaterial color="#f4eee4" />
      </mesh>
      <mesh position={[0, 1.78, -1.88]}>
        <boxGeometry args={[2.5, 0.035, 0.04]} />
        <meshStandardMaterial color="#f4eee4" />
      </mesh>
      <mesh position={[0, 1.56, -1.9]}>
        <planeGeometry args={[2.48, 1.28]} />
        <meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.1} roughness={0.05} metalness={0.05} />
      </mesh>
      <mesh position={[-1.22, 1.52, -1.8]} rotation={[0, 0.08, 0.04]} castShadow>
        <boxGeometry args={[0.2, 1.48, 0.05]} />
        <meshStandardMaterial color="#e4c49a" roughness={0.82} />
      </mesh>
      <mesh position={[1.22, 1.52, -1.8]} rotation={[0, -0.08, -0.04]} castShadow>
        <boxGeometry args={[0.2, 1.48, 0.05]} />
        <meshStandardMaterial color="#e4c49a" roughness={0.82} />
      </mesh>

      <Hotspot
        hint={t.den.window}
        onOver={hint}
        onOut={clear}
        onClick={() => setFocus(focus === 'window' ? 'home' : 'window')}
      >
        <mesh position={[0, 1.56, -1.86]}>
          <planeGeometry args={[2.5, 1.32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Hotspot>

      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[(i - 5) * 0.17, 0.3, -1.76]} castShadow>
          <boxGeometry args={[0.13, 0.5, 0.09]} />
          <meshStandardMaterial color="#efe6d8" metalness={0.25} roughness={0.45} />
        </mesh>
      ))}

      <Hotspot
        hint={t.den.diploma}
        onOver={hint}
        onOut={clear}
        onClick={() => {
          setFocus('diploma');
          setPanel('education');
        }}
      >
        <group position={[-1.52, 1.62, -1.88]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.5, 0.03]} />
            <meshStandardMaterial color="#7a4e22" roughness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.32, 0.42]} />
            <meshStandardMaterial map={diplomaTex} roughness={0.7} />
          </mesh>
        </group>
      </Hotspot>

      <RoundedBox args={[1.72, 0.06, 0.78]} radius={0.02} position={[0, 0.73, 0.18]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} color="#8d5a32" roughness={0.5} />
      </RoundedBox>
      {[
        [-0.72, 0.36, -0.1],
        [0.72, 0.36, -0.1],
        [-0.72, 0.36, 0.46],
        [0.72, 0.36, 0.46],
      ].map((p) => (
        <mesh key={p.join(',')} position={p} castShadow>
          <boxGeometry args={[0.07, 0.72, 0.07]} />
          <meshStandardMaterial color="#6e4226" roughness={0.55} />
        </mesh>
      ))}

      <Laptop
        t={t}
        onOpen={() => {
          if (focus === 'laptop') setPanel('projects');
          else setFocus('laptop');
        }}
        onHint={hint}
        clearHint={clear}
      />

      <group position={[0.42, 0.78, 0.28]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, -0.02]} rotation={[0.4, 0, 0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
          <meshStandardMaterial color="#2f2f2f" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0.02, 0.36, -0.08]} rotation={[1.05, 0, 0]}>
          <coneGeometry args={[0.07, 0.1, 16]} />
          <meshStandardMaterial color="#d9a05a" roughness={0.45} />
        </mesh>
      </group>

      <Hotspot hint={t.den.about} onOver={hint} onOut={clear} onClick={() => setPanel('about')}>
        <mesh position={[-0.48, 0.79, 0.32]} castShadow>
          <cylinderGeometry args={[0.035, 0.028, 0.07, 16]} />
          <meshStandardMaterial color="#cfe6dc" roughness={0.4} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.kit} onOver={hint} onOut={clear} onClick={() => setPanel('skills')}>
        <mesh position={[-0.62, 0.775, 0.05]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.16, 0.02, 0.22]} />
          <meshStandardMaterial color="#3d6a8a" roughness={0.55} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.mail} onOver={hint} onOut={clear} onClick={() => setPanel('contact')}>
        <mesh position={[0.52, 0.772, 0.08]} rotation={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.12, 0.01, 0.08]} />
          <meshStandardMaterial color="#f4f0e6" roughness={0.65} />
        </mesh>
      </Hotspot>
      <Hotspot hint={t.den.lab} onOver={hint} onOut={clear} onClick={() => setPanel('experience')}>
        <mesh position={[0.58, 0.79, 0.38]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.04, 0.18]} />
          <meshStandardMaterial color="#d7c39a" roughness={0.7} />
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
        <Piano />
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
        <Guitar />
      </Hotspot>

      <Hotspot hint={t.den.tools} onOver={hint} onOut={clear} onClick={() => onViewChange('utility')}>
        <group position={[-1.85, 0.16, 1.05]}>
          <RoundedBox args={[0.38, 0.22, 0.26]} radius={0.02} castShadow>
            <meshStandardMaterial color="#6b4428" roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.28]} />
            <meshStandardMaterial color="#5a3820" />
          </mesh>
        </group>
      </Hotspot>

      <DenOtter t={t} setHint={setHint} />
      <Dust />
      <ContactShadows position={[0, 0.02, 0.2]} opacity={0.38} scale={8} blur={2.2} far={3.5} />
    </>
  );
};

export default DenScene;
