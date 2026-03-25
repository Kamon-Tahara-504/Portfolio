export interface About {
  image: string;
  furigana?: string;
  description: string;
  birthDate?: string;
  birthplace?: string;
  hobby?: string;
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

export interface HeroData {
  name: string;
  nameEn?: string;
  title: string;
  developerTitle?: string;
}

export interface AboutData {
  name: string;
  nameEn?: string;
  age?: number | string;
  about: About;
  contact?: Contact;
}

