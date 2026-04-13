"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import aboutData from "@/data/about.json";
import heroData from "@/data/hero.json";
import HeroSection from "@/components/hero/HeroSection";
import ProjectModal from "@/components/projects/ProjectModal";
import PageBackground from "@/components/page/PageBackground";
import PageHeaderNav from "@/components/page/PageHeaderNav";
import SectionShell from "@/components/page/SectionShell";
import { SECTION_META, SectionId } from "@/components/page/SectionMeta";
import { getSectionContent } from "@/components/page/SectionContent";
import { Project } from "@/types/project";

// ポートフォリオのルート画面。導入->本編遷移とセクション描画を統括する。
export default function PortfolioPage() {
  // 画面遷移・モーダル・現在アクティブセクションの主要状態。
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(SECTION_META[0].id);
  const shouldReduceMotion = useReducedMotion();
  // セクションごとの背景画像割り当てマップ。
  const sectionImageMap = useMemo<Record<SectionId, string>>(
    () =>
      SECTION_META.reduce(
        (acc, section, index) => {
          acc[section.id] = index % 2 === 0 ? "/images/profile/Top1.jpg" : "/images/profile/Top2.jpg";
          return acc;
        },
        {} as Record<SectionId, string>
      ),
    []
  );

  // スクロール中に最も見えているセクションを追跡し、背景画像の切り替えに使う。
  useEffect(() => {
    if (!hasEntered) return;

    const sectionElements = SECTION_META.map((section) => document.getElementById(section.id)).filter(
      (section): section is HTMLElement => section !== null
    );
    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const nextSection = visibleEntry.target.id as SectionId;
        setActiveSectionId((prev) => (prev === nextSection ? prev : nextSection));
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
      }
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [hasEntered]);

  // セクションIDから背景を決定することで、表示ロジックをこの2値判定に集約する。
  const activeBackground = sectionImageMap[activeSectionId];
  const isTop1Active = activeBackground === "/images/profile/Top1.jpg";

  // Hero は導入画面として独立させ、onLead のみで本編へ遷移する。
  if (!hasEntered) {
    return (
      <HeroSection
        image={aboutData.about.image}
        title={heroData.title}
        nameEn={heroData.nameEn}
        onLead={() => setHasEntered(true)}
      />
    );
  }

  return (
    <div className="relative h-screen overflow-y-auto snap-y snap-mandatory">
      <PageBackground isTop1Active={isTop1Active} shouldReduceMotion={shouldReduceMotion} />
      <PageHeaderNav title={heroData.title} sections={SECTION_META} />

      <main>
        {SECTION_META.map((section) => (
          <SectionShell key={section.id} section={section} shouldReduceMotion={shouldReduceMotion}>
            {getSectionContent(section.id, (project) => setSelectedProject(project))}
          </SectionShell>
        ))}
      </main>

      {selectedProject ? (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      ) : null}

      <footer className="fixed right-6 bottom-5 z-20 hidden text-[11px] tracking-[0.22em] text-zinc-300 uppercase md:block">
        <p className="text-zinc-300/85">Copyright</p>
        <p className="mt-1 max-w-sm leading-relaxed text-zinc-400 normal-case tracking-[0.14em]">
          &copy; 2026 Kamon-Tahara-504
        </p>
      </footer>
    </div>
  );
}
