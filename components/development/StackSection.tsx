import { Development, Repository } from "@/types/development";

// 日付文字列を表示用フォーマットに変換する。
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year} / ${month} / ${day}`;
}

// Stackセクションの入力。
interface StackSectionProps {
  development: Development;
}

// 見出し「STACK」右に置く GitHub 遷移ボタン（リポジトリ URL 表示ボックスは本文側に置かない）。
export function StackGitHubHeaderButton({ repository }: { repository: Repository }) {
  return (
    <a
      href={repository.url}
      target="_blank"
      rel="noreferrer"
      aria-label={repository.label}
      className="inline-flex shrink-0 items-center gap-2 rounded-md border border-zinc-300/30 bg-zinc-900/55 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-300/50 hover:bg-zinc-900/75 sm:px-4 sm:py-2.5 sm:text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 sm:h-5 sm:w-5"
        aria-hidden
      >
        <path d="M12 2a10 10 0 0 0-3.162 19.488c.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.776.603-3.363-1.338-3.363-1.338-.454-1.153-1.11-1.46-1.11-1.46-.908-.621.069-.609.069-.609 1.004.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.091-.646.349-1.088.635-1.338-2.218-.252-4.552-1.109-4.552-4.939 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.56 9.56 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.839-2.338 4.684-4.563 4.93.359.309.679.92.679 1.854 0 1.338-.012 2.419-.012 2.748 0 .268.18.579.688.481A10 10 0 0 0 12 2Z" />
      </svg>
      GitHub
    </a>
  );
}

// 技術スタックと開発プロセス情報を表示する。
export default function StackSection({ development }: StackSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        このポートフォリオで使用している主要技術です。
      </p>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">Design Philosophy</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {development.developmentProcess.designPhilosophy}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">
            Implementation Highlights
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {development.developmentProcess.implementationHighlights}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">Learnings</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {development.developmentProcess.learnings}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">
            Future Improvements
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {development.developmentProcess.futureImprovements}
          </p>
        </article>
      </div>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">Date</h3>
          <div className="mt-2 space-y-2 font-semibold text-zinc-300">
            <p>開発開始日: {formatDate(development.dates.startDate)}</p>
            <p>開発終了日: {formatDate(development.dates.endDate)}</p>
            <p>最終更新日: {formatDate(development.dates.lastUpdated)}</p>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base">Tech Stack</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {development.techStack.map((tech) => (
              <div
                key={tech}
                className="rounded-md border border-zinc-300/25 bg-zinc-900/55 px-3 py-2 text-xs font-medium text-zinc-100 sm:text-sm"
              >
                {tech}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
