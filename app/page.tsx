import Link from "next/link";
import GridPattern from "@/components/GridPattern";
import ProjectGrid from "@/components/ProjectGrid";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

export default function Home() {
  const projects = projectsData as Project[];
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative border-b border-black bg-white">
        <GridPattern className="opacity-30" size={60} strokeWidth={1} />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Portfolio
            </h1>
            <p className="mb-8 text-lg text-black/70 md:text-xl">
              Webアプリケーションとモバイルアプリケーションの作品集
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center border-2 border-black bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90"
              >
                View All Projects
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border-2 border-black bg-white px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-b border-black bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-black/70 underline-offset-4 hover:text-black hover:underline"
            >
              View All →
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Let's Work Together
          </h2>
          <p className="mb-8 text-lg text-black/70">
            お問い合わせやご相談はお気軽にどうぞ
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center border-2 border-black bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
