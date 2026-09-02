"use client";

import { useMemo } from "react";

// パーティクル数。
export const RADIAL_BURST_COUNT = 32;
// 選択確定後、エフェクトが見えるまでのホールド（ms）。
export const RADIAL_BURST_HOLD_MS = 900;

interface RadialBurstParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  delayMs: number;
  durationMs: number;
  offsetX: number;
  offsetY: number;
  peakOpacity: number;
}

// 円外周から放射状に広がるパーティクル設定を生成する。
function createRadialBurstParticles(count: number): RadialBurstParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count + (index % 3) * 0.17;
    const radiusRatio = 0.48 + (index % 5) * 0.018;
    const x = 50 + Math.cos(angle) * radiusRatio * 100;
    const y = 50 + Math.sin(angle) * radiusRatio * 100;
    const size = 5 + (index % 5) * 2.2;
    const delayMs = (index % 5) * 16;
    const durationMs = 900 + (index % 6) * 110;
    const distance = 48 + (index % 8) * 12;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    const peakOpacity = 0.72 + (index % 4) * 0.08;

    return {
      id: index,
      left: `${x}%`,
      top: `${y}%`,
      size,
      delayMs,
      durationMs,
      offsetX,
      offsetY,
      peakOpacity,
    };
  });
}

export type RadialBurstTone = "light" | "dark";

interface HeroRadialBurstProps {
  active: boolean;
  /** 発生円のサイズ（ゲージ / 選択ボタンと同じ寸法）。 */
  size: string;
  /** light: 暗背景向けの明るい粒子 / dark: 白背景向けの暗い粒子。 */
  tone?: RadialBurstTone;
  /** fixed で画面中央に置くか、親 relative に absolute で乗せるか。 */
  positioning?: "fixed-center" | "absolute";
  className?: string;
}

function getParticleClass(tone: RadialBurstTone): string {
  return tone === "dark"
    ? "border-zinc-900/70 bg-zinc-900/40 shadow-[0_0_10px_rgba(0,0,0,0.28)]"
    : "border-zinc-100/70 bg-zinc-100/45 shadow-[0_0_10px_rgba(244,244,245,0.35)]";
}

// 円周から放射状に広がる共通パーティクル演出。
export default function HeroRadialBurst({
  active,
  size,
  tone = "light",
  positioning = "absolute",
  className = "",
}: HeroRadialBurstProps) {
  const particles = useMemo(() => createRadialBurstParticles(RADIAL_BURST_COUNT), []);
  if (!active) return null;

  const particleClass = getParticleClass(tone);
  const frame = (
    <div className={`relative overflow-visible ${className}`} style={{ width: size, height: size }}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`animate-carbonation-bubble absolute rounded-full border ${particleClass}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            marginLeft: -particle.size / 2,
            marginTop: -particle.size / 2,
            animationDelay: `${particle.delayMs}ms`,
            animationDuration: `${particle.durationMs}ms`,
            // CSS 変数で放射方向の移動量・ピーク透明度を渡す。
            ["--bubble-x" as string]: `${particle.offsetX}px`,
            ["--bubble-y" as string]: `${particle.offsetY}px`,
            ["--bubble-peak-opacity" as string]: String(particle.peakOpacity),
          }}
        />
      ))}
    </div>
  );

  if (positioning === "fixed-center") {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] flex items-center justify-center overflow-visible"
      >
        {frame}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {frame}
    </div>
  );
}
