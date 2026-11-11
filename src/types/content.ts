export type Hero = {
  name: string;
  nameEn: string;
  title: string;
  developerTitle: string;
};

export type Affiliation = {
  type: string;
  name: string;
  stage: string;
  isCurrent: boolean;
};

export type AboutData = {
  name: string;
  nameEn: string;
  about: {
    image: string;
    description: string;
    introduction: string;
    birthDate: string;
    birthplace: string;
    hobby: string;
  };
  contact: {
    email: string;
    github: string;
  };
  affiliations: Affiliation[];
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectLinks = {
  github?: string;
  githubFrontend?: string;
  githubBackend?: string;
  demo?: string;
  appStore?: string;
  docs?: string;
};

export type Project = {
  id: string;
  number: string;
  slug: string;
  title: string;
  catchphrase: string;
  description: string;
  category: string;
  productionType?: string;
  images: string[];
  technologies: string[];
  links: ProjectLinks;
  date: {
    startDate: string;
    endDate?: string;
    deployDate?: string;
    releaseDate?: string;
  };
};

export type Skill = {
  name: string;
  level: number;
  /** "YYYY-MM"。無い項目は自己評価だけに出す */
  startDate?: string;
  /** null は進行中 */
  endDate?: string | null;
};

export type SkillCategory = {
  key: string;
  label: string;
  skills: Skill[];
};

export type ProjectLink = {
  label: string;
  url: string;
};
