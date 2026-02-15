import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import DevelopmentSection from "@/components/DevelopmentSection";
import { HeroData, AboutData, Experience, Skills } from "@/types/profile";
import { Project } from "@/types/project";
import { Development } from "@/types/development";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import experienceData from "@/data/experience.json";
import skillsData from "@/data/skills.json";
import projectsData from "@/data/projects.json";
import developmentData from "@/data/development.json";

export default function Home() {
  const hero = heroData as HeroData;
  const about = aboutData as AboutData;
  const experience = experienceData as Experience[];
  const skills = skillsData as Skills;
  const projects = projectsData as Project[];
  const development = developmentData as Development;

  const mainContent = (
    <div
      className="relative z-20 overflow-hidden rounded-[2rem] p-8 shadow-2xl bg-transparent"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="overflow-hidden rounded-[1.25rem] pt-8 relative"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div
          className="absolute inset-0 rounded-[1.25rem] z-0"
          style={{
            background: "rgb(255 255 255 / 0.90)",
          }}
          aria-hidden
        />
        <div className="relative z-10 select-none">
          <AboutSection
            name={about.name}
            nameEn={about.nameEn}
            age={about.age}
            title={about.title}
            about={about.about}
            contact={about.contact}
          />
          <ExperienceSection experience={experience} />
          <SkillsSection skills={skills} />
          <ProjectsSection projects={projects} />
          <DevelopmentSection development={development} />
          <footer className="border-t border-black mt-auto">
            <div className="mx-auto max-w-7-5xl px-6 py-8 text-center text-sm text-black/60">
              <p>©︎ 2025 Kamon-Tahara-504</p>
              <p className="mt-2">Licensed under MIT License</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      hero={
        <HeroSection
          image="/images/hero/hero.jpg"
          title={hero.name}
          subtitle={hero.title}
          nameEn={hero.nameEn}
          developerTitle={hero.developerTitle}
        />
      }
      mainContent={mainContent}
    />
  );
}
