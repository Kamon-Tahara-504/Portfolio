'use client';

import { useState, useEffect } from 'react';

export default function EngineerExperienceCard() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 2022年5月1日 00:00:00 を基準日として設定
    const startDate = new Date('2022-05-01T00:00:00');
    
    const updateSeconds = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      setSeconds(diff);
    };

    // 初回実行
    updateSeconds();

    // 1秒ごとに更新
    const interval = setInterval(updateSeconds, 1000);

    return () => clearInterval(interval);
  }, []);

  // 秒数を年、日、時間、分、秒に変換
  const formatDuration = (totalSeconds: number) => {
    const startDate = new Date('2022-05-01T00:00:00');
    const now = new Date();
    
    // 年数を計算（うるう年を考慮して平均365.25日/年を使用）
    const daysInYear = 365.25;
    const secondsInYear = daysInYear * 24 * 60 * 60;
    const years = Math.floor(totalSeconds / secondsInYear);
    let remainingSeconds = totalSeconds % secondsInYear;
    
    // 日数を計算
    const secondsInDay = 24 * 60 * 60;
    const days = Math.floor(remainingSeconds / secondsInDay);
    remainingSeconds = remainingSeconds % secondsInDay;
    
    // 時間を計算
    const secondsInHour = 60 * 60;
    const hours = Math.floor(remainingSeconds / secondsInHour);
    remainingSeconds = remainingSeconds % secondsInHour;
    
    // 分を計算
    const minutes = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    
    return { years, days, hours, minutes, seconds: secs };
  };

  const duration = formatDuration(seconds);

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-black bg-white px-4 py-2 shadow-sm">
      <span className="text-xs font-medium text-black/70 md:text-sm">
        エンジニア歴
      </span>
      <span className="text-sm font-bold text-black md:text-base">
        {duration.years}年 {duration.days}日 {duration.hours}時間 {duration.minutes}分 {duration.seconds}秒
      </span>
    </div>
  );
}

