"use client";

import { Skills, Skill } from "@/types/profile";
import { useTimelineLayout, type TimelineSkill } from "@/hooks/useTimelineLayout";
import { useTimelineAutoScroll } from "@/hooks/useTimelineAutoScroll";
import TimelineHeader from "./TimelineHeader";
import TimelineRuler from "./TimelineRuler";
import TimelineSkillBar from "./TimelineSkillBar";
import EngineerExperienceCard from "./EngineerExperienceCard";

interface SkillsTimelineProps {
  skills: Skills;
}

export default function SkillsTimeline({ skills }: SkillsTimelineProps) {
  const allSkills: Skill[] = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.mobile,
    ...skills.tools,
    { name: "C#", level: 0, startDate: "2022-05", endDate: "2022-11" },
  ];

  const timelineSkills: TimelineSkill[] = allSkills.filter(
    (skill): skill is TimelineSkill =>
      skill.startDate !== undefined && skill.startDate !== null
  );

  const layout = useTimelineLayout(timelineSkills);
  const { scrollContainerRef, isPlaying, handlePlay } = useTimelineAutoScroll();

  if (timelineSkills.length === 0) {
    return null;
  }

  const {
    skillPositions,
    yearMarks,
    monthlyTickPositions,
    minTimelineWidth,
    timelineHeight,
    baseLineTop,
  } = layout;

  return (
    <div className="mt-7 w-full pb-0.5">
      <div className="relative w-full rounded-none border-2 border-black bg-white px-3 pt-2.5 pb-1 shadow-[0_10px_24px_rgba(0,0,0,0.18)] md:px-4 md:pt-3.5 md:pb-1.5">
        <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
          <EngineerExperienceCard />
        </div>
        <TimelineHeader onPlay={handlePlay} isPlaying={isPlaying} />
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden timeline-scrollbar"
          style={{
            WebkitOverflowScrolling: "touch",
            paddingLeft: "60px",
            paddingRight: "120px",
            pointerEvents: isPlaying ? "none" : "auto",
          }}
        >
          <div
            className="relative mx-auto px-1 md:px-2.5"
            style={{
              height: `${timelineHeight}px`,
              minWidth: `${minTimelineWidth}px`,
              width: "100%",
              paddingTop: "48px",
              paddingBottom: "0px",
            }}
          >
            <TimelineRuler
              yearMarks={yearMarks}
              monthlyTickPositions={monthlyTickPositions}
              baseLineTop={baseLineTop}
            />

            {skillPositions.map((pos, index) => (
              <TimelineSkillBar
                key={`${pos.skill.name}-${index}`}
                skill={pos.skill}
                left={pos.left}
                width={pos.width}
                isAbove={pos.isAbove}
                lineHeight={pos.lineHeight}
                startDate={pos.startDate}
                endDate={pos.endDate}
                color={pos.color}
                baseLineTop={baseLineTop}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
