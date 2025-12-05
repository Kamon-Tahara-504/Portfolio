import { Skills } from "@/types/profile";
import SkillsTimeline from "./SkillsTimeline";

interface SkillsSectionProps {
  skills: Skills;
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const skillCategories = [
    { name: "Frontend", skills: skills.frontend },
    { name: "Backend", skills: skills.backend },
    { name: "Mobile", skills: skills.mobile },
    { name: "Tools", skills: skills.tools },
  ];

  return (
    <section
      id="skills"
      className="border-b border-black bg-white py-48 md:py-56"
    >
      <div className="mx-auto max-w-7-5xl px-6">
        <h2 className="mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl">
          Skills
        </h2>
        <SkillsTimeline skills={skills} />
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.name}>
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
          ))}
        </div>
      </div>
    </section>
  );
}

