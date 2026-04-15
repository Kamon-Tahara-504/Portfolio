import { motion } from "framer-motion";
import { ReactNode } from "react";
import { SectionMeta } from "@/components/page/SectionMeta";

// セクション共通シェルの受け取り値。
interface SectionShellProps {
  section: SectionMeta;
  shouldReduceMotion: boolean | null;
  /** 見出し（section.title）の右側に並べる任意 UI（例: Stack の GitHub ボタン） */
  titleAside?: ReactNode;
  children: ReactNode;
}

// 見出し・アニメーション・幅制御を共通化したセクションラッパー。
export default function SectionShell({ section, shouldReduceMotion, titleAside, children }: SectionShellProps) {
  return (
    <section
      id={section.id}
      className="snap-start min-h-screen min-w-0 px-4 pt-24 pb-16 sm:px-6 lg:px-10 lg:pt-28 lg:pb-20"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-start">
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          // 本文が長いセクションでも交差が取れるよう、露出割合は抑えめにする（0.6 だとモバイルで未発火になり得る）。
          viewport={{ amount: 0.15, once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full min-w-0 space-y-5 text-zinc-100 sm:space-y-6"
        >
          {/* セクション共通の見出し領域をひとまとめにして、本文差し替えだけで使い回せるようにする */}
          <p className="text-[10px] tracking-[0.2em] text-zinc-300 uppercase sm:text-xs sm:tracking-[0.24em]">
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
