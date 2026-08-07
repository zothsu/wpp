import {
  createRawShaderBackground,
  initRawShaderBackgrounds,
  type ShaderHandle,
  type ShaderInputDefinitions,
} from "@/lib/utils/starwind/shader-runtime";

const fragmentShaderSource = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uAuroraDrift;
  uniform float uVeilScale;
  uniform float uVeilBrightness;
  uniform vec3 uPrimaryVeilColor;
  uniform vec3 uSecondaryVeilColor;
  uniform vec3 uGlintColor;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 34.45);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = mat2(0.82, 0.57, -0.57, 0.82) * p * 2.03 + 7.13;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / max(uResolution.y, 1.0);
    float t = uTime * uAuroraDrift * 0.24;
    float field = fbm(vec2(p.x * 0.75, p.y * 1.8) * uVeilScale + vec2(t, -t * 0.55));
    float drift = fbm(p * 1.35 + vec2(-t * 0.6, t * 0.35));
    float curtain = sin(p.x * 2.35 + field * 2.9 + t * 1.8) * 0.22;
    float band = smoothstep(0.74, 0.03, abs(p.y + curtain + drift * 0.16));
    float ray = smoothstep(-0.95, 0.58, p.y + field * 0.36);
    float veil = band * ray;

    vec3 deep = vec3(0.012, 0.018, 0.032);
    vec3 primaryVeil = uPrimaryVeilColor;
    vec3 secondaryVeil = uSecondaryVeilColor;
    vec3 glint = uGlintColor;
    vec3 color = mix(deep, primaryVeil, field * 0.42);
    color = mix(color, secondaryVeil, veil * 0.64);
    color += glint * pow(max(veil, 0.0), 3.0) * 0.22;
    color += primaryVeil * smoothstep(0.42, 1.0, drift) * 0.08;

    float vignette = smoothstep(1.45, 0.12, length(p * vec2(0.9, 1.16)));
    color *= uVeilBrightness;
    gl_FragColor = vec4(color, clamp(0.18 + vignette * 0.82, 0.18, 1.0));
  }
`;

const shaderInputs = {
  auroraDrift: {
    attribute: "data-shader-aurora-drift",
    default: 0.4,
    max: 3,
    min: 0,
    type: "number",
    uniform: "uAuroraDrift",
  },
  glintColor: {
    attribute: "data-shader-glint-color",
    default: [0.98, 0.63, 0.28],
    type: "color",
    uniform: "uGlintColor",
  },
  primaryVeilColor: {
    attribute: "data-shader-primary-veil-color",
    default: [0.08, 0.88, 0.72],
    type: "color",
    uniform: "uPrimaryVeilColor",
  },
  secondaryVeilColor: {
    attribute: "data-shader-secondary-veil-color",
    default: [0.47, 0.34, 0.96],
    type: "color",
    uniform: "uSecondaryVeilColor",
  },
  veilBrightness: {
    attribute: "data-shader-veil-brightness",
    default: 0.9,
    max: 2,
    min: 0,
    type: "number",
    uniform: "uVeilBrightness",
  },
  veilScale: {
    attribute: "data-shader-veil-scale",
    default: 2.2,
    max: 6,
    min: 0.5,
    type: "number",
    uniform: "uVeilScale",
  },
} satisfies ShaderInputDefinitions;

export function createShaderAuroraVeilBackground(canvas: HTMLCanvasElement): ShaderHandle | null {
  return createRawShaderBackground(canvas, {
    fragmentShaderSource,
    rootSelector: "[data-shader-aurora-veil]",
    defaults: {
      maxDpr: 1.5,
      maxFps: 60,
    },
    inputs: shaderInputs,
  });
}

export function initShaderAuroraVeilBackgrounds() {
  initRawShaderBackgrounds("[data-shader-aurora-veil-canvas]", createShaderAuroraVeilBackground);
}
