"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Navigation from "./Navigation";
import BubbleParticles from "./BubbleParticles";
import AssetWarmup from "./AssetWarmup";
import WaterPuddleBackdrop from "./WaterPuddleBackdrop";

export type ViewMode = "hero" | "main";

/** トップ／メインのビュー切り替え用コンテキスト */
export const ViewContext = createContext<{
  view: ViewMode;
  enterMain: () => void;
  enterHero: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const viewContextValue = useMemo(() => {
    if (useViewSwitch) {
      return { view, enterMain, enterHero, isModalOpen, setIsModalOpen };
    }
    return {
      view: "main" as ViewMode,
      enterMain: () => {},
      enterHero: () => {},
      isModalOpen,
      setIsModalOpen,
    };
  }, [useViewSwitch, view, enterMain, enterHero, isModalOpen]);

  const overlayOpacity =
    transitionPhase === "out" ? (overlayVisible ? 1 : 0) : transitionPhase === "in" ? 0 : 0;

  const mainGutterClass =
    useViewSwitch && view === "hero"
      ? ""
      : "lg:pl-[var(--nav-desktop-gutter)] lg:pr-[var(--nav-desktop-gutter)]";

  const showMainDecor = !useViewSwitch || view !== "hero";

  /** 水たまり z-0・バブル z-[5] は本文 z-10 より下。セクション透過部で背景に見える */
  const decorLayers = showMainDecor ? (
    <>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <WaterPuddleBackdrop />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
        <BubbleParticles />
      </div>
    </>
  ) : null;

  const mainInner = useViewSwitch ? (
    view === "hero" ? (
      <div className="relative z-10 min-h-screen w-full">{hero}</div>
    ) : (
      <>
        {decorLayers}
        <div className="relative z-10 w-full">{mainContent}</div>
      </>
    )
  ) : (
    <>
      {decorLayers}
      <div className="relative z-10 w-full">{children}</div>
    </>
  );

  return (
    <ViewContext.Provider value={viewContextValue}>
      <AssetWarmup />
      <div className="relative isolate z-10 min-h-screen bg-white text-black">
        <div className="relative z-10">
          <main className={`relative w-full ${mainGutterClass}`}>{mainInner}</main>
        </div>
        <div className="relative z-20">
          <Navigation />
        </div>
      </div>
      {useViewSwitch && transitionPhase !== null && (
        <div
          className="fixed inset-0 z-50 bg-black pointer-events-none transition-opacity duration-[400ms] ease-out"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
      )}
    </ViewContext.Provider>
  );
}
