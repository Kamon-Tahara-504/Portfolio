"use client";

import { ProjectDateRange } from "@/types/project";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year} / ${month} / ${day}`;
}

export default function ProjectModalDate({
  date,
}: {
  date: string | ProjectDateRange;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
        Date
      </h3>
      {typeof date === "string" ? (
        <p className="font-semibold text-black/70">
          {new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : (
        <div className="space-y-2 font-semibold text-black/70">
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

