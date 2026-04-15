"use client";

import { motion } from "framer-motion";
import { SectionId, SectionMeta } from "@/components/page/SectionMeta";

// ヘッダー表示に必要な入力。
interface PageHeaderNavProps {
  title: string;
  sections: SectionMeta[];
  activeSectionId: SectionId;
}

// 固定ヘッダーとセクションアンカーリンクを表示する。
export default function PageHeaderNav({ title, sections, activeSectionId }: PageHeaderNavProps) {
  const handleSectionMove = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 left-0 z-20 flex w-full items-center max-md:justify-end md:justify-between px-4 py-4 text-[10px] tracking-[0.18em] text-zinc-200/85 uppercase sm:px-6 sm:text-[11px] sm:tracking-[0.22em] lg:px-10 lg:py-5">
      <span className="truncate text-[10px] max-md:pr-0 sm:text-xs md:pr-4">{title}</span>
      <nav className="hidden gap-3 md:flex lg:gap-5">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleSectionMove(section.id)}
            className="relative pb-2 text-[10px] transition hover:text-white lg:text-[11px]"
          >
            {section.title}
            {activeSectionId === section.id ? (
              <motion.span
                layoutId="active-section-underline"
                className="pointer-events-none absolute bottom-0 left-0.5 right-0.5 h-[3px] rounded-full bg-zinc-100"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            ) : null}
          </button>
        ))}
      </nav>
    </header>
  );
}
