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

  const showNav = (viewContext === null || view === "main") && !viewContext?.isModalOpen;

  return (
    <>
    {/* デスクトップ用: 右側垂直ナビゲーション */}
    <nav 
      className={`fixed right-10 top-1/2 z-50 -translate-y-1/2 hidden lg:block transition-opacity duration-500 ease-in-out ${
        showNav ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-3 rounded-full border border-white/15 bg-neutral-900/92 p-1.5 backdrop-blur-xl shadow-lg">
        {sections.map((section) => {
          const isActive = effectiveActiveSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-black scale-110 shadow-md" : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
              aria-label={`${section.label}へスクロール`}
              aria-current={isActive ? "true" : undefined}
            >
              <MobileNavIcon
                sectionId={section.id}
                isActive={isActive}
                className="h-5 w-5 shrink-0"
              />
              {/* ツールチップ（ホバー時に表示） */}
              <span className="absolute right-full mr-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-black opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap pointer-events-none shadow-md">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>

    {/* モバイル用: 下部リキッドグラスナビ（PCでは隠す） */}
    <div 
      className={`fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center lg:hidden transition-opacity duration-500 ease-in-out ${
        showNav ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <nav
        className="mobile-nav-liquid-glass flex items-center justify-around w-full max-w-[300px] h-[60px] px-2 rounded-full border border-white/15 bg-neutral-900/92 backdrop-blur-xl shadow-2xl"
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
              className="relative flex flex-col items-center justify-center flex-1"
              aria-label={`${section.label}へスクロール`}
              aria-current={isActive ? "true" : undefined}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-black scale-110 shadow-md" : "text-white/50"
              }`}>
                <MobileNavIcon
                  sectionId={section.id}
                  isActive={isActive}
                  className="w-5 h-5 shrink-0"
                />
              </div>
              <span className={`absolute -bottom-1 rounded-full bg-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-black transition-all duration-300 shadow-sm ${
                isActive ? "opacity-100 translate-y-4" : "opacity-0 translate-y-2"
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
    </>
  );
}

