/**
 * GitHub Linguist の言語色（hex）。
 * @see https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml
 */
const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  CSS: "#563d7c",
  HTML: "#e34c26",
  C: "#555555",
  "C#": "#178600",
  "C++": "#f34b7d",
  Python: "#3572A5",
  Django: "#092e20",
  Java: "#b07219",
  Dart: "#00B4AB",
  Flutter: "#00B4AB", // Dart ベース
  "Flutter / Dart": "#00B4AB",
  "Spring / Java": "#6DB33F", // Spring Framework のメインカラー（黄緑）
  "Django / Python": "#092e20",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  "SwiftUI / Swift": "#F05138",
  "React Native": "#61dafb",
  "node.js": "#f7df1e", // JavaScript
  React: "#61dafb",
  "React.js": "#61dafb",
  "Next.js": "#000000", // 公式ロゴに合わせる（Linguist には未登録のため）
};

const FALLBACK_COLOR = "#6b7280";

/**
 * 言語名から GitHub の言語色（hex）を返す。未定義の場合はフォールバック色を返す。
 */
export function getGitHubLanguageColor(languageName: string): string {
  if (!languageName || !languageName.trim()) return FALLBACK_COLOR;
  const trimmed = languageName.trim();
  return GITHUB_LANGUAGE_COLORS[trimmed] ?? FALLBACK_COLOR;
}
