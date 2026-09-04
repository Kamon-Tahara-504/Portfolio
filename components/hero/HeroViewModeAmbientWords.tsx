"use client";

import { useEffect, useState } from "react";
import { PREVIEW_FADE_MS } from "@/components/hero/HeroViewModePreview";
import type { PortfolioViewMode } from "@/types/portfolioView";

interface AmbientWord {
  text: string;
  index: string;
  // 画面上の位置クラス。
  positionClass: string;
  // 中央寄せなど、位置用の transform。
  anchorClass?: string;
  // 浮遊アニメのずれ。
  floatDelayClass: string;
  floatDurationClass: string;
}

// Vision（迷いを技術で解消し創造的な時間・体験を生む）に沿った語。
const AMBIENT_WORDS: AmbientWord[] = [
  {
    text: "迷い",
    index: "01",
    positionClass: "top-[8%] left-[5%] sm:top-[10%] sm:left-[7%] md:left-[9%]",
    floatDelayClass: "[animation-delay:0ms]",
    floatDurationClass: "[animation-duration:5.5s]",
  },
  {
    text: "技術",
    index: "02",
    positionClass: "top-[8%] right-[5%] sm:top-[10%] sm:right-[7%] md:right-[9%]",
    floatDelayClass: "[animation-delay:700ms]",
    floatDurationClass: "[animation-duration:6.2s]",
  },
  {
    text: "解消",
    index: "03",
    positionClass: "bottom-[12%] left-[6%] sm:bottom-[14%] sm:left-[8%] md:left-[10%]",
    floatDelayClass: "[animation-delay:1200ms]",
    floatDurationClass: "[animation-duration:5.8s]",
  },
  {
    text: "創造",
    index: "04",
    positionClass: "bottom-[8%] left-1/2 sm:bottom-[10%]",
    anchorClass: "-translate-x-1/2",
    floatDelayClass: "[animation-delay:400ms]",
    floatDurationClass: "[animation-duration:6.8s]",
  },
  {
    text: "体験",
    index: "05",
    positionClass: "bottom-[12%] right-[6%] sm:bottom-[14%] sm:right-[8%] md:right-[10%]",
    floatDelayClass: "[animation-delay:1600ms]",
    floatDurationClass: "[animation-duration:5.2s]",
  },
];

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
  // 左ボタン上に2本
  { id: "n-left-1", top: "28%", left: "22%", width: "min(9vw, 58px)", rotateDeg: -30, opacity: 0.32 },
  { id: "n-left-2", top: "32%", left: "30%", width: "min(7vw, 46px)", rotateDeg: -34, opacity: 0.28 },
  // 右ボタン上に2本
  { id: "n-right-1", top: "27%", right: "22%", width: "min(9vw, 58px)", rotateDeg: -27, opacity: 0.32 },
  { id: "n-right-2", top: "31%", right: "30%", width: "min(7vw, 46px)", rotateDeg: -33, opacity: 0.28 },
  { id: "n1", top: "30%", left: "46%", width: "min(6vw, 42px)", rotateDeg: -33, opacity: 0.28 },
  { id: "n2", top: "47%", left: "48%", width: "min(5vw, 34px)", rotateDeg: -29, opacity: 0.24 },
  { id: "n3", top: "64%", left: "46%", width: "min(6vw, 42px)", rotateDeg: -31, opacity: 0.26 },
  { id: "n4", top: "40%", left: "14%", width: "min(7vw, 46px)", rotateDeg: -27, opacity: 0.26 },
  { id: "n5", top: "44%", right: "14%", width: "min(7vw, 46px)", rotateDeg: -34, opacity: 0.26 },

  // --- 左右の語のあいだ ---
  { id: "m1", top: "38%", left: "3%", width: "min(11vw, 70px)", rotateDeg: -30, opacity: 0.34 },
  { id: "m2", top: "52%", left: "4%", width: "min(10vw, 64px)", rotateDeg: -26, opacity: 0.3 },
  { id: "m3", top: "36%", right: "3%", width: "min(12vw, 78px)", rotateDeg: -33, opacity: 0.34 },
  { id: "m4", top: "50%", right: "4%", width: "min(10vw, 64px)", rotateDeg: -28, opacity: 0.3 },

  // --- 下部（語ブロックの隙間寄り） ---
  { id: "b1", top: "70%", left: "20%", width: "min(12vw, 78px)", rotateDeg: -32, opacity: 0.36 },
  { id: "b2", top: "72%", left: "42%", width: "min(10vw, 66px)", rotateDeg: -28, opacity: 0.32 },
  { id: "b3", top: "69%", right: "18%", width: "min(13vw, 84px)", rotateDeg: -35, opacity: 0.36 },
  { id: "b4", top: "78%", left: "30%", width: "min(11vw, 70px)", rotateDeg: -30, opacity: 0.3 },
  { id: "b5", top: "80%", left: "55%", width: "min(10vw, 64px)", rotateDeg: -37, opacity: 0.3 },
  { id: "b6", top: "76%", right: "10%", width: "min(9vw, 58px)", rotateDeg: -25, opacity: 0.28 },
  { id: "b7", bottom: "5%", left: "26%", width: "min(10vw, 64px)", rotateDeg: -33, opacity: 0.28 },
  { id: "b8", bottom: "4%", right: "30%", width: "min(12vw, 78px)", rotateDeg: -29, opacity: 0.3 },
];

interface HeroViewModeAmbientWordsProps {
  previewMode: PortfolioViewMode | null;
  isEntered: boolean;
  prefersReducedMotion: boolean;
}

// プレビュー背景に合わせた文字色（黒背景時は非表示）。
function getAmbientTextClass(previewMode: PortfolioViewMode): string {
  return previewMode === "recruiter" ? "text-black" : "text-white";
}

// 表示モード選択のプレビュー時のみ、縦書き＋番号＋線アクセントの Vision 文言を散らす。
export default function HeroViewModeAmbientWords({
  previewMode,
  isEntered,
  prefersReducedMotion,
}: HeroViewModeAmbientWordsProps) {
  // フェードアウト中も直前の色を保つ（text-transparent 即時切替で消えて見えないようにする）。
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
  const colorClass = heldMode ? getAmbientTextClass(heldMode) : "text-transparent";
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
      {/* 斜め線（流星軌跡・不規則） */}
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

      {AMBIENT_WORDS.map((word) => (
        <div
          key={word.text}
          className={`absolute ${word.positionClass} ${word.anchorClass ?? ""}`}
        >
          {/* 文字は正立のまま。浮遊のみ transform を使う。 */}
          <div
            className={`flex flex-col items-center gap-2 sm:gap-2.5 ${
              prefersReducedMotion || !heldMode
                ? ""
                : `animate-ambient-float ${word.floatDelayClass} ${word.floatDurationClass}`
            }`}
          >
            {/* 番号 + 短い横線 */}
            <span className="select-none text-[10px] font-medium tracking-[0.2em] sm:text-xs">
              {word.index}
            </span>
            <span className="h-[1.5px] w-4 bg-current opacity-70" aria-hidden />

            {/* 縦書き本体 + 左側の縦線（文字に寄せる） */}
            <div className="flex items-stretch gap-1">
              <span className="w-[1.5px] self-stretch bg-current" aria-hidden />
              <span className="select-none font-black tracking-[0.08em] [writing-mode:vertical-rl] [text-orientation:upright] text-[clamp(1.9rem,6vw,4.25rem)] sm:text-[clamp(2.2rem,7vw,4.75rem)]">
                {word.text}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
