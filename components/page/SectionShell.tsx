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
    <section id={section.id} className="snap-start min-h-screen px-6 py-28 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl items-center">
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ amount: section.id === "works" ? 0.15 : 0.6, once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full space-y-6 text-zinc-100"
        >
          {/* セクション共通の見出し領域をひとまとめにして、本文差し替えだけで使い回せるようにする */}
          <p className="text-xs tracking-[0.24em] text-zinc-300 uppercase">{section.label}</p>
          <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            {section.title}
          </h1>
          {children}
        </motion.article>
      </div>
    </section>
  );
}
