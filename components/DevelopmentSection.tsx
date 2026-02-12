"use client";

import Link from "next/link";
import { Development } from "@/types/development";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import TerminalBlock from "@/components/TerminalBlock";

interface DevelopmentSectionProps {
  development: Development;
}

export default function DevelopmentSection({
  development,
}: DevelopmentSectionProps) {
  const titleRef = useFadeInOnScroll({ delay: 0 });
  const contentRef = useFadeInOnScroll({ delay: 200 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <section
      id="development"
      className="relative border-b border-black pt-24 pb-12 md:pt-28 md:pb-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-20 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-from-left section-title-blink ${titleRef.isVisible ? "visible" : ""}`}
        >
          Development
        </h2>
        <div
          ref={contentRef.ref as React.RefObject<HTMLDivElement>}
          className={`fade-in-on-scroll ${contentRef.isVisible ? "visible" : ""}`}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
            {/* 左カラム: ターミナル ＋ 技術スタック */}
            <div className="space-y-8">
              <TerminalBlock />
              <div>
                <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
                  技術スタック
                </h3>
                <ul className="space-y-3">
                  {development.techStack.map((tech, index) => (
                    <li
                      key={index}
                      className="flex items-center rounded-lg border border-black px-4 py-3 text-base font-medium md:text-lg"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GitHubボタン ＋ 開発期間・最終更新日 */}
              <div className="flex flex-col gap-4 pt-4 border-t border-black/20 sm:flex-row sm:items-start sm:gap-6">
                <Link
                  href={development.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90 md:text-base"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {development.repository.label}
                </Link>
                <div className="space-y-2 text-sm text-black/70 md:text-base">
                  <div className="flex items-center gap-2">
                    <span>
                      <span className="font-bold">開発期間</span>:
                    </span>
                    <span>
                      {formatDate(development.dates.startDate)} 〜{" "}
                      {formatDate(development.dates.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      <span className="font-bold">最終更新日</span>:
                    </span>
                    <span>{formatDate(development.dates.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右カラム */}
            <div className="space-y-8">
              <div>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-lg font-bold md:text-xl">
                      デザインの考え方
                    </h4>
                    <p className="leading-relaxed text-black/80 md:text-lg">
                      {development.developmentProcess.designPhilosophy}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold md:text-xl">
                      実装で工夫した点
                    </h4>
                    <p className="leading-relaxed text-black/80 md:text-lg">
                      {development.developmentProcess.implementationHighlights}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold md:text-xl">
                      学んだこと
                    </h4>
                    <p className="leading-relaxed text-black/80 md:text-lg">
                      {development.developmentProcess.learnings}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold md:text-xl">
                      今後の改善点
                    </h4>
                    <p className="leading-relaxed text-black/80 md:text-lg">
                      {development.developmentProcess.futureImprovements}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

