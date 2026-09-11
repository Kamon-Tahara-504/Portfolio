"use client";

import { useEffect, useState } from "react";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { fixedLabel } from "@/lib/portfolioViewStyles";

// 学習開始日（エンジニア歴の起算点）。
const LEARNING_START_DATE = new Date("2022-05-01T00:00:00");

function formatDuration(totalSeconds: number) {
  const daysInYear = 365.25;
  const secondsInYear = daysInYear * 24 * 60 * 60;
  const years = Math.floor(totalSeconds / secondsInYear);
  let remainingSeconds = totalSeconds % secondsInYear;

  const secondsInDay = 24 * 60 * 60;
  const days = Math.floor(remainingSeconds / secondsInDay);
  remainingSeconds = remainingSeconds % secondsInDay;

  const secondsInHour = 60 * 60;
  const hours = Math.floor(remainingSeconds / secondsInHour);
  remainingSeconds = remainingSeconds % secondsInHour;

  const minutes = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  return { years, days, hours, minutes, seconds: secs };
}

// 右端の縦書きラベル。リニューアル表示と同じ見た目で学習時間が秒更新される。
export default function FixedExperienceLabel() {
  const { viewMode, zoomCompensation } = usePortfolioView();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateSeconds = () => {
      const diff = Math.floor((Date.now() - LEARNING_START_DATE.getTime()) / 1000);
      setSeconds(Math.max(0, diff));
    };

    updateSeconds();
    const interval = window.setInterval(updateSeconds, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const duration = formatDuration(seconds);
  const label = `${duration.years}年 ${duration.days}日 ${duration.hours}時間 ${duration.minutes}分 ${duration.seconds}秒`;

  return (
    <p
      aria-label={`エンジニア歴 ${label}`}
      className={`pointer-events-none fixed top-1/2 right-1 z-20 hidden -translate-y-1/2 text-[10px] tracking-[0.24em] tabular-nums [writing-mode:vertical-rl] [text-orientation:mixed] md:block md:right-3 md:text-xs ${fixedLabel(viewMode)}`}
      style={{ zoom: zoomCompensation }}
    >
      {label}
    </p>
  );
}
