"use client";

export default function ProjectModalTechnologies({
  technologies,
}: {
  technologies: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
        Technologies
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="border border-black bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

