"use client";

import { useEffect, useRef, useState } from "react";
import HeroRadialBurst from "@/components/hero/HeroRadialBurst";

// 100% 到達後のホールドと退場アニメーション（ms）。
// パーティクルが見えるよう、ホールドを少し長めに取る。
const HOLD_AT_100_MS = 720;
const EXIT_DURATION_MS = 480;
const GAUGE_SIZE = "min(72vw, 280px)";
// 進捗更新間隔（ms）。
const TICK_INTERVAL_MS = 50;
// 0% を表示し続ける時間（ms）。
const HOLD_AT_ZERO_MS = 400;
// 0%→98% までの充填時間（ms）。中間まで加速 → 後半は減速。
const FILL_TO_98_MS = 2200;
// 99 / 100 それぞれの表示時間（ms）。
const FINAL_STEP_MS = 500;
// SVG 円の半径と円周。
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// 背景グローのサイズ。
const GLOW_SIZE = "min(90vw, 420px)";

interface HeroStartGaugeProps {
  onComplete: () => void;
}

// ease-in-out cubic: 前半加速 → 中間でピーク → 後半減速
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 経過時間から表示パーセントを算出する（0% ホールド → 98% まで ease-in-out → 99-100 を段階表示）。
function computeGaugeProgress(elapsedMs: number): number {
  if (elapsedMs < HOLD_AT_ZERO_MS) {
    return 0;
  }

  const fillElapsed = elapsedMs - HOLD_AT_ZERO_MS;

  if (fillElapsed < FILL_TO_98_MS) {
    const t = fillElapsed / FILL_TO_98_MS;
    return Math.min(98, Math.round(easeInOutCubic(t) * 98));
  }

  const finalElapsed = fillElapsed - FILL_TO_98_MS;
  if (finalElapsed < FINAL_STEP_MS) {
    return 99;
  }
  return 100;
}

function isGaugeFillComplete(elapsedMs: number): boolean {
  return elapsedMs >= HOLD_AT_ZERO_MS + FILL_TO_98_MS + FINAL_STEP_MS * 2;
}

interface HeroGaugeGlowProps {
  opacity: number;
  scale: number;
}

// 進捗に連動する背景グロー。ゲージ背面に配置する。
function HeroGaugeGlow({ opacity, scale }: HeroGaugeGlowProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
    >
      <div
        className="rounded-full blur-3xl transition-[opacity,transform] duration-300 ease-out"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          opacity,
          transform: `scale(${scale})`,
          background:
            "radial-gradient(circle, rgba(244,244,245,0.38) 0%, rgba(161,161,170,0.14) 42%, transparent 72%)",
        }}
      />
    </div>
  );
}

// 導入画面の円ゲージ。0%→100% で onComplete を呼ぶ。
export default function HeroStartGauge({ onComplete }: HeroStartGaugeProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hasCalledCompleteRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReducedMotion(reducedMotion);

    if (reducedMotion) {
      setProgress(100);
      setIsComplete(true);
      return;
    }

    setProgress(0);
    setIsComplete(false);
    setShowBurst(false);

    const startedAt = performance.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = computeGaugeProgress(elapsed);
      setProgress(nextProgress);

      // 100% 表示と同時に放射バーストを出す。
      if (nextProgress >= 100) {
        setShowBurst(true);
        setIsComplete(true);
      }

      if (isGaugeFillComplete(elapsed)) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setProgress(100);
      }
    }, TICK_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isComplete || hasCalledCompleteRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasCalledCompleteRef.current = true;
      onComplete();
      return;
    }

    const holdTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, HOLD_AT_100_MS);

    const completeTimer = window.setTimeout(() => {
      hasCalledCompleteRef.current = true;
      onComplete();
    }, HOLD_AT_100_MS + EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isComplete, onComplete, prefersReducedMotion]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);
  const glowProgress = prefersReducedMotion ? 100 : progress;
  const glowOpacity = prefersReducedMotion ? 0.25 : 0.08 + (glowProgress / 100) * 0.42;
  const glowScale = prefersReducedMotion ? 1 : 0.85 + (glowProgress / 100) * 0.15;

  const exitTransitionClass = prefersReducedMotion
    ? ""
    : "transition-opacity duration-[480ms] ease-in-out";

  return (
    <div
      className={`relative z-10 flex w-full flex-col items-center justify-center ${exitTransitionClass} ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <HeroGaugeGlow opacity={isExiting ? 0 : glowOpacity} scale={glowScale} />
      <HeroRadialBurst
        active={showBurst && !prefersReducedMotion}
        size={GAUGE_SIZE}
        tone="light"
        positioning="fixed-center"
      />
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="読み込み中"
        className="relative flex items-center justify-center"
        style={{ width: GAUGE_SIZE, height: GAUGE_SIZE }}
      >
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(244,244,245,0.12)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(244,244,245,0.85)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isComplete ? 0 : strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-75 ease-out"
          />
        </svg>
        <span className="relative z-10 font-mono text-2xl font-semibold tabular-nums tracking-wider text-zinc-100 sm:text-3xl">
          {progress}
          <span className="text-lg text-zinc-400 sm:text-xl">%</span>
        </span>
      </div>
    </div>
  );
}
