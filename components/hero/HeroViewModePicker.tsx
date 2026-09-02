"use client";

import { useEffect, useRef, useState } from "react";
import HeroRadialBurst, { RADIAL_BURST_HOLD_MS } from "@/components/hero/HeroRadialBurst";
import { PREVIEW_FADE_MS } from "@/components/hero/HeroViewModePreview";
import type { PortfolioViewMode } from "@/types/portfolioView";

interface HeroViewModePickerProps {
  previewMode: PortfolioViewMode | null;
  onPreviewChange: (mode: PortfolioViewMode | null) => void;
  onSelect: (mode: PortfolioViewMode) => void;
}

const OPTIONS: {
  mode: PortfolioViewMode;
  title: string;
  description: string;
}[] = [
  {
    mode: "personal",
    title: "個人向け",
    description: "デザイン重視の表示",
  },
  {
    mode: "recruiter",
    title: "担当者様向け",
    description: "読みやすさ重視の表示",
  },
];

// ゲージと同系統の円周・半径。
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const BUTTON_SIZE = "min(46vw, 280px)";
// 選択確定後のフェード退場時間（ms）。
const SELECT_EXIT_MS = 420;

// 背景プレビューに合わせて案内文の色・影を切り替える。
function getPromptStyleClass(previewMode: PortfolioViewMode | null): string {
  switch (previewMode) {
    case "recruiter":
      return "text-black";
    case "personal":
      return "text-zinc-50 [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]";
    default:
      return "text-zinc-300 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]";
  }
}

// 未選択時（黒背景）のゲージ色。
const IDLE_TRACK_STROKE = "rgba(244,244,245,0.12)";
const IDLE_PROGRESS_STROKE = "rgba(244,244,245,0.85)";
const IDLE_PROGRESS_RING_OPACITY = 0.35;
// 担当者プレビュー（白背景）の非選択ゲージ色。
const RECRUITER_IDLE_TRACK_STROKE = "rgba(0,0,0,0.18)";
const RECRUITER_IDLE_PROGRESS_STROKE = "rgba(0,0,0,0.35)";
const RECRUITER_IDLE_PROGRESS_RING_OPACITY = 0.35;

// 担当者プレビュー時は白地・黒文字。非選択側のゲージは未選択時と同透明度。
function getButtonInnerClass(isRecruiterPreview: boolean, isActive: boolean): string {
  if (isRecruiterPreview) {
    return "bg-white";
  }
  return isActive ? "bg-zinc-950/70" : "bg-zinc-950/55 group-hover:bg-zinc-950/70";
}

function getTrackStroke(isRecruiterPreview: boolean): string {
  return isRecruiterPreview ? RECRUITER_IDLE_TRACK_STROKE : IDLE_TRACK_STROKE;
}

function getProgressStroke(isRecruiterPreview: boolean, isActive: boolean): string {
  if (isRecruiterPreview) {
    return isActive ? "#000000" : RECRUITER_IDLE_PROGRESS_STROKE;
  }
  return IDLE_PROGRESS_STROKE;
}

function getProgressRingOpacity(isRecruiterPreview: boolean, isActive: boolean): number {
  if (isRecruiterPreview) {
    return isActive ? 1 : RECRUITER_IDLE_PROGRESS_RING_OPACITY;
  }
  return isActive ? 1 : IDLE_PROGRESS_RING_OPACITY;
}

function getTitleClass(isRecruiterPreview: boolean): string {
  return isRecruiterPreview ? "text-black" : "text-white";
}

function getDescriptionClass(isRecruiterPreview: boolean): string {
  return isRecruiterPreview ? "text-black" : "text-zinc-400 sm:text-sm";
}

function getFocusOutlineClass(isRecruiterPreview: boolean): string {
  return isRecruiterPreview
    ? "focus-visible:ring-black"
    : "focus-visible:ring-zinc-100/70";
}

// ゲージ完了後に表示するビューモード選択 UI。
export default function HeroViewModePicker({
  previewMode,
  onPreviewChange,
  onSelect,
}: HeroViewModePickerProps) {
  const [isEntered, setIsEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // クリック確定後のモード。エフェクト表示中は再選択不可。
  const [confirmingMode, setConfirmingMode] = useState<PortfolioViewMode | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  // リングゲージが満タンになったモードのみ確定可能。
  const [gaugeReadyMode, setGaugeReadyMode] = useState<PortfolioViewMode | null>(null);
  const hasCommittedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReducedMotion(reducedMotion);

    if (reducedMotion) {
      setIsEntered(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => setIsEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // プレビュー中のリング充填完了を待つ。完了前のクリックでは確定しない。
  useEffect(() => {
    if (confirmingMode) return;

    if (!previewMode) {
      setGaugeReadyMode(null);
      return;
    }

    if (prefersReducedMotion) {
      setGaugeReadyMode(previewMode);
      return;
    }

    setGaugeReadyMode(null);
    const readyTimer = window.setTimeout(() => {
      setGaugeReadyMode(previewMode);
    }, PREVIEW_FADE_MS);

    return () => window.clearTimeout(readyTimer);
  }, [previewMode, confirmingMode, prefersReducedMotion]);

  useEffect(() => {
    if (!confirmingMode || hasCommittedRef.current) return;

    if (prefersReducedMotion) {
      hasCommittedRef.current = true;
      onSelect(confirmingMode);
      return;
    }

    // 放射エフェクトが見えるようホールドしてから退場 → 本編へ。
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, RADIAL_BURST_HOLD_MS);

    const commitTimer = window.setTimeout(() => {
      hasCommittedRef.current = true;
      onSelect(confirmingMode);
    }, RADIAL_BURST_HOLD_MS + SELECT_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(commitTimer);
    };
  }, [confirmingMode, onSelect, prefersReducedMotion]);

  const handleSelect = (mode: PortfolioViewMode) => {
    if (confirmingMode) return;
    // ゲージが溜まり切るまで確定させない。
    if (gaugeReadyMode !== mode) return;
    setConfirmingMode(mode);
    // 確定中はプレビューを固定する。
    onPreviewChange(mode);
  };

  const enterTransitionClass = prefersReducedMotion
    ? ""
    : "transition-[opacity,transform] duration-700 ease-out";

  const promptColorTransitionClass = prefersReducedMotion
    ? ""
    : "transition-colors ease-in-out";
  const promptColorTransitionStyle = prefersReducedMotion
    ? undefined
    : { transitionDuration: `${PREVIEW_FADE_MS}ms` };

  const exitTransitionClass = prefersReducedMotion
    ? ""
    : "transition-opacity ease-in-out";

  const isRecruiterPreview = previewMode === "recruiter";
  const colorTransitionClass = prefersReducedMotion
    ? ""
    : "transition-[background-color,color,stroke,opacity] ease-in-out";

  return (
    <div
      className={`relative z-10 flex w-full flex-col items-center gap-8 px-6 sm:gap-10 ${exitTransitionClass} ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      style={prefersReducedMotion ? undefined : { transitionDuration: `${SELECT_EXIT_MS}ms` }}
    >
      <p
        className={`max-w-xl text-center text-base font-semibold tracking-[0.16em] uppercase sm:text-lg md:text-xl ${promptColorTransitionClass} ${getPromptStyleClass(previewMode)} ${enterTransitionClass} ${
          isEntered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{
          ...(prefersReducedMotion ? {} : { transitionDelay: "80ms" }),
          ...promptColorTransitionStyle,
        }}
      >
        表示モードを選択してください
      </p>
      <div className="flex flex-row flex-wrap items-center justify-center gap-12 sm:gap-16 md:gap-20">
        {OPTIONS.map((option, index) => {
          const isActive = previewMode === option.mode;
          const isConfirming = confirmingMode === option.mode;
          const isGaugeReady = gaugeReadyMode === option.mode;
          const canConfirm = isGaugeReady && confirmingMode === null;
          const enterDelayMs = prefersReducedMotion ? 0 : 180 + index * 120;
          const ringTransitionStyle = prefersReducedMotion
            ? undefined
            : { transitionDuration: `${PREVIEW_FADE_MS}ms` };
          const burstTone = option.mode === "recruiter" ? "dark" : "light";

          return (
            <div
              key={option.mode}
              className="relative shrink-0"
              style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
            >
              {/* clip-path の外側に置くため、ボタンの兄弟としてバーストを描画する。 */}
              <HeroRadialBurst
                active={isConfirming && !prefersReducedMotion}
                size={BUTTON_SIZE}
                tone={burstTone}
                positioning="absolute"
              />
              <button
                type="button"
                aria-label={
                  canConfirm
                    ? `${option.title} — ${option.description}`
                    : `${option.title} — ゲージが満タンになるまでホバーしてください`
                }
                aria-disabled={!canConfirm}
                disabled={confirmingMode !== null}
                onMouseEnter={() => {
                  if (!confirmingMode) onPreviewChange(option.mode);
                }}
                onMouseLeave={() => {
                  if (!confirmingMode) onPreviewChange(null);
                }}
                onFocus={() => {
                  if (!confirmingMode) onPreviewChange(option.mode);
                }}
                onBlur={() => {
                  if (!confirmingMode) onPreviewChange(null);
                }}
                onClick={() => handleSelect(option.mode)}
                className={`group relative flex h-full w-full items-center justify-center overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)] focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none disabled:cursor-default ${getFocusOutlineClass(isRecruiterPreview)} ${enterTransitionClass} ${
                  isEntered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${isEntered && isActive ? "scale-[1.02]" : isEntered ? "scale-100 hover:scale-[1.02]" : "scale-95"}`}
                style={{
                  transitionDelay: prefersReducedMotion || confirmingMode ? undefined : `${enterDelayMs}ms`,
                }}
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
                    strokeWidth="6"
                    className={colorTransitionClass}
                    style={{ ...ringTransitionStyle, stroke: getTrackStroke(isRecruiterPreview) }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={isActive ? 0 : CIRCUMFERENCE}
                    className={`transition-[stroke-dashoffset,opacity,stroke] ease-in-out ${prefersReducedMotion ? "duration-0" : ""}`}
                    style={{
                      ...ringTransitionStyle,
                      stroke: getProgressStroke(isRecruiterPreview, isActive),
                      opacity: getProgressRingOpacity(isRecruiterPreview, isActive),
                    }}
                  />
                </svg>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-[10%] rounded-full ${colorTransitionClass} ${getButtonInnerClass(isRecruiterPreview, isActive)} ${
                    isRecruiterPreview || !isActive ? "" : "shadow-[0_0_32px_rgba(244,244,245,0.08)]"
                  }`}
                  style={ringTransitionStyle}
                />
                <span className="relative z-10 flex max-w-[72%] flex-col items-center gap-2 text-center sm:gap-2.5">
                  <span
                    className={`text-base font-semibold tracking-wide sm:text-lg ${colorTransitionClass} ${getTitleClass(isRecruiterPreview)}`}
                    style={ringTransitionStyle}
                  >
                    {option.title}
                  </span>
                  <span
                    className={`text-xs leading-snug ${colorTransitionClass} ${getDescriptionClass(isRecruiterPreview)}`}
                    style={ringTransitionStyle}
                  >
                    {option.description}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
