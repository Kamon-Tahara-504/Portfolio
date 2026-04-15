import type { Project } from "@/types/project";

// 「準備中」プロジェクトを判定するための比較文字列。
const COMING_SOON_TITLE = "準備中";

// タイトルが準備中表示かどうかを判定する共通関数。
export function isComingSoonProject(
  project: Pick<Project, "title">
): boolean {
  return project.title.trim() === COMING_SOON_TITLE;
}
