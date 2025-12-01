"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import ProjectGrid from "./ProjectGrid";
import ProjectModal from "./ProjectModal";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="border-b border-black bg-white py-48 md:py-56"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl">
          Projects
        </h2>
        <ProjectGrid
          projects={projects}
          onProjectClick={(project: Project) => setSelectedProject(project)}
        />
      </div>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

