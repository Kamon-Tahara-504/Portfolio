"use client";

import { useRef, useEffect } from "react";
import { Skills, Skill } from "@/types/profile";

interface SkillsTimelineProps {
  skills: Skills;
}

interface TimelineSkill extends Skill {
  startDate: string;
  endDate: string | null;
}

// 各スキルに色を割り当てる関数
const getSkillColor = (skillName: string): string => {
  const colorMap: Record<string, string> = {
    "C#": "#ef4444", // red-500
    "C": "#3b82f6", // blue-500
    "Python": "#10b981", // emerald-500
    "Django": "#059669", // emerald-600
    "node.js": "#f59e0b", // amber-500
    "Flutter": "#06b6d4", // cyan-500
    "React": "#3b82f6", // blue-500
    "Java": "#f97316", // orange-500
    "Next.js": "#8b5cf6", // violet-500
  };
  return colorMap[skillName] || "#6b7280"; // デフォルトはgray-500
};

export default function SkillsTimeline({ skills }: SkillsTimelineProps) {
  // スクロール可能なコンテナへの参照
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 全スキルから期間情報を持つものを抽出
  const allSkills: Skill[] = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.mobile,
    ...skills.tools,
    // C#はSkillsカテゴリーには表示しないが、Learning Timelineには表示する
    { name: "C#", level: 0, startDate: "2022-05", endDate: "2022-11" },
  ];

  const timelineSkills: TimelineSkill[] = allSkills.filter(
    (skill): skill is TimelineSkill =>
      skill.startDate !== undefined && skill.startDate !== null
  );

  if (timelineSkills.length === 0) {
    return null;
  }

  // 日付をパースして最小・最大期間を計算
  const parseDate = (dateStr: string): number => {
    const [year, month] = dateStr.split("-").map(Number);
    return year * 12 + month - 1; // 月を0ベースのインデックスに変換
  };

  const formatDate = (dateStr: string): string => {
    const [year, month] = dateStr.split("-");
    return `${year}年${parseInt(month)}月`;
  };

  const now = new Date();
  const currentMonth = now.getFullYear() * 12 + now.getMonth();

  // 全期間の最小・最大を計算（全期間表示用）
  const allMonths = timelineSkills.flatMap((skill) => {
    const start = parseDate(skill.startDate);
    const end = skill.endDate ? parseDate(skill.endDate) : currentMonth;
    return [start, end];
  });

  const absoluteMinMonth = Math.min(...allMonths);
  const absoluteMaxMonth = Math.max(...allMonths);

  // 全期間を表示（固定スケール20px/月で）
  // 開始点を2022年1月に固定
  const FIXED_START_MONTH = 2022 * 12 + 0; // 2022年1月
  const minMonth = FIXED_START_MONTH;
  const maxMonth = absoluteMaxMonth;
  const totalMonths = absoluteMaxMonth - FIXED_START_MONTH;

  // 固定スケール: 30px/月（より長い線で表示）
  const PIXELS_PER_MONTH = 50;
  const timelineWidthPx = totalMonths * PIXELS_PER_MONTH;

  // 年/月の目盛りを計算（ピクセル単位で計算してからパーセンテージに変換）
  const minYear = Math.floor(minMonth / 12);
  const maxYear = Math.floor(maxMonth / 12);
  const yearMarks: Array<{ year: number; month: number; position: number }> = [];

  // 最初の月を追加（1月でない場合）
  const firstMonthValue = (minMonth % 12) + 1;
  const firstYearValue = Math.floor(minMonth / 12);
  if (firstMonthValue !== 1) {
    yearMarks.push({
      year: firstYearValue,
      month: firstMonthValue,
      position: 0,
    });
  }

  // 1年ごとに目盛りを追加（1月の位置）
  for (let year = minYear; year <= maxYear; year++) {
    const monthIndex = year * 12;
    // minMonthが1月の場合も含めて、その年の1月の目盛りを追加
    if (monthIndex >= minMonth && monthIndex < maxMonth) {
      const positionPx = (monthIndex - minMonth) * PIXELS_PER_MONTH;
      const position = (positionPx / timelineWidthPx) * 100;
      yearMarks.push({ year, month: 0, position });
    }
  }

  // 最後の月を追加（12月でない場合、または現在の場合）
  // ただし、2025年12月は追加しない
  const lastMonthValue = (maxMonth % 12) + 1;
  const lastYearValue = Math.floor(maxMonth / 12);
  const isCurrentMonth = maxMonth === currentMonth;
  const is2025December = lastYearValue === 2025 && lastMonthValue === 12;
  if ((lastMonthValue !== 12 || isCurrentMonth) && !is2025December) {
    const lastPosition = 100;
    // 重複チェック（最後の年が既に追加されている場合）
    const alreadyExists = yearMarks.some(
      (mark) => mark.year === lastYearValue && mark.month === 0 && mark.position >= 95
    );
    if (!alreadyExists) {
      yearMarks.push({
        year: lastYearValue,
        month: lastMonthValue,
        position: lastPosition,
      });
    }
  }

  // 位置でソート
  yearMarks.sort((a, b) => a.position - b.position);

  // 重なり検出関数
  const hasOverlap = (
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): boolean => {
    return start1 < end2 && start2 < end1;
  };

  // レイヤーの定義（上側5層、下側5層）- 50px間隔で拡大
  const LAYER_HEIGHTS = {
    above: [-50, -100, -150, -200, -250], // 上側のレイヤー高さ（px）- 50px間隔
    below: [50, 100, 150, 200, 250], // 下側のレイヤー高さ（px）- 50px間隔
  };

  // 各レイヤーに配置されているスキルの期間を記録
  type LayerOccupancy = Array<{ start: number; end: number }>;
  const aboveLayers: LayerOccupancy[] = [[], [], [], [], []]; // 上側5層
  const belowLayers: LayerOccupancy[] = [[], [], [], [], []]; // 下側5層

  // スキルを開始日順にソート
  const sortedSkills = [...timelineSkills].sort((a, b) => {
    const startA = parseDate(a.startDate);
    const startB = parseDate(b.startDate);
    return startA - startB;
  });

  // 各スキルを適切なレイヤーに配置
  const skillPositions = sortedSkills.map((skill) => {
    const start = parseDate(skill.startDate);
    const end = skill.endDate ? parseDate(skill.endDate) : currentMonth;

    // 位置計算をピクセル単位で行う（2年表示時の線の長さを維持）
    const leftPx = (start - minMonth) * PIXELS_PER_MONTH;
    const widthPx = (end - start) * PIXELS_PER_MONTH;
    
    // パーセンテージに変換（タイムライン幅に対する相対位置）
    const left = (leftPx / timelineWidthPx) * 100;
    const width = (widthPx / timelineWidthPx) * 100;

    const color = getSkillColor(skill.name);

    // 上下に交互に配置するが、重なりを避ける
    // まず上下を決定（交互に配置）
    const preferAbove = sortedSkills.indexOf(skill) % 2 === 0;

    // 利用可能なレイヤーを見つける（まず希望側を試す）
    let assignedLayer = -1;
    let isAbove = preferAbove;
    let usedLayers = preferAbove ? aboveLayers : belowLayers;

    for (let i = 0; i < usedLayers.length; i++) {
      const layer = usedLayers[i];
      // このレイヤーに重なっているスキルがあるかチェック
      const hasConflict = layer.some((occupied) =>
        hasOverlap(start, end, occupied.start, occupied.end)
      );

      if (!hasConflict) {
        assignedLayer = i;
        // このレイヤーにスキルを記録
        layer.push({ start, end });
        break;
      }
    }

    // 希望側で利用可能なレイヤーが見つからない場合、反対側を試す
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

    // それでも見つからない場合、最初のレイヤーを使用（重なるが仕方ない）
    if (assignedLayer === -1) {
      assignedLayer = 0;
      usedLayers[0].push({ start, end });
    }

    // レイヤー高さを決定
    const layerHeights = isAbove
      ? LAYER_HEIGHTS.above
      : LAYER_HEIGHTS.below;
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

  // タイムラインの最小幅を計算（固定スケールで全期間を表示）
  const minTimelineWidth = Math.max(1400, totalMonths * PIXELS_PER_MONTH);

  // 基準線の位置（中央に配置）- レイヤー間隔拡大に対応
  const timelineHeight = 450; // タイムラインの高さ（レイヤー間隔拡大のため増加）
  const baseLineTop = 225; // タイムラインの中央（450pxの中央）

  // マウント時に右端にスクロール
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // 右端にスクロール（scrollWidth - clientWidth）
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    }
  }, []); // マウント時のみ実行

  return (
    <div className="mt-10 w-full mx-auto pb-10" style={{ maxWidth: "76rem" }}>
      <h3 className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">
        Learning Timeline
      </h3>
      <div 
        className="w-full border border-black px-2 py-2"
      >
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-visible timeline-scrollbar" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            paddingLeft: "60px", // 左側の目盛りが見えるように透明な空白を追加
            paddingRight: "120px" // 右側の目盛りと「現在」の位置の要素が見えるように透明な空白を追加
          }}
        >
        <div 
          className="relative mx-auto px-4" 
          style={{ 
            height: `${timelineHeight}px`,
            minWidth: `${minTimelineWidth}px`,
            width: "100%",
            paddingTop: "150px", // 上側の要素が切れないように上部にpadding（縮小）
            paddingBottom: "10px" // 下側のpaddingを縮小
          }}
        >
        {/* 年/月の目盛り（基準線の中央） */}
        {yearMarks.map((mark, index) => (
          <div
            key={`mark-${index}`}
            className="absolute"
            style={{
              left: `${mark.position}%`,
              top: `${baseLineTop}px`,
              transform: "translateX(-50%) translateY(-50%)",
              zIndex: 20
            }}
          >
            {/* 縦線（中央線の上側） */}
            <div
              className="mx-auto w-px bg-black/30"
              style={{ 
                height: "10px",
                marginBottom: "4px"
              }}
            />
            {/* 年数（中央線の真ん中） */}
            <div 
              className="text-xs font-medium text-black/70 md:text-sm bg-white px-2 rounded"
              style={{ 
                lineHeight: "1.2",
                zIndex: 10
              }}
            >
              {mark.month === 0
                ? `${mark.year}`
                : `${mark.year}年${mark.month}月`}
            </div>
            {/* 縦線（中央線の下側） */}
            <div
              className="mx-auto w-px bg-black/30"
              style={{ 
                height: "10px",
                marginTop: "4px"
              }}
            />
          </div>
        ))}

        {/* 中央の基準線 */}
        <div
          className="absolute w-full bg-black"
          style={{ 
            top: `${baseLineTop}px`, 
            left: 0, 
            height: "2.5px",
            zIndex: 1
          }}
        />

        {/* 各スキルの線とラベル */}
        {skillPositions.map(({ skill, left, width, isAbove, lineHeight, startDate, endDate, color }, index) => {
          // ラベルを線の中央に配置するための計算
          const labelOffset = isAbove ? -8 : 8;
          
          // 各スキルごとにランダムな遅延を生成（スキル名とインデックスを組み合わせて一貫した値を生成）
          const randomSeed = skill.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), index);
          const randomDelay = (randomSeed % 100) / 100 * 3; // 0から3秒の間でランダム

          return (
            <div
              key={`${skill.name}-${index}`}
              className="absolute"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: `${baseLineTop}px`,
              }}
            >
              {/* 色付きの横線（期間） */}
              <div
                className="absolute left-0 rounded-full"
                style={{
                  width: "100%",
                  height: "2.5px",
                  top: `${lineHeight}px`,
                  backgroundColor: color,
                }}
              />
              {/* 開始点の円（ドット） */}
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
              {/* 終了点の円（ドット） */}
              <div
                className={`absolute right-0 rounded-full ${endDate === null ? 'animate-wobble' : ''}`}
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
              {/* ラベル */}
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: `${lineHeight + labelOffset}px`,
                  transform: isAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                }}
              >
                <div
                  className="flex flex-col whitespace-nowrap"
                  style={{ color }}
                >
                  <span className="text-xs font-medium md:text-sm">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-black/60 md:text-xs">
                    {formatDate(startDate)} ～{" "}
                    {endDate ? formatDate(endDate) : "現在"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
      </div>
    </div>
  );
}

