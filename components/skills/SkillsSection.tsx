"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SkillsGridPanel from "@/components/skills/SkillsGridPanel";
import SkillsModeToggle from "@/components/skills/SkillsModeToggle";
import SkillsTimelinePanel from "@/components/skills/SkillsTimelinePanel";
import { Skill, Skills } from "@/types/profile";
import {
  CARD_MOTION_DURATION,
  SkillsPhase,
  TIMELINE_CONTENT_HIDE_DELAY_MS,
  TIMELINE_CONTENT_SHOW_DELAY_MS,
  TIMELINE_ENTER_DURATION,
  TIMELINE_ENTER_EASE,
  TIMELINE_EXIT_DURATION,
  TIMELINE_EXIT_EASE,
  TIMELINE_TO_SKILLS_START_DELAY_MS,
  TIMELINE_SWITCH_RATIO,
} from "@/components/skills/skillsTransition";

const TO_SKILLS_PREP_ADVANCE_MS = 80;

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
  // 現在フェーズとタイムライン本文表示タイミングを管理するstate。
  const [phase, setPhase] = useState<SkillsPhase>("skills");
  const [timelineContentVisible, setTimelineContentVisible] = useState(false);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineContentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
      if (timelineContentTimeoutRef.current) {
        clearTimeout(timelineContentTimeoutRef.current);
      }
    };
  }, []);

  // スキルグリッドからタイムラインへ遷移する。
  const goToTimeline = () => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }
    if (timelineContentTimeoutRef.current) {
      clearTimeout(timelineContentTimeoutRef.current);
    }
    setTimelineContentVisible(false);
    setPhase("toTimeline");
    phaseTimeoutRef.current = setTimeout(
      () => {
        setPhase("timeline");
        timelineContentTimeoutRef.current = setTimeout(
          () => setTimelineContentVisible(true),
          TIMELINE_CONTENT_SHOW_DELAY_MS
        );
      },
      CARD_MOTION_DURATION * TIMELINE_SWITCH_RATIO * 1000
    );
  };

  // タイムラインからスキルグリッドへ戻る。
  const goToSkills = () => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
    }
    if (timelineContentTimeoutRef.current) {
      clearTimeout(timelineContentTimeoutRef.current);
    }
    timelineContentTimeoutRef.current = setTimeout(
      () => setTimelineContentVisible(false),
      TIMELINE_CONTENT_HIDE_DELAY_MS
    );

    phaseTimeoutRef.current = setTimeout(
      () => setPhase("toSkillsPrep"),
      Math.max(0, TIMELINE_TO_SKILLS_START_DELAY_MS - TO_SKILLS_PREP_ADVANCE_MS)
    );
  };

  const handleTimelineExitComplete = () => {
    if (phase !== "toSkillsPrep") {
      return;
    }
    setPhase("toSkills");
    phaseTimeoutRef.current = setTimeout(() => setPhase("skills"), CARD_MOTION_DURATION * 1000);
  };

  const showGrid = phase !== "timeline" && phase !== "toSkillsPrep";
  const showTimeline = phase === "timeline";
  const isTimelineMode = phase === "timeline" || phase === "toSkillsPrep" || phase === "toSkills";

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {isTimelineMode
            ? "スキルの習得期間をタイムラインで表示しています。"
            : "習熟度と使用経験をカテゴリ別に掲載しています。"}
        </p>
        <SkillsModeToggle
          phase={phase}
          isTimelineMode={isTimelineMode}
          onGoToTimeline={goToTimeline}
          onGoToSkills={goToSkills}
        />
      </div>

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
