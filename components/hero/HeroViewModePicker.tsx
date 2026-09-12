"use client";

import { useEffect, useRef, useState } from "react";
import HeroRadialBurst, { RADIAL_BURST_HOLD_MS } from "@/components/hero/HeroRadialBurst";
import HeroViewModeAmbientLines from "@/components/hero/HeroViewModeAmbientLines";
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
// ゲージ充填・減少時間。背景フェードより短くして、早く確定確認できるようにする。
const GAUGE_FILL_MS = 980;
// 満タン判定の許容誤差。
const GAUGE_READY_EPSILON = 0.001;

/** 序盤は加速、終盤は減速して収まる充填カーブ。 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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

// 未選択時／個人向けプレビューのゲージ色。
const IDLE_TRACK_STROKE = "rgba(244,244,245,0.12)";
const IDLE_PROGRESS_STROKE = "rgba(244,244,245,0.85)";
const IDLE_PROGRESS_RING_OPACITY = 0.35;
// 担当者プレビュー時のゲージ色（白背景で空リングも見える濃さ）。
const RECRUITER_TRACK_STROKE = "rgba(0,0,0,0.22)";
const RECRUITER_PROGRESS_STROKE = "#000000";
const RECRUITER_IDLE_PROGRESS_STROKE = "rgba(0,0,0,0.38)";
// 背景フェードより早くゲージ色を切り替えて、プレビュー途中でも空リングを見せる。
const GAUGE_COLOR_MS = 360;

// ボタン内側はプレビュー種別に依存せず、個人向けと同じ暗色を維持する。
function getButtonInnerClass(isActive: boolean): string {
  return isActive ? "bg-zinc-950/70" : "bg-zinc-950/55 group-hover:bg-zinc-950/70";
}

function getProgressRingOpacity(hasProgress: boolean): number {
  return hasProgress ? 1 : IDLE_PROGRESS_RING_OPACITY;
}

// 担当者プレビュー中は両ボタンとも暗色ゲージ（白背景で空ゲージが見えるようにする）。
function getGaugeStrokes(
  isRecruiterPreview: boolean,
  isActive: boolean
): {
  track: string;
  progress: string;
} {
  if (!isRecruiterPreview) {
    return { track: IDLE_TRACK_STROKE, progress: IDLE_PROGRESS_STROKE };
  }
  return {
    track: RECRUITER_TRACK_STROKE,
    progress: isActive ? RECRUITER_PROGRESS_STROKE : RECRUITER_IDLE_PROGRESS_STROKE,
  };
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
  // リング見た目の進捗 0〜1（イージング後）。クリック可否も同じ値を使う。
  const [gaugeProgress, setGaugeProgress] = useState(0);
  // 進捗を表示しているボタン（解除後の減少中も維持する）。
  const [gaugeProgressMode, setGaugeProgressMode] = useState<PortfolioViewMode | null>(null);
  const hasCommittedRef = useRef(false);
  // 線形時間 0〜1。見た目はこの値を ease-in したものを使う。
  const gaugeTimeRef = useRef(0);
  const gaugeProgressModeRef = useRef<PortfolioViewMode | null>(null);

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

  // ゲージ進捗を JS で駆動し、見た目と ready 判定を常に一致させる。
  useEffect(() => {
    if (confirmingMode) return;

    if (prefersReducedMotion) {
      if (previewMode) {
        gaugeTimeRef.current = 1;
        gaugeProgressModeRef.current = previewMode;
        setGaugeProgress(1);
        setGaugeProgressMode(previewMode);
      } else {
        gaugeTimeRef.current = 0;
        gaugeProgressModeRef.current = null;
        setGaugeProgress(0);
        setGaugeProgressMode(null);
      }
      return;
    }

    // 別モードへ移ったら進捗をリセットして詰め直す。
    if (previewMode && gaugeProgressModeRef.current && previewMode !== gaugeProgressModeRef.current) {
      gaugeTimeRef.current = 0;
      setGaugeProgress(0);
    }
    if (previewMode) {
      gaugeProgressModeRef.current = previewMode;
      setGaugeProgressMode(previewMode);
    }

    const target = previewMode ? 1 : 0;
    let frameId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - lastTs);
      lastTs = now;
      const step = dt / GAUGE_FILL_MS;
      const current = gaugeTimeRef.current;

      let nextTime = current;
      if (current < target) {
        nextTime = Math.min(target, current + step);
      } else if (current > target) {
        nextTime = Math.max(target, current - step);
      }

      gaugeTimeRef.current = nextTime;
      // 線形時間を加速→終盤減速のカーブへ変換して見た目・判定を同期する。
      const nextProgress = easeInOutCubic(nextTime);
      setGaugeProgress(nextProgress);

      if (!previewMode && nextTime <= GAUGE_READY_EPSILON) {
        gaugeTimeRef.current = 0;
        gaugeProgressModeRef.current = null;
        setGaugeProgress(0);
        setGaugeProgressMode(null);
        return;
      }

      if (Math.abs(nextTime - target) > GAUGE_READY_EPSILON) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      gaugeTimeRef.current = target;
      setGaugeProgress(easeInOutCubic(target));
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
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
    // 進捗が満タンかつ、そのモードをホバー中のときだけ確定できる。
    if (previewMode !== mode) return;
    if (gaugeProgressMode !== mode || gaugeProgress < 1 - GAUGE_READY_EPSILON) return;
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
      <HeroViewModeAmbientLines
        previewMode={previewMode}
        isEntered={isEntered}
        prefersReducedMotion={prefersReducedMotion}
      />
      <p
        className={`relative z-10 max-w-xl text-center text-base font-semibold tracking-[0.16em] uppercase sm:text-lg md:text-xl ${promptColorTransitionClass} ${getPromptStyleClass(previewMode)} ${enterTransitionClass} ${
          isEntered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{
          ...(prefersReducedMotion ? {} : { transitionDelay: "80ms" }),
          ...promptColorTransitionStyle,
        }}
      >
        表示モードを選択してください
      </p>
      <div className="relative z-10 flex flex-row flex-wrap items-center justify-center gap-12 sm:gap-16 md:gap-20">
        {OPTIONS.map((option) => {
          const isActive = previewMode === option.mode;
          const isConfirming = confirmingMode === option.mode;
          const ringProgress = gaugeProgressMode === option.mode ? gaugeProgress : 0;
          const isGaugeReady =
            isActive && gaugeProgressMode === option.mode && gaugeProgress >= 1 - GAUGE_READY_EPSILON;
          const canConfirm = isGaugeReady && confirmingMode === null;
          const ringTransitionStyle = prefersReducedMotion
            ? undefined
            : { transitionDuration: `${PREVIEW_FADE_MS}ms` };
          // ゲージ色だけ早めに切り替えて、背景クロスフェード途中でも空リングを見せる。
          const gaugeColorTransitionStyle = prefersReducedMotion
            ? undefined
            : { transitionDuration: `${GAUGE_COLOR_MS}ms` };
          const burstTone = option.mode === "recruiter" ? "dark" : "light";
          // ホバー解除と同時に元色へ戻す（display ホールドしない）。
          const isRecruiterPreview = previewMode === "recruiter";
          const gaugeStrokes = getGaugeStrokes(isRecruiterPreview, isActive || ringProgress > 0);

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
                className={`group relative flex h-full w-full items-center justify-center overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)] focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none disabled:cursor-default focus-visible:ring-zinc-100/70 ${enterTransitionClass} ${
                  isEntered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${isEntered && isActive ? "scale-[1.02]" : isEntered ? "scale-100 hover:scale-[1.02]" : "scale-95"}`}
                style={{
                  // 左右のボタンは同じタイミングで入場させる。
                  transitionDelay: prefersReducedMotion || confirmingMode ? undefined : "180ms",
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
                    style={{ ...gaugeColorTransitionStyle, stroke: gaugeStrokes.track }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - ringProgress)}
                    className={colorTransitionClass}
                    style={{
                      // dashoffset は JS 進捗と同期。色だけ CSS で切り替える。
                      transitionDuration: prefersReducedMotion ? undefined : `${GAUGE_COLOR_MS}ms`,
                      transitionProperty: "stroke, opacity",
                      stroke: gaugeStrokes.progress,
                      opacity: getProgressRingOpacity(ringProgress > GAUGE_READY_EPSILON),
                    }}
                  />
                </svg>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-[10%] rounded-full ${colorTransitionClass} ${getButtonInnerClass(isActive)} ${
                    isActive ? "shadow-[0_0_32px_rgba(244,244,245,0.08)]" : ""
                  }`}
                  style={ringTransitionStyle}
                />
                <span className="relative z-10 flex max-w-[72%] flex-col items-center gap-2 text-center sm:gap-2.5">
                  <span
                    className={`text-base font-semibold tracking-wide text-white sm:text-lg ${colorTransitionClass}`}
                    style={ringTransitionStyle}
                  >
                    {option.title}
                  </span>
                  <span
                    className={`text-xs leading-snug text-zinc-400 sm:text-sm ${colorTransitionClass}`}
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
