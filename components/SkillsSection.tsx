"use client";

import { Skills } from "@/types/profile";
import SkillsTimeline from "./SkillsTimeline";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

interface SkillsSectionProps {
  skills: Skills;
}

interface SkillCategoryItemProps {
  category: { name: string; skills: any[] };
  index: number;
}

function SkillCategoryItem({ category, index }: SkillCategoryItemProps) {
  const categoryRef = useFadeInOnScroll({ delay: 100 * (index + 1) });

  return (
    <div 
      ref={categoryRef.ref as React.RefObject<HTMLDivElement>}
      className={`fade-in-on-scroll ${categoryRef.isVisible ? 'visible' : ''}`}
    >
      <h3 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
        {category.name}
      </h3>
      <div className="space-y-6">
        {category.skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 将来のアイコン挿入用のスペース */}
                <div className="h-6 w-6 flex-shrink-0" />
                <span className="text-sm font-medium text-black md:text-base">
                  {skill.name}
                </span>
              </div>
              <span className="text-xs text-black/60 md:text-sm">
                {skill.level}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-black/10">
              <div
                className="h-full bg-black transition-all"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const skillCategories = [
    { name: "Frontend", skills: skills.frontend },
    { name: "Backend", skills: skills.backend },
    { name: "Mobile", skills: skills.mobile },
    { name: "Tools", skills: skills.tools },
  ];

  const titleRef = useFadeInOnScroll({ delay: 0 });
  const timelineRef = useFadeInOnScroll({ delay: 500 });

  return (
    <section
      id="skills"
      className="border-b border-black bg-white py-48 md:py-56"
    >
      <div className="mx-auto max-w-7-5xl px-6">
        <h2 
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-on-scroll ${titleRef.isVisible ? 'visible' : ''}`}
        >
          Skills
        </h2>
        <div className="mt-20 grid gap-12 md:grid-cols-4">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCategoryItem key={category.name} category={category} index={categoryIndex} />
          ))}
        </div>
        <div 
          ref={timelineRef.ref as React.RefObject<HTMLDivElement>}
          className={`mt-20 fade-in-on-scroll ${timelineRef.isVisible ? 'visible' : ''}`}
        >
          <SkillsTimeline skills={skills} />
        </div>
      </div>
    </section>
  );
}
