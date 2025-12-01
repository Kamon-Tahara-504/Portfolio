import { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "A collection of web and mobile applications",
};

export default function ProjectsPage() {
  const projects = projectsData as Project[];

  return (
    <div className="border-b border-black bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Projects
          </h1>
          <p className="text-lg text-black/70">
            Webアプリケーションとモバイルアプリケーションの作品集
          </p>
        </div>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}

