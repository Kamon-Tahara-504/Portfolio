"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CARD_MOTION_DURATION,
  SkillsPhase,
  TIMELINE_CONTENT_HIDE_DELAY_MS,
  TIMELINE_CONTENT_SHOW_DELAY_MS,
  TIMELINE_TO_SKILLS_START_DELAY_MS,
  TIMELINE_SWITCH_RATIO,
} from "@/components/skills/skillsTransition";

const TO_SKILLS_PREP_ADVANCE_MS = 80;

interface SkillsViewContextValue {
  phase: SkillsPhase;
  timelineContentVisible: boolean;
  isTimelineMode: boolean;
  showGrid: boolean;
  showTimeline: boolean;
  goToTimeline: () => void;
  goToSkills: () => void;
  handleTimelineExitComplete: () => void;
}

const SkillsViewContext = createContext<SkillsViewContextValue | null>(null);

export function SkillsViewProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<SkillsPhase>("skills");
  const [timelineContentVisible, setTimelineContentVisible] = useState(false);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineContentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (timelineContentTimeoutRef.current) clearTimeout(timelineContentTimeoutRef.current);
    };
  }, []);

  const goToTimeline = useCallback(() => {
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (timelineContentTimeoutRef.current) clearTimeout(timelineContentTimeoutRef.current);
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
  }, []);

  const goToSkills = useCallback(() => {
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (timelineContentTimeoutRef.current) clearTimeout(timelineContentTimeoutRef.current);
    timelineContentTimeoutRef.current = setTimeout(
      () => setTimelineContentVisible(false),
      TIMELINE_CONTENT_HIDE_DELAY_MS
    );
    phaseTimeoutRef.current = setTimeout(
      () => setPhase("toSkillsPrep"),
      Math.max(0, TIMELINE_TO_SKILLS_START_DELAY_MS - TO_SKILLS_PREP_ADVANCE_MS)
    );
  }, []);

  const handleTimelineExitComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== "toSkillsPrep") return current;
      phaseTimeoutRef.current = setTimeout(() => setPhase("skills"), CARD_MOTION_DURATION * 1000);
      return "toSkills";
    });
  }, []);

  const value = useMemo<SkillsViewContextValue>(() => {
    const showGrid = phase !== "timeline" && phase !== "toSkillsPrep";
    const showTimeline = phase === "timeline";
    const isTimelineMode = phase === "timeline" || phase === "toSkillsPrep" || phase === "toSkills";

    return {
      phase,
      timelineContentVisible,
      isTimelineMode,
      showGrid,
      showTimeline,
      goToTimeline,
      goToSkills,
      handleTimelineExitComplete,
    };
  }, [
    phase,
    timelineContentVisible,
    goToTimeline,
    goToSkills,
    handleTimelineExitComplete,
  ]);

  return <SkillsViewContext.Provider value={value}>{children}</SkillsViewContext.Provider>;
}

export function useSkillsView(): SkillsViewContextValue {
  const context = useContext(SkillsViewContext);
  if (!context) {
    throw new Error("useSkillsView は SkillsViewProvider 内で使用してください。");
  }
  return context;
}
