"use client";

import { AnimatePresence, motion } from "framer-motion";
import SkillsGridPanel from "@/components/skills/SkillsGridPanel";
import SkillsTimelinePanel from "@/components/skills/SkillsTimelinePanel";
import { useSkillsView } from "@/components/skills/SkillsViewContext";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { bodyText } from "@/lib/portfolioViewStyles";
import { Skill, Skills } from "@/types/profile";
import {
  TIMELINE_ENTER_DURATION,
  TIMELINE_ENTER_EASE,
  TIMELINE_EXIT_DURATION,
  TIMELINE_EXIT_EASE,
} from "@/components/skills/skillsTransition";

// SkillsSectionへ渡すカテゴリグループ構造。
interface SkillGroup {
  title: string;
  items: Skill[];
}

// SkillsSectionの入力。
interface SkillsSectionProps {
  skillGroups: SkillGroup[];
  skills: Skills;
}

// スキルカードとタイムラインの遷移を制御するコンテナ。
export default function SkillsSection({ skillGroups, skills }: SkillsSectionProps) {
  const { viewMode } = usePortfolioView();
  const {
    phase,
    timelineContentVisible,
    isTimelineMode,
    showGrid,
    showTimeline,
    handleTimelineExitComplete,
  } = useSkillsView();

  return (
    <div className="space-y-5 sm:space-y-6">
      <p className={`max-w-3xl ${bodyText(viewMode)}`}>
        {isTimelineMode
          ? "スキルの習得時期と成長の流れを、タイムライン形式で可視化しています。"
          : "使用言語・フレームワークの理解度を、カテゴリ別に数値で可視化しています。"}
      </p>

      <div className="relative">
        <AnimatePresence initial={false}>
          {showGrid ? (
            <motion.div
              key="skills-grid"
              exit={{ opacity: 0, transition: { duration: 0 } }}
            >
              <SkillsGridPanel phase={phase} skillGroups={skillGroups} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false} onExitComplete={handleTimelineExitComplete}>
          {showTimeline ? (
            <motion.div
              key="timeline"
              initial={{ scale: 0.55, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.55,
                opacity: 1,
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
              <SkillsTimelinePanel skills={skills} contentVisible={timelineContentVisible} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
