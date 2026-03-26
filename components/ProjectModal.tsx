"use client";

import { useEffect, useState, useContext } from "react";
import { Project } from "@/types/project";
import { ViewContext } from "./Layout";
import ProjectModalDate from "./ProjectModal/ProjectModalDate";
import ProjectModalImage from "./ProjectModal/ProjectModalImage";
import ProjectModalLinks from "./ProjectModal/ProjectModalLinks";
import ProjectModalTechnologies from "./ProjectModal/ProjectModalTechnologies";

// basePathの定義（開発環境では空、本番環境では'/Portfolio'）
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const viewContext = useContext(ViewContext);

  useEffect(() => {
    // マウント時にアニメーションをトリガー
    setIsOpen(true);
    viewContext?.setIsModalOpen(true);

    return () => {
      viewContext?.setIsModalOpen(false);
    };
  }, [viewContext]);

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

  const handleTouchMove = (e: React.TouchEvent) => {
    // Passive listener error を防ぐため、ここでは preventDefault しない
    // body { overflow: hidden } で背景スクロールは制御済み
  };

  const handleWheel = (e: React.WheelEvent) => {
    // 同上
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className={`relative w-full max-w-[95vw] md:max-w-[82vw] h-[92vh] md:h-[85vh] max-h-[92vh] md:max-h-[85vh] bg-white border border-black transition-all duration-300 ease-out select-none ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
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
        <div className="h-full overflow-y-auto p-4 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full items-start md:items-center min-h-full py-4">
            {/* 左側: 画像エリア（1枚目を表示） */}
            {project.images && project.images.length > 0 && (() => {
              const modalImage = project.images[0];
              const imageSrc = modalImage.startsWith("/")
                ? `${basePath}${modalImage}`
                : modalImage;
              return (
                <ProjectModalImage
                  projectTitle={project.title}
                  imageSrc={imageSrc}
                />
              );
            })()}

            {/* 右側: 情報エリア */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* タイトル */}
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {project.title}
              </h2>

              {/* 説明文 */}
              <p className="font-normal leading-relaxed text-sm text-black/80 md:text-base whitespace-pre-line">
                {project.description}
              </p>

              {/* 技術スタック */}
              <ProjectModalTechnologies technologies={project.technologies} />

              {/* URL */}
              <ProjectModalLinks links={project.links} basePath={basePath} />

              {/* 日付 */}
              <ProjectModalDate date={project.date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

