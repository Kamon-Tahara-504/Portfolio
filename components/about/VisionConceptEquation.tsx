"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// エディタで書き換える前後のコード行。before → after へ上書きするアニメーション。
const CODE_BEFORE = "await sleep(3200);";
const CODE_AFTER  = "await cache.get(key);";

// 遅いスピナー（Before）を描画する。
function SlowSpinner() {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="relative flex h-28 w-28 items-center justify-center sm:h-40 sm:w-40 md:h-48 md:w-48">
        <svg
          className="h-full w-full animate-[spin_3.5s_linear_infinite]"
          viewBox="0 0 48 48"
          fill="none"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(239,68,68,0.35)"
            strokeWidth="3.5"
          />
          <path
            d="M44 24a20 20 0 0 0-20-20"
            stroke="rgb(239,68,68)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-mono text-base font-medium tracking-wider text-red-400/90 sm:text-lg md:text-xl">
        3.2s
      </span>
    </div>
  );
}

// フェーズ: "before" = 古いコード表示 → "deleting" = 消す → "typing" = 新コード入力 → "done" = 完了表示
type Phase = "before" | "deleting" | "typing" | "done";

// コードエディタ風パネル。既存コードを消して新しいコードに書き換えるアニメーション。
function CodeEditorPanel({ active }: { active: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("before");
  const [line, setLine] = useState(CODE_BEFORE);

  useEffect(() => {
    if (!active || shouldReduceMotion) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const loop = async () => {
      while (!cancelled) {
        setPhase("before");
        setLine(CODE_BEFORE);
        await sleep(1800);
        if (cancelled) return;

        setPhase("deleting");
        for (let i = CODE_BEFORE.length; i >= 0; i--) {
          if (cancelled) return;
          setLine(CODE_BEFORE.slice(0, i));
          await sleep(22);
        }
        if (cancelled) return;

        setPhase("typing");
        await sleep(200);
        for (let i = 1; i <= CODE_AFTER.length; i++) {
          if (cancelled) return;
          setLine(CODE_AFTER.slice(0, i));
          await sleep(48);
        }
        if (cancelled) return;

        setPhase("done");
        await sleep(2800);
      }
    };

    void loop();
    return () => { cancelled = true; };
  }, [active, shouldReduceMotion]);

  const displayLine = !active
    ? CODE_BEFORE
    : shouldReduceMotion
      ? CODE_AFTER
      : line;

  // 編集中〜完了フェーズのみ改善後カラーを使って「最適化後」を強調する。
  const isAfterCode = phase === "typing" || phase === "done";
  const lineColor = isAfterCode ? "text-emerald-300" : "text-red-300/90";

  return (
    <div className="flex w-[min(100%,22rem)] flex-col items-stretch gap-2 self-center sm:w-[min(100%,28rem)] sm:gap-3 md:w-[min(100%,32rem)]">
      <div className="relative overflow-hidden rounded-lg border border-cyan-500/30 bg-zinc-950/85 shadow-[0_0_32px_-4px_rgba(34,211,238,0.2)] backdrop-blur-sm sm:rounded-xl">
        {/* タイトルバー */}
        <div className="flex items-center gap-1.5 border-b border-zinc-800/90 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
          <span className="size-2.5 rounded-full bg-red-500/80 sm:size-3" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-400/80 sm:size-3" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-500/70 sm:size-3" aria-hidden />
          <span className="ml-2 truncate font-mono text-[10px] tracking-wide text-zinc-500 sm:text-xs">
            loader.ts — src
          </span>
        </div>

        {/* コードエリア */}
        <div className="px-3 py-3 sm:px-5 sm:py-4">
          {/* 行1: 静的 */}
          <p className="font-mono text-xs leading-[1.85] text-zinc-500/80 sm:text-sm md:text-base">
            <span className="mr-2.5 inline-block w-5 text-right text-zinc-600/60 sm:w-6">1</span>
            <span className="text-violet-400/80">async</span>
            <span className="text-cyan-100/90"> fetch</span>
            <span className="text-amber-300/70">{"()"}</span>
            <span className="text-zinc-500"> {"{"}</span>
          </p>

          {/* 行2: 書き換わる行 */}
          <p className="font-mono text-xs leading-[1.85] sm:text-sm md:text-base">
            <span className="mr-2.5 inline-block w-5 text-right text-zinc-600/60 sm:w-6">2</span>
            <span className="pl-3 sm:pl-4">
              <span className={lineColor}>{displayLine}</span>
            </span>
            <span
              className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-pulse bg-cyan-400/90 align-middle sm:h-[1em] sm:w-[2.5px]"
              aria-hidden
            />
          </p>

          {/* 行3: 静的 */}
          <p className="font-mono text-xs leading-[1.85] text-zinc-500/80 sm:text-sm md:text-base">
            <span className="mr-2.5 inline-block w-5 text-right text-zinc-600/60 sm:w-6">3</span>
            <span className="text-zinc-500">{"}"}</span>
          </p>
        </div>
      </div>
      <span className="text-center font-mono text-xs font-medium tracking-[0.18em] text-cyan-400/70 uppercase sm:text-sm md:text-base">
        refactor
      </span>
    </div>
  );
}

// 高速ゲージ充填→チェックマークポップ→リセットを繰り返すアニメーション。
function FastSpinner({ active }: { active: boolean }) {
  const [cycle, setCycle] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || shouldReduceMotion) return;
    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        // 充填→チェック→ポップの1サイクルが見える間隔で再スタートする。
        await new Promise((r) => setTimeout(r, 4000));
        if (cancelled) return;
        setCycle((c) => c + 1);
      }
    };

    void loop();
    return () => { cancelled = true; };
  }, [active, shouldReduceMotion]);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="relative flex h-28 w-28 items-center justify-center sm:h-40 sm:w-40 md:h-48 md:w-48">
        <svg key={cycle} className="h-full w-full" viewBox="0 0 48 48" fill="none">
          {/* 背景リング */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(34,197,94,0.35)"
            strokeWidth="3.5"
          />
          {/* 一瞬で充填されるゲージ */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgb(34,197,94)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset="126"
            className="animate-[circle-fill_0.35s_0.1s_ease-out_forwards]"
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
          {/* チェックマーク描画 */}
          <path
            d="M16 24.5l5.5 5.5L32 19"
            stroke="rgb(34,197,94)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="24"
            strokeDashoffset="24"
            className="animate-[check-draw_0.3s_0.4s_ease-out_forwards]"
          />
        </svg>
        {/* チェックマーク後のポップグロー */}
        <div
          key={`glow-${cycle}`}
          className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/20 opacity-0 blur-md animate-[pop-glow_0.6s_0.55s_ease-out_forwards]"
        />
      </div>
      <span className="font-mono text-base font-medium tracking-wider text-green-400/90 sm:text-lg md:text-xl">
        0.1s
      </span>
    </div>
  );
}

// × 記号を白い線で描画する。
function CrossOperator() {
  return (
    // ラベル行(3.2s/0.1s)の分だけ上に補正し、視覚中心を揃える。
    <div className="relative flex shrink-0 items-center justify-center self-center h-14 w-14 -translate-y-3 sm:h-20 sm:w-20 sm:-translate-y-4 md:h-24 md:w-24">
      <span className="absolute h-[6px] w-full rotate-45 rounded-full bg-white" />
      <span className="absolute h-[6px] w-full -rotate-45 rounded-full bg-white" />
    </div>
  );
}

// = 記号を白い線で描画する。
function EqualOperator() {
  return (
    // × と同じ基準で上方向に補正し、両オペレータの見た目を揃える。
    <div className="relative flex shrink-0 flex-col items-center justify-center gap-3 self-center w-14 -translate-y-3 sm:w-20 sm:-translate-y-4 sm:gap-4 md:w-24 md:gap-5">
      <span className="block h-[6px] w-full rounded-full bg-white" />
      <span className="block h-[6px] w-full rounded-full bg-white" />
    </div>
  );
}

// 「遅い → 技術 → 速い」のコンセプト数式全体を配置する。
export default function VisionConceptEquation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12 sm:mt-16 md:mt-20"
    >
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
        <SlowSpinner />
        <CrossOperator />
        <CodeEditorPanel key={isInView ? "vision-editor-in" : "vision-editor-out"} active={isInView} />
        <EqualOperator />
        <FastSpinner key={isInView ? "fast-spinner-active" : "fast-spinner-idle"} active={isInView} />
      </div>
    </motion.div>
  );
}
