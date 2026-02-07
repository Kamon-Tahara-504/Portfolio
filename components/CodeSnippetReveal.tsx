"use client";

import React from "react";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

const DEFAULT_LINES = [
  "const build = () => ({",
  "  stack: \"Next.js, React, TypeScript\",",
  "  ship: () => deploy(),",
  "});",
];

interface CodeSnippetRevealProps {
  lines?: string[];
  className?: string;
}

export default function CodeSnippetReveal({ lines = DEFAULT_LINES, className = "" }: CodeSnippetRevealProps) {
  const { ref, isVisible } = useFadeInOnScroll({ delay: 150 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement | null>}
      className={`code-snippet-reveal fade-in-on-scroll ${isVisible ? "visible" : ""} ${className}`}
    >
      <div className="rounded-lg border border-black/20 bg-black/5 px-4 py-3 font-mono text-sm text-black/90 md:text-base">
        {lines.map((line, index) => (
          <div
            key={index}
            className="code-snippet-line"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
