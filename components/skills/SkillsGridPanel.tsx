"use client";

import { motion } from "framer-motion";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { mutedText, surfaceCard, viewClass } from "@/lib/portfolioViewStyles";
import { Skill } from "@/types/profile";
import { getGitHubLanguageColor } from "@/utils/githubLanguageColors";
import {
  CARD_CONVERGE,
  CARD_MOTION_DURATION,
  CARD_MOTION_EASE,
  CONTENT_FADE_DURATION,
  CONTENT_FADE_EASE,
  SkillsPhase,
} from "@/components/skills/skillsTransition";

interface SkillGroup {
  title: string;
  items: Skill[];
}

interface SkillsGridPanelProps {
  phase: SkillsPhase;
  skillGroups: SkillGroup[];
}

function SkillItem({ item }: { item: Skill }) {
  const { viewMode } = usePortfolioView();

  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full md:h-2 md:w-2"
            style={{ backgroundColor: getGitHubLanguageColor(item.name) }}
            aria-hidden
          />
          <span
            className={`text-xs font-semibold md:text-sm ${viewClass(viewMode, { personal: "text-zinc-100", recruiter: "text-foreground" })}`}
          >
            {item.name}
          </span>
        </div>
        <span className={`text-[10px] font-semibold md:text-xs ${mutedText(viewMode)}`}>{item.level}%</span>
      </div>
      <div
        className={`h-1.5 w-full rounded-sm ${viewClass(viewMode, {
          personal: "bg-zinc-800/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]",
          recruiter: "bg-zinc-200",
        })}`}
      >
        <div
          className="h-full rounded-sm transition-all duration-700"
          style={{ width: `${item.level}%`, backgroundColor: getGitHubLanguageColor(item.name) }}
        />
      </div>
    </li>
  );
}

export default function SkillsGridPanel({ phase, skillGroups }: SkillsGridPanelProps) {
  const { viewMode } = usePortfolioView();

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
      {skillGroups.map((group, i) => {
        const converge = CARD_CONVERGE[i];
        const isGoingOut = phase === "toTimeline";
        const isComingBack = phase === "toSkills";
        const contentHidden = isGoingOut || isComingBack;

        return (
          <motion.article
            key={group.title}
            className={surfaceCard(viewMode)}
            initial={isComingBack ? { x: converge.x, y: converge.y, scale: 0.6, opacity: 1 } : false}
            animate={{
              x: isGoingOut ? converge.x : "0%",
              y: isGoingOut ? converge.y : "0%",
              scale: isGoingOut ? 0.6 : 1,
              opacity: 1,
              zIndex: isGoingOut ? 10 : 0,
            }}
            transition={{ duration: CARD_MOTION_DURATION, ease: CARD_MOTION_EASE }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: contentHidden ? 0 : 1 }}
              transition={{
                duration: CONTENT_FADE_DURATION,
                ease: CONTENT_FADE_EASE,
              }}
            >
              <h2
                className={`text-sm font-medium sm:text-base ${viewClass(viewMode, { personal: "text-white", recruiter: "text-foreground" })}`}
              >
                {group.title}
              </h2>
              <ul className="mt-3 space-y-3">
                {group.items
                  .filter((item) => item.name && item.level > 0 && item.name !== "Django")
                  .map((item) => (
                    <SkillItem key={`${group.title}-${item.name}`} item={item} />
                  ))}
              </ul>
              {group.title === "Mobile" ? (
                <p className={`mt-4 text-[11px] font-semibold ${mutedText(viewMode)}`}>
                  ※ この数値は理解自信度です
                </p>
              ) : null}
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
