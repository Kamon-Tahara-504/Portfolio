export interface About {
  image: string;
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
  mobile: Skill[];
  tools: Skill[];
}

export interface Profile {
  name: string;
  title: string;
  about: About;
  experience: Experience[];
  skills: Skills;
}

