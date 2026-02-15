"use client";

import { useContext } from "react";
import { ViewContext } from "./Layout";
import { useTypewriter } from "@/hooks/useTypewriter";

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  nameEn?: string;
  developerTitle?: string;
}

function HeroDeveloperTitle({ text }: { text: string }) {
  const { displayText, showCursor } = useTypewriter({
    text,
    speed: 65,
    startDelay: 500,
    showCursor: true,
  });
  return (
    <div className="mb-4 animate-fade-in-left delay-200" aria-live="polite">
      <p className="text-lg font-medium tracking-wide md:text-xl lg:text-2xl text-white/90 drop-shadow-lg inline">
        {displayText}
        {showCursor && (
          <span className="typewriter-cursor ml-0.5 inline-block w-0.5 h-[1em] align-middle bg-white/90 animate-cursor-blink" aria-hidden />
        )}
      </p>
    </div>
  );
}

export default function HeroSection({
  image,
  title,
  subtitle,
  nameEn,
  developerTitle,
}: HeroSectionProps) {
  const viewContext = useContext(ViewContext);

  const handleLeadClick = () => {
    viewContext?.enterMain();
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="relative z-30 flex flex-col items-center justify-center text-center text-white px-4 select-none">
        {/* PORTFOLIO ラベル */}
        <div className="mb-6 animate-fade-in-left">
          <span className="inline-block px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/80 border border-white/30 rounded-full backdrop-blur-sm bg-white/5">
            PORTFOLIO
          </span>
        </div>

        {/* 名前（英語） */}
        {nameEn && (
          <h1 className="mb-6 animate-fade-in-left delay-100">
            <span className="block text-6xl font-extrabold tracking-tight md:text-8xl lg:text-9xl bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_0_40px_rgba(255,255,255,0.3)]">
              {nameEn}
            </span>
          </h1>
        )}

        {/* 開発者タイトル（タイピング風） */}
        {developerTitle && (
          <HeroDeveloperTitle text={developerTitle} />
        )}

        {/* 既存のsubtitle（フォールバック） */}
        {!developerTitle && subtitle && (
          <div className="mb-4 animate-fade-in-left delay-200">
            <p className="text-lg font-medium tracking-wide md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          </div>
        )}

        {/* LEAD ボタン（ポートフォリオを見る） */}
        <button
          type="button"
          onClick={handleLeadClick}
          className="mt-10 animate-fade-in-left delay-200 group inline-flex items-center gap-3 rounded-full border-2 border-white/50 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white bg-gradient-to-r from-white/20 via-white/25 to-white/20 backdrop-blur-md shadow-[0_0_24px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:border-white/70 hover:from-white/30 hover:via-white/35 hover:to-white/30 hover:shadow-[0_0_36px_rgba(255,255,255,0.35),0_0_60px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:text-white active:scale-[1.02]"
          aria-label="ポートフォリオを見る"
        >
          <span>LEAD</span>
          <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
