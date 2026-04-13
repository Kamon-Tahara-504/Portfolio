import { motion } from "framer-motion";

// 背景クロスフェード描画の入力パラメータ。
interface PageBackgroundProps {
  isTop1Active: boolean;
  shouldReduceMotion: boolean | null;
}

// セクション状態に追従して背景2枚をクロスフェード表示する。
export default function PageBackground({ isTop1Active, shouldReduceMotion }: PageBackgroundProps) {
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <motion.img
        src="/images/profile/Top1.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        animate={{ opacity: isTop1Active ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
      />
      <motion.img
        src="/images/profile/Top2.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        animate={{ opacity: isTop1Active ? 0 : 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
    </motion.div>
  );
}
