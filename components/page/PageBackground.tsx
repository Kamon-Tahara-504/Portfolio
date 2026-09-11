"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// 背景クロスフェード描画の入力パラメータ。
interface PageBackgroundProps {
  activeImage: string;
  shouldReduceMotion: boolean | null;
}

// セクション状態に追従して背景画像をクロスフェード表示する。
export default function PageBackground({ activeImage, shouldReduceMotion }: PageBackgroundProps) {
  // ヒーロー個人プレビューから続く初回だけ、同じ画像を透明から載せない。
  const isFirstImageRef = useRef(true);

  useEffect(() => {
    isFirstImageRef.current = false;
  }, []);

  const initialOpacity = isFirstImageRef.current ? 1 : 0;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <AnimatePresence mode="sync">
        <motion.img
          key={activeImage}
          src={activeImage}
          alt=""
          // セクション切替時にクロスフェードする背景画像。
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          initial={{ opacity: initialOpacity }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
        />
      </AnimatePresence>
      {/* 背景画像の上に一定の暗幕を載せ、本文の可読性を保つ */}
      <div className="absolute inset-0 bg-black/42" />
    </motion.div>
  );
}
