"use client";

import React, { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";

interface LayoutProps {
  children: React.ReactNode;
}

/** スクロール範囲外に出たときだけ、スクロールが止まった後に補正する（毎フレーム補正しないので重くならない） */
const SCROLL_CORRECT_TOLERANCE = 5; // このピクセル以上はみ出していたら補正
const SCROLL_SETTLE_MS = 120; // スクロールが止まってからこの時間後に補正

export default function Layout({ children }: LayoutProps) {
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const correctIfOutOfBounds = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      if (scrollTop < -SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, 0);
      } else if (scrollTop > maxScroll + SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, maxScroll);
      }
    };

    const handleScroll = () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        correctIfOutOfBounds();
      }, SCROLL_SETTLE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  return (
    <VideoColorProvider>
      <div className="min-h-screen bg-white text-black">
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-black bg-white">
          <div className="mx-auto max-w-7-5xl px-6 py-8 text-center text-sm text-black/60">
            <p>©︎ 2025 Kamon-Tahara-504</p>
            <p className="mt-2">Licensed under MIT License</p>
          </div>
        </footer>
      </div>
    </VideoColorProvider>
  );
}

