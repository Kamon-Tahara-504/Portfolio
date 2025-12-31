export type ProjectCategory = "web" | "mobile";

export interface ProjectLinks {
  github?: string;
  demo?: string;
  appStore?: string;
}

export interface ProjectDateRange {
  startDate?: string;
  endDate?: string;
  releaseDate?: string;
  deployDate?: string;
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
  date: string | ProjectDateRange;
}

