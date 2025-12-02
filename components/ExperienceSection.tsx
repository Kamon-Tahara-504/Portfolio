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
        <h2 className="mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl">
          Experience
        </h2>
        <div className="relative">
          {/* タイムラインの縦線 */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-black/30 md:left-8" />
          <div className="space-y-16">
            {experience.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-16 md:pl-20"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

