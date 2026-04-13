"use client";

import { useContext } from "react";
import { Project } from "@/types/project";
import { ViewContext } from "@/components/Layout";
import ProjectModalDate from "./ProjectModal/ProjectModalDate";
import ProjectModalImage from "./ProjectModal/ProjectModalImage";
import ProjectModalLinks from "./ProjectModal/ProjectModalLinks";
import ProjectModalTechnologies from "./ProjectModal/ProjectModalTechnologies";
import { useModalLifecycle } from "@/hooks/useModalLifecycle";

// 画像URLのbasePath（開発は空、本番は /Portfolio）。
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

// モーダル表示に必要な入力。
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Layout側のモーダル開閉状態と同期する。
  const viewContext = useContext(ViewContext);
  const { isOpen, isClosing, handleClose } = useModalLifecycle({
    onClose,
    setIsModalOpen: viewContext?.setIsModalOpen,
  });

  const handleTouchMove = (e: React.TouchEvent) => {
    // Passive listener error を防ぐため、ここでは preventDefault しない
    // body { overflow: hidden } で背景スクロールは制御済み
  };

  const handleWheel = (e: React.WheelEvent) => {
    // 同上
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-opacity duration-300 ease-out ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className={`relative h-[92vh] max-h-[92vh] w-full max-w-[95vw] select-none rounded-2xl border border-zinc-300/20 bg-zinc-950/95 text-zinc-100 shadow-2xl md:h-[85vh] md:max-h-[85vh] md:max-w-[82vw] ${
          isClosing
            ? "animate-tv-close"
            : isOpen
            ? "animate-tv-open"
            : "scale-y-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/30 bg-zinc-900/90 text-zinc-100 shadow-md transition-[transform,box-shadow] duration-200 hover:bg-zinc-800 active:translate-y-0.5 active:shadow-sm"
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="h-full overflow-y-auto p-4 md:p-10">
          <div className="grid min-h-full w-full grid-cols-1 items-start gap-8 py-4 md:grid-cols-2 md:items-center md:gap-10">
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
            <div className="min-w-0 flex-1 space-y-6">
              {/* タイトル */}
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {project.title}
              </h2>

              {/* 説明文 */}
              <p className="text-sm leading-relaxed text-zinc-300 md:text-base whitespace-pre-line">
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

