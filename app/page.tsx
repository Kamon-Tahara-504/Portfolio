import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";

export default function Home() {
  const profile = profileData as Profile;
  const projects = projectsData as Project[];

  return (
    <>
      <HeroSection
        image="/images/hero/hero.jpg"
        title={profile.name}
        subtitle={profile.title}
      />
      <AboutSection
        name={profile.name}
        title={profile.title}
        about={profile.about}
      />
      <ExperienceSection experience={profile.experience} />
      <SkillsSection skills={profile.skills} />
      <ProjectsSection projects={projects} />
    </>
  );
}
