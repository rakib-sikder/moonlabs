"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ThemeColors } from "@/lib/useTheme";

/* ---------- A small satellite on a low, tilted orbit around the moon ---------- */
// It passes in front of the moon roughly every half minute and disappears behind it in between.
export function Satellite({ colors, paused }: { colors: ThemeColors; paused: boolean }) {
  const craft = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const angle = useRef(0.6);
  const RADIUS = 1.95;

  useFrame((state, dt) => {
    if (!paused) angle.current += Math.min(dt, 0.05) * 0.21;
    const a = angle.current;
    if (craft.current) {
      craft.current.position.set(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS * 0.18, Math.sin(a) * RADIUS);
      // Face along the direction of travel, with a slow tumble of the panels.
      craft.current.rotation.set(0.35, -a, Math.sin(state.clock.elapsedTime * 0.4) * 0.25);
    }
    if (beacon.current) beacon.current.visible = state.clock.elapsedTime % 1.6 < 0.12;
  });

  const panel = colors.isDark ? "#2a3f8f" : "#24357a";
  return (
    <group rotation={[0.42, 0, -0.32]}>
      <group ref={craft} scale={0.75}>
        {/* Body wrapped in gold foil */}
        <mesh>
          <boxGeometry args={[0.07, 0.07, 0.11]} />
          <meshStandardMaterial color="#d6a94e" metalness={0.85} roughness={0.32} />
        </mesh>
        {/* Solar panel wings */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.15, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.2, 0.005, 0.075]} />
              <meshStandardMaterial color={panel} metalness={0.55} roughness={0.28} emissive={panel} emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[-side * 0.105, 0, 0]}>
              <boxGeometry args={[0.03, 0.006, 0.008]} />
              <meshStandardMaterial color="#9aa3b5" metalness={0.8} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Dish and antenna */}
        <mesh position={[0, 0.055, 0.02]} rotation={[-0.6, 0, 0]}>
          <coneGeometry args={[0.035, 0.02, 16, 1, true]} />
          <meshStandardMaterial color="#e8ebf2" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
          <meshStandardMaterial color="#c9ced9" />
        </mesh>
        <mesh ref={beacon} position={[0, 0.042, -0.05]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color="#ff5a5a" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Occasional meteors streaking across the background ---------- */
const meteorVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const meteorFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLife;
  varying vec2 vUv;
  void main() {
    // Bright head at uv.x = 1, tail fading to nothing; soft across the width.
    float along = pow(vUv.x, 2.6);
    float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float core = smoothstep(0.0, 1.0, across) * along;
    float head = smoothstep(0.93, 1.0, vUv.x) * smoothstep(0.2, 1.0, across);
    float a = (core + head * 0.8) * uLife;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), head * 0.6), a);
  }
`;

type Flight = { x: number; y: number; dx: number; dy: number; start: number; duration: number };

export function Meteors({ colors }: { colors: ThemeColors }) {
  const mesh = useRef<THREE.Mesh>(null);
  const flight = useRef<Flight | null>(null);
  const nextAt = useRef(3.5);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: meteorVertex,
        fragmentShader: meteorFragment,
        uniforms: {
          uColor: { value: new THREE.Color(colors.isDark ? "#cfd8ff" : colors.accent) },
          uLife: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: colors.isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    [colors.isDark, colors.accent],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const u = (m.material as THREE.ShaderMaterial).uniforms;

    if (!flight.current && t >= nextAt.current) {
      // Launch from the upper part of the sky, heading down and to the left.
      const ang = Math.PI + 0.38 + Math.random() * 0.3;
      flight.current = {
        x: -1 + Math.random() * 10,
        y: 2.6 + Math.random() * 2.4,
        dx: Math.cos(ang),
        dy: Math.sin(ang),
        start: t,
        duration: 0.8 + Math.random() * 0.5,
      };
      m.rotation.z = ang; // the plane's +x end (the head) points along the flight
    }

    const f = flight.current;
    if (!f) {
      m.visible = false;
      return;
    }
    const k = (t - f.start) / f.duration;
    if (k >= 1) {
      flight.current = null;
      nextAt.current = t + 5 + Math.random() * 9;
      m.visible = false;
      return;
    }
    const dist = k * 7.5;
    m.visible = true;
    m.position.set(f.x + f.dx * dist, f.y + f.dy * dist, -4);
    // Quick fade in, long fade out.
    u.uLife.value = Math.min(1, k * 6) * (1 - Math.pow(k, 2.2)) * (colors.isDark ? 1 : 0.75);
  });

  return (
    <mesh ref={mesh} material={material} visible={false}>
      <planeGeometry args={[2.2, 0.035]} />
    </mesh>
  );
}
