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
    <header className="fixed top-0 left-0 z-20 flex w-full items-center justify-between px-6 py-5 text-[11px] tracking-[0.22em] text-zinc-200/85 uppercase md:px-10">
      <span>{title}</span>
      <nav className="hidden gap-5 md:flex">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleSectionMove(section.id)}
            className="relative pb-2 transition hover:text-white"
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
