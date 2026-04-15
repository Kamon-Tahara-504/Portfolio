import { AnimatePresence, motion } from "framer-motion";
import { SkillsPhase } from "@/components/skills/skillsTransition";

// スキル表示モード切替ボタンの入力。
interface SkillsModeToggleProps {
  phase: SkillsPhase;
  isTimelineMode: boolean;
  onGoToTimeline: () => void;
  onGoToSkills: () => void;
}

// 現在フェーズに応じて Timeline/Back ボタンを切り替える。
export default function SkillsModeToggle({
  phase,
  isTimelineMode,
  onGoToTimeline,
  onGoToSkills,
}: SkillsModeToggleProps) {
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
          className="ml-4 flex-shrink-0 rounded-full border border-zinc-300/30 bg-zinc-900/70 px-4 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="hidden shrink-0 rounded-full border border-zinc-300/30 bg-zinc-900/70 px-4 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:ml-4 md:inline-flex"
        >
          Timeline →
        </motion.button>
      )}
    </AnimatePresence>
  );
}
