import { about, featuredProjects } from "./content";
import { asset } from "./asset";

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

const HERO_IMAGE = asset("/images/section/Top1.1.png");

/** 開いた直後に見せる画像。ゲージの待ち時間で取り切る。 */
function collectCriticalImageUrls(): string[] {
  return [HERO_IMAGE, about.about.image];
}

/** スクロールするとすぐ出る制作カード。Hero よりあとに回す。 */
function collectCardImageUrls(): string[] {
  return [...new Set(featuredProjects.map((project) => project.images[0]).filter(Boolean))];
}

function shouldSkipCardImages(): boolean {
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  return Boolean(
    connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g",
  );
}

function warm(url: string, priority: "high" | "low") {
  const img = new Image();
  img.decoding = "async";
  img.fetchPriority = priority;
  img.src = url;
  // パスが間違っていても表示側は止めない。キャッシュを温めるだけ。
  img.decode().catch(() => {});
}

/** ゲージ表示中に、最初の画面で使う画像をキャッシュへ載せる。 */
export function preloadPageImages() {
  for (const url of collectCriticalImageUrls()) warm(url, "high");
  if (shouldSkipCardImages()) return;
  for (const url of collectCardImageUrls()) warm(url, "low");
}
