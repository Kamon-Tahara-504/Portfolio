"use client";

import { useContext } from "react";
import { Project } from "@/types/project";
import { ViewContext } from "@/components/Layout";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import {
  bodyText,
  modalBackdrop,
  modalCloseButton,
  modalPanel,
} from "@/lib/portfolioViewStyles";
import ProjectModalDate from "./ProjectModal/ProjectModalDate";
import ProjectModalImage from "./ProjectModal/ProjectModalImage";
import ProjectModalLinks from "./ProjectModal/ProjectModalLinks";
import ProjectModalTechnologies from "./ProjectModal/ProjectModalTechnologies";
import { getTvPowerAnimationClass, useModalLifecycle } from "@/hooks/useModalLifecycle";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { viewMode } = usePortfolioView();
  const viewContext = useContext(ViewContext);
  const { isOpen, isClosing, handleClose } = useModalLifecycle({
    onClose,
    setIsModalOpen: viewContext?.setIsModalOpen,
  });

  return (
    <div
      className={`${modalBackdrop(viewMode)} z-[100] flex items-center justify-center p-3 transition-opacity duration-300 ease-out sm:p-4 lg:p-6 ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`${modalPanel(viewMode)} h-[94vh] max-h-[94vh] w-full max-w-[min(1240px,96vw)] select-none md:h-[88vh] md:max-h-[88vh] lg:h-[84vh] lg:max-h-[84vh] ${getTvPowerAnimationClass(isOpen, isClosing)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className={modalCloseButton(viewMode)}
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="grid min-h-full w-full grid-cols-1 items-start gap-6 py-3 sm:py-4 lg:grid-cols-2 lg:items-center lg:gap-10">
            {project.images && project.images.length > 0 && (() => {
              const modalImage = project.images[0];
              const imageSrc = modalImage.startsWith("/")
                ? `${basePath}${modalImage}`
                : modalImage;
              return (
                <ProjectModalImage projectTitle={project.title} imageSrc={imageSrc} />
              );
            })()}

            <div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
              <h2 className="text-[clamp(1.85rem,4vw,2.4rem)] font-bold tracking-tight">
                {project.title}
              </h2>
              <p className={`text-sm leading-relaxed whitespace-pre-line sm:text-base ${bodyText(viewMode)}`}>
                {project.description}
              </p>
              <ProjectModalTechnologies technologies={project.technologies} />
              <ProjectModalLinks links={project.links} basePath={basePath} />
              <ProjectModalDate date={project.date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
