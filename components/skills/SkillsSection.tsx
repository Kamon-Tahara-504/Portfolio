"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SkillsGridPanel from "@/components/skills/SkillsGridPanel";
import SkillsModeToggle from "@/components/skills/SkillsModeToggle";
import SkillsTimelinePanel from "@/components/skills/SkillsTimelinePanel";
import { Skill, Skills } from "@/types/profile";
import {
  CARD_MOTION_DURATION,
  SkillsPhase,
  TIMELINE_CONTENT_REVEAL_RATIO,
  TIMELINE_ENTER_DURATION,
  TIMELINE_EXIT_DURATION,
  TIMELINE_HIDE_TO_EXIT_FRAME_MS,
  TIMELINE_SWITCH_RATIO,
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
  // 現在フェーズとタイムライン本文表示タイミングを管理するstate。
  const [phase, setPhase] = useState<SkillsPhase>("skills");
  const [timelineContentVisible, setTimelineContentVisible] = useState(false);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineContentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
      if (phaseEndTimeoutRef.current) {
        clearTimeout(phaseEndTimeoutRef.current);
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
    if (phaseEndTimeoutRef.current) {
      clearTimeout(phaseEndTimeoutRef.current);
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
          TIMELINE_ENTER_DURATION * TIMELINE_CONTENT_REVEAL_RATIO * 1000
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
    if (phaseEndTimeoutRef.current) {
      clearTimeout(phaseEndTimeoutRef.current);
    }
    if (timelineContentTimeoutRef.current) {
      clearTimeout(timelineContentTimeoutRef.current);
    }
    const timelineContentHideDelayMs = TIMELINE_EXIT_DURATION * (1 - TIMELINE_CONTENT_REVEAL_RATIO) * 1000;

    timelineContentTimeoutRef.current = setTimeout(
      () => setTimelineContentVisible(false),
      timelineContentHideDelayMs
    );

    phaseTimeoutRef.current = setTimeout(
      () => {
        setPhase("toSkills");
        phaseEndTimeoutRef.current = setTimeout(() => setPhase("skills"), CARD_MOTION_DURATION * 1000);
      },
      timelineContentHideDelayMs + TIMELINE_HIDE_TO_EXIT_FRAME_MS
    );
  };

  const showGrid = phase !== "timeline";
  const isTimelineMode = phase === "timeline" || phase === "toSkills";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
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

      <AnimatePresence mode="wait" initial={false}>
        {showGrid ? (
          <SkillsGridPanel phase={phase} skillGroups={skillGroups} />
        ) : (
          <SkillsTimelinePanel skills={skills} contentVisible={timelineContentVisible} />
        )}
      </AnimatePresence>
    </div>
  );
}
