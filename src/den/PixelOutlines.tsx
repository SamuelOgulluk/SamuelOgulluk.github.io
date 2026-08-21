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
  vec2 grid = resolution / max(uPixel, 1.0);
  vec2 cell = floor(uv * grid);
  vec2 mid = (cell + 0.5) / grid;
  vec2 stepUv = 1.0 / grid;

  vec3 c = texture2D(inputBuffer, mid).rgb;
  vec3 l = texture2D(inputBuffer, mid + vec2(-stepUv.x, 0.0)).rgb;
  vec3 r = texture2D(inputBuffer, mid + vec2(stepUv.x, 0.0)).rgb;
  vec3 u = texture2D(inputBuffer, mid + vec2(0.0, stepUv.y)).rgb;
  vec3 d = texture2D(inputBuffer, mid + vec2(0.0, -stepUv.y)).rgb;

  float cg = max(max(colorGap(c, l), colorGap(c, r)), max(colorGap(c, u), colorGap(c, d)));
  float dist = viewZAt(mid);
  float nearW = 1.0 - smoothstep(4.2, 8.5, dist);
  float colorEdge = step(uColorThresh, cg) * mix(0.2, 1.0, nearW);

  float zc = readDepth(mid);
  float zl = readDepth(mid + vec2(-stepUv.x, 0.0));
  float zr = readDepth(mid + vec2(stepUv.x, 0.0));
  float zu = readDepth(mid + vec2(0.0, stepUv.y));
  float zd = readDepth(mid + vec2(0.0, -stepUv.y));
  float zg = max(max(abs(zc - zl), abs(zc - zr)), max(abs(zc - zu), abs(zc - zd)));
  float depthEdge = step(uDepthThresh, zg);

  float edge = max(colorEdge, depthEdge);
  vec3 ink = vec3(0.1, 0.07, 0.05);
  outputColor = vec4(mix(inputColor.rgb, ink, edge), inputColor.a);
}
`;

export class PixelOutlineEffect extends Effect {
  constructor({ pixelSize = 3.5, colorThresh = 0.11, depthThresh = 0.007 } = {}) {
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

const PixelOutlines = ({ pixelSize = 3.5, colorThresh = 0.11, depthThresh = 0.007 }) => {
  const effect = useMemo(
    () => new PixelOutlineEffect({ pixelSize, colorThresh, depthThresh }),
    [pixelSize, colorThresh, depthThresh]
  );
  return <primitive object={effect} />;
};

export default PixelOutlines;
