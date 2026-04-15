"use client";

// 技術タグ一覧を表示するセクション。
export default function ProjectModalTechnologies({
  technologies,
}: {
  technologies: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
        Technologies
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-zinc-300/20 bg-zinc-900/55 px-3 py-1.5 text-sm font-semibold text-zinc-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

