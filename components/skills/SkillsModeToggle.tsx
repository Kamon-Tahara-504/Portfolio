"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { primaryButton } from "@/lib/portfolioViewStyles";
import { SkillsPhase } from "@/components/skills/skillsTransition";

interface SkillsModeToggleProps {
  phase: SkillsPhase;
  isTimelineMode: boolean;
  onGoToTimeline: () => void;
  onGoToSkills: () => void;
}

export default function SkillsModeToggle({
  phase,
  isTimelineMode,
  onGoToTimeline,
  onGoToSkills,
}: SkillsModeToggleProps) {
  const { viewMode } = usePortfolioView();
  const buttonClass = `${primaryButton(viewMode)} px-4 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50 active:scale-95`;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isTimelineMode ? (
        <motion.button
          key="back"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          onClick={onGoToSkills}
          disabled={phase !== "timeline"}
          className={`ml-4 flex-shrink-0 ${buttonClass}`}
        >
          ← Back
        </motion.button>
      ) : (
        <motion.button
          key="timeline"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          onClick={onGoToTimeline}
          disabled={phase !== "skills"}
          className={`hidden shrink-0 md:ml-4 md:inline-flex ${buttonClass}`}
        >
          Timeline →
        </motion.button>
      )}
    </AnimatePresence>
  );
}
