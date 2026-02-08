"use client";

import { Skills, Skill } from "@/types/profile";
import SkillsTimeline from "./SkillsTimeline";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useCountUpAnimation } from "@/hooks/useCountUpAnimation";

interface SkillsSectionProps {
  skills: Skills;
}

interface SkillCategoryItemProps {
  category: { name: string; skills: Skill[] };
  index: number;
}

interface SkillItemProps {
  skill: Skill;
  isCategoryVisible: boolean;
  index: number;
}

function SkillItem({ skill, isCategoryVisible, index }: SkillItemProps) {
  const animatedValue = useCountUpAnimation({
    targetValue: skill.level,
    duration: 1500,
    delay: 100 * (index + 1),
    isVisible: isCategoryVisible,
  });

  const skillNameRef = useFadeInOnScroll({ 
    delay: 100 * (index + 1) 
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 将来のアイコン挿入用のスペース */}
          <div className="h-6 w-6 flex-shrink-0" />
          <span 
            ref={skillNameRef.ref as React.RefObject<HTMLSpanElement>}
            className={`text-sm font-medium text-black md:text-base fade-in-from-left ${skillNameRef.isVisible ? 'visible' : ''}`}
          >
            {skill.name}
          </span>
        </div>
        <span className="text-xs text-black/60 md:text-sm">
          {animatedValue}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-black/10">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
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
        {category.skills.map((skill, skillIndex) => (
          <SkillItem 
            key={skill.name} 
            skill={skill} 
            isCategoryVisible={categoryRef.isVisible}
            index={skillIndex}
          />
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
      className="relative border-b border-black pt-24 pb-48 md:pt-28 md:pb-56"
    >
      <div className="mx-auto max-w-7-5xl px-6">
        <h2
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-from-left section-title-blink ${titleRef.isVisible ? "visible" : ""}`}
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
