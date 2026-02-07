import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import DevelopmentSection from "@/components/DevelopmentSection";
import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import { Development } from "@/types/development";
import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import developmentData from "@/data/development.json";

export default function Home() {
  const profile = profileData as Profile;
  const projects = projectsData as Project[];
  const development = developmentData as Development;

  return (
    <>
      <HeroSection
        image="/images/hero/hero.jpg"
        title={profile.name}
        subtitle={profile.title}
        nameEn={profile.nameEn}
        developerTitle={profile.developerTitle}
      />
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
              background: "rgb(255 255 255 / 0.92)",
            }}
            aria-hidden
          />
          <div className="relative z-10">
          <AboutSection
            name={profile.name}
            nameEn={profile.nameEn}
            age={profile.age}
            title={profile.title}
            about={profile.about}
            contact={profile.contact}
          />
          <ExperienceSection experience={profile.experience} />
          <SkillsSection skills={profile.skills} />
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
    </>
  );
}
