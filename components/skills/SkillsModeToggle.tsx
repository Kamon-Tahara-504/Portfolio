"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { useSkillsView } from "@/components/skills/SkillsViewContext";
import { primaryButton } from "@/lib/portfolioViewStyles";

// SKILLS 見出し右に置くタイムライン切替ボタン。
export default function SkillsModeToggle() {
  const { viewMode } = usePortfolioView();
  const { phase, isTimelineMode, goToTimeline, goToSkills } = useSkillsView();
  const buttonClass = `${primaryButton(viewMode)} shrink-0 px-3.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 sm:px-4`;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isTimelineMode ? (
        <motion.button
          key="back"
          type="button"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          onClick={goToSkills}
          disabled={phase !== "timeline"}
          className={buttonClass}
        >
          ← Back
        </motion.button>
      ) : (
        <motion.button
          key="timeline"
          type="button"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          onClick={goToTimeline}
          disabled={phase !== "skills"}
          className={buttonClass}
        >
          Timeline →
        </motion.button>
      )}
    </AnimatePresence>
  );
}
