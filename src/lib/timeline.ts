import type { Skill, SkillCategory } from "../types/content";

/** タイムライン開始月（2022年1月） */
const FIXED_START_MONTH = 2022 * 12;
const PIXELS_PER_MONTH = 50;
const LAYER_HEIGHTS = {
  above: [-40, -80, -120, -160, -200],
  below: [40, 80, 120, 160, 200],
} as const;

export const TIMELINE_HEIGHT = 550;
export const BASE_LINE_TOP = 275;

// 見た目のバランス用に、上側を優先するスキル。
const PREFER_ABOVE_SKILLS = new Set(["SwiftUI / Swift"]);

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  CSS: "#563d7c",
  HTML: "#e34c26",
  C: "#555555",
  "C#": "#178600",
  Python: "#3572A5",
  Django: "#092e20",
  "Spring / Java": "#6DB33F",
  Kotlin: "#A97BFF",
  "SwiftUI / Swift": "#F05138",
  "React Native": "#61dafb",
  React: "#61dafb",
  "Next.js": "#000000",
  "Flutter / Dart": "#00B4AB",
  AWS: "#FF9900",
};

const FALLBACK_COLOR = "#6b7280";

export type TimelineSkill = Skill & {
  startDate: string;
  endDate: string | null;
};

export type SkillPosition = {
  skill: TimelineSkill;
  left: number;
  width: number;
  isAbove: boolean;
  lineHeight: number;
  startDate: string;
  endDate: string | null;
  color: string;
};

export type TimelineLayout = {
  skillPositions: SkillPosition[];
  yearMarks: Array<{ year: number; position: number }>;
  monthlyTickPositions: number[];
  minTimelineWidth: number;
  timelineHeight: number;
  baseLineTop: number;
};

type LayerOccupancy = Array<{ start: number; end: number }>;

/** 自己評価には出さない、タイムラインだけの期間。 */
const TIMELINE_ONLY_SKILLS: TimelineSkill[] = [
  { name: "C#", level: 0, startDate: "2022-05", endDate: "2022-11" },
  { name: "AWS", level: 20, startDate: "2026-05", endDate: null },
];

/** "YYYY-MM" を月インデックスにする */
export function parseDate(dateStr: string): number {
  const [year, month] = dateStr.split("-").map(Number);
  return year * 12 + month - 1;
}

export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `${year}年${Number(month)}月`;
}

function hasOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
  return start1 < end2 && start2 < end1;
}

function languageColor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return FALLBACK_COLOR;
  return LANGUAGE_COLORS[trimmed] ?? FALLBACK_COLOR;
}

export function collectTimelineSkills(categories: SkillCategory[]): TimelineSkill[] {
  const dated = categories.flatMap((category) =>
    category.skills.flatMap((skill) => {
      if (!skill.startDate) return [];
      return [{ ...skill, startDate: skill.startDate, endDate: skill.endDate ?? null }];
    }),
  );
  return [...dated, ...TIMELINE_ONLY_SKILLS];
}

/** 開始月の早い順に、上下 5 段へ重ならないように詰める */
export function layoutTimeline(skills: TimelineSkill[], now = new Date()): TimelineLayout {
  const currentMonth = now.getFullYear() * 12 + now.getMonth();

  if (skills.length === 0) {
    return {
      skillPositions: [],
      yearMarks: [],
      monthlyTickPositions: [],
      minTimelineWidth: 1400,
      timelineHeight: TIMELINE_HEIGHT,
      baseLineTop: BASE_LINE_TOP,
    };
  }

  const minMonth = FIXED_START_MONTH;
  const datedEnds = skills.map((skill) => (skill.endDate ? parseDate(skill.endDate) : currentMonth));
  const maxMonth = Math.max(...datedEnds, now.getFullYear() * 12, currentMonth + 2);
  const totalMonths = Math.max(1, maxMonth - minMonth);
  const timelineWidthPx = totalMonths * PIXELS_PER_MONTH;

  const yearMarks: Array<{ year: number; position: number }> = [];
  const minYear = Math.floor(minMonth / 12);
  const displayMaxYear = Math.max(Math.floor(maxMonth / 12), now.getFullYear());
  for (let year = minYear; year <= displayMaxYear; year++) {
    const january = year * 12;
    if (january >= minMonth && (january <= maxMonth || year === now.getFullYear())) {
      yearMarks.push({ year, position: ((january - minMonth) / totalMonths) * 100 });
    }
  }

  const monthlyTickPositions = Array.from({ length: totalMonths + 1 }, (_, index) => (index / totalMonths) * 100);

  const aboveLayers: LayerOccupancy[] = [[], [], [], [], []];
  const belowLayers: LayerOccupancy[] = [[], [], [], [], []];
  const sortedSkills = [...skills].sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
  let reactLayer: { isAbove: boolean; assignedLayer: number } | null = null;

  const skillPositions = sortedSkills.map((skill, order) => {
    const start = parseDate(skill.startDate);
    const end = skill.endDate ? parseDate(skill.endDate) : currentMonth + 0.5;
    const left = ((start - minMonth) / totalMonths) * 100;
    const width = (Math.max(1, end - start) / totalMonths) * 100;

    let assignedLayer = -1;
    let isAbove = false;

    if (skill.name === "React Native" && reactLayer) {
      const candidateLayers = reactLayer.isAbove ? aboveLayers : belowLayers;
      const layer = candidateLayers[reactLayer.assignedLayer];
      const blocked = layer.some((occupied) => hasOverlap(start, end, occupied.start, occupied.end));
      if (!blocked) {
        isAbove = reactLayer.isAbove;
        assignedLayer = reactLayer.assignedLayer;
        layer.push({ start, end });
      }
    }

    if (assignedLayer === -1) {
      const preferAbove = PREFER_ABOVE_SKILLS.has(skill.name) ? true : order % 2 === 0;
      const placeOn = (layers: LayerOccupancy[]) => {
        for (let index = 0; index < layers.length; index++) {
          const blocked = layers[index].some((occupied) => hasOverlap(start, end, occupied.start, occupied.end));
          if (!blocked) {
            layers[index].push({ start, end });
            return index;
          }
        }
        return -1;
      };

      isAbove = preferAbove;
      assignedLayer = placeOn(preferAbove ? aboveLayers : belowLayers);

      if (assignedLayer === -1) {
        isAbove = !preferAbove;
        assignedLayer = placeOn(isAbove ? aboveLayers : belowLayers);
      }

      if (assignedLayer === -1) {
        let minOverlap = Infinity;
        let bestAbove = true;
        let bestIndex = 0;
        for (const [side, layers] of [
          [true, aboveLayers],
          [false, belowLayers],
        ] as const) {
          layers.forEach((layer, index) => {
            const total = layer.reduce((sum, occupied) => {
              if (!hasOverlap(start, end, occupied.start, occupied.end)) return sum;
              return sum + (Math.min(end, occupied.end) - Math.max(start, occupied.start));
            }, 0);
            if (total < minOverlap) {
              minOverlap = total;
              bestAbove = side;
              bestIndex = index;
            }
          });
        }
        isAbove = bestAbove;
        assignedLayer = bestIndex;
        (isAbove ? aboveLayers : belowLayers)[assignedLayer].push({ start, end });
      }

      if (skill.name === "React") {
        reactLayer = { isAbove, assignedLayer };
      }
    }

    const lineHeight = (isAbove ? LAYER_HEIGHTS.above : LAYER_HEIGHTS.below)[assignedLayer];
    return {
      skill,
      left,
      width,
      isAbove,
      lineHeight,
      startDate: skill.startDate,
      endDate: skill.endDate,
      color: languageColor(skill.name),
    };
  });

  return {
    skillPositions,
    yearMarks,
    monthlyTickPositions,
    minTimelineWidth: Math.max(1400, timelineWidthPx),
    timelineHeight: TIMELINE_HEIGHT,
    baseLineTop: BASE_LINE_TOP,
  };
}
