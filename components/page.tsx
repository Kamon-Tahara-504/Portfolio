"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import developmentData from "@/data/development.json";
import heroData from "@/data/hero.json";
import { StackGitHubHeaderButton } from "@/components/development/StackSection";
import HeroSection from "@/components/hero/HeroSection";
import ProjectModal from "@/components/projects/ProjectModal";
import EntryBlackout from "@/components/page/EntryBlackout";
import PageBackground from "@/components/page/PageBackground";
import PageHeaderNav from "@/components/page/PageHeaderNav";
import FixedExperienceLabel from "@/components/page/FixedExperienceLabel";
import { PortfolioViewProvider } from "@/components/page/PortfolioViewContext";
import SectionShell from "@/components/page/SectionShell";
import { SECTION_META, SectionId } from "@/components/page/SectionMeta";
import { getSectionContent } from "@/components/page/SectionContent";
import SkillsModeToggle from "@/components/skills/SkillsModeToggle";
import { SkillsViewProvider } from "@/components/skills/SkillsViewContext";
import { resolveAssetPath } from "@/lib/collectLocalAssetUrls";
import { fixedLabel } from "@/lib/portfolioViewStyles";
import {
  useBrowserZoomCompensation,
  useBrowserZoomLock,
} from "@/lib/useBrowserZoomCompensation";
import { useHeavySmoothScroll } from "@/lib/useHeavySmoothScroll";
import BrowserZoomLock from "@/components/page/BrowserZoomLock";
import { Development } from "@/types/development";
import { Project } from "@/types/project";
import type { PortfolioViewMode } from "@/types/portfolioView";

const development = developmentData as Development;
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

// 個人向け確定後、Hero → About の間に挟む暗転の時間。
const ENTRY_BLACKOUT_COVER_MS = 450;
const ENTRY_BLACKOUT_REVEAL_MS = 600;

type EntryBlackoutStage = "cover" | "reveal";

interface EntryBlackoutState {
  opacity: number;
  stage: EntryBlackoutStage;
}

// ポートフォリオのルート画面。導入->本編遷移とセクション描画を統括する。
export default function PortfolioPage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [viewMode, setViewMode] = useState<PortfolioViewMode | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(SECTION_META[0].id);
  const [entryBlackout, setEntryBlackout] = useState<EntryBlackoutState | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const zoomCompensation = useBrowserZoomCompensation();
  const zoomLock = useBrowserZoomLock();
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useHeavySmoothScroll(mainScrollRef, hasEntered && Boolean(viewMode) && !zoomLock.isLocked);

  // public/images/section の実ファイルに対応（Top6 は無いので stack は Top5 を再利用）
  const sectionImageMap = useMemo<Record<SectionId, string>>(
    () => ({
      about: resolveAssetPath("/images/section/Top1.png", basePath),
      vision: resolveAssetPath("/images/section/Top2.png", basePath),
      career: resolveAssetPath("/images/section/Top3.png", basePath),
      skills: resolveAssetPath("/images/section/Top4.png", basePath),
      works: resolveAssetPath("/images/section/Top5.png", basePath),
      stack: resolveAssetPath("/images/section/Top5.png", basePath),
    }),
    []
  );

  // html に data 属性を同期し、CSS 変数と body 背景をビューモード連動させる。
  useEffect(() => {
    if (!viewMode) {
      document.documentElement.removeAttribute("data-portfolio-view");
      return;
    }
    document.documentElement.setAttribute("data-portfolio-view", viewMode);
    return () => document.documentElement.removeAttribute("data-portfolio-view");
  }, [viewMode]);

  useEffect(() => {
    if (!hasEntered || !viewMode) return;

    const sectionElements = SECTION_META.map((section) => document.getElementById(section.id)).filter(
      (section): section is HTMLElement => section !== null
    );
    if (sectionElements.length === 0) return;

    const MIN_SWITCH_RATIO = 0.08;
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
  }, [hasEntered, viewMode]);

  // 初回描画で opacity 0 を確定してから目標値へ変え、CSS トランジションを確実に走らせる。
  useEffect(() => {
    if (!entryBlackout) return;

    const shouldStartCover = entryBlackout.stage === "cover" && entryBlackout.opacity === 0;
    const shouldStartReveal = entryBlackout.stage === "reveal" && entryBlackout.opacity === 1;
    if (!shouldStartCover && !shouldStartReveal) return;

    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        if (shouldStartCover) {
          setEntryBlackout({ opacity: 1, stage: "cover" });
          return;
        }
        setEntryBlackout({ opacity: 0, stage: "reveal" });
      });
    });

    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [entryBlackout]);

  const enterMain = (mode: PortfolioViewMode) => {
    setViewMode(mode);
    setHasEntered(true);
  };

  const handleLead = (mode: PortfolioViewMode) => {
    // 担当者様向けは白背景のまま入る。個人向けは Hero→Top1 の飛びを暗転で隠す。
    if (mode !== "personal") {
      enterMain(mode);
      return;
    }

    setEntryBlackout({ opacity: 0, stage: "cover" });
  };

  const handleBlackoutTransitionEnd = () => {
    if (!entryBlackout) return;

    if (entryBlackout.stage === "cover" && entryBlackout.opacity === 1) {
      // 黒が完全になったフレームで本編を載せ、その下で Top1 を表示する。
      enterMain("personal");
      setEntryBlackout({ opacity: 1, stage: "reveal" });
      return;
    }

    if (entryBlackout.stage === "reveal" && entryBlackout.opacity === 0) {
      setEntryBlackout(null);
    }
  };

  const activeBackground = sectionImageMap[activeSectionId];
  const blackoutDurationMs =
    entryBlackout?.stage === "reveal" ? ENTRY_BLACKOUT_REVEAL_MS : ENTRY_BLACKOUT_COVER_MS;

  return (
    <>
      <BrowserZoomLock lock={zoomLock} />

      {!hasEntered || !viewMode ? (
        <HeroSection onLead={handleLead} />
      ) : (
        <PortfolioViewProvider viewMode={viewMode} zoomCompensation={zoomCompensation}>
          <div
            ref={mainScrollRef}
            data-portfolio-view={viewMode}
            className={`relative h-screen max-w-full min-h-0 min-w-0 overflow-x-clip overflow-y-auto overscroll-none text-foreground ${viewMode === "recruiter" ? "bg-background" : ""}`}
          >
            {viewMode === "personal" ? (
              <PageBackground activeImage={activeBackground} shouldReduceMotion={shouldReduceMotion} />
            ) : null}
            <div className="relative z-10">
              <PageHeaderNav title={heroData.title} sections={SECTION_META} activeSectionId={activeSectionId} />

              <main className="contents">
                {SECTION_META.map((section) => {
                  const titleAside =
                    section.id === "stack" ? (
                      <StackGitHubHeaderButton repository={development.repository} />
                    ) : section.id === "skills" ? (
                      <SkillsModeToggle />
                    ) : undefined;

                  const shell = (
                    <SectionShell
                      section={section}
                      shouldReduceMotion={shouldReduceMotion}
                      titleAside={titleAside}
                    >
                      {getSectionContent(section.id, (project) => setSelectedProject(project))}
                    </SectionShell>
                  );

                  return section.id === "skills" ? (
                    <SkillsViewProvider key={section.id}>{shell}</SkillsViewProvider>
                  ) : (
                    <Fragment key={section.id}>{shell}</Fragment>
                  );
                })}
              </main>
            </div>

            {selectedProject ? (
              <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            ) : null}

            <FixedExperienceLabel />
            <p
              aria-label="Web Developer and Mobile Developer"
              className={`pointer-events-none fixed top-1/2 left-1 z-20 hidden -translate-y-1/2 rotate-180 text-[10px] tracking-[0.24em] [writing-mode:vertical-lr] [text-orientation:mixed] md:block md:left-3 md:text-xs ${fixedLabel(viewMode)}`}
              style={{ zoom: zoomCompensation }}
            >
              WEB DEVELOPER & MOBILE DEVELOPER
            </p>

            <footer
              className={`fixed right-4 bottom-4 z-20 text-[10px] tracking-[0.22em] uppercase md:bottom-5 md:right-6 md:text-[11px] ${fixedLabel(viewMode)}`}
              style={{ zoom: zoomCompensation }}
            >
              <p className="text-right opacity-85">Copyright</p>
              <p className="mt-1 max-w-sm text-right leading-relaxed normal-case tracking-[0.14em] opacity-70">
                &copy; 2026 Kamon-Tahara-504
              </p>
            </footer>
          </div>
        </PortfolioViewProvider>
      )}

      {entryBlackout ? (
        <EntryBlackout
          opacity={entryBlackout.opacity}
          durationMs={blackoutDurationMs}
          onTransitionEnd={handleBlackoutTransitionEnd}
        />
      ) : null}
    </>
  );
}
