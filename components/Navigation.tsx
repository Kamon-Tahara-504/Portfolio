"use client";

import { useEffect, useState } from "react";
import { useVideoColor } from "@/contexts/VideoColorContext";

const sections = [
  { id: "hero", label: "Top", offset: 0 },
  { id: "about", label: "About", offset: -50 },
  { id: "experience", label: "Experience", offset: -170 },
  { id: "skills", label: "Skills", offset: -170 },
  { id: "projects", label: "Projects", offset: -50 },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hasColorDetected, setHasColorDetected] = useState(false);
  const { isDark } = useVideoColor();
  
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
      const sectionConfig = sections.find(s => s.id === sectionId);
      const offset = sectionConfig?.offset ?? -50; // セクションごとのオフセット、デフォルトは-50
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed right-8 top-1/2 z-50 -translate-y-1/2 hidden lg:block">
      <ul className="flex flex-col gap-4">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
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
    </nav>
  );
}

