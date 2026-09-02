"use client";

import Image from "next/image";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { bodyText, mutedText, viewClass, worksCard } from "@/lib/portfolioViewStyles";
import { Project } from "@/types/project";
import { resolveAssetPath } from "@/lib/collectLocalAssetUrls";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

interface WorksSectionProps {
  workItems: Project[];
  onSelectProject: (project: Project) => void;
}

export default function WorksSection({ workItems, onSelectProject }: WorksSectionProps) {
  const { viewMode } = usePortfolioView();
  const isRecruiter = viewMode === "recruiter";

  return (
    <div className="space-y-3 sm:space-y-4">
      <p className={`max-w-3xl ${bodyText(viewMode)}`}>
        これまで取り組んだ制作実績をカード形式で整理して掲載しています。
      </p>
      <p className={`text-xs sm:text-sm ${mutedText(viewMode)}`}>
        横スクロールで閲覧できます。トラックパッドまたはShift + マウスホイールでも操作可能です。
      </p>
      <div className="works-scrollbar grid max-h-[36rem] grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-4 pr-2 snap-x snap-mandatory sm:max-h-[38rem] sm:gap-4">
        {workItems.map((work) => {
          const primaryImage = work.images[0] ?? "/images/projects/PlaceHolder.png";
          const imageSrc = resolveAssetPath(primaryImage, basePath);
          return (
            <button
              key={work.id}
              type="button"
              onClick={() => onSelectProject(work)}
              className={worksCard(viewMode)}
            >
              <span
                className={`absolute top-3 left-3 z-10 rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${
                  isRecruiter
                    ? "border-border bg-surface-muted text-foreground"
                    : "border-white/25 bg-black/50 text-zinc-100 backdrop-blur-sm"
                }`}
              >
                #{work.number ?? "00"}
              </span>
              <Image
                src={imageSrc}
                alt={`${work.title} preview`}
                fill
                sizes="220px"
                className="object-cover"
              />
              {!isRecruiter ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              ) : null}
              <div
                className={`absolute right-2.5 bottom-2.5 left-2.5 rounded-2xl border p-2.5 sm:right-3 sm:bottom-3 sm:left-3 sm:p-3 ${
                  isRecruiter
                    ? "border-border bg-surface/95"
                    : "border-white/15 bg-black/40 backdrop-blur-md"
                }`}
              >
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-zinc-900 uppercase sm:text-[10px]">
                    {work.category}
                  </span>
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-zinc-900 sm:text-[10px]">
                    {work.productionType === "collaborative" ? "共同制作" : "自主制作"}
                  </span>
                </div>
                <h2
                  className={`truncate text-[0.95rem] leading-tight font-semibold sm:text-[1.05rem] ${viewClass(viewMode, { personal: "text-white", recruiter: "text-foreground" })}`}
                >
                  {work.title}
                </h2>
                <div
                  className={`mt-1 overflow-hidden text-[11px] sm:text-xs ${viewClass(viewMode, { personal: "text-zinc-100/85", recruiter: "text-foreground-muted" })}`}
                >
                  <p className="works-catchphrase-track inline-flex w-max whitespace-nowrap">
                    <span className="pr-6">{work.catchphrase}</span>
                    <span aria-hidden="true" className="pr-6">
                      {work.catchphrase}
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
