"use client";

import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

export interface ProjectGridProps {
  projects: Project[];
  category?: "all" | "web" | "mobile";
  onProjectClick?: (project: Project) => void;
}

export default function ProjectGrid({
  projects,
  category = "all",
  onProjectClick,
}: ProjectGridProps) {
  const filteredProjects =
    category === "all"
      ? projects
      : projects.filter((project) => project.category === category);

  if (filteredProjects.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-black/60">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
}

