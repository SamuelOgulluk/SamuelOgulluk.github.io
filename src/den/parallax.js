import * as THREE from 'three';

const FOV = 38;
const SEG_X = 240;
const SEG_Y = 140;
const DEPTH_SCALE = 0.18;
const OVERSCAN = 1;
const ZOOM_IN = 0.23;
const POINTER_LERP = 0.06;
const FOCUS_LERP = 0.08;
const ZOOM_LERP = 0.06;
const TAN_HALF_FOV = Math.tan((FOV * Math.PI) / 180 / 2);

const VERT = `
  precision highp float;
  uniform sampler2D uDepth;
  uniform float uDepthScale, uZoomGeo;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vec3 p = position;
    p.z += (d - 0.5) * uDepthScale * uZoomGeo;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uColor;
  uniform sampler2D uDepth;
  uniform float uStrength, uTime, uParallaxScale, uImageAspect;
  uniform float uHoverAmt;
  uniform vec2 uPointer, uHoverPos;
  uniform vec4 uHoverRect;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main(){
    float d = texture2D(uDepth, vUv).r;
    vec2 sway = vec2(sin(uTime * 0.25), cos(uTime * 0.20)) * 0.12;
    vec2 uv = vUv + (uPointer + sway) * uStrength * (d - 0.5) * uParallaxScale;
    float sheen = 0.0;
    if (uHoverAmt > 0.001) {
      vec2 rp = (vUv - uHoverRect.xy) / max(uHoverRect.zw - uHoverRect.xy, vec2(1e-4));
      float fth = 0.35;
      float fx = smoothstep(0.0, fth, rp.x) * (1.0 - smoothstep(1.0 - fth, 1.0, rp.x));
      float fy = smoothstep(0.0, fth, rp.y) * (1.0 - smoothstep(1.0 - fth, 1.0, rp.y));
      float boxFade = clamp(fx, 0.0, 1.0) * clamp(fy, 0.0, 1.0);
      vec2 a = vec2(vUv.x * uImageAspect, vUv.y);
      vec2 h = vec2(uHoverPos.x * uImageAspect, uHoverPos.y);
      vec2 delta = a - h;
      float dist = length(delta);
      vec2 dir = delta / (dist + 1e-4);
      float n = vnoise(a * 9.0 + uTime * 0.6);
      float ring = sin(dist * 30.0 - uTime * 4.0 + n * 3.0);
      float falloff = exp(-dist * dist * 10.0);
      float amt = uHoverAmt * boxFade;
      uv += dir * ring * falloff * 0.006 * amt;
      uv += vec2(-dir.y, dir.x) * (n - 0.5) * falloff * 0.004 * amt;
      sheen = falloff * (0.5 + 0.5 * ring) * amt;
    }
    uv = clamp(uv, 0.0, 1.0);
    vec3 col = texture2D(uColor, uv).rgb;
    col += sheen * 0.05 * vec3(1.0, 0.97, 0.9);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const DUST_VERT = `
  attribute float aSize;
  attribute float aSpeed;
  uniform float uTime, uImageAspect, uPixelRatio, uZoomScale;
  varying highp float vSeed;
  varying vec2 vUvAnchor;
  void main() {
    vec2 anchor = position.xy;
    float seed = position.z;
    float ph = seed * 6.2831;
    vec2 wob = 0.06 * vec2(sin(uTime * aSpeed + ph), cos(uTime * aSpeed * 0.8 + ph * 1.7));
    vec2 buv = anchor + wob;
    vUvAnchor = buv;
    vec3 wpos = vec3((buv.x - 0.5) * uImageAspect, buv.y - 0.5, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(wpos, 1.0);
    gl_PointSize = max(aSize, 2.0) * uPixelRatio * uZoomScale;
    vSeed = seed;
  }
`;

const DUST_FRAG = `
  precision highp float;
  varying highp float vSeed;
  varying vec2 vUvAnchor;
  uniform float uTime;
  uniform sampler2D uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    float tw = 0.6 + 0.4 * sin(uTime * 0.8 + vSeed * 30.0);
    float lum = dot(texture2D(uColor, vUvAnchor).rgb, vec3(0.299, 0.587, 0.114));
    float gate = smoothstep(0.5, 0.78, lum);
    gl_FragColor = vec4(vec3(1.0, 0.96, 0.86), a * tw * 0.85 * gate);
  }
`;

const makeCanvas = (w, h, color) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.fillRect(0, 0, w, h);
  return c;
};

export function createParallax(container, opts) {
  const { colorURL, depthURL, aspect = 16 / 9, strength = 0.018 } = opts;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  const canVTF = renderer.capabilities.vertexTextures;

  const uniforms = {
    uColor: { value: null },
    uDepth: { value: null },
    uImageAspect: { value: aspect },
    uDepthScale: { value: canVTF ? DEPTH_SCALE : 0 },
    uZoomGeo: { value: 0 },
    uStrength: { value: strength },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uParallaxScale: { value: 1 },
    uHoverAmt: { value: 0 },
    uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
    uHoverRect: { value: new THREE.Vector4(0, 0, 0, 0) },
  };

  const grayDepth = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
  grayDepth.needsUpdate = true;
  uniforms.uDepth.value = grayDepth;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, SEG_X, SEG_Y), material);
  mesh.scale.set(aspect, 1, 1);
  scene.add(mesh);

  const DUST_N = 120;
  const dpos = new Float32Array(DUST_N * 3);
  const dsize = new Float32Array(DUST_N);
  const dspeed = new Float32Array(DUST_N);
  for (let i = 0; i < DUST_N; i += 1) {
    dpos[i * 3] = Math.random();
    dpos[i * 3 + 1] = Math.random();
    dpos[i * 3 + 2] = Math.random();
    dsize[i] = 3 + Math.random() * 2.5;
    dspeed[i] = (0.07 + Math.random() * 0.1) * 0.8;
  }
  const dgeo = new THREE.BufferGeometry();
  dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  dgeo.setAttribute('aSize', new THREE.BufferAttribute(dsize, 1));
  dgeo.setAttribute('aSpeed', new THREE.BufferAttribute(dspeed, 1));
  const dustUniforms = {
    uTime: { value: 0 },
    uImageAspect: uniforms.uImageAspect,
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uZoomScale: { value: 1 },
    uColor: uniforms.uColor,
  };
  const dust = new THREE.Points(
    dgeo,
    new THREE.ShaderMaterial({
      uniforms: dustUniforms,
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  );
  dust.frustumCulled = false;
  scene.add(dust);

  const pt = new THREE.Vector2();
  const ptTarget = new THREE.Vector2();
  const focus = new THREE.Vector2(0, 0);
  const focusTarget = new THREE.Vector2(0, 0);
  let zoom = 0;
  let zoomTarget = 0;
  let dolly = ZOOM_IN;
  let dollyTarget = ZOOM_IN;
  let zoomLerp = ZOOM_LERP;
  let hoverAmt = 0;
  let hoverAmtTarget = 0;
  const hoverPos = new THREE.Vector2(0.5, 0.5);
  const hoverPosTarget = new THREE.Vector2(0.5, 0.5);
  let restDist = 2;

  function frame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    const va = w / h;
    const ia = uniforms.uImageAspect.value;
    camera.aspect = va;
    camera.updateProjectionMatrix();
    const coverVh = va > ia ? ia / va : 1;
    restDist = coverVh / OVERSCAN / (2 * Math.tan((FOV * Math.PI) / 180 / 2));
  }
  window.addEventListener('resize', frame);
  frame();

  const loader = new THREE.TextureLoader();
  let readyCb = null;
  let isReady = false;

  const prep = (tex) => {
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
  };

  const setColor = (tex, isImage) => {
    prep(tex);
    if (isImage && tex.image) {
      uniforms.uImageAspect.value = tex.image.width / tex.image.height;
      mesh.scale.x = uniforms.uImageAspect.value;
      frame();
    }
    uniforms.uColor.value = tex;
    if (!isReady) {
      isReady = true;
      readyCb && readyCb();
    }
  };
  const setDepth = (tex) => {
    prep(tex);
    uniforms.uDepth.value = tex;
  };

  loader.load(colorURL, (t) => setColor(t, true), undefined, () => setColor(new THREE.CanvasTexture(makeCanvas(16, 9, '#1a100c')), false));
  loader.load(depthURL, setDepth, undefined, () => setDepth(new THREE.CanvasTexture(makeCanvas(16, 9, '#808080'))));

  const setPointer = (nx, ny) => ptTarget.set(nx, ny);
  const zoomTo = (fx, fy, depth = ZOOM_IN, lerp = ZOOM_LERP) => {
    focusTarget.set((fx - 0.5) * uniforms.uImageAspect.value, 0.5 - fy);
    zoomTarget = 1;
    dollyTarget = depth;
    zoomLerp = lerp;
  };
  const zoomOut = () => {
    zoomTarget = 0;
    focusTarget.set(0, 0);
    dollyTarget = ZOOM_IN;
  };
  const zoomValue = () => zoom;

  const setHover = (u, v, uMin, vMin, uMax, vMax) => {
    const rect = uniforms.uHoverRect.value;
    const changed = rect.x !== uMin || rect.y !== vMin || rect.z !== uMax || rect.w !== vMax;
    if (hoverAmt < 0.01 || changed) hoverPos.set(u, v);
    rect.set(uMin, vMin, uMax, vMax);
    hoverAmtTarget = 1;
    hoverPosTarget.set(u, v);
  };
  const clearHover = () => {
    hoverAmtTarget = 0;
  };

  function coverRect() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const ia = uniforms.uImageAspect.value;
    const va = W / H;
    let w;
    let h;
    if (va > ia) {
      w = W;
      h = W / ia;
    } else {
      h = H;
      w = H * ia;
    }
    return { x: (W - w) / 2, y: (H - h) / 2, w, h };
  }

  const _pv = new THREE.Vector3();
  function projectImageRect(box) {
    const ia = uniforms.uImageAspect.value;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const x0 = (box.x - 0.5) * ia;
    const x1 = (box.x + box.w - 0.5) * ia;
    const yTop = 0.5 - box.y;
    const yBot = 0.5 - box.y - box.h;
    camera.updateMatrixWorld();
    const toPx = (wx, wy) => {
      _pv.set(wx, wy, 0).project(camera);
      return { x: (_pv.x * 0.5 + 0.5) * W, y: (1 - (_pv.y * 0.5 + 0.5)) * H };
    };
    const tl = toPx(x0, yTop);
    const br = toPx(x1, yBot);
    return { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
  }

  const _tgt = new THREE.Vector3();
  function render(tSeconds) {
    pt.lerp(ptTarget, POINTER_LERP);
    focus.lerp(focusTarget, FOCUS_LERP);
    zoom += (zoomTarget - zoom) * zoomLerp;
    dolly += (dollyTarget - dolly) * zoomLerp;
    uniforms.uPointer.value.copy(pt);
    uniforms.uTime.value = tSeconds;
    uniforms.uZoomGeo.value = zoom;
    uniforms.uParallaxScale.value = 1 - 0.7 * zoom;
    hoverAmt += (hoverAmtTarget - hoverAmt) * 0.12;
    hoverPos.lerp(hoverPosTarget, 0.18);
    uniforms.uHoverAmt.value = hoverAmt;
    uniforms.uHoverPos.value.copy(hoverPos);
    const camDist = restDist * (1 - dolly * zoom);
    const visHalfY = camDist * TAN_HALF_FOV;
    const visHalfX = visHalfY * camera.aspect;
    const maxX = Math.max(0, uniforms.uImageAspect.value / 2 - visHalfX);
    const maxY = Math.max(0, 0.5 - visHalfY);
    const fx = Math.max(-maxX, Math.min(maxX, focus.x));
    const fy = Math.max(-maxY, Math.min(maxY, focus.y));
    _tgt.set(fx, fy, 0);
    camera.position.set(fx, fy, camDist);
    camera.lookAt(_tgt);
    dustUniforms.uTime.value = tSeconds;
    dustUniforms.uZoomScale.value = restDist / camDist;
    renderer.render(scene, camera);
  }

  function onReady(cb) {
    readyCb = cb;
    if (isReady) cb();
  }

  function dispose() {
    window.removeEventListener('resize', frame);
    renderer.dispose();
    material.dispose();
    mesh.geometry.dispose();
    dgeo.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  return {
    ok: true,
    renderer,
    setPointer,
    zoomTo,
    zoomOut,
    zoomValue,
    setHover,
    clearHover,
    coverRect,
    projectImageRect,
    render,
    onReady,
    dispose,
  };
}
