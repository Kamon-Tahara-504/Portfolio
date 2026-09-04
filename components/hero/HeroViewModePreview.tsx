"use client";

import { useEffect, useState } from "react";
import { resolveAssetPath } from "@/lib/collectLocalAssetUrls";
import type { PortfolioViewMode } from "@/types/portfolioView";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
const previewImage = resolveAssetPath("/images/profile/Top1.jpg", basePath);

// 本編 PageBackground のオーバーレイに合わせる。
const PERSONAL_OVERLAY_OPACITY = 0.42;
// 黒背景から本番プレビューへ切り替える時間（ms）。眩しさ軽減のため長め。
const PREVIEW_FADE_MS = 1400;

interface HeroViewModePreviewProps {
  previewMode: PortfolioViewMode | null;
}

// ホバー中のビューモードを本編と同じ見た目でクロスフェードプレビューする。
export default function HeroViewModePreview({ previewMode }: HeroViewModePreviewProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const transitionClass = prefersReducedMotion
    ? "transition-none"
    : "transition-opacity ease-in-out";
  const transitionStyle = prefersReducedMotion ? undefined : { transitionDuration: `${PREVIEW_FADE_MS}ms` };

  const isPersonal = previewMode === "personal";
  const isRecruiter = previewMode === "recruiter";

  // 黒ベースは未ホバー時のみ。プレビュー時は本編レイヤーへ完全クロスフェード。
  const blackOpacity = previewMode === null ? 1 : 0;
  const personalOpacity = isPersonal ? 1 : 0;
  const recruiterOpacity = isRecruiter ? 1 : 0;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* 未ホバー: 黒 */}
      <div
        className={`absolute inset-0 bg-black ${transitionClass}`}
        style={{ ...transitionStyle, opacity: blackOpacity }}
      />

      {/* 個人向け: 本編 PageBackground と同構成 */}
      <div
        className={`absolute inset-0 ${transitionClass}`}
        style={{ ...transitionStyle, opacity: personalOpacity }}
      >
        <img
          src={previewImage}
          alt=""
          className="absolute inset-0 h-full w-full scale-101 object-cover blur-[3px]"
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: PERSONAL_OVERLAY_OPACITY }}
        />
      </div>

      {/* 担当者様向け: 本編と同じ白背景（黒上の半透明ではなく完全な白） */}
      <div
        className={`absolute inset-0 bg-white ${transitionClass}`}
        style={{ ...transitionStyle, opacity: recruiterOpacity }}
      />
    </div>
  );
}

export { PREVIEW_FADE_MS };
