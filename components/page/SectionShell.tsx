"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionMeta } from "@/components/page/SectionMeta";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { viewClass } from "@/lib/portfolioViewStyles";

interface SectionShellProps {
  section: SectionMeta;
  shouldReduceMotion: boolean | null;
  titleAside?: ReactNode;
  children: ReactNode;
}

// 見出し・アニメーション・幅制御を共通化したセクションラッパー。
export default function SectionShell({
  section,
  shouldReduceMotion,
  titleAside,
  children,
}: SectionShellProps) {
  const { viewMode } = usePortfolioView();
  const verticalSpacingClass =
    section.id === "works" ? "pt-16 pb-10 lg:pt-20 lg:pb-14" : "pt-24 pb-16 lg:pt-28 lg:pb-20";

  const articleTextClass = viewClass(viewMode, {
    personal: "text-zinc-100",
    recruiter: "text-foreground",
  });

  const labelClass = viewClass(viewMode, {
    personal: "text-zinc-300",
    recruiter: "text-foreground-muted",
  });

  return (
    <section
      id={section.id}
      className={`snap-start snap-always min-h-screen min-w-0 px-4 sm:px-6 lg:px-10 ${verticalSpacingClass}`}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-start">
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ amount: 0.15, once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`w-full min-w-0 space-y-5 sm:space-y-6 ${articleTextClass}`}
        >
          <p className={`text-[10px] tracking-[0.2em] uppercase sm:text-xs sm:tracking-[0.24em] ${labelClass}`}>
            {section.label}
          </p>
          {titleAside ? (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <h1 className="max-w-[min(100%,42rem)] text-[clamp(2rem,5.2vw,3.8rem)] leading-[1.08] font-semibold tracking-tight">
                {section.title}
              </h1>
              {titleAside}
            </div>
          ) : (
            <h1 className="max-w-5xl text-[clamp(2rem,5.2vw,3.8rem)] leading-[1.08] font-semibold tracking-tight">
              {section.title}
            </h1>
          )}
          {children}
        </motion.article>
      </div>
    </section>
  );
}
