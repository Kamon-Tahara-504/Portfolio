export type ProjectCategory = "web" | "mobile";

export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  images: string[];
  technologies: string[];
  links: ProjectLinks;
  date: string;
}

