"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ThemeColors } from "@/lib/useTheme";
import { MOON_COLOR_2K, MOON_HEIGHT } from "@/lib/moonTexture";
import { LunarLab } from "./LunarLab";
import { Meteors, Satellite } from "./SpaceTraffic";

/* ---------- Moon surface: NASA LRO colour + LOLA elevation (public domain) ---------- */
function MoonSurface() {
  const [map, bump] = useTexture([MOON_COLOR_2K, MOON_HEIGHT], (loaded) => {
    const [color] = loaded as THREE.Texture[];
    color.colorSpace = THREE.SRGBColorSpace;
    color.anisotropy = 8;
  });
  return (
    <mesh rotation={[0.12, -Math.PI / 2, 0.05]}>
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

const MOON_RADIUS = 1.4;
// Where the base sits: near the upper-left limb, on the sunlit side, facing us a little.
const LAB_NORMAL = new THREE.Vector3(-0.3, 0.84, 0.46).normalize();

function System({ colors, reduced }: { colors: ThemeColors; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const intro = useRef(reduced ? 1 : 0);
  const { size } = useThree();
  const wide = size.width >= 900;

  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(colors.isDark ? "#c9d1e4" : "#d9c9a6") },
      uIntensity: { value: colors.isDark ? 0.55 : 0.45 },
    }),
    [colors.isDark],
  );

  const lab = useMemo(() => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), LAB_NORMAL);
    // Sink the footings slightly so they meet the bumpy surface.
    const p = LAB_NORMAL.clone().multiplyScalar(MOON_RADIUS - 0.012);
    return { position: p, quaternion: q };
  }, []);

  useFrame((state) => {
    if (!reduced) intro.current = Math.min(1, state.clock.elapsedTime / 2.4);
    if (root.current) {
      const p = state.pointer;
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, p.x * 0.22, 0.04);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -p.y * 0.12, 0.04);
      const s = (wide ? 1.12 : 0.7) * (0.85 + 0.15 * easeOut(intro.current));
      root.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={root} position={wide ? [2.7, -0.25, 0] : [0, 1.5, 0]}>
      <Suspense fallback={null}>
        <MoonSurface />
      </Suspense>
      <mesh scale={1.22}>
        <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
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
      <group position={lab.position} quaternion={lab.quaternion} scale={0.72}>
        <LunarLab colors={colors} reduced={reduced} />
      </group>
      {!reduced && <Satellite colors={colors} paused={false} />}
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
      <ambientLight intensity={colors.isDark ? 0.06 : 0.35} />
      {/* Key light from upper-left gives the moon a crescent terminator. */}
      <directionalLight
        position={colors.isDark ? [-5, 2.2, 4.2] : [-3, 2.5, 6]}
        intensity={colors.isDark ? 3.4 : 3.1}
        color={colors.isDark ? "#ffffff" : "#fffaf2"}
      />
      {/* Faint cool rim light from behind. */}
      <directionalLight position={[5, -1, -4]} intensity={colors.isDark ? 0.4 : 0.15} color="#9fb3d9" />
      {!reduced && <Meteors colors={colors} />}
      <System colors={colors} reduced={reduced} />
    </Canvas>
  );
}
