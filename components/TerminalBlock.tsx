"use client";

import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

const DEFAULT_LINES = [
  { type: "command" as const, text: "npm run dev" },
  { type: "output" as const, text: "> next dev -p 4000" },
  { type: "output" as const, text: "✔ Ready in 1.2s" },
];

interface TerminalBlockProps {
  lines?: Array< { type: "command" | "output"; text: string } >;
  className?: string;
}

export default function TerminalBlock({ lines = DEFAULT_LINES, className = "" }: TerminalBlockProps) {
  const ref = useFadeInOnScroll({ delay: 100 });

  return (
    <div
      ref={ref.ref as React.RefObject<HTMLDivElement>}
      className={`fade-in-on-scroll ${ref.isVisible ? "visible" : ""} ${className}`}
    >
      <div
        className="rounded-xl border border-black bg-[#1e1e1e] px-4 py-3 font-mono text-sm shadow-lg md:text-base"
        role="img"
        aria-label="ターミナル: npm run dev の実行例"
      >
        <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs text-white/50">zsh</span>
        </div>
        <div className="space-y-1.5">
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex items-baseline gap-2"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {line.type === "command" && (
                <span className="select-none text-green-400">$</span>
              )}
              <span
                className={
                  line.type === "command"
                    ? "text-white"
                    : "text-white/80"
                }
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
