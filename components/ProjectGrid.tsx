import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  category?: "all" | "web" | "mobile";
}

export default function ProjectGrid({
  projects,
  category = "all",
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

