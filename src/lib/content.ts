import heroJson from "../../data/hero.json";
import aboutJson from "../../data/about.json";
import experienceJson from "../../data/experience.json";
import projectsJson from "../../data/projects.json";
import skillsJson from "../../data/skills.json";
import type {
  AboutData,
  Experience,
  Hero,
  Project,
  ProjectLink,
  ProjectLinks,
  Skill,
  SkillCategory,
} from "../types/content";
import { asset } from "./asset";

export const hero: Hero = heroJson;
export const about: AboutData = {
  ...aboutJson,
  about: {
    ...aboutJson.about,
    image: asset(aboutJson.about.image),
  },
};
export const experiences: Experience[] = experienceJson;

const projects: Project[] = (projectsJson as Project[]).map((project) => ({
  ...project,
  images: project.images.map(asset),
}));

// 企業サイトとしての密度を保つため、成果や課題設定が伝わる作品だけを大きく見せる
const FEATURED_SLUGS = [
  "thisone",
  "koko",
  "shiftora",
  "hypoframe",
  "plotty",
  "nexst-task",
];

export const featuredProjects: Project[] = FEATURED_SLUGS.map((slug) =>
  projects.find((project) => project.slug === slug),
).filter((project): project is Project => project !== undefined);

export const otherProjects: Project[] = projects.filter(
  (project) => !FEATURED_SLUGS.includes(project.slug),
);

const SKILL_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  tools: "Tools",
};

export const skillCategories: SkillCategory[] = Object.entries(
  skillsJson as Record<string, Skill[]>,
).map(([key, skills]) => ({
  key,
  label: SKILL_LABELS[key] ?? key,
  // データ側に空行のプレースホルダーが含まれるため除外する
  skills: skills.filter((skill) => skill.name.trim() !== ""),
}));

const LEVELS_PER_CATEGORY = 5;

/** 自己評価バーは、カテゴリ内で割合の高い 5 件だけ出す。外れた項目はデータに残す。 */
export function skillsForLevels(skills: Skill[]): Skill[] {
  const ranked = skills
    .map((skill, index) => ({ skill, index }))
    // 同率ならデータの後ろを残す。C# は自己評価の枠から外したままにする
    .sort((a, b) => b.skill.level - a.skill.level || b.index - a.index)
    .slice(0, LEVELS_PER_CATEGORY)
    .map((item) => item.skill);
  const shown = new Set(ranked);
  return skills.filter((skill) => shown.has(skill));
}

const LINK_LABELS: Record<keyof ProjectLinks, string> = {
  demo: "Demo",
  appStore: "App Store",
  github: "GitHub",
  githubFrontend: "GitHub Front",
  githubBackend: "GitHub Back",
  docs: "資料",
};

export function getProjectLinks(project: Project): ProjectLink[] {
  return (Object.keys(LINK_LABELS) as (keyof ProjectLinks)[])
    .map((key) => ({ label: LINK_LABELS[key], url: project.links[key] }))
    .filter((link): link is ProjectLink => Boolean(link.url));
}

function toMonth(date: string): string {
  const [year, month] = date.split("-");
  return `${year}.${month}`;
}

export function getProjectPeriod(project: Project): string {
  const { startDate, endDate, releaseDate } = project.date;
  const end = endDate ?? releaseDate;
  return end ? `${toMonth(startDate)} — ${toMonth(end)}` : `${toMonth(startDate)} —`;
}

export function getCategoryLabel(project: Project): string {
  const category = project.category === "mobile" ? "Mobile App" : "Web App";
  if (project.productionType === "collaborative") return `${category} / Team`;
  if (project.productionType === "solo") return `${category} / Solo`;
  return category;
}

// about.description は空行区切りで「リード文」と「本文」を持っている
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
