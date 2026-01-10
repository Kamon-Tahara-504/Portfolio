export interface DevelopmentProcess {
  designPhilosophy: string;
  implementationHighlights: string;
  learnings: string;
  futureImprovements: string;
}

export interface DevelopmentDates {
  startDate: string;
  endDate: string;
  lastUpdated: string;
}

export interface Repository {
  url: string;
  label: string;
}

export interface Development {
  techStack: string[];
  developmentProcess: DevelopmentProcess;
  dates: DevelopmentDates;
  repository: Repository;
}

