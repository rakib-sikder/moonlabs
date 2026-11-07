"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { services } from "@/lib/site";
import type { ThemeColors } from "@/lib/useTheme";

/* ---------- Procedural moon surface (no image assets) ---------- */
function makeMoonTexture() {
  const W = 1024;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  // Draw a feature three times (shifted by the texture width) so the sphere's seam is invisible.
  const wrap = (x: number, draw: (x: number) => void) => [x - W, x, x + W].forEach(draw);

  g.fillStyle = "#a9abb5";
  g.fillRect(0, 0, W, H);

  // Maria: big soft dark plains.
  for (let i = 0; i < 14; i++) {
    const x = rnd() * W;
    const y = H * 0.2 + rnd() * H * 0.6;
    const r = 60 + rnd() * 140;
    wrap(x, (x) => {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(60,62,75,0.45)");
      grad.addColorStop(1, "rgba(60,62,75,0)");
      g.fillStyle = grad;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    });
  }
  // Grain.
  for (let i = 0; i < 26000; i++) {
    const v = Math.floor(120 + rnd() * 100);
    g.fillStyle = `rgba(${v},${v},${v + 8},0.12)`;
    g.fillRect(rnd() * W, rnd() * H, 1.5, 1.5);
  }
  // Craters: soft dark bowl with a faint offset highlight — mostly small, a few large.
  for (let i = 0; i < 700; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = Math.pow(rnd(), 3.2) * 30 + 1.5;
    wrap(x, (x) => {
      const bowl = g.createRadialGradient(x + r * 0.15, y + r * 0.15, 0, x, y, r);
      bowl.addColorStop(0, "rgba(72,74,86,0.42)");
      bowl.addColorStop(0.7, "rgba(95,97,110,0.22)");
      bowl.addColorStop(1, "rgba(95,97,110,0)");
      g.fillStyle = bowl;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
      const lit = g.createRadialGradient(x - r * 0.35, y - r * 0.35, 0, x - r * 0.35, y - r * 0.35, r * 0.9);
      lit.addColorStop(0, "rgba(230,232,242,0.16)");
      lit.addColorStop(1, "rgba(230,232,242,0)");
      g.fillStyle = lit;
      g.beginPath();
      g.arc(x, y, r * 1.05, 0, Math.PI * 2);
      g.fill();
    });
  }
  // A couple of bright ray craters.
  for (let i = 0; i < 3; i++) {
    const x = rnd() * W;
    const y = H * 0.25 + rnd() * H * 0.5;
    wrap(x, (x) => {
      const ray = g.createRadialGradient(x, y, 0, x, y, 70);
      ray.addColorStop(0, "rgba(240,242,250,0.35)");
      ray.addColorStop(1, "rgba(240,242,250,0)");
      g.fillStyle = ray;
      g.fillRect(x - 70, y - 70, 140, 140);
    });
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------- Fresnel glow shell ---------- */
const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Back faces of a slightly larger shell: brightest next to the moon, fading to zero outward.
    float f = pow(abs(dot(vNormal, vView)), 3.0);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`;

// Soft radial dot used as the planets' glow (shared by all planets).
let halo: THREE.CanvasTexture | null = null;
function haloTexture() {
  if (halo) return halo;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  halo = new THREE.CanvasTexture(c);
  return halo;
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

type OrbitSpec = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  offset: number;
  size: number;
};

function useOrbitSpecs(): OrbitSpec[] {
  return useMemo(
    () =>
      services.map((_, i) => ({
        radius: 2.35 + i * 0.3,
        tiltX: 1.18 + (i % 3) * 0.07,
        tiltZ: (i % 2 ? 1 : -1) * (0.16 + (i % 4) * 0.05),
        speed: 0.42 / (1 + i * 0.22),
        offset: i * 2.399, // golden angle spread
        size: 0.085 + ((i * 37) % 5) * 0.012,
      })),
    [],
  );
}

function circlePoints(r: number, n = 128) {
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
  });
}

function Planet({
  index,
  spec,
  hovered,
  setHovered,
  angle,
  intro,
  colors,
}: {
  index: number;
  spec: OrbitSpec;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  angle: React.RefObject<number>;
  intro: React.RefObject<number>;
  colors: ThemeColors;
}) {
  const router = useRouter();
  const body = useRef<THREE.Group>(null);
  const service = services[index];
  const points = useMemo(() => circlePoints(spec.radius), [spec.radius]);
  const isHover = hovered === index;
  const dim = hovered !== null && !isHover;

  useFrame(() => {
    if (!body.current) return;
    const a = angle.current * spec.speed + spec.offset;
    const r = spec.radius * (0.25 + 0.75 * easeOut(intro.current * 1.2 - index * 0.05));
    body.current.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    const target = isHover ? 1.9 : 1;
    const s = THREE.MathUtils.lerp(body.current.scale.x, target, 0.15);
    body.current.scale.setScalar(s * easeOut(intro.current * 1.4 - index * 0.06));
  });

  return (
    <group rotation={[spec.tiltX, 0, spec.tiltZ]}>
      <Line
        points={points}
        color={isHover ? service.color : colors.isDark ? colors.moon : colors.muted}
        lineWidth={isHover ? 1.6 : 1}
        transparent
        opacity={isHover ? 0.75 : dim ? 0.06 : colors.isDark ? 0.14 : 0.28}
      />
      <group ref={body}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(index);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(null);
            document.body.style.cursor = "";
          }}
          onClick={() => router.push(`/services/${service.slug}`)}
        >
          {/* Generous invisible hit area so small planets are easy to target. */}
          <sphereGeometry args={[spec.size * 2.6, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[spec.size, 32, 32]} />
          <meshStandardMaterial
            color={service.color}
            emissive={service.color}
            emissiveIntensity={isHover ? 1.2 : 0.55}
            roughness={0.5}
          />
        </mesh>
        <sprite scale={spec.size * (isHover ? 9 : 6)}>
          <spriteMaterial
            map={haloTexture()}
            color={service.color}
            transparent
            opacity={isHover ? 0.75 : 0.45}
            depthWrite={false}
          />
        </sprite>
        {isHover && (
          <Html center position={[0, spec.size * 4.2, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
            <div className="whitespace-nowrap rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur">
              <span
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: service.color }}
              />
              {service.name}
              <span className="ml-2 text-accent">→</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function System({ colors, reduced }: { colors: ThemeColors; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const speed = useRef(1);
  const intro = useRef(reduced ? 1 : 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const specs = useOrbitSpecs();
  const texture = useMemo(() => makeMoonTexture(), []);
  const { size } = useThree();
  const wide = size.width >= 900;

  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(colors.accent) },
      uIntensity: { value: colors.isDark ? 0.9 : 0.55 },
    }),
    [colors.accent, colors.isDark],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    if (!reduced) {
      // Wall-clock based so the intro finishes on time even at a low frame rate.
      intro.current = Math.min(1, state.clock.elapsedTime / 2.4);
      // Orbits slow to a stop while a planet is hovered.
      speed.current = THREE.MathUtils.lerp(speed.current, hovered === null ? 1 : 0, 0.08);
      angle.current += d * speed.current;
    }
    if (moon.current && !reduced) moon.current.rotation.y += d * 0.05;
    if (root.current) {
      const p = state.pointer;
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, p.x * 0.28, 0.04);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -p.y * 0.16, 0.04);
      const s = (wide ? 1 : 0.62) * (0.7 + 0.3 * easeOut(intro.current));
      root.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={root} position={wide ? [2.6, -0.1, 0] : [0, 1.55, 0]}>
      <mesh ref={moon} rotation={[0.2, 0, 0.1]}>
        <sphereGeometry args={[1.55, 128, 128]} />
        <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={1.2} roughness={1} metalness={0} />
      </mesh>
      <mesh scale={1.25}>
        <sphereGeometry args={[1.55, 64, 64]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={glowUniforms}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
      {specs.map((spec, i) => (
        <Planet
          key={services[i].slug}
          index={i}
          spec={spec}
          hovered={hovered}
          setHovered={setHovered}
          angle={angle}
          intro={intro}
          colors={colors}
        />
      ))}
    </group>
  );
}

export default function MoonScene({
  colors,
  active,
  reduced,
}: {
  colors: ThemeColors;
  active: boolean;
  reduced: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={colors.isDark ? 0.07 : 0.55} />
      {/* Key light from upper-left gives the moon a crescent terminator. */}
      <directionalLight position={[-7, 2.5, 1.6]} intensity={colors.isDark ? 3.4 : 2.6} />
      {/* Cool rim light from behind. */}
      <directionalLight position={[5, -1, -4]} intensity={colors.isDark ? 1.4 : 0.5} color={colors.accent} />
      <System colors={colors} reduced={reduced} />
    </Canvas>
  );
}
