"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";
import BubbleParticles from "./BubbleParticles";
import FixedVideoBackground from "./FixedVideoBackground";

interface LayoutProps {
  children: React.ReactNode;
}

/** スタートボタン押下時のみスクロールロックを有効にするためのコンテキスト */
export const ScrollLockContext = createContext<{
  hasClickedStartRef: React.MutableRefObject<boolean>;
} | null>(null);

/** スクロール範囲外に出たときだけ、スクロールが止まった後に補正する（毎フレーム補正しないので重くならない） */
const SCROLL_CORRECT_TOLERANCE = 5; // このピクセル以上はみ出していたら補正
const SCROLL_SETTLE_MS = 120; // スクロールが止まってからこの時間後に補正

export default function Layout({ children }: LayoutProps) {
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasClickedStartRef = useRef(false);
  const lockCorrectRafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // ロック境界ではみ出している間だけ毎フレーム補正するループ（慣性に負けない）
    const startLockCorrectLoop = () => {
      if (!hasClickedStartRef.current) return;
      if (lockCorrectRafIdRef.current != null) return;
      const loop = () => {
        const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
        const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;
        if (scrollTop < clientHeight - SCROLL_CORRECT_TOLERANCE) {
          window.scrollTo({ top: clientHeight, left: 0, behavior: "auto" });
        }
        const nextScrollTop = window.scrollY ?? document.documentElement.scrollTop;
        if (nextScrollTop < clientHeight - SCROLL_CORRECT_TOLERANCE) {
          lockCorrectRafIdRef.current = requestAnimationFrame(loop);
        } else {
          lockCorrectRafIdRef.current = null;
        }
      };
      lockCorrectRafIdRef.current = requestAnimationFrame(loop);
    };

    const correctIfOutOfBounds = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      // スタート押下前: ヒーローから動かさない
      if (!hasClickedStartRef.current && scrollTop > SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, 0);
        return;
      }
      // スタート押下後の上方向ロックは補正ループで毎フレーム取り戻す
      if (
        hasClickedStartRef.current &&
        scrollTop < clientHeight - SCROLL_CORRECT_TOLERANCE
      ) {
        startLockCorrectLoop();
        return;
      }

      if (scrollTop < -SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, 0);
      } else if (scrollTop > maxScroll + SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, maxScroll);
      }
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;

      // スタート押下前: ヒーローから動いたら即トップに戻す
      if (!hasClickedStartRef.current && scrollTop > SCROLL_CORRECT_TOLERANCE) {
        window.scrollTo(0, 0);
        return;
      }
      // スタート押下後: 上方向ロックは補正ループで毎フレーム取り戻す
      if (
        hasClickedStartRef.current &&
        scrollTop < clientHeight - SCROLL_CORRECT_TOLERANCE
      ) {
        startLockCorrectLoop();
        return;
      }

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        correctIfOutOfBounds();
      }, SCROLL_SETTLE_MS);
    };

    // スタート押下前: ホイールで一切スクロールさせない / スタート押下後: 上方向のみブロック
    const onWheel = (e: WheelEvent) => {
      if (!hasClickedStartRef.current) {
        e.preventDefault();
        return;
      }
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;
      if (scrollTop <= clientHeight && e.deltaY < 0) {
        e.preventDefault();
      }
    };
    let lastTouchY = 0;
    const saveTouchY = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    // スタート押下前: タッチで一切スクロールさせない / スタート押下後: 上方向のみブロック
    const onTouchMove = (e: TouchEvent) => {
      if (!hasClickedStartRef.current) {
        e.preventDefault();
        return;
      }
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const clientHeight = window.innerHeight ?? document.documentElement.clientHeight;
      if (scrollTop > clientHeight) {
        lastTouchY = e.touches[0]?.clientY ?? 0;
        return;
      }
      const currentY = e.touches[0]?.clientY ?? 0;
      if (currentY > lastTouchY) {
        e.preventDefault();
      }
      lastTouchY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", saveTouchY, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", saveTouchY);
      window.removeEventListener("touchmove", onTouchMove);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (lockCorrectRafIdRef.current != null) {
        cancelAnimationFrame(lockCorrectRafIdRef.current);
        lockCorrectRafIdRef.current = null;
      }
    };
  }, []);

  return (
    <ScrollLockContext.Provider value={{ hasClickedStartRef }}>
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
    </ScrollLockContext.Provider>
  );
}

