"use client";

import { NavIcon } from "./NavIcon";

type SectionConfig = { id: string; label: string; offset: number };

export default function MobileNav({
  sections,
  effectiveActiveSection,
  scrollToSection,
  className = "",
}: {
  sections: SectionConfig[];
  effectiveActiveSection: string;
  scrollToSection: (sectionId: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center lg:hidden transition-opacity duration-500 ease-in-out ${className}`}
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
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black scale-110 shadow-md"
                    : "text-white/50"
                }`}
              >
                <NavIcon
                  sectionId={section.id}
                  isActive={isActive}
                  className="w-5 h-5 shrink-0"
                />
              </div>

              <span
                className={`absolute -bottom-1 rounded-full bg-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-black transition-all duration-300 shadow-sm ${
                  isActive ? "opacity-100 translate-y-4" : "opacity-0 translate-y-2"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

