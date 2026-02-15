"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";
import BubbleParticles from "./BubbleParticles";
import FixedVideoBackground from "./FixedVideoBackground";

export type ViewMode = "hero" | "main";

/** トップ／メインのビュー切り替え用コンテキスト */
export const ViewContext = createContext<{
  view: ViewMode;
  enterMain: () => void;
  enterHero: () => void;
} | null>(null);

const DARKEN_DURATION_MS = 400;

interface LayoutProps {
  children?: React.ReactNode;
  hero?: React.ReactNode;
  mainContent?: React.ReactNode;
}

export default function Layout({ children, hero, mainContent }: LayoutProps) {
  const [view, setView] = useState<ViewMode>("hero");
  const [transitionPhase, setTransitionPhase] = useState<"out" | "in" | null>(
    null
  );
  const [overlayVisible, setOverlayVisible] = useState(false);

  const enterMain = useCallback(() => {
    if (transitionPhase !== null) return;
    setTransitionPhase("out");
  }, [transitionPhase]);

  const enterHero = useCallback(() => {
    setView("hero");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 暗転 0→1: phase "out" の次のフレームでオーバーレイを 1 にする
  useEffect(() => {
    if (transitionPhase !== "out") return;
    const id = requestAnimationFrame(() => setOverlayVisible(true));
    return () => cancelAnimationFrame(id);
  }, [transitionPhase]);

  // 暗転後ビュー切り替え → 明転
  useEffect(() => {
    if (transitionPhase !== "out") return;
    const timer = setTimeout(() => {
      setView("main");
      setTransitionPhase("in");
    }, DARKEN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [transitionPhase]);

  useEffect(() => {
    if (transitionPhase !== "in") return;
    const timer = setTimeout(() => {
      setTransitionPhase(null);
      setOverlayVisible(false);
    }, DARKEN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [transitionPhase]);

  const useViewSwitch = hero != null && mainContent != null;

  const viewContextValue = useViewSwitch ? { view, enterMain, enterHero } : null;

  const overlayOpacity =
    transitionPhase === "out" ? (overlayVisible ? 1 : 0) : transitionPhase === "in" ? 0 : 0;

  return (
    <ViewContext.Provider value={viewContextValue}>
      <VideoColorProvider>
        <FixedVideoBackground />
        <div className="relative z-10 min-h-screen text-black">
          <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
            <BubbleParticles />
          </div>
          <div className="relative z-20">
            <Navigation />
            <main>
              {useViewSwitch
                ? view === "hero"
                  ? hero
                  : mainContent
                : children}
            </main>
          </div>
        </div>
        {useViewSwitch && transitionPhase !== null && (
          <div
            className="fixed inset-0 z-50 bg-black pointer-events-none transition-opacity duration-[400ms] ease-out"
            style={{ opacity: overlayOpacity }}
            aria-hidden
          />
        )}
      </VideoColorProvider>
    </ViewContext.Provider>
  );
}
