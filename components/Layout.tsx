"use client";

import React, { useEffect } from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // スクロール範囲外へのスクロールを防止
  useEffect(() => {
    const getScrollBounds = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      return {
        min: 0,
        max: Math.max(0, scrollHeight - clientHeight),
      };
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const bounds = getScrollBounds();
      
      // 最小値（0）を下回らないように制限
      if (scrollTop < bounds.min) {
        window.scrollTo({ top: bounds.min, behavior: "auto" });
        return;
      }
      
      // 最大値を超えないように制限
      if (scrollTop > bounds.max) {
        window.scrollTo({ top: bounds.max, behavior: "auto" });
        return;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const bounds = getScrollBounds();
      
      // 上方向へのスクロールで範囲外に出ようとする場合のみ制限
      if (e.deltaY < 0 && scrollTop <= bounds.min) {
        e.preventDefault();
        return;
      }
      
      // 下方向へのスクロールで範囲外に出ようとする場合のみ制限
      if (e.deltaY > 0 && scrollTop >= bounds.max) {
        e.preventDefault();
        return;
      }
    };

    // スクロール位置を監視して制限（passive: trueでパフォーマンスを維持）
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // wheelイベントで範囲外へのスクロールを防ぐ（正常なスクロールは許可）
    window.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <VideoColorProvider>
      <div className="min-h-screen bg-white text-black">
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-black bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-black/60">
            <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </VideoColorProvider>
  );
}

