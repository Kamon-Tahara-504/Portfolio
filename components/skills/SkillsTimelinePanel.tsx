import { motion } from "framer-motion";
import SkillsTimeline from "@/components/skills/SkillsTimeline";
import { Skills } from "@/types/profile";
import {
  TIMELINE_ENTER_DURATION,
  TIMELINE_ENTER_EASE,
  TIMELINE_EXIT_DURATION,
  TIMELINE_EXIT_EASE,
} from "@/components/skills/skillsTransition";

// タイムラインパネル描画に必要な入力。
interface SkillsTimelinePanelProps {
  skills: Skills;
  contentVisible: boolean;
}

// タイムラインの出入りアニメーションを含む表示ラッパー。
export default function SkillsTimelinePanel({ skills, contentVisible }: SkillsTimelinePanelProps) {
  return (
    <motion.div
      key="timeline"
      initial={{ scale: 0.55, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0.55,
        opacity: 0,
        transition: {
          duration: TIMELINE_EXIT_DURATION,
          ease: TIMELINE_EXIT_EASE,
        },
      }}
      transition={{
        duration: TIMELINE_ENTER_DURATION,
        ease: TIMELINE_ENTER_EASE,
      }}
    >
      <SkillsTimeline skills={skills} contentVisible={contentVisible} />
    </motion.div>
  );
}
