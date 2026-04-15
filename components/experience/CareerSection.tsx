"use client";

import { useEffect, useRef, useState } from "react";
import { Experience } from "@/types/profile";

// Careerセクションの入力。
interface CareerSectionProps {
  experiences: Experience[];
}

// タイムライン接続線1本分の座標定義。
type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// モバイル縦線: 先頭・末尾ノードの中心 y のみを結ぶ範囲。
type MobileVLine = {
  top: number;
  height: number;
};

// 経歴カードと接続線を並べて表示するセクション。
export default function CareerSection({ experiences }: CareerSectionProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [mobileVLine, setMobileVLine] = useState<MobileVLine | null>(null);

  useEffect(() => {
    const updateSegments = () => {
      const listElement = listRef.current;
      if (!listElement) return;

      const listRect = listElement.getBoundingClientRect();
      const points = nodeRefs.current
        .map((node) => {
          if (!node) return null;
          const rect = node.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - listRect.left,
            y: rect.top + rect.height / 2 - listRect.top,
          };
        })
        .filter((point): point is { x: number; y: number } => point !== null);

      const nextSegments = points.slice(0, -1).map((point, index) => ({
        x1: point.x,
        y1: point.y,
        x2: points[index + 1].x,
        y2: points[index + 1].y,
      }));

      setSegments(nextSegments);

      if (points.length >= 2) {
        const yFirst = points[0].y;
        const yLast = points[points.length - 1].y;
        setMobileVLine({
          top: Math.min(yFirst, yLast),
          height: Math.abs(yLast - yFirst),
        });
      } else {
        setMobileVLine(null);
      }
    };

    updateSegments();
    const rafId = window.requestAnimationFrame(updateSegments);
    const listElement = listRef.current;
    const observer = listElement ? new ResizeObserver(() => updateSegments()) : null;
    if (listElement && observer) {
      observer.observe(listElement);
    }
    window.addEventListener("resize", updateSegments);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateSegments);
    };
  }, [experiences]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <p className="max-w-4xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        学習歴と所属歴を時系列で整理し、星座をたどるように成長の流れを可視化しています。
      </p>
      <div className="mx-auto w-full">
        {/* モバイル: セクション左右パディング分だけ左へ張り出し、ノード・接続線を画面左ギリギリへ */}
        <div
          ref={listRef}
          className="relative space-y-1.5 max-md:-ml-4 max-md:w-[calc(100%+1rem)] max-md:[--career-gutter:1.25rem] sm:max-md:-ml-6 sm:max-md:w-[calc(100%+1.5rem)] md:ml-0 md:w-full md:space-y-2"
        >
          {/* md+: ノード座標で斜め／折れ線。モバイルは下の CSS 縦線のみ（getBoundingClientRect とノードの x が僅かにずれるのを避ける） */}
          <div className="pointer-events-none absolute inset-0 max-md:hidden" aria-hidden>
            {segments.map((segment, index) => {
              const dx = segment.x2 - segment.x1;
              const dy = segment.y2 - segment.y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <div
                  key={`career-line-${index}`}
                  className="absolute left-0 top-0"
                  style={{
                    left: `${segment.x1}px`,
                    top: `${segment.y1}px`,
                    width: `${length}px`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "0 0",
                  }}
                >
                  <span className="absolute left-0 top-0 block h-[4px] w-full -translate-y-1/2 rounded-full bg-zinc-100/20" />
                  <span className="absolute left-0 top-0 block h-[1.2px] w-full -translate-y-1/2 rounded-full bg-zinc-100/70" />
                </div>
              );
            })}
          </div>

          {/* モバイル: 先頭〜末尾ノードの中心 y だけを結ぶ縦線（listRef 全高の inset-y だと点をはみ出す） */}
          {mobileVLine && mobileVLine.height > 0 ? (
            <div
              aria-hidden
              style={{ top: mobileVLine.top, height: mobileVLine.height }}
              className="pointer-events-none absolute left-[calc(var(--career-gutter)/2)] z-[1] hidden w-0 -translate-x-1/2 max-md:block md:hidden"
            >
              <span className="absolute inset-y-0 left-1/2 block w-1 -translate-x-1/2 rounded-full bg-zinc-100/20" />
              <span className="absolute inset-y-0 left-1/2 block w-[1.2px] -translate-x-1/2 bg-zinc-100/70" />
            </div>
          ) : null}

          {experiences.map((item, index) => (
            <article key={item.id} className="relative min-h-[120px] sm:min-h-[118px]">
              <span
                className={`pointer-events-none absolute top-1/2 z-10 block -translate-x-1/2 -translate-y-1/2 ${
                  index % 2 === 0
                    ? /* モバイル: カード左余白（--career-gutter）の水平中央＝線・ノードと整合 */
                      "max-md:left-[calc(var(--career-gutter)/2)] md:left-[calc(50%_-_2.2rem)]"
                    : "max-md:left-[calc(var(--career-gutter)/2)] md:left-[calc(50%_+_2.2rem)]"
                }`}
                aria-hidden
              >
                <span
                  ref={(node) => {
                    nodeRefs.current[index] = node;
                  }}
                  className="block h-3 w-3 rounded-full bg-zinc-100 shadow-[0_0_0_1px_rgba(24,24,27,0.85)]"
                />
                <span className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100/20 blur-sm" />
              </span>

              {/* モバイル: ノード＋グロー外側まで詰めた左マージン（ml-16 より左へ。重ならない最小付近） */}
              <div
                className={`flex max-md:ml-[var(--career-gutter)] max-md:min-w-0 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                    className={`w-full min-w-0 rounded-2xl border border-zinc-300/20 bg-black/30 px-3.5 py-3 backdrop-blur-[2px] md:w-[calc(50%-5.5rem)] md:px-4 ${
                    index % 2 === 0
                      ? index % 4 === 0
                        ? "md:translate-x-2"
                        : "md:-translate-x-1"
                      : index % 4 === 1
                        ? "md:-translate-x-3"
                        : "md:translate-x-1"
                  }`}
                >
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-1 text-left">
                    <h3 className="text-base leading-none font-semibold text-white sm:text-lg md:text-xl">{item.title}</h3>
                    <p className="text-xs font-medium text-zinc-300 sm:text-sm md:text-base">{item.period}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed font-medium whitespace-pre-line text-zinc-200 sm:text-sm">
                    {item.company}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
