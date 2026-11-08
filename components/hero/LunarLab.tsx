"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ThemeColors } from "@/lib/useTheme";

/*
  The "lab" in Moonlabs: a small research base sitting on the moon's surface.
  Built in local space with +Y as the surface normal; the parent places and orients it.
  Domes with lit windows, a connecting tunnel, a solar array, and a mast that
  sends out a radio pulse every couple of seconds.
*/

const PULSE_EVERY = 2.6;

function Dome({ radius, position }: { radius: number; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e9e7e1" metalness={0.25} roughness={0.45} />
      </mesh>
      {/* Panel seams */}
      {[0.35, 0.7].map((h) => (
        <mesh key={h} position={[0, radius * h * 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * Math.sqrt(1 - (h * 0.92) ** 2), radius * 0.018, 6, 48]} />
          <meshStandardMaterial color="#b9b6ad" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {/* Ring of lit windows around the base */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius * 0.985, radius * 0.16, Math.sin(a) * radius * 0.985]}
            rotation={[0, -a + Math.PI / 2, 0]}
          >
            <planeGeometry args={[radius * 0.32, radius * 0.11]} />
            <meshBasicMaterial color="#ffc46b" toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Footing ring */}
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[radius * 1.06, radius * 1.1, 0.012, 40]} />
        <meshStandardMaterial color="#8d8a83" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Tunnel({ from, to, radius }: { from: [number, number, number]; to: [number, number, number]; radius: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: a.add(b).multiplyScalar(0.5), quaternion: q, length: dir.length() };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial color="#d9d6ce" metalness={0.3} roughness={0.5} />
    </mesh>
  );
}

export function LunarLab({ colors, reduced }: { colors: ThemeColors; reduced: boolean }) {
  const beacon = useRef<THREE.Mesh>(null);
  const pulses = useRef<THREE.Group>(null);

  const pulseMaterials = useMemo(
    () =>
      [0, 1, 2].map(
        () =>
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(colors.accent),
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false,
            toneMapped: false,
          }),
      ),
    [colors.accent],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beacon.current) beacon.current.visible = reduced || t % 1.4 < 0.18;
    const g = pulses.current;
    if (!g || reduced) return;
    // Three staggered rings expand from the mast top and fade out.
    g.children.forEach((child, i) => {
      const k = (((t + i * (PULSE_EVERY / 3)) % PULSE_EVERY) / PULSE_EVERY);
      child.scale.setScalar(0.2 + k * 3.2);
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - k) * (1 - k) * 0.55;
    });
  });

  const mastTop: [number, number, number] = [-0.24, 0.62, -0.08];

  return (
    <group>
      {/* Warm spill from the windows onto the regolith */}
      <pointLight position={[0, 0.25, 0.15]} color="#ffb55a" intensity={colors.isDark ? 0.45 : 0.2} distance={0.7} decay={2} />

      <Dome radius={0.24} position={[0, 0, 0]} />
      <Dome radius={0.15} position={[0.42, 0, 0.1]} />
      <Dome radius={0.11} position={[-0.36, 0, 0.18]} />
      <Tunnel from={[0.18, 0.06, 0.04]} to={[0.3, 0.06, 0.08]} radius={0.05} />
      <Tunnel from={[-0.2, 0.05, 0.08]} to={[-0.27, 0.05, 0.14]} radius={0.04} />

      {/* Solar array */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0.18 + side * 0.17, 0.12, -0.34]} rotation={[-0.75, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.012, 0.16]} />
            <meshStandardMaterial color="#1c2f66" metalness={0.6} roughness={0.25} emissive="#0d1a3d" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, -0.07, 0.04]} rotation={[0.75, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
            <meshStandardMaterial color="#9a9890" />
          </mesh>
        </group>
      ))}

      {/* Communications mast with dish and beacon */}
      <mesh position={[-0.24, 0.31, -0.08]}>
        <cylinderGeometry args={[0.012, 0.018, 0.62, 8]} />
        <meshStandardMaterial color="#cfcbc2" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.24, 0.5, -0.04]} rotation={[-0.9, 0, 0.3]}>
        <coneGeometry args={[0.09, 0.04, 24, 1, true]} />
        <meshStandardMaterial color="#efede7" metalness={0.3} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={beacon} position={mastTop}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#ff5a4a" toneMapped={false} />
      </mesh>
      <group ref={pulses} position={mastTop}>
        {pulseMaterials.map((m, i) => (
          <mesh key={i} material={m} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.112, 64]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
