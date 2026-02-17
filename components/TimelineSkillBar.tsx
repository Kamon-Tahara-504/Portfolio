"use client";

import { Skill } from "@/types/profile";
import { formatDate } from "@/utils/timelineUtils";

interface TimelineSkillBarProps {
  skill: Skill;
  left: number;
  width: number;
  isAbove: boolean;
  lineHeight: number;
  startDate: string;
  endDate: string | null;
  color: string;
  baseLineTop: number;
  index: number;
}

export default function TimelineSkillBar({
  skill,
  left,
  width,
  isAbove,
  lineHeight,
  startDate,
  endDate,
  color,
  baseLineTop,
  index,
}: TimelineSkillBarProps) {
  const labelOffset = isAbove ? -4 : 12;
  const labelTransform = isAbove
    ? "translate(-50%, -100%)"
    : "translate(-50%, 0)";

  const randomSeed = skill.name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), index);
  const randomDelay = (randomSeed % 100) / 100 * 3;

  return (
    <div
      className="absolute"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        top: `${baseLineTop}px`,
      }}
    >
      <div
        className="absolute left-0 rounded-full"
        style={{
          width: endDate === null ? "calc(100% + 4px)" : "100%",
          height: "2.5px",
          top: `${lineHeight}px`,
          backgroundColor: color,
        }}
      />
      <div
        className="absolute left-0 rounded-full"
        style={{
          width: "10px",
          height: "10px",
          top: `${lineHeight - 4}px`,
          backgroundColor: color,
          border: "2.5px solid white",
          boxShadow: "0 0 0 1px black",
        }}
      />
      <div
        className={`absolute right-0 rounded-full ${endDate === null ? "animate-wobble" : ""}`}
        style={{
          width: "10px",
          height: "10px",
          top: `${lineHeight - 4}px`,
          right: endDate === null ? "-3px" : "0",
          backgroundColor: color,
          border: "2.5px solid white",
          boxShadow: "0 0 0 1px black",
          animationDelay: endDate === null ? `${randomDelay}s` : undefined,
        }}
      />
      <div
        className="absolute"
        style={{
          left: "50%",
          top: `${lineHeight + labelOffset}px`,
          transform: labelTransform,
        }}
      >
        <div
          className="flex flex-col whitespace-nowrap"
          style={{ color }}
        >
          <span className="text-xs font-medium md:text-sm">{skill.name}</span>
          <span className="text-[10px] text-black/60 md:text-xs">
            {formatDate(startDate)} ～ {endDate ? formatDate(endDate) : "現在"}
          </span>
        </div>
      </div>
    </div>
  );
}
