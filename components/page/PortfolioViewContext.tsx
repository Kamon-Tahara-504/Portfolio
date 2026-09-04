"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PortfolioViewMode } from "@/types/portfolioView";

interface PortfolioViewContextValue {
  viewMode: PortfolioViewMode;
}

const PortfolioViewContext = createContext<PortfolioViewContextValue | null>(null);

interface PortfolioViewProviderProps {
  viewMode: PortfolioViewMode;
  children: ReactNode;
}

// 本編セクション向けに選択済みビューモードを配布する。
export function PortfolioViewProvider({ viewMode, children }: PortfolioViewProviderProps) {
  return (
    <PortfolioViewContext.Provider value={{ viewMode }}>{children}</PortfolioViewContext.Provider>
  );
}

export function usePortfolioView(): PortfolioViewContextValue {
  const context = useContext(PortfolioViewContext);
  if (!context) {
    throw new Error("usePortfolioView は PortfolioViewProvider 内で使用してください。");
  }
  return context;
}

/** Provider 外でも安全に参照できる版（導入画面プレビュー等）。 */
export function usePortfolioViewOptional(): PortfolioViewContextValue | null {
  return useContext(PortfolioViewContext);
}
