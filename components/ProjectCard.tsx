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
      className="group relative block w-full aspect-[3/4] overflow-hidden rounded-xl bg-black/5 text-left transition-transform hover:scale-[1.02]"
    >
      {/* カード全体に画像を表示（フルブリード） */}
      {project.images && project.images.length > 0 ? (
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <span className="text-black/20">No Image</span>
        </div>
      )}

      {/* カテゴリーバッジ（上部右） */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-white px-3 py-1 text-xs font-medium text-black border border-black rounded">
          {categoryLabel}
        </span>
      </div>

      {/* テキストエリア（下部に浮遊） */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10 bg-black rounded-xl p-4 md:p-6 flex flex-col">
        <h3 className="mb-2 text-lg md:text-xl font-bold tracking-tight text-white line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs md:text-sm text-white/80 line-clamp-2">
          {project.description}
        </p>
      </div>
    </button>
  );
}

