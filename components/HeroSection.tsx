"use client";

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
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="relative z-30 flex flex-col items-center justify-center text-center text-white px-4">
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
      </div>
    </section>
  );
}
