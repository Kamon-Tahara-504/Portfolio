import Image from "next/image";
import { Project } from "@/types/project";

// Worksセクションの入力。
interface WorksSectionProps {
  workItems: Project[];
  onSelectProject: (project: Project) => void;
}

// 作品カード一覧と選択ハンドラを表示する。
export default function WorksSection({ workItems, onSelectProject }: WorksSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        これまで取り組んだ制作実績をカード形式で整理して掲載しています。
      </p>
      <p className="text-xs text-zinc-300 sm:text-sm">
        横スクロールで閲覧できます。トラックパッドまたはShift + マウスホイールでも操作可能です。
      </p>
      <div className="works-scrollbar grid max-h-[36rem] grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-4 pr-2 snap-x snap-mandatory sm:max-h-[38rem] sm:gap-4">
        {workItems.map((work) => (
          <button
            key={work.id}
            type="button"
            onClick={() => onSelectProject(work)}
            className="group relative h-[14.5rem] w-[11.5rem] snap-start overflow-hidden rounded-2xl border border-zinc-300/20 bg-zinc-900/40 text-left shadow-lg shadow-black/35 transition hover:scale-[1.01] hover:border-zinc-300/40 sm:h-[16.5rem] sm:w-[13.5rem] lg:h-[17.5rem] lg:w-[14.5rem]"
          >
            <span className="absolute top-3 left-3 z-10 rounded-md border border-white/25 bg-black/50 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-100 backdrop-blur-sm">
              #{work.number ?? "00"}
            </span>
            <Image
              src={work.images[0] ?? "/images/projects/PlaceHolder.png"}
              alt={`${work.title} preview`}
              fill
              sizes="220px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute right-2.5 bottom-2.5 left-2.5 rounded-2xl border border-white/15 bg-black/40 p-2.5 backdrop-blur-md sm:right-3 sm:bottom-3 sm:left-3 sm:p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-zinc-900 uppercase sm:text-[10px]">
                  {work.category}
                </span>
                <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-zinc-900 sm:text-[10px]">
                  {work.productionType === "collaborative" ? "共同制作" : "自主制作"}
                </span>
              </div>
              <h2 className="truncate text-[0.95rem] leading-tight font-semibold text-white sm:text-[1.05rem]">
                {work.title}
              </h2>
              <p className="mt-1 truncate text-[11px] text-zinc-100/85 sm:text-xs">{work.catchphrase}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
