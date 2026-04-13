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
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md transition-opacity duration-300 ease-out sm:p-4 lg:p-6 ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className={`relative h-[94vh] max-h-[94vh] w-full max-w-[min(1240px,96vw)] select-none rounded-2xl border border-zinc-300/20 bg-zinc-950/95 text-zinc-100 shadow-2xl md:h-[88vh] md:max-h-[88vh] lg:h-[84vh] lg:max-h-[84vh] ${
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
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/30 bg-zinc-900/90 text-zinc-100 shadow-md transition-[transform,box-shadow] duration-200 hover:bg-zinc-800 active:translate-y-0.5 active:shadow-sm sm:right-4 sm:top-4"
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="grid min-h-full w-full grid-cols-1 items-start gap-6 py-3 sm:py-4 lg:grid-cols-2 lg:items-center lg:gap-10">
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
            <div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
              {/* タイトル */}
              <h2 className="text-[clamp(1.85rem,4vw,2.4rem)] font-bold tracking-tight">
                {project.title}
              </h2>

              {/* 説明文 */}
              <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-300 sm:text-base">
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

