"use client";

import { useEffect, useState } from "react";
import { PREVIEW_FADE_MS } from "@/components/hero/HeroViewModePreview";
import type { PortfolioViewMode } from "@/types/portfolioView";

// 流星群の軌跡。向きは揃え、ボタン円には重ねず付近まで寄せる。密度は画面全体で均す。
const METEOR_LINES: {
  id: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width: string;
  rotateDeg: number;
  opacity: number;
}[] = [
  // --- 上部 ---
  { id: "t1", top: "5%", left: "3%", width: "min(20vw, 130px)", rotateDeg: -29, opacity: 0.48 },
  { id: "t2", top: "4%", left: "36%", width: "min(14vw, 92px)", rotateDeg: -27, opacity: 0.4 },
  { id: "t3", top: "7%", right: "8%", width: "min(12vw, 78px)", rotateDeg: -34, opacity: 0.36 },
  { id: "t4", top: "12%", left: "20%", width: "min(11vw, 72px)", rotateDeg: -32, opacity: 0.34 },
  { id: "t5", top: "14%", left: "52%", width: "min(10vw, 64px)", rotateDeg: -24, opacity: 0.28 },
  { id: "t6", top: "11%", right: "22%", width: "min(13vw, 84px)", rotateDeg: -36, opacity: 0.34 },
  { id: "t7", top: "19%", left: "8%", width: "min(9vw, 58px)", rotateDeg: -25, opacity: 0.3 },
  { id: "t8", top: "21%", left: "42%", width: "min(12vw, 78px)", rotateDeg: -31, opacity: 0.36 },
  { id: "t9", top: "23%", right: "18%", width: "min(11vw, 70px)", rotateDeg: -28, opacity: 0.32 },

  // --- ボタン付近（少なめ・円に入らない短線） ---
  { id: "n-left-1", top: "28%", left: "22%", width: "min(9vw, 58px)", rotateDeg: -30, opacity: 0.32 },
  { id: "n-left-2", top: "32%", left: "30%", width: "min(7vw, 46px)", rotateDeg: -34, opacity: 0.28 },
  { id: "n-right-1", top: "27%", right: "22%", width: "min(9vw, 58px)", rotateDeg: -27, opacity: 0.32 },
  { id: "n-right-2", top: "31%", right: "30%", width: "min(7vw, 46px)", rotateDeg: -33, opacity: 0.28 },
  { id: "n1", top: "30%", left: "46%", width: "min(6vw, 42px)", rotateDeg: -33, opacity: 0.28 },
  { id: "n2", top: "47%", left: "48%", width: "min(5vw, 34px)", rotateDeg: -29, opacity: 0.24 },
  { id: "n3", top: "64%", left: "46%", width: "min(6vw, 42px)", rotateDeg: -31, opacity: 0.26 },
  { id: "n4", top: "40%", left: "14%", width: "min(7vw, 46px)", rotateDeg: -27, opacity: 0.26 },
  { id: "n5", top: "44%", right: "14%", width: "min(7vw, 46px)", rotateDeg: -34, opacity: 0.26 },
  // --- 個人向けボタン左（短線） ---
  { id: "pl1", top: "36%", left: "2%", width: "min(10vw, 64px)", rotateDeg: -28, opacity: 0.32 },
  { id: "pl2", top: "44%", left: "5%", width: "min(8vw, 52px)", rotateDeg: -33, opacity: 0.28 },
  { id: "pl3", top: "54%", left: "3%", width: "min(9vw, 58px)", rotateDeg: -26, opacity: 0.3 },
  { id: "pl4", top: "48%", left: "11%", width: "min(7vw, 46px)", rotateDeg: -31, opacity: 0.26 },
  // --- 担当者様向けボタン右下（短線） ---
  { id: "pr1", top: "52%", right: "3%", width: "min(10vw, 64px)", rotateDeg: -28, opacity: 0.32 },
  { id: "pr2", top: "58%", right: "6%", width: "min(8vw, 52px)", rotateDeg: -33, opacity: 0.28 },
  { id: "pr3", top: "64%", right: "4%", width: "min(9vw, 58px)", rotateDeg: -26, opacity: 0.3 },
  { id: "pr4", top: "56%", right: "12%", width: "min(7vw, 46px)", rotateDeg: -31, opacity: 0.26 },

  // --- 左右 ---
  { id: "m1", top: "38%", left: "3%", width: "min(11vw, 70px)", rotateDeg: -30, opacity: 0.34 },
  { id: "m2", top: "52%", left: "4%", width: "min(10vw, 64px)", rotateDeg: -26, opacity: 0.3 },
  { id: "m3", top: "36%", right: "3%", width: "min(12vw, 78px)", rotateDeg: -33, opacity: 0.34 },
  { id: "m4", top: "50%", right: "4%", width: "min(10vw, 64px)", rotateDeg: -28, opacity: 0.3 },

  // --- 下部 ---
  { id: "b1", top: "70%", left: "20%", width: "min(12vw, 78px)", rotateDeg: -32, opacity: 0.36 },
  { id: "b2", top: "72%", left: "42%", width: "min(10vw, 66px)", rotateDeg: -28, opacity: 0.32 },
  { id: "b3", top: "69%", right: "18%", width: "min(13vw, 84px)", rotateDeg: -35, opacity: 0.36 },
  { id: "b4", top: "78%", left: "30%", width: "min(11vw, 70px)", rotateDeg: -30, opacity: 0.3 },
  { id: "b5", top: "80%", left: "55%", width: "min(10vw, 64px)", rotateDeg: -37, opacity: 0.3 },
  { id: "b6", top: "76%", right: "10%", width: "min(9vw, 58px)", rotateDeg: -25, opacity: 0.28 },
  { id: "b7", bottom: "5%", left: "26%", width: "min(10vw, 64px)", rotateDeg: -33, opacity: 0.28 },
  { id: "b8", bottom: "4%", right: "30%", width: "min(12vw, 78px)", rotateDeg: -29, opacity: 0.3 },
  // --- 左下（密度を補う） ---
  { id: "bl1", top: "74%", left: "4%", width: "min(13vw, 84px)", rotateDeg: -31, opacity: 0.34 },
  { id: "bl2", top: "82%", left: "8%", width: "min(11vw, 70px)", rotateDeg: -27, opacity: 0.3 },
  { id: "bl3", bottom: "8%", left: "3%", width: "min(12vw, 78px)", rotateDeg: -35, opacity: 0.32 },
  { id: "bl4", bottom: "3%", left: "14%", width: "min(10vw, 64px)", rotateDeg: -29, opacity: 0.28 },
  // --- 下端中央〜右寄り（密度を補う） ---
  { id: "bc1", bottom: "7%", left: "38%", width: "min(12vw, 78px)", rotateDeg: -31, opacity: 0.32 },
  { id: "bc2", bottom: "2%", left: "48%", width: "min(11vw, 70px)", rotateDeg: -27, opacity: 0.3 },
  { id: "bc3", bottom: "9%", left: "62%", width: "min(13vw, 84px)", rotateDeg: -34, opacity: 0.34 },
  { id: "bc4", bottom: "3%", right: "12%", width: "min(10vw, 64px)", rotateDeg: -29, opacity: 0.28 },
];

interface HeroViewModeAmbientLinesProps {
  previewMode: PortfolioViewMode | null;
  isEntered: boolean;
  prefersReducedMotion: boolean;
}

// プレビュー背景に合わせた線色（黒背景時は非表示）。
function getAmbientLineClass(previewMode: PortfolioViewMode): string {
  return previewMode === "recruiter" ? "text-black" : "text-white";
}

// 表示モード選択のプレビュー時のみ、斜め線アクセントを散らす。
export default function HeroViewModeAmbientLines({
  previewMode,
  isEntered,
  prefersReducedMotion,
}: HeroViewModeAmbientLinesProps) {
  // フェードアウト中も直前の色を保つ。
  const [heldMode, setHeldMode] = useState<PortfolioViewMode | null>(null);

  useEffect(() => {
    if (previewMode) {
      setHeldMode(previewMode);
      return;
    }

    if (prefersReducedMotion) {
      setHeldMode(null);
      return;
    }

    const clearTimer = window.setTimeout(() => {
      setHeldMode(null);
    }, PREVIEW_FADE_MS);

    return () => window.clearTimeout(clearTimer);
  }, [previewMode, prefersReducedMotion]);

  const isVisible = isEntered && previewMode !== null;
  const colorClass = heldMode ? getAmbientLineClass(heldMode) : "text-transparent";
  const transitionClass = prefersReducedMotion ? "" : "transition-opacity ease-in-out";
  const transitionStyle = prefersReducedMotion
    ? undefined
    : { transitionDuration: `${PREVIEW_FADE_MS}ms` };

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${colorClass} ${transitionClass} ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={transitionStyle}
    >
      {METEOR_LINES.map((line) => (
        <span
          key={line.id}
          className="absolute origin-left h-[1.5px] bg-current"
          style={{
            top: line.top,
            left: line.left,
            right: line.right,
            bottom: line.bottom,
            width: line.width,
            opacity: line.opacity,
            transform: `rotate(${line.rotateDeg}deg)`,
          }}
        />
      ))}
    </div>
  );
}
