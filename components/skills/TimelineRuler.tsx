"use client";

// 目盛り描画に必要な入力。
interface TimelineRulerProps {
  yearMarks: Array<{ year: number; position: number }>;
  monthlyTickPositions: number[];
  baseLineTop: number;
}

// 月/年目盛りと基準線を描画するルーラー。
export default function TimelineRuler({
  yearMarks,
  monthlyTickPositions,
  baseLineTop,
}: TimelineRulerProps) {
  return (
    <>
      {monthlyTickPositions.map((position, index) => (
        <div
          key={`month-tick-${index}`}
          className="absolute w-px bg-zinc-300/25"
          style={{
            left: `${position}%`,
            top: `${baseLineTop + 1}px`,
            height: "6px",
            transform: "translateX(-50%) translateY(-50%)",
            zIndex: 2,
          }}
          aria-hidden
        />
      ))}

      {yearMarks.map((mark, index) => (
        <div
          key={`mark-${index}`}
          className="absolute"
          style={{
            left: `${mark.position}%`,
            top: `${baseLineTop + 1}px`,
            transform: "translateX(-50%) translateY(-50%)",
            zIndex: 20,
          }}
        >
          <div
            className="mx-auto w-px bg-zinc-300/35"
            style={{
              height: "10px",
              marginBottom: "4px",
            }}
          />
          <div
            className="rounded border border-zinc-300/30 bg-zinc-900/85 px-2 text-xs font-semibold text-zinc-100 md:text-sm"
            style={{
              lineHeight: "1.2",
              zIndex: 10,
            }}
          >
            {mark.year}
          </div>
          <div
            className="mx-auto w-px bg-zinc-300/35"
            style={{
              height: "10px",
              marginTop: "4px",
            }}
          />
        </div>
      ))}

      <div
        className="absolute w-full bg-zinc-300/35"
        style={{
          top: `${baseLineTop}px`,
          left: 0,
          height: "2.5px",
          zIndex: 1,
        }}
      />
    </>
  );
}
