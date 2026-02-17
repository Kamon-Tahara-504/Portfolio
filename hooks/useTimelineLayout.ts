import { Skill } from "@/types/profile";
import { getGitHubLanguageColor } from "@/utils/githubLanguageColors";
import {
  parseDate,
  hasOverlap,
  FIXED_START_MONTH,
  PIXELS_PER_MONTH,
  LAYER_HEIGHTS,
  TIMELINE_HEIGHT,
  BASE_LINE_TOP,
} from "@/utils/timelineUtils";

export interface TimelineSkill extends Skill {
  startDate: string;
  endDate: string | null;
}

export interface SkillPosition {
  skill: Skill;
  left: number;
  width: number;
  isAbove: boolean;
  lineHeight: number;
  startDate: string;
  endDate: string | null;
  color: string;
}

type LayerOccupancy = Array<{ start: number; end: number }>;

export function useTimelineLayout(timelineSkills: TimelineSkill[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentMonth = currentYear * 12 + currentMonthIndex;

  if (timelineSkills.length === 0) {
    return {
      skillPositions: [] as SkillPosition[],
      yearMarks: [] as Array<{ year: number; position: number }>,
      monthlyTickPositions: [] as number[],
      minTimelineWidth: 1400,
      timelineHeight: TIMELINE_HEIGHT,
      baseLineTop: BASE_LINE_TOP,
    };
  }

  const allMonths = timelineSkills.flatMap((skill) => {
    const start = parseDate(skill.startDate);
    const end = skill.endDate ? parseDate(skill.endDate) : currentMonth;
    return [start, end];
  });

  const absoluteMinMonth = Math.min(...allMonths);
  const absoluteMaxMonth = Math.max(...allMonths);
  const minMonth = FIXED_START_MONTH;
  const currentYearStartMonth = currentYear * 12;
  const maxMonth = Math.max(
    absoluteMaxMonth,
    currentYearStartMonth,
    currentMonth + 2
  );
  const totalMonths = Math.max(1, maxMonth - FIXED_START_MONTH);
  const timelineWidthPx = totalMonths * PIXELS_PER_MONTH;

  const minYear = Math.floor(minMonth / 12);
  const maxYear = Math.floor(maxMonth / 12);
  const yearMarks: Array<{ year: number; position: number }> = [];
  const displayMaxYear = Math.max(maxYear, currentYear);
  for (let year = minYear; year <= displayMaxYear; year++) {
    const januaryMonthIndex = year * 12 + 0;
    if (
      januaryMonthIndex >= minMonth &&
      (januaryMonthIndex <= maxMonth || year === currentYear)
    ) {
      const positionPx = (januaryMonthIndex - minMonth) * PIXELS_PER_MONTH;
      const position = (positionPx / timelineWidthPx) * 100;
      yearMarks.push({ year, position });
    }
  }
  yearMarks.sort((a, b) => a.position - b.position);

  const monthlyTickPositions: number[] = [];
  for (let i = 0; i <= totalMonths; i++) {
    monthlyTickPositions.push((i / totalMonths) * 100);
  }

  const aboveLayers: LayerOccupancy[] = [[], [], [], [], []];
  const belowLayers: LayerOccupancy[] = [[], [], [], [], []];

  const sortedSkills = [...timelineSkills].sort((a, b) => {
    const startA = parseDate(a.startDate);
    const startB = parseDate(b.startDate);
    return startA - startB;
  });

  let reactLayerInfo: { isAbove: boolean; assignedLayer: number } | null = null;

  const skillPositions: SkillPosition[] = sortedSkills.map((skill) => {
    const start = parseDate(skill.startDate);
    const end = skill.endDate ? parseDate(skill.endDate) : currentMonth;

    const leftPx = (start - minMonth) * PIXELS_PER_MONTH;
    const monthSpan = skill.endDate
      ? Math.max(1, end - start)
      : end - start + 1;
    const widthPx = monthSpan * PIXELS_PER_MONTH;
    const left = (leftPx / timelineWidthPx) * 100;
    const width = (widthPx / timelineWidthPx) * 100;

    const color = getGitHubLanguageColor(skill.name);

    let assignedLayer = -1;
    let isAbove = false;
    let usedLayers: LayerOccupancy[] = aboveLayers;

    if (skill.name === "React Native" && reactLayerInfo !== null) {
      const candidateLayers = reactLayerInfo.isAbove ? aboveLayers : belowLayers;
      const layer = candidateLayers[reactLayerInfo.assignedLayer];
      const hasConflictOnReactLayer = layer.some((occupied) =>
        hasOverlap(start, end, occupied.start, occupied.end)
      );
      if (!hasConflictOnReactLayer) {
        isAbove = reactLayerInfo.isAbove;
        assignedLayer = reactLayerInfo.assignedLayer;
        usedLayers = candidateLayers;
        usedLayers[assignedLayer].push({ start, end });
      }
    }

    if (assignedLayer === -1) {
      const preferAbove = sortedSkills.indexOf(skill) % 2 === 0;
      isAbove = preferAbove;
      usedLayers = preferAbove ? aboveLayers : belowLayers;

      for (let i = 0; i < usedLayers.length; i++) {
        const layer = usedLayers[i];
        const hasConflict = layer.some((occupied) =>
          hasOverlap(start, end, occupied.start, occupied.end)
        );
        if (!hasConflict) {
          assignedLayer = i;
          layer.push({ start, end });
          break;
        }
      }

      if (assignedLayer === -1) {
        isAbove = !preferAbove;
        usedLayers = isAbove ? aboveLayers : belowLayers;
        for (let i = 0; i < usedLayers.length; i++) {
          const layer = usedLayers[i];
          const hasConflict = layer.some((occupied) =>
            hasOverlap(start, end, occupied.start, occupied.end)
          );
          if (!hasConflict) {
            assignedLayer = i;
            layer.push({ start, end });
            break;
          }
        }
      }

      if (assignedLayer === -1) {
        const overlapLength = (
          start1: number,
          end1: number,
          start2: number,
          end2: number
        ): number => {
          if (!hasOverlap(start1, end1, start2, end2)) return 0;
          return Math.min(end1, end2) - Math.max(start1, start2);
        };
        let minOverlap = Infinity;
        let bestSide: "above" | "below" | null = null;
        let bestLayerIndex = 0;
        for (const [side, layers] of [
          ["above", aboveLayers] as const,
          ["below", belowLayers] as const,
        ]) {
          for (let i = 0; i < layers.length; i++) {
            const totalOverlap = layers[i].reduce(
              (sum, occupied) =>
                sum + overlapLength(start, end, occupied.start, occupied.end),
              0
            );
            if (totalOverlap < minOverlap) {
              minOverlap = totalOverlap;
              bestSide = side;
              bestLayerIndex = i;
            }
          }
        }
        isAbove = bestSide === "above";
        usedLayers = isAbove ? aboveLayers : belowLayers;
        assignedLayer = bestLayerIndex;
        usedLayers[assignedLayer].push({ start, end });
      }

      if (skill.name === "React.js") {
        reactLayerInfo = { isAbove, assignedLayer };
      }
    }

    const layerHeights = isAbove ? LAYER_HEIGHTS.above : LAYER_HEIGHTS.below;
    const lineHeight = layerHeights[assignedLayer];

    return {
      skill,
      left,
      width,
      isAbove,
      lineHeight,
      startDate: skill.startDate,
      endDate: skill.endDate,
      color,
    };
  });

  const minTimelineWidth = Math.max(1400, totalMonths * PIXELS_PER_MONTH);

  return {
    skillPositions,
    yearMarks,
    monthlyTickPositions,
    minTimelineWidth,
    timelineHeight: TIMELINE_HEIGHT,
    baseLineTop: BASE_LINE_TOP,
  };
}
