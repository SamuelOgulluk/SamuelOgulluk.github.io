import { useMemo } from 'react';
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing';
import { Uniform } from 'three';

const FRAG = `
uniform float uPixel;
uniform float uColorThresh;
uniform float uDepthThresh;

float luma(const in vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

float colorGap(const in vec3 a, const in vec3 b) {
  vec3 d = abs(a - b);
  return max(max(d.r, d.g), max(d.b, abs(luma(a) - luma(b))));
}

float viewZAt(const in vec2 p) {
  float z = readDepth(p);
  return cameraNear * cameraFar / (cameraFar - z * (cameraFar - cameraNear));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  float cell = max(uPixel, 1.0);
  vec2 grid = resolution / cell;
  vec2 frac = fract(uv * grid);
  vec2 mid = (floor(uv * grid) + 0.5) / grid;
  vec2 stepUv = 1.0 / grid;

  vec3 c = texture2D(inputBuffer, mid).rgb;
  vec3 l = texture2D(inputBuffer, mid + vec2(-stepUv.x, 0.0)).rgb;
  vec3 r = texture2D(inputBuffer, mid + vec2(stepUv.x, 0.0)).rgb;
  vec3 up = texture2D(inputBuffer, mid + vec2(0.0, stepUv.y)).rgb;
  vec3 dn = texture2D(inputBuffer, mid + vec2(0.0, -stepUv.y)).rgb;

  float dist = viewZAt(mid);
  float nearW = 1.0 - smoothstep(3.2, 6.4, dist);
  float tC = uColorThresh;

  float eL = step(tC, colorGap(c, l) * mix(0.15, 1.0, nearW));
  float eR = step(tC, colorGap(c, r) * mix(0.15, 1.0, nearW));
  float eU = step(tC, colorGap(c, up) * mix(0.15, 1.0, nearW));
  float eD = step(tC, colorGap(c, dn) * mix(0.15, 1.0, nearW));

  float zc = readDepth(mid);
  eL = max(eL, step(uDepthThresh, abs(zc - readDepth(mid + vec2(-stepUv.x, 0.0)))));
  eR = max(eR, step(uDepthThresh, abs(zc - readDepth(mid + vec2(stepUv.x, 0.0)))));
  eU = max(eU, step(uDepthThresh, abs(zc - readDepth(mid + vec2(0.0, stepUv.y)))));
  eD = max(eD, step(uDepthThresh, abs(zc - readDepth(mid + vec2(0.0, -stepUv.y)))));

  float rim = 0.5;
  float ink = 0.0;
  ink = max(ink, eL * step(frac.x, rim));
  ink = max(ink, eR * step(1.0 - frac.x, rim));
  ink = max(ink, eD * step(frac.y, rim));
  ink = max(ink, eU * step(1.0 - frac.y, rim));

  vec3 line = vec3(0.09, 0.06, 0.045);
  outputColor = vec4(mix(inputColor.rgb, line, ink), inputColor.a);
}
`;

export class PixelOutlineEffect extends Effect {
  constructor({ pixelSize = 4, colorThresh = 0.2, depthThresh = 0.012 } = {}) {
    super('PixelOutlineEffect', FRAG, {
      blendFunction: BlendFunction.SRC,
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ['uPixel', new Uniform(pixelSize)],
        ['uColorThresh', new Uniform(colorThresh)],
        ['uDepthThresh', new Uniform(depthThresh)],
      ]),
    });
  }
}

const PixelOutlines = ({ pixelSize = 4, colorThresh = 0.2, depthThresh = 0.012 }) => {
  const effect = useMemo(
    () => new PixelOutlineEffect({ pixelSize, colorThresh, depthThresh }),
    [pixelSize, colorThresh, depthThresh]
  );
  return <primitive object={effect} />;
};

export default PixelOutlines;
