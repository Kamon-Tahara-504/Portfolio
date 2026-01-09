export interface MoreInfo {
  title?: string;
  items?: Array<{
    label: string;
    value: string;
  }>;
  description?: string;
}

export interface About {
  image: string;
  furigana?: string;
  description: string;
  birthDate?: string;
  birthplace?: string;
  hobby?: string;
  moreInfo?: MoreInfo;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
  startDate?: string; // "YYYY-MM" format
  endDate?: string | null; // "YYYY-MM" format or null for ongoing
}

export interface Skills {
  frontend: Skill[];
  backend: Skill[];
  mobile: Skill[];
  tools: Skill[];
}

export interface Contact {
  email?: string;
  phone?: string;
  github?: string;
}

export interface Profile {
  name: string;
  nameEn?: string;
  age?: number | string;
  title: string;
  developerTitle?: string;
  about: About;
  contact?: Contact;
  experience: Experience[];
  skills: Skills;
}

