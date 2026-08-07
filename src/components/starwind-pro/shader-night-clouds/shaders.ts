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
  uniform float uCloudDrift;
  uniform float uCloudScale;
  uniform float uMoonlitDepth;
  uniform vec3 uSkyColor;
  uniform vec3 uCloudColor;
  uniform vec3 uHorizonColor;

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
      p = mat2(0.82, 0.57, -0.57, 0.82) * p * 2.0 + 3.1;
      amplitude *= 0.52;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
    vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / max(uResolution.y, 1.0);
    float t = uTime * uCloudDrift * 0.12;

    vec2 strata = vec2(p.x * 0.78, uv.y * 2.18) * uCloudScale;
    float cloudA = fbm(strata + vec2(t, -t * 0.55));
    float cloudB = fbm(strata * vec2(1.36, 0.74) + vec2(4.2 - t * 0.65, -1.3 + t * 0.28));
    float cloudC = fbm(strata * vec2(0.72, 1.55) + vec2(-2.0 + t * 0.34, 5.0));

    float bandA = smoothstep(0.38, 0.84, cloudA + sin(p.x * 0.48 - t * 1.1) * 0.12);
    float bandB = smoothstep(0.44, 0.92, cloudB + sin(p.x * 0.86 + t * 0.6) * 0.1);
    float cloudBand = clamp(bandA * 0.56 + bandB * 0.34 + cloudC * 0.16, 0.0, 1.0);
    float verticalClouds = smoothstep(-1.18, -0.25, p.y) * (1.0 - smoothstep(0.86, 1.38, p.y));
    float clouds = cloudBand * verticalClouds;

    float upperSky = smoothstep(0.12, 1.18, p.y);
    float lowHorizon = 1.0 - smoothstep(-1.18, -0.18, p.y);

    vec3 nightSky = mix(uSkyColor * 0.78, uSkyColor + vec3(0.025, 0.035, 0.065), uv.y);
    vec3 color = nightSky;
    color = mix(color, uCloudColor, clouds * 0.5 * uMoonlitDepth);
    color += uHorizonColor * clouds * lowHorizon * 0.12 * uMoonlitDepth;
    color += uCloudColor * cloudA * 0.04 * uMoonlitDepth;
    color += vec3(0.02, 0.025, 0.04) * upperSky;
    color = color / (vec3(0.92) + color * 0.22);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const shaderInputs = {
  cloudColor: {
    attribute: "data-shader-cloud-color",
    default: [0.58, 0.7, 0.86],
    type: "color",
    uniform: "uCloudColor",
  },
  cloudDrift: {
    attribute: "data-shader-cloud-drift",
    default: 0.22,
    max: 3,
    min: 0,
    type: "number",
    uniform: "uCloudDrift",
  },
  cloudScale: {
    attribute: "data-shader-cloud-scale",
    default: 2.4,
    max: 6,
    min: 0.8,
    type: "number",
    uniform: "uCloudScale",
  },
  horizonColor: {
    attribute: "data-shader-horizon-color",
    default: [0.82, 0.62, 0.44],
    type: "color",
    uniform: "uHorizonColor",
  },
  moonlitDepth: {
    attribute: "data-shader-moonlit-depth",
    default: 0.84,
    max: 2,
    min: 0,
    type: "number",
    uniform: "uMoonlitDepth",
  },
  skyColor: {
    attribute: "data-shader-sky-color",
    default: [0.05, 0.06, 0.1],
    type: "color",
    uniform: "uSkyColor",
  },
} satisfies ShaderInputDefinitions;

export function createShaderNightCloudsBackground(canvas: HTMLCanvasElement): ShaderHandle | null {
  return createRawShaderBackground(canvas, {
    fragmentShaderSource,
    rootSelector: "[data-shader-night-clouds]",
    inputs: shaderInputs,
    defaults: {
      maxDpr: 1.5,
      maxFps: 60,
    },
  });
}

export function initShaderNightCloudsBackgrounds() {
  initRawShaderBackgrounds("[data-shader-night-clouds-canvas]", createShaderNightCloudsBackground);
}
