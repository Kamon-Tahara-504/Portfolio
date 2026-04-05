import projectsData from "@/data/projects.json";
import aboutData from "@/data/about.json";
import type { Project } from "@/types/project";
import type { AboutData } from "@/types/profile";

export function resolveAssetPath(src: string, basePath: string): string {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}

/** ポートフォリオ内の静的画像・動画 URL を集約（basePath 適用・画像は重複排除）。ウォームアップ用。 */
export function collectLocalAssetUrls(basePath: string): {
  imageUrls: string[];
  videoUrls: string[];
} {
  const projects = projectsData as Project[];
  const { about } = aboutData as AboutData;

  const imageSet = new Set<string>();
  for (const p of projects) {
    for (const img of p.images ?? []) {
      imageSet.add(resolveAssetPath(img, basePath));
    }
  }
  imageSet.add(resolveAssetPath(about.image, basePath));
  imageSet.add(resolveAssetPath("/images/projects/appstore.png", basePath));
  imageSet.add(resolveAssetPath("/images/hero/hero.jpg", basePath));

  const videoUrls = [
    resolveAssetPath("/images/profile/Galaxy1.mp4", basePath),
    resolveAssetPath("/images/profile/Galaxy2.mp4", basePath),
  ];

  return {
    imageUrls: [...imageSet],
    videoUrls,
  };
}
