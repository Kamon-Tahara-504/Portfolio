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

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月`;
}

function ExperienceItem({ exp, index }: ExperienceItemProps) {
  const expRef = useFadeInOnScroll({ delay: 100 * (index + 1) });
  const periodDisplay = exp.title === "現在" ? getCurrentYearMonth() : exp.period;

  return (
    <div
      ref={expRef.ref as React.RefObject<HTMLDivElement>}
      className={`relative pl-12 md:pl-20 fade-in-on-scroll ${expRef.isVisible ? "visible" : ""}`}
    >
      <div className="absolute left-6 top-4 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black md:left-8 md:h-3 md:w-3" />
      <div className="space-y-2 md:space-y-3">
        <div className="mb-3 md:mb-4">
          <div className="mb-1 flex flex-col gap-0.5 md:mb-2 md:flex-row md:items-baseline md:gap-4">
            <h3 className="text-xl font-bold tracking-tight md:text-3xl">{exp.title}</h3>
            <span className="text-xs font-semibold text-black/60 md:text-base">{periodDisplay}</span>
          </div>
          <div className="text-base font-semibold text-black/70 md:text-xl">
            {exp.company.split("\n").map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-black/80 md:text-lg">{exp.description}</p>
      </div>
    </div>
  );
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const titleRef = useFadeInOnScroll({ delay: 0 });

  return (
    <section id="experience" className="relative border-b border-black bg-transparent pt-24 pb-24 md:pt-28 md:pb-56">
      <GridPattern className="opacity-[0.07]" size={60} strokeWidth={0.5} />
      <div className="section-container-responsive relative z-10 mx-auto max-w-7-5xl px-6">
        <h2
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-10 text-center text-3xl font-bold tracking-tight md:mb-12 md:text-5xl fade-in-from-left section-title-blink section-title-responsive ${titleRef.isVisible ? "visible" : ""}`}
        >
          Experience
        </h2>
        <div className="mx-auto w-full max-w-5xl md:ml-auto md:mr-0">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-black/30 md:left-8" />
            <div className="space-y-12 md:space-y-16">
              {experience.map((exp, index) => (
                <ExperienceItem key={exp.id} exp={exp} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
