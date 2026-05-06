"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { ViewContext } from "@/components/Layout";
import HeroErrorTabs from "@/components/hero/HeroErrorTabs";
import HeroLeadPanel from "@/components/hero/HeroLeadPanel";
import HeroResolveTerminal from "@/components/hero/HeroResolveTerminal";
import {
  AFTER_LAST_TAB_PAD_MS,
  CLI_RESOLVE_WARMUP_MS,
  ErrorTabPhase,
  ERROR_TAB_COUNT,
  ERROR_TAB_RESOLVE_ORDER,
  GREEN_TO_CLOSE_DELAY_MS,
  TAB_CLOSE_ANIM_MS,
  TAB_CLOSE_STAGGER_MS,
  TAB_GREEN_STAGGER_MS,
} from "@/components/hero/errorTabs";

// ヒーロー導入演出の進行フェーズ。
type Phase = "error" | "resolving" | "blinking" | "resolved";
// 点滅演出の周期と回数。
const BLINK_INTERVAL_MS = 120;
const BLINK_TOGGLE_COUNT = 8;
// エラータブは最初だけゆっくり、後半は加速して出現させる。
const INTRO_FIRST_TAB_DELAY_MS = 360;
const INTRO_REVEAL_START_INTERVAL_MS = 230;
const INTRO_REVEAL_ACCELERATION = 0.82;
const INTRO_REVEAL_MIN_INTERVAL_MS = 44;


// ヒーロー表示の外部入力。
interface HeroSectionProps {
  image?: string;
  title?: string;
  subtitle?: string;
  nameEn?: string;
  developerTitle?: string;
  onLead?: () => void;
}

// 画像参照用basePath（開発は空、本番は /Portfolio）。
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

// ヒーロー全体コンテナ。演出フェーズと遷移導線を管理する。
export default function HeroSection({ nameEn, onLead }: HeroSectionProps) {
  // 演出状態とタブ進行状態を保持する主要state。
  const viewContext = useContext(ViewContext);
  const [phase, setPhase] = useState<Phase>("error");
  const [isBlinkVisible, setIsBlinkVisible] = useState(false);
  const [isCliVisible, setIsCliVisible] = useState(false);
  const [errorTabPhases, setErrorTabPhases] = useState<ErrorTabPhase[]>(() =>
    Array.from({ length: ERROR_TAB_COUNT }, (): ErrorTabPhase => "removed")
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let totalDelay = INTRO_FIRST_TAB_DELAY_MS;
    let intervalMs = INTRO_REVEAL_START_INTERVAL_MS;

    Array.from({ length: ERROR_TAB_COUNT }).forEach((_, tabIndex) => {
      const tSpawn = setTimeout(() => {
        setErrorTabPhases((prev) => {
          const next = [...prev];
          next[tabIndex] = "spawning";
          return next;
        });

        const tActivate = setTimeout(() => {
          setErrorTabPhases((prev) => {
            const next = [...prev];
            next[tabIndex] = "active";
            return next;
          });
          if (tabIndex === ERROR_TAB_COUNT - 1) {
            setIsCliVisible(true);
          }
        }, 34);
        timersRef.current.push(tActivate);
      }, totalDelay);

      timersRef.current.push(tSpawn);
      totalDelay += intervalMs;
      // 体感的に「増殖していく」印象を作るため、出現間隔を段階的に短縮する。
      intervalMs = Math.max(INTRO_REVEAL_MIN_INTERVAL_MS, Math.floor(intervalMs * INTRO_REVEAL_ACCELERATION));
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (phase !== "blinking") return;

    let toggleCount = 0;
    const intervalId = setInterval(() => {
      toggleCount += 1;
      setIsBlinkVisible((prev) => !prev);
      if (toggleCount >= BLINK_TOGGLE_COUNT) {
        clearInterval(intervalId);
        setIsBlinkVisible(false);
        setPhase("resolved");
      }
    }, BLINK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [phase]);

  // 中央CLIトリガーからエラー解消シーケンスを開始する。
  const handleResolve = () => {
    if (phase !== "error" || !isCliVisible) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setPhase("resolving");
    setErrorTabPhases(Array.from({ length: ERROR_TAB_COUNT }, (): ErrorTabPhase => "active"));

    const closeOrder = ERROR_TAB_RESOLVE_ORDER;
    closeOrder.forEach((tabIndex, i) => {
      // 各タブは green -> closing -> removed の順で段階的に解消する。
      const startGreenAt = CLI_RESOLVE_WARMUP_MS + i * TAB_GREEN_STAGGER_MS;
      const tGreen = setTimeout(() => {
        setErrorTabPhases((prev) => {
          const next = [...prev];
          next[tabIndex] = "green";
          return next;
        });
      }, startGreenAt);
      timersRef.current.push(tGreen);

      const startCloseAt = startGreenAt + GREEN_TO_CLOSE_DELAY_MS + i * TAB_CLOSE_STAGGER_MS;
      const tClose = setTimeout(() => {
        setErrorTabPhases((prev) => {
          const next = [...prev];
          next[tabIndex] = "closing";
          return next;
        });
        const tRemoved = setTimeout(() => {
          setErrorTabPhases((prev) => {
            const next = [...prev];
            next[tabIndex] = "removed";
            return next;
          });
        }, TAB_CLOSE_ANIM_MS);
        timersRef.current.push(tRemoved);
      }, startCloseAt);
      timersRef.current.push(tClose);
    });

    const resolveDoneMs =
      CLI_RESOLVE_WARMUP_MS +
      (ERROR_TAB_COUNT - 1) * TAB_GREEN_STAGGER_MS +
      GREEN_TO_CLOSE_DELAY_MS +
      (ERROR_TAB_COUNT - 1) * TAB_CLOSE_STAGGER_MS +
      TAB_CLOSE_ANIM_MS +
      AFTER_LAST_TAB_PAD_MS;
    // すべてのタブ削除が終わってから点滅フェーズへ移行する。
    const tBlink = setTimeout(() => setPhase("blinking"), resolveDoneMs);
    timersRef.current.push(tBlink);
  };
  // 本編遷移は演出完了後のみ有効化し、途中クリック誤作動を防ぐ。
  const canEnterMain = phase === "resolved";

  // 解消後に本編へ遷移するハンドラ。
  const handleEnterMain = () => {
    if (viewContext?.enterMain) {
      viewContext.enterMain();
      return;
    }
    onLead?.();
  };
  // 画面全体クリック時の進行制御。
  const handleHeroClick = () => {
    if (phase === "error" && isCliVisible) {
      handleResolve();
      return;
    }
    if (canEnterMain) {
      handleEnterMain();
    }
  };

  return (
    <section
      id="hero"
      className={`snap-start relative flex min-h-screen items-center justify-center overflow-hidden ${
        canEnterMain ? "cursor-pointer" : ""
      }`}
      onClick={handleHeroClick}
    >
      <div className="pointer-events-none absolute inset-0 bg-black" aria-hidden />
      {(phase === "resolved" || phase === "blinking") ? (
        <div
          className={`pointer-events-none absolute inset-0 z-[4] ${
            phase === "blinking"
              ? `transition-opacity duration-450 ease-in-out ${isBlinkVisible ? "opacity-100" : "opacity-0"}`
              : "opacity-100"
          }`}
          aria-hidden
        >
          <img
            src={`${basePath}/images/profile/hero.jpg`}
            alt=""
            className="h-full w-full scale-101 object-cover blur-[3px]"
            loading="eager"
            decoding="async"
          />
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-black/36 backdrop-blur-[4px]"
        aria-hidden
      />

      <HeroLeadPanel nameEn={nameEn} isResolved={phase === "resolved"} onEnterMain={handleEnterMain} />
      {phase !== "resolved" && (
        <p className="pointer-events-none fixed bottom-6 right-6 z-[60] font-mono text-sm font-semibold text-white/65">
          ※エラーは演出です。クリックで進行できます。
        </p>
      )}
      {phase === "resolved" && (
        <p
          aria-label="2026 4/15 Renewal"
          className="pointer-events-none fixed top-1/2 right-1 z-[60] -translate-y-1/2 text-[10px] tracking-[0.24em] text-zinc-200/75 [writing-mode:vertical-rl] [text-orientation:mixed] sm:right-2 sm:text-[11px] md:right-3 md:text-xs"
        >
          2026 4/15 RENEWAL
        </p>
      )}
      {phase === "resolved" && (
        <footer className="pointer-events-none fixed right-4 bottom-4 z-[60] text-[10px] tracking-[0.22em] text-zinc-300 uppercase md:bottom-5 md:right-6 md:text-[11px]">
          <p className="text-right text-zinc-300/85">Copyright</p>
          <p className="mt-1 max-w-sm text-right leading-relaxed text-zinc-400 normal-case tracking-[0.14em]">
            &copy; 2026 Kamon-Tahara-504
          </p>
        </footer>
      )}

      {(phase === "error" || phase === "resolving") && (
        <>
          {isCliVisible && <HeroResolveTerminal phase={phase} errorTabCount={ERROR_TAB_COUNT} onResolve={handleResolve} />}
          <HeroErrorTabs phases={errorTabPhases} />
        </>
      )}
    </section>
  );
}
