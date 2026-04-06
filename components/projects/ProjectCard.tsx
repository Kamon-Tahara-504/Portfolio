"use client";

import React from "react";
import ProtectedImage from "@/components/ProtectedImage";
import ProjectCardDescription from "./ProjectCardDescription";
import { Project } from "@/types/project";
import { isComingSoonProject } from "@/lib/projectStatus";

// basePathの定義（開発環境では空、本番環境では'/Portfolio'）
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  index: number;
  shouldAnimate: boolean;
}

export default function ProjectCard({
  project,
  onClick,
  index,
  shouldAnimate,
}: ProjectCardProps) {
  const isComingSoon = isComingSoonProject(project);
  const categoryLabel = project.category === "web" ? "Web" : "Mobile";
  const productionLabel =
    project.productionType === "collaborative" ? "共同制作" : "自主制作";
  const descriptionText = project.catchphrase ?? project.description;
  const animationClass = `fade-in-on-scroll ${shouldAnimate ? "visible" : ""}`;
  const cardImagePath = isComingSoon
    ? "/images/projects/PlaceHolder.png"
    : project.images[0];
  const cardImageSrc = cardImagePath.startsWith("/")
    ? `${basePath}${cardImagePath}`
    : cardImagePath;
  const interactiveClass = isComingSoon
    ? "cursor-default"
    : "hover:scale-[1.02] hover:border-neutral-500 hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)] active:scale-[1.01] active:shadow-[0_8px_18px_rgba(0,0,0,0.14)]";

  return (
    <button
      type="button"
      onClick={() => {
        if (isComingSoon) return;
        onClick?.(project);
      }}
      className={`group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl bg-black/5 text-left border-2 border-black shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color,filter] duration-300 ${interactiveClass} ${animationClass}`}
      aria-disabled={isComingSoon}
      // 表示時は上から順に100ms刻み、巻き戻し時も同じディレイで戻る
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* カード全体に画像を表示（フルブリード） */}
      {cardImagePath ? (
        <ProtectedImage
          wrapperClassName="absolute inset-0"
          src={cardImageSrc}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <span className="text-black/20">No Image</span>
        </div>
      )}

      {/* テキストエリア（下部・黒リキッドグラス） */}
      <div className="absolute bottom-2 left-2 right-2 md:bottom-6 md:left-6 md:right-6 z-10 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl px-3 pt-2.5 pb-1.5 md:px-6 md:pt-4.5 md:pb-3 flex flex-col border border-white/10 shadow-lg">
        <div className="mb-1 md:mb-2 flex flex-wrap items-center gap-1">
          <span className="shrink-0 bg-white/90 px-1.5 py-0.5 text-[8px] md:px-2.5 md:text-xs font-bold text-black border border-white rounded">
            {categoryLabel}
          </span>
          <span className="shrink-0 bg-white/90 px-1.5 py-0.5 text-[8px] md:px-2.5 md:text-xs font-bold text-black border border-white rounded">
            {productionLabel}
          </span>
        </div>
        <h3 className="mb-1 md:mb-2 text-sm md:text-xl font-bold tracking-tight text-white line-clamp-1">
          {project.title}
        </h3>
        <ProjectCardDescription
          text={descriptionText}
          isComingSoon={isComingSoon}
        />
      </div>
    </button>
  );
}

