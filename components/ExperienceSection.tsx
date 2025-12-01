import { Experience } from "@/types/profile";
import GridPattern from "./GridPattern";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="relative border-b border-black bg-white py-48 md:py-56"
    >
      <GridPattern className="opacity-20" size={60} strokeWidth={0.5} />
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl">
          Experience
        </h2>
        <div className="relative">
          {/* タイムラインの縦線 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black md:left-8" />
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-12 md:pl-16"
              >
                {/* タイムラインのドット */}
                <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-black bg-white md:left-4" />
                <div className="border-l-2 border-black/20 pl-8 md:pl-12">
                  <div className="mb-4">
                    <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                      <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                        {exp.title}
                      </h3>
                      <span className="text-sm font-medium text-black/60 md:text-base">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-black/70 md:text-xl">
                      {exp.company}
                    </p>
                  </div>
                  <p className="leading-relaxed text-black/80 md:text-lg">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

