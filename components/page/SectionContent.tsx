import { ReactNode } from "react";
import aboutData from "@/data/about.json";
import developmentData from "@/data/development.json";
import experienceData from "@/data/experience.json";
import heroData from "@/data/hero.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import ProfileSection from "@/components/about/ProfileSection";
import VisionSection from "@/components/about/VisionSection";
import StackSection from "@/components/development/StackSection";
import CareerSection from "@/components/experience/CareerSection";
import WorksSection from "@/components/projects/WorksSection";
import SkillsSection from "@/components/skills/SkillsSection";
import { SectionId } from "@/components/page/SectionMeta";
import { Development } from "@/types/development";
import { AboutData, Skill } from "@/types/profile";
import { Project } from "@/types/project";

// スキルカードをカテゴリ別で扱うための中間型。
type SkillGroup = {
  title: string;
  items: Skill[];
};

// スキルセクション表示用のグルーピング済みデータ。
const skillGroups: SkillGroup[] = [
  { title: "Frontend", items: skillsData.frontend },
  { title: "Backend", items: skillsData.backend },
  { title: "Mobile", items: skillsData.mobile },
  { title: "Tools", items: skillsData.tools },
];

// 「準備中」以外の作品のみ抽出して表示に使う。
const workItems: Project[] = (projectsData as Project[]).filter(
  (project) => project.title !== "準備中"
);

// 開発データを表示用型へ明示キャストして扱う。
const development = developmentData as Development;
const about = aboutData as AboutData;

// セクションIDに応じた本文コンポーネントを返すファクトリ。
export function getSectionContent(
  sectionId: SectionId,
  onSelectProject: (project: Project) => void
) {
  const profileChips: string[] = [];

  const sectionContentMap: Record<SectionId, ReactNode> = {
    profile: <ProfileSection about={about} hero={heroData} profileChips={profileChips} />,
    vision: <VisionSection description={about.about.description} />,
    career: <CareerSection experiences={experienceData} />,
    skills: <SkillsSection skillGroups={skillGroups} skills={skillsData} />,
    works: <WorksSection workItems={workItems} onSelectProject={onSelectProject} />,
    stack: <StackSection development={development} />,
  };

  return sectionContentMap[sectionId] ?? null;
}
