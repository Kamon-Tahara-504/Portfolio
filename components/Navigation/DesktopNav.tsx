"use client";

import { NavIcon } from "./NavIcon";

type SectionConfig = { id: string; label: string; offset: number };

export default function DesktopNav({
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
    <nav
      className={`fixed right-10 top-1/2 z-50 -translate-y-1/2 hidden lg:block transition-opacity duration-500 ease-in-out ${className}`}
    >
      <div className="flex flex-col items-center gap-3 rounded-full border border-white/15 bg-neutral-900/92 p-1.5 backdrop-blur-xl shadow-lg">
        {sections.map((section) => {
          const isActive = effectiveActiveSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-white text-black scale-110 shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
              aria-label={`${section.label}へスクロール`}
              aria-current={isActive ? "true" : undefined}
            >
              <NavIcon
                sectionId={section.id}
                isActive={isActive}
                className="h-5 w-5 shrink-0"
              />
              <span className="absolute right-full mr-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-black opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap pointer-events-none shadow-md">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

