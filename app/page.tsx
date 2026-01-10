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
    </>
  );
}
