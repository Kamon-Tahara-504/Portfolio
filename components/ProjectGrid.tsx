"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

export interface ProjectGridProps {
  projects: Project[];
  category?: "all" | "web" | "mobile";
  onProjectClick?: (project: Project) => void;
  isGridVisible?: boolean;
}

export default function ProjectGrid({
  projects,
  category = "all",
  onProjectClick,
  isGridVisible = false,
}: ProjectGridProps) {
  const filteredProjects = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((project) => project.category === category),
    [category, projects]
  );

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

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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

