"use client";

import { Experience } from "@/types/profile";
import GridPattern from "./GridPattern";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

interface ExperienceSectionProps {
  experience: Experience[];
}

interface ExperienceItemProps {
  exp: Experience;
  index: number;
}

function ExperienceItem({ exp, index }: ExperienceItemProps) {
  const expRef = useFadeInOnScroll({ delay: 100 * (index + 1) });

  return (
    <div
      ref={expRef.ref as React.RefObject<HTMLDivElement>}
      className={`relative pl-16 md:pl-20 fade-in-on-scroll ${expRef.isVisible ? 'visible' : ''}`}
    >
      {/* タイムラインのドット */}
      <div className="absolute left-[25px] top-4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black md:left-[33px]" />
      <div className="space-y-3">
        <div className="mb-4">
          <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              {exp.title}
            </h3>
            <span className="text-sm font-medium text-black/60 md:text-base">
              {exp.period}
            </span>
          </div>
          <div className="text-lg font-medium text-black/70 md:text-xl">
            {exp.company.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <p className="leading-relaxed text-black/80 md:text-lg">
          {exp.description}
        </p>
      </div>
    </div>
  );
}

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  const titleRef = useFadeInOnScroll({ delay: 0 });

  return (
    <section
      id="experience"
      className="relative border-b border-black bg-white py-48 md:py-56"
    >
      <GridPattern className="opacity-20" size={60} strokeWidth={0.5} />
      <div className="relative mx-auto max-w-3-5xl px-6">
        <h2 
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-on-scroll ${titleRef.isVisible ? 'visible' : ''}`}
        >
          Experience
        </h2>
        <div className="relative">
          {/* タイムラインの縦線 */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-black/30 md:left-8" />
          <div className="space-y-16">
            {experience.map((exp, index) => (
              <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
