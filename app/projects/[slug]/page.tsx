import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import { Project } from "@/types/project";
import projectsData from "@/data/projects.json";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = projectsData as Project[];
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = projectsData as Project[];
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = projectsData as Project[];
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const categoryLabel = project.category === "web" ? "Web" : "Mobile";

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center text-sm font-medium text-black/70 underline-offset-4 hover:text-black hover:underline"
        >
          ← Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-12 border-b border-black pb-8">
          <div className="mb-4">
            <span className="bg-black px-3 py-1 text-xs font-medium text-white">
              {categoryLabel}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mb-6 text-lg text-black/70">{project.description}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
              >
                GitHub
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12">
            <ImageGallery images={project.images} alt={project.title} />
          </div>
        )}

        {/* Project Details */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="border border-black bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Date</h2>
            <p className="text-black/70">
              {new Date(project.date).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

