"use client";

import { Skills, Skill } from "@/types/profile";
import { useTimelineLayout, type TimelineSkill } from "@/hooks/useTimelineLayout";
import { useTimelineAutoScroll } from "@/hooks/useTimelineAutoScroll";
import TimelineHeader from "./TimelineHeader";
import TimelineRuler from "./TimelineRuler";
import TimelineSkillBar from "./TimelineSkillBar";

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
    <div className="mt-10 w-full mx-auto pb-5" style={{ maxWidth: "76rem" }}>
      <div className="relative w-full border border-black px-2 py-2">
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
            className="relative mx-auto px-4"
            style={{
              height: `${timelineHeight}px`,
              minWidth: `${minTimelineWidth}px`,
              width: "100%",
              paddingTop: "60px",
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
