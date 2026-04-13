"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import AssetWarmup from "./AssetWarmup";

// 表示中のメインビュー種別。
export type ViewMode = "hero" | "main";

/** トップ／メインのビュー切り替え用コンテキスト */
export const ViewContext = createContext<{
  view: ViewMode;
  enterMain: () => void;
  enterHero: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
} | null>(null);

// ヒーロー->本編遷移時の暗転時間。
const DARKEN_DURATION_MS = 400;

// Layoutの描画モードを切り替えるための受け口。
interface LayoutProps {
  children?: React.ReactNode;
  hero?: React.ReactNode;
  mainContent?: React.ReactNode;
}

export default function Layout({ children, hero, mainContent }: LayoutProps) {
  // 現在の画面モードと遷移補助状態。
  const [view, setView] = useState<ViewMode>("hero");
  const [transitionPhase, setTransitionPhase] = useState<"out" | "in" | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 本編へ進む操作を受け、暗転フェーズ開始だけを担当する。
  const enterMain = useCallback(() => {
    if (transitionPhase !== null) return;
    setTransitionPhase("out");
  }, [transitionPhase]);

  // ヒーローへ戻す際にスクロール位置も初期化する。
  const enterHero = useCallback(() => {
    setView("hero");
    if (typeof document !== "undefined") {
      document.getElementById("snap-scroll-main")?.scrollTo({ top: 0 });
    }
  }, []);

  useEffect(() => {
    if (transitionPhase !== "out") return;
    const id = requestAnimationFrame(() => setOverlayVisible(true));
    return () => cancelAnimationFrame(id);
  }, [transitionPhase]);

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

  // hero/mainContentの両方がある場合のみビュー切り替えモードを有効化する。
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
    transitionPhase === "out" ? (overlayVisible ? 1 : 0) : 0;

  const mainInner = useViewSwitch ? (
    view === "hero" ? (
      <div className="h-screen w-full">{hero}</div>
    ) : (
      <div className="h-screen w-full">{mainContent}</div>
    )
  ) : (
    <div className="h-screen w-full">{children}</div>
  );

  return (
    <ViewContext.Provider value={viewContextValue}>
      <AssetWarmup />
      <div className="relative isolate h-screen overflow-hidden text-black">
        <main className="h-full w-full">{mainInner}</main>
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
