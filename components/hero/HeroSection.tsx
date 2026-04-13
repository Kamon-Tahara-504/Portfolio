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
  const [errorTabPhases, setErrorTabPhases] = useState<ErrorTabPhase[]>(() =>
    Array.from({ length: ERROR_TAB_COUNT }, (): ErrorTabPhase => "active")
  );
  const resolveTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      resolveTimersRef.current.forEach(clearTimeout);
      resolveTimersRef.current = [];
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
    if (phase !== "error") return;
    resolveTimersRef.current.forEach(clearTimeout);
    resolveTimersRef.current = [];

    setPhase("resolving");
    setErrorTabPhases(Array.from({ length: ERROR_TAB_COUNT }, (): ErrorTabPhase => "active"));

    const closeOrder = ERROR_TAB_RESOLVE_ORDER;
    closeOrder.forEach((tabIndex, i) => {
      const startGreenAt = CLI_RESOLVE_WARMUP_MS + i * TAB_GREEN_STAGGER_MS;
      const tGreen = setTimeout(() => {
        setErrorTabPhases((prev) => {
          const next = [...prev];
          next[tabIndex] = "green";
          return next;
        });
      }, startGreenAt);
      resolveTimersRef.current.push(tGreen);

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
        resolveTimersRef.current.push(tRemoved);
      }, startCloseAt);
      resolveTimersRef.current.push(tClose);
    });

    const resolveDoneMs =
      CLI_RESOLVE_WARMUP_MS +
      (ERROR_TAB_COUNT - 1) * TAB_GREEN_STAGGER_MS +
      GREEN_TO_CLOSE_DELAY_MS +
      (ERROR_TAB_COUNT - 1) * TAB_CLOSE_STAGGER_MS +
      TAB_CLOSE_ANIM_MS +
      AFTER_LAST_TAB_PAD_MS;
    const tBlink = setTimeout(() => setPhase("blinking"), resolveDoneMs);
    resolveTimersRef.current.push(tBlink);
  };

  const allErrorsVisible = true;
  const canEnterMain = phase === "resolved";

  // 解消後に本編へ遷移するハンドラ。
  const handleEnterMain = () => {
    if (viewContext?.enterMain) {
      viewContext.enterMain();
      return;
    }
    onLead?.();
  };

  return (
    <section
      id="hero"
      className={`snap-start relative flex min-h-screen items-center justify-center overflow-hidden ${
        canEnterMain ? "cursor-pointer" : ""
      }`}
      onClick={() => {
        if (canEnterMain) {
          handleEnterMain();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black" aria-hidden />
      {(phase === "resolved" || (phase === "blinking" && isBlinkVisible)) ? (
        <div
          className={`pointer-events-none absolute inset-0 z-[4] ${
            phase === "blinking" ? "animate-pulse" : ""
          }`}
          aria-hidden
        >
          <img
            src={`${basePath}/images/profile/Top1.jpg`}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-black/30 backdrop-blur-[2px]"
        aria-hidden
      />

      <HeroLeadPanel nameEn={nameEn} isResolved={phase === "resolved"} onEnterMain={handleEnterMain} />

      {(phase === "error" || phase === "resolving") && allErrorsVisible && (
        <>
          <HeroResolveTerminal phase={phase} errorTabCount={ERROR_TAB_COUNT} onResolve={handleResolve} />
          <HeroErrorTabs phases={errorTabPhases} />
        </>
      )}
    </section>
  );
}
