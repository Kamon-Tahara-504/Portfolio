"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  /** 表示する全文 */
  text: string;
  /** 1文字あたりの表示間隔（ms） */
  speed?: number;
  /** タイピング開始までの遅延（ms） */
  startDelay?: number;
  /** タイピング完了後にカーソルを表示し続けるか */
  showCursor?: boolean;
}

export function useTypewriter({
  text,
  speed = 60,
  startDelay = 0,
  showCursor = true,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsComplete(true);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    indexRef.current = 0;
    setDisplayText("");
    setIsComplete(false);

    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1;
        setDisplayText(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsComplete(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [text, speed, startDelay]);

  return {
    displayText,
    isComplete,
    showCursor: showCursor && (isComplete || displayText.length > 0),
  };
}
