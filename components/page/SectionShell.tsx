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
// 横は max-w-6xl 中央、縦は min-h-screen 内で中央寄せ（長い内容はセクションが伸びる）。
export default function SectionShell({
  section,
  shouldReduceMotion,
  titleAside,
  children,
}: SectionShellProps) {
  const { viewMode, zoomCompensation } = usePortfolioView();
  // 固定ナビとの干渉を避けつつ、余白が余るときは縦中央に見えるようにする。
  // about のみ上余白を少し削って、要素をわずかに上寄せする。
  const verticalSpacingClass =
    section.id === "works"
      ? "py-14 lg:py-16"
      : section.id === "about"
        ? "pt-10 pb-16 lg:pt-12 lg:pb-20"
        : "py-16 lg:py-20";

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
      className={`flex min-h-screen min-w-0 flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-14 ${verticalSpacingClass}`}
    >
      <div
        className="mx-auto flex w-full min-w-0 max-w-6xl justify-center"
        style={{ zoom: zoomCompensation }}
      >
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ amount: 0.15, once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`w-full min-w-0 space-y-4 sm:space-y-5 ${articleTextClass}`}
        >
          <p className={`text-[10px] tracking-[0.2em] uppercase sm:text-xs sm:tracking-[0.24em] ${labelClass}`}>
            {section.label}
          </p>
          {titleAside ? (
            <div className="flex items-center justify-between gap-x-3 gap-y-2">
              <h1 className="min-w-0 text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight">
                {section.title}
              </h1>
              {titleAside}
            </div>
          ) : (
            <h1 className="text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight">
              {section.title}
            </h1>
          )}
          {children}
        </motion.article>
      </div>
    </section>
  );
}
