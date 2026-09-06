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
          // 画像自体に軽いぼかしを載せ、scaleでぼかし端の白縁を画面外へ逃がす。
          className="absolute inset-0 h-full w-full scale-101 object-cover blur-[3px]"
          loading="eager"
          decoding="async"
          initial={{ opacity: initialOpacity }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
        />
      </AnimatePresence>
      {/* 画像のぼかしは固定にし、明暗だけを緩やかに往復させる */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.42 }}
        animate={shouldReduceMotion ? { opacity: 0.42 } : { opacity: [0.48, 0.34, 0.44, 0.36, 0.46] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
        }
      />
    </motion.div>
  );
}
