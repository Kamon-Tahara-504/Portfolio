"use client";

import { Skill } from "@/types/profile";
import { formatDate } from "@/utils/timelineUtils";

// タイムライン上の1スキルバー描画に必要な入力。
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

// スキル期間バーとラベルを描画する要素。
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

  // 進行中スキルの揺れ開始タイミングを分散させるための疑似乱数種。
  const randomSeed = skill.name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), index);
  const randomDelay = (randomSeed % 100) / 100 * 3;
  const timelineColor = color.toLowerCase() === "#000000" ? "#a1a1aa" : color;

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
          width: endDate === null ? "calc(100% - 1px)" : "100%",
          height: "2.5px",
          top: `${lineHeight}px`,
          backgroundColor: timelineColor,
        }}
      />
      <div
        className="absolute left-0 rounded-full"
        style={{
          width: "10px",
          height: "10px",
          top: `${lineHeight - 4}px`,
          backgroundColor: timelineColor,
          border: "2.5px solid #18181b",
          boxShadow: "0 0 0 1px rgba(161,161,170,0.5)",
        }}
      />
      <div
        className={`absolute right-0 rounded-full ${endDate === null ? "animate-wobble" : ""}`}
        style={{
          width: "10px",
          height: "10px",
          top: `${lineHeight - 4}px`,
          right: endDate === null ? "-1px" : "0",
          backgroundColor: timelineColor,
          border: "2.5px solid #18181b",
          boxShadow: "0 0 0 1px rgba(161,161,170,0.5)",
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
          className="flex flex-col whitespace-nowrap text-zinc-100"
        >
          <span className="text-xs font-semibold md:text-sm">{skill.name}</span>
          <span className="text-[10px] font-semibold text-zinc-400 md:text-xs">
            {formatDate(startDate)} ～ {endDate ? formatDate(endDate) : "現在"}
          </span>
        </div>
      </div>
    </div>
  );
}
