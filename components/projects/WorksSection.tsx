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
    <div className="space-y-3">
      <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
        実案件や制作課題をカード形式で閲覧できます。
      </p>
      <p className="text-xs text-zinc-300">
        横スクロールで閲覧できます。トラックパッドまたはShift + マウスホイールでも操作可能です。
      </p>
      <div className="works-scrollbar grid max-h-[38rem] grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-4 pr-2 snap-x snap-mandatory">
        {workItems.map((work) => (
          <button
            key={work.id}
            type="button"
            onClick={() => onSelectProject(work)}
            className="group relative h-[16.5rem] w-[13.5rem] snap-start overflow-hidden rounded-2xl border border-zinc-300/20 bg-zinc-900/40 text-left shadow-lg shadow-black/35 transition hover:scale-[1.01] hover:border-zinc-300/40 md:h-[17.5rem] md:w-[14.5rem]"
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
            <div className="absolute right-3 bottom-3 left-3 rounded-2xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
              <div className="mb-2 flex gap-1.5">
                <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-900 uppercase">
                  {work.category}
                </span>
                <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-900">
                  {work.productionType === "collaborative" ? "共同制作" : "自主制作"}
                </span>
              </div>
              <h2 className="truncate text-[1.05rem] leading-tight font-semibold text-white">{work.title}</h2>
              <p className="mt-1 truncate text-xs text-zinc-100/85">{work.catchphrase}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
