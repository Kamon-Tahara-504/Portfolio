import Image from "next/image";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const categoryLabel = project.category === "web" ? "Web" : "Mobile";

  return (
    <button
      onClick={() => onClick?.(project)}
      className="group relative block w-full overflow-hidden border border-black bg-white text-left transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-black/5">
            <span className="text-black/20">No Image</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-white px-3 py-1 text-xs font-medium text-black border border-black">
            {categoryLabel}
          </span>
        </div>
      </div>
      <div className="border-t border-black p-6">
        <h3 className="mb-2 text-xl font-bold tracking-tight">
          {project.title}
        </h3>
        <p className="mb-4 text-sm text-black/70 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs text-black/60 border border-black/20 px-2 py-1"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

