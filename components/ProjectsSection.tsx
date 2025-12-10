"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import ProjectGrid from "./ProjectGrid";
import ProjectModal from "./ProjectModal";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const titleRef = useFadeInOnScroll({ delay: 0 });
  const gridRef = useFadeInOnScroll({ delay: 200 });

  return (
    <section
      id="projects"
      className="border-b border-black bg-white py-48 md:py-56"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-on-scroll ${titleRef.isVisible ? 'visible' : ''}`}
        >
          Projects
        </h2>
        <div 
          ref={gridRef.ref as React.RefObject<HTMLDivElement>}
          className={`fade-in-on-scroll ${gridRef.isVisible ? 'visible' : ''}`}
        >
          <ProjectGrid
            projects={projects}
            onProjectClick={(project: Project) => setSelectedProject(project)}
            isGridVisible={gridRef.isVisible}
          />
        </div>
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

