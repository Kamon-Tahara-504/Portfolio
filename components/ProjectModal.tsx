"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/project";

// basePathの定義（開発環境では空、本番環境では'/Portfolio'）
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

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

    // 背景のスクロールを防ぐ（htmlとbodyの両方に適用）
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const categoryLabel = project.category === "web" ? "Web" : "Mobile";

  // 日付を「YYYY / M / D」形式にフォーマット
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} / ${month} / ${day}`;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 touch-none"
      onClick={onClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className="relative w-full max-w-[90vw] h-[90vh] bg-white border border-black"
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
        <div className="h-full p-8 md:p-12 flex items-center">
          <div className="flex flex-col gap-12 md:flex-row md:items-center w-full">
            {/* 左側: 画像エリア */}
            {project.images && project.images.length > 0 && (
              <div className="relative w-full flex-shrink-0 overflow-hidden border border-black bg-black/5 md:w-1/2 aspect-[4/3]">
                <Image
                  src={(project.images.length > 1 ? project.images[1] : project.images[0]).startsWith('/') 
                    ? `${basePath}${project.images.length > 1 ? project.images[1] : project.images[0]}`
                    : (project.images.length > 1 ? project.images[1] : project.images[0])}
                  alt={project.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            {/* 右側: 情報エリア */}
            <div className="flex-1 space-y-6">
              {/* カテゴリバッジ */}
              <div className="flex items-center gap-3">
                <span className="bg-black px-4 py-2 text-sm font-medium text-white">
                  {categoryLabel}
                </span>
              </div>

              {/* タイトル */}
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {project.title}
              </h2>

              {/* 説明文 */}
              <p className="leading-relaxed text-black/80 md:text-lg whitespace-pre-line">
                {project.description}
              </p>

              {/* 技術スタック */}
              <div>
                <h3 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
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

              {/* URL */}
              {(project.links.github || project.links.demo || project.links.appStore) && (
                <div>
                  <h3 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
                    URL
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90 md:text-base"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-black bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5 md:text-base"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.links.appStore && (
                      <a
                        href={project.links.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-md bg-gradient-to-r from-blue-500 to-blue-600 p-[2px] transition-all hover:from-blue-600 hover:to-blue-700"
                      >
                        <span className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-gray-900 md:text-base">
                          <Image
                            src={`${basePath}/images/projects/appstore.png`}
                            alt="App Store"
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded-sm"
                          />
                          Apple Store
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 日付 */}
              <div>
                <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">Date</h3>
                {typeof project.date === "string" ? (
                  <p className="text-black/70">
                    {new Date(project.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                ) : (
                  <div className="space-y-2 text-black/70">
                    {project.date.startDate && (
                      <p>
                        開発開始日: {formatDate(project.date.startDate)}
                      </p>
                    )}
                    {project.date.endDate && (
                      <p>
                        開発終了日: {formatDate(project.date.endDate)}
                      </p>
                    )}
                    {project.date.releaseDate && (
                      <p>
                        リリース日: {formatDate(project.date.releaseDate)}
                      </p>
                    )}
                    {project.date.deployDate && (
                      <p>
                        デプロイ日: {formatDate(project.date.deployDate)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

