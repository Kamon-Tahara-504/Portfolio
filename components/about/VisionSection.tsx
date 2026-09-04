"use client";

import VisionConceptEquation from "@/components/about/VisionConceptEquation";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { viewClass } from "@/lib/portfolioViewStyles";

interface VisionSectionProps {
  description: string;
}

export default function VisionSection({ description }: VisionSectionProps) {
  const { viewMode } = usePortfolioView();

  return (
    <div className="space-y-4 md:ml-8 lg:ml-12 xl:ml-16 2xl:ml-20">
      <p
        className={`text-sm font-semibold leading-relaxed whitespace-pre-line md:text-base ${viewClass(viewMode, {
          personal: "text-zinc-200",
          recruiter: "text-foreground",
        })}`}
      >
        {description}
      </p>
      <div className="hidden md:block">
        <VisionConceptEquation />
      </div>
    </div>
  );
}
