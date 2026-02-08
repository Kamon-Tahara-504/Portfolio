"use client";

import React, { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";
import BubbleParticles from "./BubbleParticles";
import FixedVideoBackground from "./FixedVideoBackground";

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
      <FixedVideoBackground />
      <div className="relative z-10 min-h-screen text-black">
        <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
          <BubbleParticles />
        </div>
        <div className="relative z-20">
          <Navigation />
          <main>{children}</main>
        </div>
      </div>
    </VideoColorProvider>
  );
}

