"use client";

import { Skills, Skill } from "@/types/profile";
import SkillsTimeline from "./SkillsTimeline";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useCountUpAnimation } from "@/hooks/useCountUpAnimation";
import { getGitHubLanguageColor } from "@/utils/githubLanguageColors";

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

  const skillNameRef = useFadeInOnScroll({ delay: 100 * (index + 1) });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {skill.name ? (
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full md:h-2 md:w-2" style={{ backgroundColor: getGitHubLanguageColor(skill.name) }} aria-hidden />
          ) : null}
          <span
            ref={skillNameRef.ref as React.RefObject<HTMLSpanElement>}
            className={`text-xs font-semibold text-black md:text-sm fade-in-from-left ${skillNameRef.isVisible ? "visible" : ""}`}
          >
            {skill.name}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-black/60 md:text-xs">{animatedValue}%</span>
      </div>
      <div className="h-1.25 w-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
        <div
          className="h-full transition-all shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
          style={{
            width: `${animatedValue}%`,
            backgroundColor: getGitHubLanguageColor(skill.name),
          }}
        />
      </div>
    </div>
  );
}

function SkillCategoryItem({ category, index }: SkillCategoryItemProps) {
  const categoryRef = useFadeInOnScroll({ delay: 100 * (index + 1) });
  const isMobileCategory = category.name === "Mobile";

  return (
    <div ref={categoryRef.ref as React.RefObject<HTMLDivElement>} className={`fade-in-on-scroll ${categoryRef.isVisible ? "visible" : ""}`}>
      <h3 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{category.name}</h3>
      <div className="space-y-5">
        {category.skills.map((skill, skillIndex) => (
          <SkillItem key={skill.name} skill={skill} isCategoryVisible={categoryRef.isVisible} index={skillIndex} />
        ))}
      </div>
      {isMobileCategory && (
        <p className="mt-6 text-xs font-semibold text-black/70 md:mt-8 md:text-sm">
          ※ この数値は理解自信度です！
        </p>
      )}
    </div>
  );
}

function getBackendSkillsForDisplay(backend: Skill[]): Skill[] {
  const hasDjango = backend.some((s) => s.name === "Django");
  const hasPython = backend.some((s) => s.name === "Python");
  if (!hasDjango || !hasPython) return backend;
  const django = backend.find((s) => s.name === "Django");
  const merged: Skill[] = [];
  let inserted = false;
  for (const s of backend) {
    if (s.name === "Django" || s.name === "Python") {
      if (!inserted) {
        merged.push({ name: "Django / Python", level: django?.level ?? 50 });
        inserted = true;
      }
    } else {
      merged.push(s);
    }
  }
  return merged;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const backendForDisplay = getBackendSkillsForDisplay(skills.backend);
  const mobileForDisplay = skills.mobile.filter((skill) => skill.level > 0);
  const skillCategories = [
    { name: "Tools", skills: skills.tools },
    { name: "Frontend", skills: skills.frontend },
    { name: "Backend", skills: backendForDisplay },
    { name: "Mobile", skills: mobileForDisplay },
  ];

  const titleRef = useFadeInOnScroll({ delay: 0 });
  const timelineRef = useFadeInOnScroll({ delay: 500 });

  return (
    <section id="skills" className="relative border-b border-black pt-18 pb-18 md:pt-22 md:pb-28">
      <div className="section-container-responsive mx-auto max-w-7-5xl px-6">
        <h2
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-8 text-center text-3xl font-bold tracking-tight md:mb-9 md:text-4xl fade-in-from-left section-title-blink section-title-responsive ${titleRef.isVisible ? "visible" : ""}`}
        >
          Skills
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-4 md:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCategoryItem key={category.name} category={category} index={categoryIndex} />
          ))}
        </div>
        <div
          ref={timelineRef.ref as React.RefObject<HTMLDivElement>}
          className={`mt-12 fade-in-on-scroll ${timelineRef.isVisible ? "visible" : ""}`}
        >
          <SkillsTimeline skills={skills} />
        </div>
      </div>
    </section>
  );
}
