"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/project";
import ImageGallery from "./ImageGallery";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const categoryLabel = project.category === "web" ? "Web" : "Mobile";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-black bg-white text-black transition-colors hover:bg-black/5"
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="p-8 md:p-12">
          {/* ヘッダー */}
          <div className="mb-8 border-b border-black pb-6">
            <div className="mb-4">
              <span className="bg-black px-3 py-1 text-xs font-medium text-white">
                {categoryLabel}
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {project.title}
            </h2>
            <p className="mb-6 text-lg text-black/70">{project.description}</p>

            {/* リンク */}
            <div className="flex flex-wrap gap-4">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
                >
                  GitHub
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* 画像ギャラリー */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <ImageGallery images={project.images} alt={project.title} />
            </div>
          )}

          {/* 詳細情報 */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-black bg-white px-4 py-2 text-sm font-medium text-black"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight">Date</h3>
              <p className="text-black/70">
                {new Date(project.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

