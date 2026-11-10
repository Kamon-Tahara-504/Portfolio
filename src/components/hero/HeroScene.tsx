import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import type { Group } from "three";
import styles from "./HeroAtmosphere.module.css";

type BlobProps = {
  position: [number, number, number];
  scale: number;
  distort: number;
  /** 行き来の周期（秒）。大きいほどゆっくり動く */
  period: number;
  phase?: number;
};

/** 液体金属風の立体。歪みと往復で表面と位置をゆっくり変える */
function MetalBlob({ position, scale, distort, period, phase = 0 }: BlobProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const t = clock.elapsedTime / period + phase;
    group.position.x = position[0] + Math.sin(t * Math.PI * 2) * 0.35;
    group.position.y = position[1] + Math.cos(t * Math.PI * 2) * 0.18;
    group.rotation.y = t * 0.55;
    group.rotation.z = Math.sin(t * Math.PI * 2) * 0.12;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#111111"
          metalness={1}
          roughness={0.08}
          distort={distort}
          speed={1.05}
        />
      </mesh>
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 2]} intensity={1.4} />
      {/* 外部 HDR を使わず、白い板状の光だけを並べて金属の映り込みを作る */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[-3, 2, 2]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[3, -1, 1]} scale={[4, 3, 1]} />
        <Lightformer form="ring" intensity={1.4} position={[0, 3, -2]} scale={5} />
      </Environment>
    </>
  );
}

/**
 * Hero 右側の 3D 背景。画面外では描画を止め、端末の負荷を下げる。
 * Atmosphere 側から lazy で読み込む前提なので、このファイル単体ではフォールバックしない。
 */
export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const camera = useMemo(() => ({ position: [0, 0, 5.2] as [number, number, number], fov: 42 }), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={styles.canvas}>
      <Canvas
        dpr={[1, 1.5]}
        camera={camera}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#ffffff"]} />
        <SceneLights />
        {/* 右側に寄せて置き、文字側の白地を広く残す */}
        <MetalBlob position={[2.05, 0.25, -0.2]} scale={1.85} distort={0.38} period={18} />
        <MetalBlob position={[2.55, -1.45, 0.55]} scale={0.82} distort={0.5} period={12} phase={0.35} />
      </Canvas>
    </div>
  );
}
