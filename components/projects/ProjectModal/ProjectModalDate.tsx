"use client";

import { ProjectDateRange } from "@/types/project";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { modalHeading, mutedText } from "@/lib/portfolioViewStyles";

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
  const { viewMode } = usePortfolioView();

  return (
    <div>
      <h3 className={`mb-2 ${modalHeading(viewMode)}`}>Date</h3>
      {typeof date === "string" ? (
        <p className={`font-semibold ${mutedText(viewMode)}`}>
          {new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : (
        <div className={`space-y-2 font-semibold ${mutedText(viewMode)}`}>
          {date.startDate && <p>開発開始日: {formatDate(date.startDate)}</p>}
          {date.endDate && <p>開発終了日: {formatDate(date.endDate)}</p>}
          {date.releaseDate && <p>リリース日: {formatDate(date.releaseDate)}</p>}
          {date.deployDate && <p>デプロイ日: {formatDate(date.deployDate)}</p>}
        </div>
      )}
    </div>
  );
}
