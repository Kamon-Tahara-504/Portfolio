import { AnimatePresence, motion } from "framer-motion";

// 背景クロスフェード描画の入力パラメータ。
interface PageBackgroundProps {
  activeImage: string;
  shouldReduceMotion: boolean | null;
}

// セクション状態に追従して背景画像をクロスフェード表示する。
export default function PageBackground({ activeImage, shouldReduceMotion }: PageBackgroundProps) {
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <AnimatePresence mode="sync">
        <motion.img
          key={activeImage}
          src={activeImage}
          alt=""
          className="absolute inset-0 h-full w-full scale-101 object-cover blur-[3px]"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.32 }}
        animate={shouldReduceMotion ? { opacity: 0.32 } : { opacity: [0.38, 0.24, 0.34, 0.27, 0.36] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
        }
      />
    </motion.div>
  );
}
