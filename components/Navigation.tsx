"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { ViewContext } from "./Layout";

const sections = [
  { id: "about", label: "About", offset: 0 },
  { id: "experience", label: "Experience", offset: -60 },
  { id: "skills", label: "Skills", offset: -180 },
  { id: "projects", label: "Projects", offset: -50 },
  { id: "development", label: "Development", offset: -60 },
];

function MobileNavIcon({
  sectionId,
  isActive,
  className = "w-6 h-6",
}: {
  sectionId: string;
  isActive: boolean;
  className?: string;
}) {
  const strokeWidth = isActive ? 2.5 : 1.5;
  const opacity = isActive ? 1 : 0.6;

  switch (sectionId) {
    case "about":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "experience":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          <path d="M5 12h7M12 12h7" />
        </svg>
      );
    case "skills":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "projects":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "development":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
          <polyline points="6 9 10 12 6 15" />
          <line x1="14" y1="15" x2="22" y2="15" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const viewContext = useContext(ViewContext);

  const view = viewContext?.view ?? "main";
  const effectiveActiveSection = view === "hero" ? "hero" : activeSection;

  // スクロール中かどうかを追跡するref
  const isScrollingRef = useRef(false);

  // ヒーロービュー時は常に hero
  useEffect(() => {
    if (view === "hero") setActiveSection("hero");
  }, [view]);

  useEffect(() => {
    const handleScroll = () => {
      if (view === "hero") return;
      if (isScrollingRef.current) return;

      const viewportCenter = window.scrollY + window.innerHeight / 2;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;
          if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      isScrollingRef.current = true;

      const sectionConfig = sections.find((s) => s.id === sectionId);
      const offset = sectionConfig?.offset ?? -50; // セクションごとのオフセット、デフォルトは-50
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // スクロール完了を検知する処理
      let lastScrollTop = window.scrollY;
      let stableFrameCount = 0;
      const requiredStableFrames = 3; // 3フレーム連続で位置が変わらなければ完了とみなす

      const checkScrollComplete = () => {
        const currentScrollTop = window.scrollY;
        
        // スクロール位置が変化していないか確認
        if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
          stableFrameCount++;
          if (stableFrameCount >= requiredStableFrames) {
            // スクロール完了
            isScrollingRef.current = false;

            // 目標セクションにactiveSectionを設定
            setActiveSection(sectionId);
            return;
          }
        } else {
          stableFrameCount = 0;
        }
        
        lastScrollTop = currentScrollTop;
        requestAnimationFrame(checkScrollComplete);
      };

      // スクロール開始後、少し待ってから完了チェックを開始
      setTimeout(() => {
        requestAnimationFrame(checkScrollComplete);
      }, 100);
    }
  };

  const showNav = viewContext === null || view === "main";

  return (
    <div
      className={`transition-opacity duration-[700ms] ease-out ${
        showNav ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
    {/* 全画面幅: 下部リキッドグラスナビ（従来のモバイルと同一） */}
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 flex justify-center">
      <nav
        className="mobile-nav-liquid-glass flex items-stretch justify-around w-full max-w-sm min-h-[4rem] py-2 rounded-full border border-white/15 bg-neutral-900/92 backdrop-blur-xl"
        aria-label="セクションへ移動"
      >
        {sections.map((section) => {
          const isActive = effectiveActiveSection === section.id;
          const label =
            section.id === "experience"
              ? "経歴"
              : section.id === "development"
                ? "Dev"
                : section.label;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2.5 px-1 transition-colors ${
                isActive ? "text-white" : "text-white/55"
              }`}
              aria-label={`${section.label}へスクロール`}
              aria-current={isActive ? "true" : undefined}
            >
              <MobileNavIcon
                sectionId={section.id}
                isActive={isActive}
                className="w-6 h-6 shrink-0"
              />
              <span className="text-[10px] font-medium truncate max-w-full">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
    </div>
  );
}

