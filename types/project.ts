export type ProjectCategory = "web" | "mobile";

/** 自主制作 or 共同制作 */
export type ProjectProductionType = "solo" | "collaborative";

export interface ProjectLinks {
  docs?: string;
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
  /** カード用の短いキャッチコピー。未指定時は description を表示 */
  catchphrase?: string;
  description: string;
  category: ProjectCategory;
  /** 自主制作 or 共同制作。未指定時は自主制作として表示 */
  productionType?: ProjectProductionType;
  images: string[];
  technologies: string[];
  links: ProjectLinks;
  date: string | ProjectDateRange;
}

