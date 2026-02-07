"use client";

import { useRef, useEffect, useState } from "react";
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
  // 再生中かどうかの状態
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  // 自動スクロール用のrequestAnimationFrameのID
  const animationFrameIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  // 現在の自動スクロール目標位置を保持
  const currentScrollTargetRef = useRef<number | null>(null);

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
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11 (0=1月、11=12月)
  const currentMonth = currentYear * 12 + currentMonthIndex;
  const isCurrentMonthDecember = currentMonthIndex === 11; // 12月かどうか

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
  // タイムラインの最大月は、スキルの最大月と現在の年の1月のうち大きい方
  // これにより、現在の年が2026年になった場合、2026年1月の目盛りも表示される
  const currentYearStartMonth = currentYear * 12;
  const maxMonth = Math.max(absoluteMaxMonth, currentYearStartMonth);
  const totalMonths = maxMonth - FIXED_START_MONTH;

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
  // 現在の年まで含めて目盛りを追加（2026年になったら自動的に2026年の目盛りも表示される）
  const displayMaxYear = Math.max(maxYear, currentYear);
  for (let year = minYear; year <= displayMaxYear; year++) {
    const monthIndex = year * 12;
    // minMonthが1月の場合も含めて、その年の1月の目盛りを追加
    // maxMonth以下の場合、または現在の年の場合に目盛りを追加
    if (monthIndex >= minMonth && (monthIndex <= maxMonth || year === currentYear)) {
      const positionPx = (monthIndex - minMonth) * PIXELS_PER_MONTH;
      const position = (positionPx / timelineWidthPx) * 100;
      yearMarks.push({ year, month: 0, position });
    }
  }

  // 最後の月を追加（現在の月が12月でない場合のみ）
  // 現在の月が12月の場合は目盛りを表示しない（2025年12月の場合は何も表示しない）
  // 次の年の1月になったら、年ごとの目盛り生成ロジック（117-129行目）で年だけが表示される
  const lastMonthValue = (maxMonth % 12) + 1;
  const lastYearValue = Math.floor(maxMonth / 12);
  const isCurrentMonth = maxMonth === currentMonth;
  // 現在の月が12月でない場合、または12月でない場合は最後の月の目盛りを追加
  // ただし、現在の月が12月の場合は追加しない
  if ((lastMonthValue !== 12 || isCurrentMonth) && !isCurrentMonthDecember) {
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

  // クリーンアップ処理
  useEffect(() => {
    return () => {
      // コンポーネントアンマウント時やisPlayingがfalseになった時にクリーンアップ
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      if (!isPlaying) {
        isPlayingRef.current = false;
      }
    };
  }, [isPlaying]);

  // 再生中にスクロールを無効化
  useEffect(() => {
    if (!isPlaying || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    
    const handleScroll = (e: Event) => {
      // 目標位置が設定されている場合、ユーザーのスクロールを無効化
      if (currentScrollTargetRef.current !== null) {
        const targetPosition = currentScrollTargetRef.current;
        const currentPosition = container.scrollLeft;
        
        // 目標位置から大きくずれていたら（1px以上）目標位置に戻す
        if (Math.abs(currentPosition - targetPosition) > 1) {
          container.scrollLeft = targetPosition;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: false });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying]);

  // 再生機能の実装
  const handlePlay = () => {
    if (!scrollContainerRef.current || isPlaying) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    const container = scrollContainerRef.current;

    // 左端にスムーズスクロール
    container.scrollTo({
      left: 0,
      behavior: 'smooth'
    });

    // スクロール完了を確認してから待機
    const checkScrollComplete = () => {
      let lastScrollLeft = container.scrollLeft;
      let stableFrameCount = 0;
      const requiredStableFrames = 3; // 3フレーム連続で位置が変わらなければ完了とみなす

      const checkFrame = () => {
        const currentScrollLeft = container.scrollLeft;
        
        // スクロール位置が0に近い（1px以内）かつ、位置が安定しているか確認
        if (Math.abs(currentScrollLeft) < 1) {
          if (Math.abs(currentScrollLeft - lastScrollLeft) < 0.1) {
            stableFrameCount++;
            if (stableFrameCount >= requiredStableFrames) {
              // 左端へのスクロール完了 - 目標位置を0に設定
              currentScrollTargetRef.current = 0;
              
          // スクロール完了を確認、1.5秒待機してから自動スクロール開始
          timeoutIdRef.current = setTimeout(() => {
            const startScrollLeft = container.scrollLeft;
            // 右端の計算: scrollWidth - clientWidth でスクロール可能な最大位置を取得
            const endScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
            const scrollDistance = endScrollLeft - startScrollLeft;
            const duration = 9000; // 9秒
            const startTime = Date.now();

            const animateScroll = () => {
              // コンテナが存在するか確認
              if (!container) {
                setIsPlaying(false);
                animationFrameIdRef.current = null;
                return;
              }

              const elapsed = Date.now() - startTime;
              const scrollProgress = Math.min(elapsed / duration, 1);
              
              // イージング関数（ease-in-out）
              const easeInOut = (t: number) => {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              };
              
              const easedProgress = easeInOut(scrollProgress);
              const currentScrollLeft = startScrollLeft + scrollDistance * easedProgress;
              
              // 目標位置を更新
              currentScrollTargetRef.current = currentScrollLeft;
              
              // scrollLeftを更新
              container.scrollLeft = currentScrollLeft;

              if (scrollProgress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(animateScroll);
              } else {
                // スクロール完了 - 最終位置を確実に設定
                container.scrollLeft = endScrollLeft;
                currentScrollTargetRef.current = endScrollLeft;
                setIsPlaying(false);
                isPlayingRef.current = false;
                animationFrameIdRef.current = null;
                currentScrollTargetRef.current = null;
              }
            };

            animationFrameIdRef.current = requestAnimationFrame(animateScroll);
          }, 1500); // 1.5秒待機
              return;
            }
          } else {
            stableFrameCount = 0;
          }
        } else {
          stableFrameCount = 0;
        }
        
        lastScrollLeft = currentScrollLeft;
        requestAnimationFrame(checkFrame);
      };

      requestAnimationFrame(checkFrame);
    };

    checkScrollComplete();
  };

  return (
    <div className="mt-10 w-full mx-auto pb-5" style={{ maxWidth: "76rem" }}>
      <div 
        className="relative w-full border border-black px-2 py-2"
      >
        <div className="absolute top-[18px] left-0 right-0 flex items-center justify-center gap-3 z-30">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            Learning Timeline
          </h3>
          {/* 再生ボタン */}
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`relative rounded-full bg-black p-2 text-white transition-all duration-200 hover:opacity-80 active:scale-95 ${
              isPlaying ? "animate-pulse-scale" : ""
            }`}
            style={isPlaying ? { opacity: 1 } : {}}
            aria-label={isPlaying ? "再生中" : "再生"}
          >
          {/* 再生アイコン（三角形） */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          </button>
        </div>
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden timeline-scrollbar" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            paddingLeft: "60px", // 左側の目盛りが見えるように透明な空白を追加
            paddingRight: "120px", // 右側の目盛りと「現在」の位置の要素が見えるように透明な空白を追加
            pointerEvents: isPlaying ? 'none' : 'auto' // 再生中はスクロール操作を無効化
          }}
        >
        <div 
          className="relative mx-auto px-4" 
          style={{ 
            height: `${timelineHeight}px`,
            minWidth: `${minTimelineWidth}px`,
            width: "100%",
            paddingTop: "60px",
            paddingBottom: "0px"
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
          // ラベルを線の内側（コンテナ内）に配置するための計算
          // 上側の線（lineHeight < 0）: ラベルを線の上側（コンテナ上部方向）に配置
          // 下側の線（lineHeight > 0）: ラベルを線の下側（コンテナ下部方向）に配置
          const labelOffset = isAbove ? -4 : 12;
          const labelTransform = isAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";
          
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
                  transform: labelTransform,
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

