"use client";

import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { modalHeading, mutedText, tagPill } from "@/lib/portfolioViewStyles";

export default function ProjectModalTechnologies({
  technologies,
}: {
  technologies: string[];
}) {
  const { viewMode } = usePortfolioView();

  return (
    <div>
      <h3 className={`mb-4 ${modalHeading(viewMode)}`}>Technologies</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span key={tech} className={tagPill(viewMode)}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
