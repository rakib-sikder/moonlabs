"use client";

import { useMemo } from "react";
import * as THREE from "three";

/* Planet looks, by service index: gas giants with bands, rocky worlds, icy/ocean worlds. */
export type PlanetLook = { type: 0 | 1 | 2; size: number; ring?: boolean; seed: number };

export const PLANET_LOOKS: PlanetLook[] = [
  { type: 0, size: 0.15, seed: 1.3 }, // Sales — violet gas giant
  { type: 1, size: 0.105, seed: 4.1 }, // Marketing — rose rocky
  { type: 2, size: 0.12, seed: 7.7 }, // Support — teal ocean world
  { type: 0, size: 0.14, ring: true, seed: 2.9 }, // Voice — amber ringed giant
  { type: 2, size: 0.1, seed: 9.2 }, // Operations — blue ice world
  { type: 1, size: 0.11, seed: 5.6 }, // Finance — green rocky
  { type: 1, size: 0.12, seed: 3.3 }, // E-commerce — rust desert world
  { type: 0, size: 0.125, seed: 6.4 }, // Custom — pale gas giant
];

const NOISE = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
    return s;
  }
`;

const planetVertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vN;
  varying vec3 vWorld;
  void main() {
    vObj = position;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uA;      // base colour
  uniform vec3 uB;      // shadowed / deep tone
  uniform vec3 uC;      // highlight tone
  uniform float uType;
  uniform float uSeed;
  uniform float uTime;
  uniform float uHover;
  uniform float uAmbient;
  uniform vec3 uLight;
  varying vec3 vObj;
  varying vec3 vN;
  varying vec3 vWorld;
  ${NOISE}
  void main() {
    vec3 p = normalize(vObj);
    vec3 s = vec3(uSeed);
    vec3 col;
    if (uType < 0.5) {
      // Gas giant: turbulent latitude bands plus a drifting storm.
      float warp = fbm(p * 2.5 + s + vec3(uTime * 0.02, 0.0, 0.0));
      float bands = 0.5 + 0.5 * sin((p.y * 7.0 + warp * 2.2) * 3.0);
      col = mix(uB, uA, bands);
      col = mix(col, uC, smoothstep(0.55, 0.85, fbm(p * 5.0 + s * 2.0)) * 0.45);
      float storm = smoothstep(0.22, 0.0, length(vec2(p.x - 0.35, (p.y + 0.25) * 1.8)));
      col = mix(col, uC, storm * 0.6);
    } else if (uType < 1.5) {
      // Rocky: highlands, lowlands, dusty bright patches.
      float h = fbm(p * 3.2 + s);
      col = mix(uB, uA, smoothstep(0.3, 0.68, h));
      col = mix(col, uC, smoothstep(0.66, 0.82, fbm(p * 8.0 + s * 3.0)) * 0.5);
      col *= 0.85 + 0.3 * noise(p * 40.0 + s);
    } else {
      // Ocean / ice world: seas, swirling cloud and polar caps.
      float h = fbm(p * 2.2 + s);
      col = mix(uB, uA, smoothstep(0.4, 0.62, h));
      float cloud = smoothstep(0.55, 0.8, fbm(p * 3.5 + s + vec3(uTime * 0.03, 0.0, 0.0)));
      col = mix(col, vec3(0.96, 0.98, 1.0), cloud * 0.55);
      col = mix(col, vec3(0.97), smoothstep(0.72, 0.88, abs(p.y)));
    }

    vec3 N = normalize(vN);
    vec3 L = normalize(uLight);
    vec3 V = normalize(cameraPosition - vWorld);
    float d = dot(N, L);
    float day = smoothstep(-0.12, 0.55, d);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 atmo = mix(uA, uC, 0.5) * fres * (0.25 + 1.1 * smoothstep(-0.4, 0.4, d)) * (1.0 + uHover * 0.8);
    vec3 color = col * (uAmbient + day * 1.1) + atmo;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function tones(hex: string) {
  const a = new THREE.Color(hex);
  const b = a.clone().multiplyScalar(0.38);
  const c = a.clone().lerp(new THREE.Color("#ffffff"), 0.55);
  return { a, b, c };
}

export function usePlanetMaterial(hex: string, look: PlanetLook, light: [number, number, number], ambient: number) {
  const material = useMemo(() => {
    const { a, b, c } = tones(hex);
    return new THREE.ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      uniforms: {
        uA: { value: a },
        uB: { value: b },
        uC: { value: c },
        uType: { value: look.type },
        uSeed: { value: look.seed },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uAmbient: { value: ambient },
        uLight: { value: new THREE.Vector3(...light) },
      },
    });
  }, [hex, look.type, look.seed, light, ambient]);
  return material;
}

/** Advances time and eases the hover glow on a planet's shader material. */
export function tickPlanet(material: THREE.ShaderMaterial, time: number, hovered: boolean) {
  const u = material.uniforms;
  u.uTime.value = time;
  u.uHover.value += ((hovered ? 1 : 0) - u.uHover.value) * 0.12;
}

/* ---------- Saturn-style ring ---------- */
const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ringFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vPos;
  void main() {
    float r = (length(vPos.xy) - uInner) / (uOuter - uInner);
    float bands = 0.55 + 0.45 * sin(r * 38.0) * sin(r * 11.0 + 1.3);
    float gap = smoothstep(0.52, 0.55, r) * (1.0 - smoothstep(0.6, 0.63, r));
    float edge = smoothstep(0.0, 0.08, r) * (1.0 - smoothstep(0.88, 1.0, r));
    float alpha = edge * bands * (1.0 - gap * 0.85) * 0.75;
    gl_FragColor = vec4(uColor * (0.7 + 0.5 * bands), alpha);
    #include <colorspace_fragment>
  }
`;

export function PlanetRing({ size, color }: { size: number; color: string }) {
  const inner = size * 1.45;
  const outer = size * 2.5;
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        uniforms: {
          uColor: { value: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35) },
          uInner: { value: inner },
          uOuter: { value: outer },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [color, inner, outer]
  );
  return (
    <mesh rotation={[1.25, 0.25, 0]} material={material}>
      <ringGeometry args={[inner, outer, 96, 1]} />
    </mesh>
  );
}

/* ---------- Fading orbit trail (static arc; its group rotates with the planet) ---------- */
export function useTrail(radius: number, color: string, length = 1.9, segments = 96) {
  return useMemo(() => {
    const pos = new Float32Array((segments + 1) * 3);
    const col = new Float32Array((segments + 1) * 4);
    const c = new THREE.Color(color);
    for (let k = 0; k <= segments; k++) {
      const t = k / segments;
      const a = -t * length;
      pos[k * 3] = Math.cos(a) * radius;
      pos[k * 3 + 1] = Math.sin(a) * radius;
      col[k * 4] = c.r;
      col[k * 4 + 1] = c.g;
      col[k * 4 + 2] = c.b;
      col[k * 4 + 3] = Math.pow(1 - t, 1.6);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(col, 4));
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, opacity: 0.9 });
    return new THREE.Line(geom, mat);
  }, [radius, color, length, segments]);
}
