/**
 * TrustRing — the hero's 3D object.
 *
 * A gyroscope, not a decorative blob: two counter-rotating rings inside a
 * ticked instrument bezel, with badge-nodes running the outer track. It reads
 * as something calibrated, which is the whole claim — QuantumFlies is the
 * layer that says a machine's next command is inside its certified envelope.
 *
 *   outer ring  the safety envelope, closed and unbroken
 *   nodes       checks running it continuously — geofence, kinematics,
 *               signature, e-stop
 *   inner ring  counter-rotating, because a gimbal that holds attitude while
 *               the frame moves is exactly the idea
 *   bezel       graduated ticks: this is an instrument with units, not an orb
 *
 * ── SIZING ───────────────────────────────────────────────────────────────
 * The object is framed to sit INSIDE its square container with margin, rather
 * than being scaled up and cropped by the viewport. Everything is measured
 * against the camera's visible half-height so the framing holds at any
 * container size:
 *
 *   half-height = distance * tan(fov / 2) = 10.5 * tan(16°) ≈ 3.01
 *
 * The bezel's outer edge is 2.62, so there is ~13% clear on every side. Change
 * the fov or the distance and that margin is what to recompute.
 *
 * ── LIGHTING IS LOCAL, ON PURPOSE ────────────────────────────────────────
 * The glossy read comes from reflections, so the scene needs an environment
 * map. drei's `preset` maps fetch HDRIs from a CDN at runtime — a network
 * dependency on first paint, and a flat matte ring if it fails. <Environment>
 * is fed Lightformer children instead, which render to a local cube target.
 */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/** Track radii. Outer is where the nodes run; bezel is the graduated edge. */
const TRACK = 2.3;
const TRACK_TUBE = 0.075;
const BEZEL = 2.62;
const NODE_R = 0.2;

/** Ghosts per node, and their spacing along the track in radians. */
const TRAIL = 5;
const TRAIL_STEP = 0.05;

const INK = "#14161f";
const LIME = "#c3f53c";

type NodeSpec = { angle: number; glyph: string; live?: boolean };

const NODES: NodeSpec[] = [
  { angle: 0, glyph: "⌖", live: true },
  { angle: Math.PI * 0.5, glyph: "≡" },
  { angle: Math.PI, glyph: "◆" },
  { angle: Math.PI * 1.5, glyph: "⏻" },
];

/**
 * Glyphs are drawn to a canvas rather than loaded as a font: drei's <Text>
 * pulls a typeface over the network per badge, and a missing glyph renders as
 * nothing at all rather than as a visible failure.
 */
function useGlyph(glyph: string, tint: string) {
  return useMemo(() => {
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = tint;
    ctx.font = "600 74px 'Inter Tight', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, s / 2, s / 2 + 2);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }, [glyph, tint]);
}

/** The graduated edge. One instanced mesh, so 72 ticks cost one draw call. */
function Bezel() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 72;

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      const major = i % 6 === 0; // a longer tick every 30°
      o.position.set(Math.cos(a) * BEZEL, Math.sin(a) * BEZEL, 0);
      o.rotation.set(0, 0, a);
      o.scale.set(major ? 0.17 : 0.075, 0.011, 0.011);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[null!, null!, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={INK} transparent opacity={0.3} />
    </instancedMesh>
  );
}

/** One badge plus the trail that sells its speed. */
function Node({ spec, speed }: { spec: NodeSpec; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const ghosts = useRef<(THREE.Mesh | null)[]>([]);
  const tex = useGlyph(spec.glyph, spec.live ? LIME : "#ffffff");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + spec.angle;
    group.current?.position.set(Math.cos(t) * TRACK, Math.sin(t) * TRACK, 0);
    // Ghosts lag along the SAME circular path, so the blur bends with the
    // track. A linear trail on a curve smears off it and reads as a bug.
    ghosts.current.forEach((m, i) => {
      if (!m) return;
      const lag = t - TRAIL_STEP * (i + 1);
      m.position.set(Math.cos(lag) * TRACK, Math.sin(lag) * TRACK, 0);
    });
  });

  return (
    <>
      {Array.from({ length: TRAIL }, (_, i) => (
        <mesh
          key={i}
          // Block body: a ref callback that returns a value is a hard error
          // from React 19 on, and that survives a major upgrade unnoticed.
          ref={(el) => {
            ghosts.current[i] = el;
          }}
        >
          <sphereGeometry args={[NODE_R * (1 - i * 0.12), 16, 16]} />
          <meshBasicMaterial
            color={spec.live ? LIME : INK}
            transparent
            opacity={0.13 * (1 - i / TRAIL)}
            depthWrite={false}
          />
        </mesh>
      ))}

      <group ref={group}>
        <mesh>
          <sphereGeometry args={[NODE_R, 40, 40]} />
          <meshPhysicalMaterial
            color={INK}
            roughness={0.3}
            metalness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.25}
            emissive={spec.live ? LIME : "#000000"}
            emissiveIntensity={spec.live ? 0.14 : 0}
          />
        </mesh>
        <mesh position={[0, 0, NODE_R]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function Instrument({ reduced }: { reduced: boolean }) {
  const frame = useRef<THREE.Group>(null);
  const gimbal = useRef<THREE.Group>(null);
  const speed = reduced ? 0 : 0.3;

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (frame.current) {
      // Small pointer lean, not a model viewer: text sits next to this.
      const drift = reduced ? 0 : Math.sin(t * 0.14) * 0.06;
      frame.current.rotation.x = -0.42 + drift + pointer.y * 0.06;
      frame.current.rotation.y = 0.38 + pointer.x * 0.1;
    }
    // Counter-rotation is the whole gyroscope read — same axis, opposite sign.
    if (gimbal.current && !reduced) gimbal.current.rotation.z = -t * 0.22;
  });

  return (
    <group ref={frame} rotation={[-0.42, 0.38, 0]}>
      <Bezel />

      {/* Outer track — near-white with a hard clearcoat. The grey is not
          pigment, it is the environment reflected in a glossy white surface,
          which is why the colour stays light and shading does the work. */}
      <mesh>
        <torusGeometry args={[TRACK, TRACK_TUBE, 32, 220]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.22}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {NODES.map((n) => (
        <Node key={n.glyph} spec={n} speed={speed} />
      ))}

      {/* Inner gimbal, tipped onto another axis and turning the other way. */}
      <group ref={gimbal} rotation={[1.24, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.52, 0.028, 16, 160]} />
          <meshStandardMaterial color={INK} transparent opacity={0.42} />
        </mesh>
      </group>

      {/* Core: small, faceted, lime. The one warm point in the composition,
          and the thing the eye lands on last. */}
      <mesh rotation={[0.4, 0.6, 0]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={LIME}
          emissive={LIME}
          emissiveIntensity={0.5}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

export default function TrustRing({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      // Decorative: the hero states everything this says in text.
      aria-hidden="true"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10.5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 6, 6]} intensity={1.4} />

      <Environment resolution={256}>
        {/* Big soft key upper-left, dim wrap so undersides never crush. */}
        <Lightformer intensity={2.5} position={[-5, 5, 4]} scale={[10, 10, 1]} />
        <Lightformer intensity={0.7} position={[6, -2, 3]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.4} position={[0, -6, -4]} scale={[12, 6, 1]} />
      </Environment>

      <Instrument reduced={reduced} />
    </Canvas>
  );
}
