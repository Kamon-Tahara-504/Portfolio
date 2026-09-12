"use client";

import { AnimatePresence, motion } from "framer-motion";
import SkillsGridPanel from "@/components/skills/SkillsGridPanel";
import SkillsTimelinePanel from "@/components/skills/SkillsTimelinePanel";
import { useSkillsView } from "@/components/skills/SkillsViewContext";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { bodyText } from "@/lib/portfolioViewStyles";
import { Skill, Skills } from "@/types/profile";
import {
  CONTENT_FADE_DURATION,
  CONTENT_FADE_EASE,
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

  const description = isTimelineMode
    ? "スキルの習得時期と成長の流れを、タイムライン形式で可視化しています。"
    : "使用言語・フレームワークの理解度を、カテゴリ別に数値で可視化しています。";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 説明文はクロスフェード＋わずかな上下移動で切り替える */}
      <div className="relative min-h-[3.25rem] max-w-3xl sm:min-h-[3.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={isTimelineMode ? "timeline-desc" : "skills-desc"}
            className={`absolute inset-x-0 top-0 ${bodyText(viewMode)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: CONTENT_FADE_DURATION,
              ease: CONTENT_FADE_EASE,
            }}
          >
            {description}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative min-h-[36rem] sm:min-h-[38rem] md:min-h-[40rem]">
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
