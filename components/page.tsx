"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import aboutData from "@/data/about.json";
import developmentData from "@/data/development.json";
import heroData from "@/data/hero.json";
import { StackGitHubHeaderButton } from "@/components/development/StackSection";
import HeroSection from "@/components/hero/HeroSection";
import ProjectModal from "@/components/projects/ProjectModal";
import PageBackground from "@/components/page/PageBackground";
import PageHeaderNav from "@/components/page/PageHeaderNav";
import SectionShell from "@/components/page/SectionShell";
import { SECTION_META, SectionId } from "@/components/page/SectionMeta";
import { getSectionContent } from "@/components/page/SectionContent";
import { resolveAssetPath } from "@/lib/collectLocalAssetUrls";
import { Development } from "@/types/development";
import { Project } from "@/types/project";

const development = developmentData as Development;
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

// ポートフォリオのルート画面。導入->本編遷移とセクション描画を統括する。
export default function PortfolioPage() {
  // 画面遷移・モーダル・現在アクティブセクションの主要状態。
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(SECTION_META[0].id);
  const shouldReduceMotion = useReducedMotion();
  // セクションごとの背景画像割り当てマップ。
  const sectionImageMap = useMemo<Record<SectionId, string>>(
    () => ({
      // ナビゲーション順に合わせて Top1〜Top6 を1:1で対応付ける。
      profile: resolveAssetPath("/images/profile/Top1.jpg", basePath),
      vision: resolveAssetPath("/images/profile/Top2.jpg", basePath),
      career: resolveAssetPath("/images/profile/Top3.jpg", basePath),
      skills: resolveAssetPath("/images/profile/Top4.jpg", basePath),
      works: resolveAssetPath("/images/profile/Top5.jpg", basePath),
      stack: resolveAssetPath("/images/profile/Top6.jpg", basePath),
    }),
    []
  );

  // スクロール中に最も見えているセクションを追跡し、背景画像の切り替えに使う。
  useEffect(() => {
    if (!hasEntered) return;

    const sectionElements = SECTION_META.map((section) => document.getElementById(section.id)).filter(
      (section): section is HTMLElement => section !== null
    );
    if (sectionElements.length === 0) return;

    // ごく僅かな露出で切り替わるチラつきを抑えるための閾値。
    const MIN_SWITCH_RATIO = 0.08;
    // 直前セクションより一定差が出るまで切り替えないヒステリシス。
    const SWITCH_HYSTERESIS = 0.01;
    const visibilityBySection = new Map<SectionId, number>(
      sectionElements.map((section) => [section.id as SectionId, 0])
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id as SectionId;
          visibilityBySection.set(sectionId, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const [nextSection, nextRatio] = Array.from(visibilityBySection.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0] ?? [null, 0];

        if (!nextSection || nextRatio < MIN_SWITCH_RATIO) return;

        setActiveSectionId((prev) => {
          if (prev === nextSection) return prev;
          const prevRatio = visibilityBySection.get(prev) ?? 0;
          const hasEnoughLead = nextRatio >= prevRatio + SWITCH_HYSTERESIS;
          return hasEnoughLead ? nextSection : prev;
        });
      },
      {
        root: null,
        threshold: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      }
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [hasEntered]);

  // セクションIDごとの背景画像を切り替える。
  const activeBackground = sectionImageMap[activeSectionId];

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
    <div className="relative h-screen max-w-full min-h-0 min-w-0 snap-y snap-mandatory overflow-x-clip overflow-y-auto overscroll-y-contain">
      <PageBackground activeImage={activeBackground} shouldReduceMotion={shouldReduceMotion} />
      <PageHeaderNav title={heroData.title} sections={SECTION_META} activeSectionId={activeSectionId} />

      <main className="contents">
        {SECTION_META.map((section) => (
          <SectionShell
            key={section.id}
            section={section}
            shouldReduceMotion={shouldReduceMotion}
            titleAside={
              section.id === "stack" ? (
                <StackGitHubHeaderButton repository={development.repository} />
              ) : undefined
            }
          >
            {getSectionContent(section.id, (project) => setSelectedProject(project))}
          </SectionShell>
        ))}
      </main>

      {selectedProject ? (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      ) : null}

      <p
        aria-label="2026 4/15 Renewal"
        className="pointer-events-none fixed top-1/2 right-1 z-20 -translate-y-1/2 text-[10px] tracking-[0.24em] text-zinc-200/75 [writing-mode:vertical-rl] [text-orientation:mixed] sm:right-2 sm:text-[11px] md:right-3 md:text-xs"
      >
        2026 4/15 RENEWAL
      </p>
      <p
        aria-label="Web Developer and Mobile Developer"
        className="pointer-events-none fixed top-1/2 left-1 z-20 -translate-y-1/2 rotate-180 text-[10px] tracking-[0.24em] text-zinc-200/75 [writing-mode:vertical-lr] [text-orientation:mixed] sm:left-2 sm:text-[11px] md:left-3 md:text-xs"
      >
        WEB DEVELOPER & MOBILE DEVELOPER
      </p>

      <footer className="fixed right-4 bottom-4 z-20 text-[10px] tracking-[0.22em] text-zinc-300 uppercase md:bottom-5 md:right-6 md:text-[11px]">
        <p className="text-right text-zinc-300/85">Copyright</p>
        <p className="mt-1 max-w-sm text-right leading-relaxed text-zinc-400 normal-case tracking-[0.14em]">
          &copy; 2026 Kamon-Tahara-504
        </p>
      </footer>
    </div>
  );
}
