"use client";

import { useContext, useState, useEffect } from "react";
import { ViewContext } from "./Layout";

type Phase = "error" | "resolving" | "resolved";

interface ErrorPosition {
  top: string;
  left: string;
  rotate: string;
}

const ERROR_POSITIONS: ErrorPosition[] = [
  { top: "5%",  left: "8%",   rotate: "-2deg" },
  { top: "4%",  left: "38%",  rotate: "1deg" },
  { top: "6%",  left: "68%",  rotate: "-1deg" },
  { top: "5%",  left: "88%",  rotate: "1.5deg" },
  { top: "18%", left: "5%",   rotate: "2deg" },
  { top: "16%", left: "48%",  rotate: "-1.5deg" },
  { top: "17%", left: "82%",  rotate: "1deg" },
  { top: "32%", left: "12%",  rotate: "-2deg" },
  { top: "34%", left: "45%",  rotate: "1.5deg" },
  { top: "30%", left: "75%",  rotate: "-1deg" },
  { top: "48%", left: "6%",   rotate: "2deg" },
  { top: "46%", left: "52%",  rotate: "-1deg" },
  { top: "50%", left: "85%",  rotate: "1deg" },
  { top: "64%", left: "10%",  rotate: "-1.5deg" },
  { top: "62%", left: "42%",  rotate: "2deg" },
  { top: "66%", left: "72%",  rotate: "-1deg" },
  { top: "82%", left: "8%",   rotate: "1deg" },
  { top: "84%", left: "48%",  rotate: "-2deg" },
  { top: "86%", left: "78%",  rotate: "1.5deg" },
];

const RESOLVE_STAGGER_MS = 48;
const GREEN_BEFORE_FADE_MS = 340;

/** エラーLEAD出現: 順序シャッフル + 間隔にジッター + 後半ほど間隔が短くなる（加速） */
function buildErrorSpawnSchedule(length: number): { index: number; atMs: number }[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let j = indices.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [indices[j], indices[k]] = [indices[k], indices[j]];
  }

  const firstPairGapMin = 150;
  const firstPairGapMax = 230;
  const maxGapAfterSecond = 110;
  const minGapAfterSecond = 14;
  let cumulative = 160 + Math.random() * 220;
  const schedule: { index: number; atMs: number }[] = [];

  indices.forEach((index, orderPos) => {
    schedule.push({ index, atMs: Math.round(cumulative) });
    if (orderPos < length - 1) {
      // 1個目と2個目の間は少し間を持たせる
      if (orderPos === 0) {
        cumulative += firstPairGapMin + Math.random() * (firstPairGapMax - firstPairGapMin);
      } else {
        // 3個目以降は一気にテンポアップしつつ後半でさらに加速
        const progressAfterSecond =
          length > 2 ? (orderPos - 1) / (length - 2) : 1;
        const gapBase =
          maxGapAfterSecond -
          progressAfterSecond * (maxGapAfterSecond - minGapAfterSecond);
        const jitter = (Math.random() - 0.5) * 50;
        cumulative += Math.max(10, gapBase + jitter);
      }
    }
  });

  return schedule;
}

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  nameEn?: string;
  developerTitle?: string;
}

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

export default function HeroSection({ nameEn }: HeroSectionProps) {
  const viewContext = useContext(ViewContext);
  const [phase, setPhase] = useState<Phase>("error");
  const [visibleErrors, setVisibleErrors] = useState<Set<number>>(new Set());
  const [greenFlashing, setGreenFlashing] = useState<Set<number>>(new Set());
  const [fadedOut, setFadedOut] = useState<Set<number>>(new Set());

  useEffect(() => {
    const schedule = buildErrorSpawnSchedule(ERROR_POSITIONS.length);
    const timers: ReturnType<typeof setTimeout>[] = [];
    schedule.forEach(({ index, atMs }) => {
      timers.push(
        setTimeout(() => {
          setVisibleErrors((prev) => new Set([...prev, index]));
        }, atMs)
      );
    });
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleResolve = () => {
    if (phase !== "error") return;
    setPhase("resolving");
    ERROR_POSITIONS.forEach((_, i) => {
      setTimeout(() => {
        setGreenFlashing((prev) => new Set([...prev, i]));
      }, i * RESOLVE_STAGGER_MS);
      setTimeout(() => {
        setFadedOut((prev) => new Set([...prev, i]));
      }, i * RESOLVE_STAGGER_MS + GREEN_BEFORE_FADE_MS);
    });
    const lastIndex = ERROR_POSITIONS.length - 1;
    const resolveDoneMs =
      lastIndex * RESOLVE_STAGGER_MS + GREEN_BEFORE_FADE_MS + 520;
    setTimeout(() => {
      setPhase("resolved");
    }, resolveDoneMs);
  };

  const allErrorsVisible = visibleErrors.size >= ERROR_POSITIONS.length;

  const leadArrow = (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white"
    >
      {/* Resolved後: 上下に映像を表示（中央エリアと重ならない） */}
      {phase === "resolved" && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-5 h-[28vh] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,0_72%)] animate-video-strip-in-top">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full scale-125 object-cover"
            >
              <source src={`${basePath}/images/profile/Galaxy1.mp4`} type="video/mp4" />
            </video>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-[28vh] overflow-hidden [clip-path:polygon(0_0,100%_28%,100%_100%,0_100%)] animate-video-strip-in-bottom">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full scale-125 object-cover"
            >
              <source src={`${basePath}/images/profile/Galaxy2.mp4`} type="video/mp4" />
            </video>
          </div>
        </>
      )}

      {/* Center block — always rendered so name never shifts position */}
      {nameEn && (
        <div
          className={`relative z-10 flex flex-col items-center gap-1 px-6 text-center select-none pointer-events-none ${
            phase === "resolved" ? "py-[27vh]" : ""
          }`}
        >
          {/* Portfolio label */}
          <p
            className="font-ink leading-none text-black"
            style={{ fontSize: "clamp(100px, 16vw, 260px)" }}
          >
            Portfolio
          </p>

          {/* Name — Portfolio の下でやや右寄せ */}
          <h1 className="w-full max-w-[min(640px,80vw)] text-right pr-3 md:pr-6 mb-1">
            <span className="font-ink font-semibold leading-tight text-black text-2xl md:text-3xl lg:text-4xl">
              {nameEn}
            </span>
          </h1>

          {/* Real LEAD button (resolved) — Portfolio の真下に中央配置 */}
          {phase === "resolved" && (
            <button
              type="button"
              onClick={() => viewContext?.enterMain()}
              className="animate-resolved-fade-in pointer-events-auto group inline-flex items-center gap-3 rounded-full border-2 border-black bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black shadow-lg transition-[border-color,transform,box-shadow] duration-300 hover:scale-105 hover:border-neutral-500 active:scale-[1.02]"
              aria-label="ポートフォリオを見る"
            >
              <span>LEAD</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Invisible spacer — keeps layout stable during error/resolving */}
          {phase !== "resolved" && (
            <div
              className="invisible inline-flex items-center gap-3 rounded-full border-2 border-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.25em]"
              aria-hidden
            >
              <span>LEAD</span>
              {leadArrow}
            </div>
          )}
        </div>
      )}

      {/* Scattered error LEAD buttons */}
      {phase !== "resolved" &&
        ERROR_POSITIONS.map((pos, i) => {
          const isVisible = visibleErrors.has(i);
          const isFaded = fadedOut.has(i);
          const isGreen = greenFlashing.has(i);
          if (!isVisible) return null;

          return (
            <div
              key={i}
              className="absolute z-20 pointer-events-auto select-none"
              style={{
                top: pos.top,
                left: pos.left,
                opacity: isFaded ? 0 : 1,
                transform: isFaded
                  ? `rotate(${pos.rotate}) scale(0.75)`
                  : `rotate(${pos.rotate})`,
                transition:
                  "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
            >
              <div
                className={`animate-error-pop inline-flex cursor-default items-center gap-3 rounded-full border-0 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] transition-[background-color,color,box-shadow] duration-300 ease-out ${
                  isGreen
                    ? "bg-emerald-50 text-emerald-900 shadow-[0_0_0_2px_#059669,0_4px_14px_rgba(5,150,105,0.2)]"
                    : "bg-white text-black shadow-[0_0_0_2px_#dc2626,0_2px_10px_rgba(0,0,0,0.08)] hover:bg-neutral-200 hover:text-black hover:shadow-[0_0_0_2px_#737373,0_2px_10px_rgba(0,0,0,0.1)]"
                }`}
              >
                <span>LEAD</span>
                {leadArrow}
              </div>
            </div>
          );
        })}

      {/* CLI 風ミニウィンドウ — 全エラー出現後のみ */}
      {(phase === "error" || phase === "resolving") && allErrorsVisible && (
        <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,22rem)] -translate-x-1/2 -translate-y-1/2 select-none">
          <div className="overflow-hidden rounded-lg border border-black/25 bg-[#1a1a1a] shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            {/* タイトルバー */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#2a2a2a] px-2.5 py-1.5">
              <span className="flex gap-1" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              </span>
              <span className="font-mono text-[10px] font-medium tracking-wide text-white/45">
                portfolio-cli — zsh
              </span>
            </div>

            {phase === "error" ? (
              <button
                type="button"
                onClick={handleResolve}
                aria-label="fix-lead コマンドを実行してエラーを解消"
                className="group w-full px-3 py-2.5 text-left font-mono text-[11px] leading-snug text-emerald-300/90 transition-colors hover:bg-white/[0.06] active:bg-white/[0.08]"
              >
                <p className="mb-1 text-white/40">
                  ERR: duplicate LEAD handlers ({ERROR_POSITIONS.length})
                </p>
                <p className="mb-2 text-[10px] text-white/28">hint: run purge to consolidate</p>
                <p>
                  <span className="text-sky-400/90">portfolio</span>
                  <span className="text-white/40">@</span>
                  <span className="text-violet-300/85">site</span>
                  <span className="text-white/40">:</span>
                  <span className="text-amber-200/75">~</span>
                  <span className="text-white/40">$ </span>
                  <span className="text-amber-100/95 group-hover:underline decoration-amber-100/40 underline-offset-2">
                    npx portfolio-cli fix-lead --purge
                  </span>
                  <span
                    className="ml-0.5 inline-block h-3 w-1 translate-y-px bg-emerald-400 align-middle animate-pulse"
                    aria-hidden
                  />
                </p>
                <p className="mt-2 text-[10px] text-white/30">クリックで実行</p>
              </button>
            ) : (
              <div className="px-3 py-2.5 font-mono text-[11px] leading-snug text-emerald-300/90">
                <p className="mb-1.5">
                  <span className="text-sky-400/90">portfolio</span>
                  <span className="text-white/40">@</span>
                  <span className="text-violet-300/85">site</span>
                  <span className="text-white/40">:</span>
                  <span className="text-amber-200/75">~</span>
                  <span className="text-white/40">$ </span>
                  <span className="text-amber-100/90">npx portfolio-cli fix-lead --purge</span>
                </p>
                <p className="flex items-center gap-2 text-white/55">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/25 border-t-emerald-400" />
                  <span className="animate-pulse">purging ghost LEAD buttons…</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
