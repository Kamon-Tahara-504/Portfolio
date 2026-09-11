import projectsData from "@/data/projects.json";
import aboutData from "@/data/about.json";
import type { Project } from "@/types/project";
import type { AboutData } from "@/types/profile";

export function resolveAssetPath(src: string, basePath: string): string {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}

/** 初期表示で優先して取得したい画像 URL 一覧。 */
export function collectCriticalImageUrls(basePath: string): string[] {
  const { about } = aboutData as AboutData;
  return [
    resolveAssetPath(about.image, basePath),
    resolveAssetPath("/images/section/Hero.png", basePath),
    resolveAssetPath("/images/section/Top1.png", basePath),
    resolveAssetPath("/images/section/Top2.png", basePath),
  ];
}

/** ポートフォリオ内の静的画像 URL を集約（basePath 適用・重複排除）。 */
export function collectLocalAssetUrls(basePath: string): {
  criticalImageUrls: string[];
  warmupImageUrls: string[];
} {
  const projects = projectsData as Project[];
  const criticalImageUrls = collectCriticalImageUrls(basePath);
  const warmupSet = new Set<string>([
    resolveAssetPath("/images/section/Top3.png", basePath),
    resolveAssetPath("/images/section/Top4.png", basePath),
    resolveAssetPath("/images/section/Top5.png", basePath),
    resolveAssetPath("/images/projects/appstore.png", basePath),
  ]);

  for (const p of projects) {
    for (const img of p.images ?? []) {
      warmupSet.add(resolveAssetPath(img, basePath));
    }
  }

  for (const criticalUrl of criticalImageUrls) {
    warmupSet.delete(criticalUrl);
  }

  return {
    criticalImageUrls,
    warmupImageUrls: [...warmupSet],
  };
}
