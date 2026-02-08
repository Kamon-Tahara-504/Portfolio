"use client";

import { useEffect, useState, useRef } from "react";
import { useVideoColor } from "@/contexts/VideoColorContext";

const sections = [
  { id: "hero", label: "Top", offset: 0 },
  { id: "about", label: "About", offset: -50 },
  { id: "experience", label: "Experience", offset: -170 },
  { id: "skills", label: "Skills", offset: -170 },
  { id: "projects", label: "Projects", offset: -50 },
  { id: "development", label: "Development", offset: -100 },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hasColorDetected, setHasColorDetected] = useState(false);
  const { isDark } = useVideoColor();
  
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
  
  // heroセクションの場合のみ動画の色検知を使用、それ以外は常に黒色
  // 初期状態では白色を表示し、動画の色検知が動作した後はその値に従って色が変わる
  const shouldUseVideoColor = activeSection === "hero";
  const effectiveIsDark = shouldUseVideoColor 
    ? (hasColorDetected ? isDark : true) // 初期状態では白色（true）、検知後はisDarkの値を使用
    : false; // 他のセクションは常に黒色（false）

  useEffect(() => {
    const handleScroll = () => {
      // スクロール中（プログラムによるスクロール）の場合はactiveSectionの更新を抑制
      if (isScrollingRef.current) {
        return;
      }

      // ナビゲーションバーは画面中央（top-1/2）にあるので、画面中央の位置を基準に判定
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      // 各セクションをチェックして、画面中央がどのセクション内にあるかを判定
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;
          
          // 画面中央がセクション内にあるか判定
          if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    // 初回実行
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      const sectionConfig = sections.find(s => s.id === sectionId);
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

  // 前のセクションを取得
  const getPreviousSection = (): string | null => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex <= 0) return null;
    return sections[currentIndex - 1].id;
  };

  // 次のセクションを取得
  const getNextSection = (): string | null => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex >= sections.length - 1) return null;
    return sections[currentIndex + 1].id;
  };

  const handlePrevious = () => {
    const currentSectionId = activeSection;
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex > 0) {
      const targetId = sections[currentIndex - 1].id;
      if (targetId === "hero") {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      } else {
        scrollToSection(targetId);
      }
    }
  };

  const handleNext = () => {
    // クリック時のactiveSectionの値を固定して使用
    const currentSectionId = activeSection;
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1].id);
    }
  };

  const previousSection = getPreviousSection();
  const nextSection = getNextSection();
  const isPreviousDisabled = previousSection === null;
  const isNextDisabled = nextSection === null;

  return (
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
          {sections.filter((s) => s.id !== "hero").map((section) => (
            <li key={section.id}>
              <button
                onClick={() => {
                  if (section.id === "hero") {
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: "smooth",
                    });
                  } else {
                    scrollToSection(section.id);
                  }
                }}
                className={`group relative flex items-center transition-colors ${
                  activeSection === section.id
                    ? effectiveIsDark ? "text-white" : "text-black"
                    : effectiveIsDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"
                }`}
                aria-label={`Scroll to ${section.label}`}
              >
                <span
                  className={`absolute -left-8 h-0.5 transition-all ${
                    activeSection === section.id
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
  );
}

