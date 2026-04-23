import projectsData from "@/data/projects.json";
import aboutData from "@/data/about.json";
import type { Project } from "@/types/project";
import type { AboutData } from "@/types/profile";

export function resolveAssetPath(src: string, basePath: string): string {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}

/** ポートフォリオ内の静的画像 URL を集約（basePath 適用・重複排除）。ウォームアップ用。 */
export function collectLocalAssetUrls(basePath: string): {
  imageUrls: string[];
} {
  const projects = projectsData as Project[];
  const { about } = aboutData as AboutData;

  // 初期表示で効く画像を先頭に寄せ、ウォームアップ件数制限時でも優先されるようにする。
  const imageSet = new Set<string>([
    resolveAssetPath(about.image, basePath),
    resolveAssetPath("/images/hero/hero.jpg", basePath),
    resolveAssetPath("/images/profile/Top1.jpg", basePath),
    resolveAssetPath("/images/profile/Top2.jpg", basePath),
    resolveAssetPath("/images/profile/Top3.jpg", basePath),
    resolveAssetPath("/images/profile/Top4.jpg", basePath),
    resolveAssetPath("/images/profile/Top5.jpg", basePath),
    resolveAssetPath("/images/profile/Top6.jpg", basePath),
    resolveAssetPath("/images/projects/appstore.png", basePath),
  ]);

  for (const p of projects) {
    for (const img of p.images ?? []) {
      imageSet.add(resolveAssetPath(img, basePath));
    }
  }

  return {
    imageUrls: [...imageSet],
  };
}
