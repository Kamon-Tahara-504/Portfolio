"use client";

import { ProjectDateRange } from "@/types/project";

// 日付文字列をUI表示用フォーマットに変換する。
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year} / ${month} / ${day}`;
}

// プロジェクト日付（単日/期間）を表示するセクション。
export default function ProjectModalDate({
  date,
}: {
  date: string | ProjectDateRange;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
        Date
      </h3>
      {typeof date === "string" ? (
        <p className="font-semibold text-zinc-300">
          {new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : (
        <div className="space-y-2 font-semibold text-zinc-300">
          {date.startDate && <p>開発開始日: {formatDate(date.startDate)}</p>}
          {date.endDate && <p>開発終了日: {formatDate(date.endDate)}</p>}
          {date.releaseDate && (
            <p>リリース日: {formatDate(date.releaseDate)}</p>
          )}
          {date.deployDate && (
            <p>デプロイ日: {formatDate(date.deployDate)}</p>
          )}
        </div>
      )}
    </div>
  );
}

