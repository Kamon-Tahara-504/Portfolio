"use client";

import { useState } from "react";
import HeroStartGauge from "@/components/hero/HeroStartGauge";
import HeroViewModePicker from "@/components/hero/HeroViewModePicker";
import HeroViewModePreview from "@/components/hero/HeroViewModePreview";
import type { PortfolioViewMode } from "@/types/portfolioView";

interface HeroSectionProps {
  onLead?: (mode: PortfolioViewMode) => void;
}

// 導入画面。ゲージ完了後にビューモードを選択して本編へ進む。
export default function HeroSection({ onLead }: HeroSectionProps) {
  const [phase, setPhase] = useState<"loading" | "picker">("loading");
  const [previewMode, setPreviewMode] = useState<PortfolioViewMode | null>(null);

  const handleGaugeComplete = () => {
    setPhase("picker");
  };

  const handleSelectMode = (mode: PortfolioViewMode) => {
    onLead?.(mode);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      {phase === "picker" ? (
        <>
          <HeroViewModePreview previewMode={previewMode} />
          <HeroViewModePicker
            previewMode={previewMode}
            onPreviewChange={setPreviewMode}
            onSelect={handleSelectMode}
          />
        </>
      ) : (
        <HeroStartGauge onComplete={handleGaugeComplete} />
      )}
    </section>
  );
}
