export interface About {
  image: string;
  furigana?: string;
  description: string;
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

