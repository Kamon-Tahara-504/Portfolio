import type { Project } from "@/types/project";

export const COMING_SOON_TITLE = "準備中";

export function isComingSoonProject(
  project: Pick<Project, "title">
): boolean {
  return project.title.trim() === COMING_SOON_TITLE;
}
