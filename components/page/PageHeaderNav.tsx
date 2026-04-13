import { SectionMeta } from "@/components/page/SectionMeta";

// ヘッダー表示に必要な入力。
interface PageHeaderNavProps {
  title: string;
  sections: SectionMeta[];
}

// 固定ヘッダーとセクションアンカーリンクを表示する。
export default function PageHeaderNav({ title, sections }: PageHeaderNavProps) {
  return (
    <header className="fixed top-0 left-0 z-20 flex w-full items-center justify-between px-6 py-5 text-[11px] tracking-[0.22em] text-zinc-200/85 uppercase md:px-10">
      <span>{title}</span>
      <nav className="hidden gap-5 md:flex">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="transition hover:text-white">
            {section.title}
          </a>
        ))}
      </nav>
    </header>
  );
}
