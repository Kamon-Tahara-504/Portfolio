"use client";

interface TimelineRulerProps {
  yearMarks: Array<{ year: number; position: number }>;
  monthlyTickPositions: number[];
  baseLineTop: number;
}

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
          className="absolute w-px bg-black/20"
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
            className="mx-auto w-px bg-black/30"
            style={{
              height: "10px",
              marginBottom: "4px",
            }}
          />
          <div
            className="text-xs font-medium text-white md:text-sm bg-black px-2 rounded"
            style={{
              lineHeight: "1.2",
              zIndex: 10,
            }}
          >
            {mark.year}
          </div>
          <div
            className="mx-auto w-px bg-black/30"
            style={{
              height: "10px",
              marginTop: "4px",
            }}
          />
        </div>
      ))}

      <div
        className="absolute w-full bg-black"
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
