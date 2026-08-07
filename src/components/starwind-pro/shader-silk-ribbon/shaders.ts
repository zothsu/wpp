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
  uniform float uSilkDrift;
  uniform float uRibbonScale;
  uniform float uRibbonWidth;
  uniform float uSheenStrength;
  uniform float uSheenWidth;
  uniform vec3 uPrimaryRibbonColor;
  uniform vec3 uSecondaryRibbonColor;
  uniform vec3 uSheenColor;

  float ribbon(vec2 p, float offset, float t, float width) {
    float sweep = sin(p.x * 0.78 + offset + t * 0.48) * 0.46;
    sweep += sin(p.x * 1.18 - offset * 0.42 + t * 0.28) * 0.16;
    sweep += sin(p.x * 0.36 + offset * 1.4 - t * 0.18) * 0.11;
    float d = abs(p.y - sweep);
    return smoothstep(width, 0.0, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
    vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / max(uResolution.y, 1.0);
    float t = uTime * uSilkDrift * 0.28;
    float density = max(uRibbonScale, 0.5);

    vec2 q = p * vec2(density * 0.86, density * 0.7);
    q.x += sin(p.y * 0.55 + t * 0.32) * 0.34;
    q.y += sin(p.x * 0.42 - t * 0.24) * 0.18;

    float ribbonWidth = clamp(uRibbonWidth, 0.35, 2.2);
    float sheenWidth = clamp(uSheenWidth, 0.35, 2.4);
    float r1 = ribbon(q + vec2(-0.08, 0.1), 0.15, t, 0.26 * ribbonWidth);
    float r2 = ribbon(
      q * vec2(0.92, 1.05) + vec2(0.18, -0.18),
      1.9,
      -t * 0.72,
      0.23 * ribbonWidth
    );
    float r3 = ribbon(
      q * vec2(1.08, 0.9) + vec2(-0.28, 0.28),
      3.25,
      t * 0.54,
      0.2 * ribbonWidth
    );
    float ridge1 = ribbon(q + vec2(-0.08, 0.1), 0.15, t, 0.055 * sheenWidth);
    float ridge2 = ribbon(
      q * vec2(0.92, 1.05) + vec2(0.18, -0.18),
      1.9,
      -t * 0.72,
      0.05 * sheenWidth
    );
    float ridge3 = ribbon(
      q * vec2(1.08, 0.9) + vec2(-0.28, 0.28),
      3.25,
      t * 0.54,
      0.045 * sheenWidth
    );
    float silk = r1 * 0.72 + r2 * 0.46 + r3 * 0.3;
    float ridges = ridge1 * 0.58 + ridge2 * 0.38 + ridge3 * 0.24;

    float fold = sin((q.x + q.y * 0.18) * 1.4 + t * 0.36) * 0.5 + 0.5;
    float sheen = pow(max(silk, 0.0), 2.8) * (0.52 + fold * 0.48);
    float broadLight = smoothstep(-1.1, 0.9, uv.y) * (1.0 - smoothstep(-0.2, 1.2, uv.y));

    vec3 base = uPrimaryRibbonColor * 0.012 + uSecondaryRibbonColor * 0.01;
    vec3 color = base;
    color = mix(color, uPrimaryRibbonColor, r1 * 0.42);
    color = mix(color, uSecondaryRibbonColor, r2 * 0.34);
    color += uSheenColor * sheen * 0.28 * uSheenStrength;
    color += vec3(1.0, 0.94, 0.84) * ridges * 0.18 * uSheenStrength;
    color += mix(uPrimaryRibbonColor, uSecondaryRibbonColor, fold) * silk * 0.18 * uSheenStrength;
    color *= 0.86 + broadLight * 0.14;
    color = color / (vec3(0.9) + color * 0.2);

    float alpha = clamp(0.08 + silk * 0.42 * uSheenStrength + ridges * 0.16, 0.06, 0.86);
    gl_FragColor = vec4(color * uSheenStrength, alpha);
  }
`;

const shaderInputs = {
  primaryRibbonColor: {
    attribute: "data-shader-primary-ribbon-color",
    default: [0.98, 0.42, 0.27],
    type: "color",
    uniform: "uPrimaryRibbonColor",
  },
  ribbonScale: {
    attribute: "data-shader-ribbon-scale",
    default: 2.25,
    max: 4.8,
    min: 1.2,
    type: "number",
    uniform: "uRibbonScale",
  },
  ribbonWidth: {
    attribute: "data-shader-ribbon-width",
    default: 1,
    max: 2.2,
    min: 0.35,
    type: "number",
    uniform: "uRibbonWidth",
  },
  secondaryRibbonColor: {
    attribute: "data-shader-secondary-ribbon-color",
    default: [0.19, 0.82, 0.72],
    type: "color",
    uniform: "uSecondaryRibbonColor",
  },
  sheenColor: {
    attribute: "data-shader-sheen-color",
    default: [0.93, 0.82, 0.68],
    type: "color",
    uniform: "uSheenColor",
  },
  sheenStrength: {
    attribute: "data-shader-sheen-strength",
    default: 0.86,
    max: 2,
    min: 0,
    type: "number",
    uniform: "uSheenStrength",
  },
  sheenWidth: {
    attribute: "data-shader-sheen-width",
    default: 1,
    max: 2.4,
    min: 0.35,
    type: "number",
    uniform: "uSheenWidth",
  },
  silkDrift: {
    attribute: "data-shader-silk-drift",
    default: 0.64,
    max: 2.4,
    min: 0.2,
    type: "number",
    uniform: "uSilkDrift",
  },
} satisfies ShaderInputDefinitions;

export function createShaderSilkRibbonBackground(canvas: HTMLCanvasElement): ShaderHandle | null {
  return createRawShaderBackground(canvas, {
    fragmentShaderSource,
    rootSelector: "[data-shader-silk-ribbon]",
    inputs: shaderInputs,
    defaults: {
      maxDpr: 1.5,
      maxFps: 60,
    },
  });
}

export function initShaderSilkRibbonBackgrounds() {
  initRawShaderBackgrounds("[data-shader-silk-ribbon-canvas]", createShaderSilkRibbonBackground);
}
