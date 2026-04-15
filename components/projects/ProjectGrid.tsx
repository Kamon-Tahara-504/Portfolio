"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

// プロジェクト一覧表示の構成オプション。
export interface ProjectGridProps {
  projects: Project[];
  category?: "all" | "web" | "mobile";
  layout?: "grid" | "horizontalSnap";
  onProjectClick?: (project: Project) => void;
  isGridVisible?: boolean;
}

export default function ProjectGrid({
  projects,
  category = "all",
  layout = "grid",
  onProjectClick,
  isGridVisible = false,
}: ProjectGridProps) {
  // カテゴリ条件を反映した表示対象プロジェクト。
  const filteredProjects = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((project) => project.category === category),
    [category, projects]
  );

  // 各カードのアニメ開始フラグ配列。
  const [shouldAnimate, setShouldAnimate] = useState<boolean[]>(
    filteredProjects.map(() => false)
  );

  // filteredProjectsが変わったら初期化
  useEffect(() => {
    setShouldAnimate(filteredProjects.map(() => false));
  }, [filteredProjects]);

  // グリッドが見える/見えなくなるでドミノ式にフラグを立てる・外す
  useEffect(() => {
    if (filteredProjects.length === 0) return;

    const timeouts: NodeJS.Timeout[] = [];

    // 表示: 先頭→末尾へ100ms刻み
    if (isGridVisible) {
      filteredProjects.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
          setShouldAnimate((prev) => {
            const base =
              prev.length === filteredProjects.length
                ? prev
                : filteredProjects.map(() => false);
            const next = [...base];
            if (index < next.length) {
              next[index] = true;
            }
            return next;
          });
        }, index * 100);
        timeouts.push(timeoutId);
      });
    } else {
      // 非表示: 末尾→先頭へ100ms刻みでvisible解除
      const lastIndex = filteredProjects.length - 1;
      filteredProjects.forEach((_, idx) => {
        const index = lastIndex - idx; // 末尾から
        const timeoutId = setTimeout(() => {
          setShouldAnimate((prev) => {
            const base =
              prev.length === filteredProjects.length
                ? prev
                : filteredProjects.map(() => false);
            const next = [...base];
            if (index < next.length) {
              next[index] = false;
            }
            return next;
          });
        }, idx * 100);
        timeouts.push(timeoutId);
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [filteredProjects, isGridVisible]);

  if (filteredProjects.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-black/60">No projects found.</p>
      </div>
    );
  }

  if (layout === "horizontalSnap") {
    return (
      <div
        className="project-horizontal-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-6 md:gap-8 md:pb-6"
        aria-label="Projects horizontal carousel"
      >
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className="snap-start shrink-0 basis-[78%] sm:basis-[52%] md:basis-[36%] lg:basis-[28%]"
          >
            <ProjectCard
              project={project}
              onClick={onProjectClick}
              index={index}
              shouldAnimate={shouldAnimate[index] ?? false}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
      {filteredProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
          index={index}
          shouldAnimate={shouldAnimate[index] ?? false}
        />
      ))}
    </div>
  );
}

