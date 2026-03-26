"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { ViewContext } from "./Layout";
import DesktopNav from "./Navigation/DesktopNav";
import MobileNav from "./Navigation/MobileNav";

const sections = [
  { id: "about", label: "About", offset: 0 },
  { id: "experience", label: "Experience", offset: -60 },
  { id: "skills", label: "Skills", offset: -180 },
  { id: "projects", label: "Projects", offset: -50 },
  { id: "development", label: "Development", offset: -60 },
];

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
      <DesktopNav
        sections={sections}
        effectiveActiveSection={effectiveActiveSection}
        scrollToSection={scrollToSection}
        className={showNav ? "opacity-100" : "opacity-0 pointer-events-none"}
      />
      <MobileNav
        sections={sections}
        effectiveActiveSection={effectiveActiveSection}
        scrollToSection={scrollToSection}
        className={showNav ? "opacity-100" : "opacity-0 pointer-events-none"}
      />
    </>
  );
}

