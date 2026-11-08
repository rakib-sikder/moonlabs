"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { automationServices as services } from "@/lib/site";
import type { ThemeColors } from "@/lib/useTheme";
import { MOON_COLOR_2K, MOON_HEIGHT } from "@/lib/moonTexture";
import { PLANET_LOOKS, PlanetRing, tickPlanet, usePlanetMaterial, useTrail } from "./Planets";
import { Meteors, Satellite } from "./SpaceTraffic";

/* ---------- Moon surface: NASA LRO colour + LOLA elevation (public domain) ---------- */
function MoonSurface({ meshRef, reduced }: { meshRef: React.RefObject<THREE.Mesh | null>; reduced: boolean }) {
  const [map, bump] = useTexture([MOON_COLOR_2K, MOON_HEIGHT], (loaded) => {
    const [color] = loaded as THREE.Texture[];
    color.colorSpace = THREE.SRGBColorSpace;
    color.anisotropy = 8;
  });
  useFrame((state) => {
    // Tidally locked: the familiar near side faces us, with a gentle libration sway.
    if (meshRef.current && !reduced) meshRef.current.rotation.y = -Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.12) * 0.22;
  });
  return (
    <mesh ref={meshRef} rotation={[0.12, -Math.PI / 2, 0.05]}>
      <sphereGeometry args={[1.4, 160, 160]} />
      <meshStandardMaterial map={map} bumpMap={bump} bumpScale={4} roughness={1} metalness={0} />
    </mesh>
  );
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

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

type OrbitSpec = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  offset: number;
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
  focused,
  onSelect,
  register,
}: {
  index: number;
  spec: OrbitSpec;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  angle: React.RefObject<number>;
  intro: React.RefObject<number>;
  colors: ThemeColors;
  focused: number | null;
  onSelect: (i: number) => void;
  register: (i: number, o: THREE.Object3D | null) => void;
}) {
  const spin = useRef<THREE.Group>(null);
  const trailGroup = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Mesh>(null);
  const service = services[index];
  const look = PLANET_LOOKS[index];
  const points = useMemo(() => circlePoints(spec.radius), [spec.radius]);
  const isFocus = focused === index;
  const isHover = hovered === index || isFocus;
  const dim = (hovered !== null || focused !== null) && !isHover;
  const light = useMemo<[number, number, number]>(() => (colors.isDark ? [-5, 2.2, 4.2] : [-3, 2.5, 6]), [colors.isDark]);
  const material = usePlanetMaterial(service.color, look, light, colors.isDark ? 0.05 : 0.32);
  const trail = useTrail(spec.radius, service.color);

  useFrame((state, dt) => {
    if (!spin.current || !body.current || !trailGroup.current) return;
    const a = angle.current * spec.speed + spec.offset;
    const k = 0.25 + 0.75 * easeOut(intro.current * 1.2 - index * 0.05);
    // The whole frame turns with the planet, so the trail always streams behind it.
    spin.current.rotation.z = a;
    trailGroup.current.scale.setScalar(k);
    body.current.position.set(spec.radius * k, 0, 0);
    body.current.rotation.z = -a;
    const target = isFocus ? 1.5 : isHover ? 1.8 : 1;
    const s = THREE.MathUtils.lerp(body.current.scale.x, target, 0.15);
    body.current.scale.setScalar(s * easeOut(intro.current * 1.4 - index * 0.06));
    if (globe.current) {
      globe.current.rotation.y += dt * 0.25;
      tickPlanet(globe.current.material as THREE.ShaderMaterial, state.clock.elapsedTime, isHover);
    }
    // Reach the trail through the scene graph (not the hook value) to fade it.
    const line = trailGroup.current.children[0] as THREE.Line | undefined;
    if (!line) return;
    const tm = line.material as THREE.LineBasicMaterial;
    const want = isHover ? 1 : dim ? 0.12 : colors.isDark ? 0.75 : 0.9;
    tm.opacity += (want - tm.opacity) * 0.1;
  });

  return (
    <group rotation={[spec.tiltX, 0, spec.tiltZ]}>
      <Line
        points={points}
        color={isHover ? service.color : colors.isDark ? colors.moon : colors.muted}
        lineWidth={1}
        transparent
        opacity={isHover ? 0.45 : dim ? 0.03 : colors.isDark ? 0.06 : 0.12}
      />
      <group ref={spin}>
        <group ref={trailGroup}>
          <primitive object={trail} />
        </group>
        <group
          ref={(o) => {
            body.current = o;
            register(index, o);
          }}
        >
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              if (focused !== null) return;
              setHovered(index);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = "";
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "";
              onSelect(index);
            }}
          >
            {/* Generous invisible hit area so small planets are easy to target. */}
            <sphereGeometry args={[look.size * 2.4, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh ref={globe} material={material} rotation={[0.35, 0, 0.2]}>
            <sphereGeometry args={[look.size, 48, 48]} />
          </mesh>
          {look.ring && <PlanetRing size={look.size} color={service.color} />}
          {isHover && !isFocus && (
            <Html center position={[0, look.size * 3.6, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
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
    </group>
  );
}

const FOCUS_SECONDS = 1.15;

function System({ colors, reduced }: { colors: ThemeColors; reduced: boolean }) {
  const router = useRouter();
  const root = useRef<THREE.Group>(null);
  const bodies = useRef<(THREE.Object3D | null)[]>([]);
  // Click-to-zoom: the camera flies to the clicked planet, then the page changes.
  const focus = useRef<{ index: number; start: number; from: THREE.Vector3; done: boolean } | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const clock = useThree((s) => s.clock);
  const camera = useThree((s) => s.camera);
  const tmp = useMemo(() => ({ planet: new THREE.Vector3(), eye: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  const register = (i: number, o: THREE.Object3D | null) => {
    bodies.current[i] = o;
  };

  const select = (i: number) => {
    const href = `/services/${services[i].slug}`;
    if (reduced) {
      router.push(href);
      return;
    }
    if (focus.current) return;
    router.prefetch(href);
    // Lets the hero copy fade out while the camera flies in (see globals.css).
    document.documentElement.dataset.zooming = "1";
    focus.current = { index: i, start: clock.elapsedTime, from: camera.position.clone(), done: false };
    setFocused(i);
  };
  const moon = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const speed = useRef(1);
  const intro = useRef(reduced ? 1 : 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const specs = useOrbitSpecs();
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
      // Orbits slow to a stop while a planet is hovered or being zoomed to.
      speed.current = THREE.MathUtils.lerp(speed.current, hovered === null && focused === null ? 1 : 0, 0.08);
      angle.current += d * speed.current;
    }
    const f = focus.current;
    const target = f ? bodies.current[f.index] : null;
    if (f && target) {
      const k = Math.min(1, (state.clock.elapsedTime - f.start) / FOCUS_SECONDS);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // ease in-out cubic
      target.getWorldPosition(tmp.planet);
      // Stop just in front of the planet, on the side facing the original camera.
      tmp.eye.copy(f.from).sub(tmp.planet).setLength(0.75).add(tmp.planet);
      state.camera.position.lerpVectors(f.from, tmp.eye, e);
      tmp.look.set(0, 0, 0).lerp(tmp.planet, Math.min(1, e * 1.4));
      state.camera.lookAt(tmp.look);
      if (k >= 1 && !f.done) {
        f.done = true;
        router.push(`/services/${services[f.index].slug}`);
      }
      return;
    }
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
      <Suspense fallback={null}>
        <MoonSurface meshRef={moon} reduced={reduced} />
      </Suspense>
      <mesh scale={1.25}>
        <sphereGeometry args={[1.4, 64, 64]} />
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
          focused={focused}
          onSelect={select}
          register={register}
        />
      ))}
      {!reduced && <Satellite colors={colors} paused={focused !== null} />}
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
  useEffect(() => () => void delete document.documentElement.dataset.zooming, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={colors.isDark ? 0.05 : 0.35} />
      {/* Key light from upper-left gives the moon a crescent terminator. */}
      <directionalLight
        position={colors.isDark ? [-5, 2.2, 4.2] : [-3, 2.5, 6]}
        intensity={colors.isDark ? 3.4 : 3.1}
        color={colors.isDark ? "#ffffff" : "#fffaf2"}
      />
      {/* Cool rim light from behind. */}
      <directionalLight position={[5, -1, -4]} intensity={colors.isDark ? 0.55 : 0.2} color={colors.accent} />
      {!reduced && <Meteors colors={colors} />}
      <System colors={colors} reduced={reduced} />
    </Canvas>
  );
}
