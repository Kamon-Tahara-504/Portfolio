import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionMeta } from "@/components/page/SectionMeta";

// セクション共通シェルの受け取り値。
interface SectionShellProps {
  section: SectionMeta;
  shouldReduceMotion: boolean | null;
  children: ReactNode;
}

// 見出し・アニメーション・幅制御を共通化したセクションラッパー。
export default function SectionShell({ section, shouldReduceMotion, children }: SectionShellProps) {
  return (
    <section
      id={section.id}
      className="snap-start min-h-screen px-4 pt-24 pb-16 sm:px-6 lg:px-10 lg:pt-28 lg:pb-20"
    >
      <div className="mx-auto flex w-full max-w-7xl items-start">
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ amount: section.id === "works" ? 0.15 : 0.6, once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full space-y-5 text-zinc-100 sm:space-y-6"
        >
          {/* セクション共通の見出し領域をひとまとめにして、本文差し替えだけで使い回せるようにする */}
          <p className="text-[10px] tracking-[0.2em] text-zinc-300 uppercase sm:text-xs sm:tracking-[0.24em]">
            {section.label}
          </p>
          <h1 className="max-w-5xl text-[clamp(2rem,5.2vw,3.8rem)] leading-[1.08] font-semibold tracking-tight">
            {section.title}
          </h1>
          {children}
        </motion.article>
      </div>
    </section>
  );
}
