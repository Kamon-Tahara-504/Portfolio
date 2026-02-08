"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useVideoColor } from "@/contexts/VideoColorContext";
import { ViewContext } from "./Layout";

const sections = [
  { id: "about", label: "About", offset: -40 },
  { id: "experience", label: "Experience", offset: -60 },
  { id: "skills", label: "Skills", offset: -180 },
  { id: "projects", label: "Projects", offset: -50 },
  { id: "development", label: "Development", offset: -60 },
];

const mobileSections = sections.filter((s) => s.id !== "hero");

function MobileNavIcon({
  sectionId,
  isActive,
  className = "w-6 h-6",
}: {
  sectionId: string;
  isActive: boolean;
  className?: string;
}) {
  const stroke = isActive ? "currentColor" : "currentColor";
  const strokeWidth = isActive ? 2.5 : 1.5;
  const opacity = isActive ? 1 : 0.6;

  switch (sectionId) {
    case "about":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "experience":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          <path d="M5 12h7M12 12h7" />
        </svg>
      );
    case "skills":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "projects":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "development":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ opacity }}>
          <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
          <polyline points="6 9 10 12 6 15" />
          <line x1="14" y1="15" x2="22" y2="15" />
        </svg>
      );
    default:
      return null;
  }
}

const mainViewSections = sections.filter((s) => s.id !== "hero");

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hasColorDetected, setHasColorDetected] = useState(false);
  const { isDark } = useVideoColor();
  const viewContext = useContext(ViewContext);

  const view = viewContext?.view ?? "main";
  const effectiveActiveSection = view === "hero" ? "hero" : activeSection;

  // スクロール中かどうかを追跡するref
  const isScrollingRef = useRef(false);
  // スクロール目標のセクションIDを保存するref
  const scrollTargetRef = useRef<string | null>(null);
  // スクロール完了検知用のタイマーID
  const scrollEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 動画の色検知が動作したかどうかを追跡
  useEffect(() => {
    if (isDark) {
      setHasColorDetected(true);
    }
  }, [isDark]);

  // ヒーロービュー時は常に hero
  useEffect(() => {
    if (view === "hero") setActiveSection("hero");
  }, [view]);

  // heroセクションの場合のみ動画の色検知を使用、それ以外は常に黒色
  // 初期状態では白色を表示し、動画の色検知が動作した後はその値に従って色が変わる
  const shouldUseVideoColor = effectiveActiveSection === "hero";
  const effectiveIsDark = shouldUseVideoColor 
    ? (hasColorDetected ? isDark : true) // 初期状態では白色（true）、検知後はisDarkの値を使用
    : false; // 他のセクションは常に黒色（false）

  useEffect(() => {
    const handleScroll = () => {
      if (view === "hero") return;
      if (isScrollingRef.current) return;

      const viewportCenter = window.scrollY + window.innerHeight / 2;
      const sectionsToUse = view === "main" ? mainViewSections : sections;

      for (let i = sectionsToUse.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionsToUse[i].id);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;
          if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            setActiveSection(sectionsToUse[i].id);
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
      // 既存のタイマーをクリア
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = null;
      }

      // スクロール中フラグを立て、目標セクションIDを保存
      isScrollingRef.current = true;
      scrollTargetRef.current = sectionId;

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
            scrollTargetRef.current = null;
            
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

  const navSections = view === "main" ? mainViewSections : sections;

  const getPreviousSection = (): string | null => {
    const currentIndex = navSections.findIndex((s) => s.id === effectiveActiveSection);
    if (currentIndex <= 0) return null;
    return navSections[currentIndex - 1].id;
  };

  const getNextSection = (): string | null => {
    const currentIndex = navSections.findIndex((s) => s.id === effectiveActiveSection);
    if (currentIndex >= navSections.length - 1) return null;
    return navSections[currentIndex + 1].id;
  };

  const handlePrevious = () => {
    const currentIndex = navSections.findIndex((s) => s.id === effectiveActiveSection);
    if (currentIndex > 0) {
      scrollToSection(navSections[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = navSections.findIndex((s) => s.id === effectiveActiveSection);
    if (currentIndex < navSections.length - 1) {
      scrollToSection(navSections[currentIndex + 1].id);
    }
  };

  const previousSection = getPreviousSection();
  const nextSection = getNextSection();
  const isPreviousDisabled = previousSection === null;
  const isNextDisabled = nextSection === null;

  return (
    <>
    <nav className="fixed right-8 top-1/2 z-50 -translate-y-1/2 hidden lg:block">
      <div className="flex flex-col items-center gap-4">
        {/* 上矢印ボタン */}
        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={`group relative flex items-center justify-center transition-all ${
            isPreviousDisabled
              ? effectiveIsDark ? "text-white/20" : "text-black/20"
              : effectiveIsDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"
          }`}
          aria-label="前のセクションへ移動"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        {/* セクションリスト（Top は表示しない） */}
        <ul className="flex flex-col gap-4">
          {mainViewSections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`group relative flex items-center transition-colors ${
                  effectiveActiveSection === section.id
                    ? effectiveIsDark ? "text-white" : "text-black"
                    : effectiveIsDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"
                }`}
                aria-label={`Scroll to ${section.label}`}
              >
                <span
                  className={`absolute -left-8 h-0.5 transition-all ${
                    effectiveActiveSection === section.id
                      ? `w-6 ${effectiveIsDark ? "bg-white" : "bg-black"}`
                      : `w-0 ${effectiveIsDark ? "bg-white/40" : "bg-black/40"} group-hover:w-4`
                  }`}
                />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {section.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* 下矢印ボタン */}
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`group relative flex items-center justify-center transition-all ${
            isNextDisabled
              ? effectiveIsDark ? "text-white/20" : "text-black/20"
              : effectiveIsDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"
          }`}
          aria-label="次のセクションへ移動"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </nav>

    {/* モバイル用ボトムナビ（スマホのみ表示） */}
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-black/10 bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
      aria-label="セクションへ移動"
    >
      <div className="flex items-stretch justify-around">
        {mobileSections.map((section) => {
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
                isActive ? "text-black" : "text-black/60"
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
      </div>
    </nav>
    </>
  );
}

