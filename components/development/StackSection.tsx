import { Development } from "@/types/development";

// Stackセクションの入力。
interface StackSectionProps {
  development: Development;
}

// 技術スタックと開発プロセス情報を表示する。
export default function StackSection({ development }: StackSectionProps) {
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
        このポートフォリオで使用している主要技術です。
      </p>
      <div className="flex flex-wrap gap-2">
        {development.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-zinc-300/30 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">Design Philosophy</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {development.developmentProcess.designPhilosophy}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
            Implementation Highlights
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {development.developmentProcess.implementationHighlights}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">Learnings</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {development.developmentProcess.learnings}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
            Future Improvements
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {development.developmentProcess.futureImprovements}
          </p>
        </article>
      </div>
      <div className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 text-sm text-zinc-300">
        <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">Dates</h3>
        <div className="mt-2 space-y-1">
          <p>Start: {development.dates.startDate}</p>
          <p>End: {development.dates.endDate}</p>
          <p>Last Updated: {development.dates.lastUpdated}</p>
        </div>
      </div>
      <a
        href={development.repository.url}
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-md bg-zinc-900/35 px-3 py-2 text-sm underline decoration-zinc-500 underline-offset-4"
      >
        {development.repository.label}
      </a>
    </div>
  );
}
