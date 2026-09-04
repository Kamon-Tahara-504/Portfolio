"use client";

import { useState, useEffect } from "react";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { mutedText, surfaceCard, viewClass } from "@/lib/portfolioViewStyles";

export default function EngineerExperienceCard() {
  const { viewMode } = usePortfolioView();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const startDate = new Date("2022-05-01T00:00:00");

    const updateSeconds = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      setSeconds(diff);
    };

    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (totalSeconds: number) => {
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
  };

  const duration = formatDuration(seconds);

  return (
    <div
      className={`flex w-[300px] flex-shrink-0 items-center px-3 py-2 shadow-sm md:w-[340px] max-[1129px]:hidden ${surfaceCard(viewMode)}`}
    >
      <span className={`text-xs font-semibold md:text-sm whitespace-nowrap flex-shrink-0 ${mutedText(viewMode)}`}>
        エンジニア歴
      </span>
      <span
        className={`text-sm font-bold md:text-base tabular-nums whitespace-nowrap -ml-3 ${viewClass(viewMode, { personal: "text-zinc-100", recruiter: "text-foreground" })}`}
      >
        <span className="inline-block w-[3ch] text-right">{duration.years}</span>年
        <span className="inline-block w-[4ch] text-right">{duration.days}</span>日
        <span className="inline-block w-[2ch] text-right">{duration.hours}</span>時間
        <span className="inline-block w-[2ch] text-right">{duration.minutes}</span>分
        <span className="inline-block w-[2ch] text-right">{duration.seconds}</span>秒
      </span>
    </div>
  );
}
