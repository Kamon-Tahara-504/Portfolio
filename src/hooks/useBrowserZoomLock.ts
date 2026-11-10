import { useEffect, useState } from "react";

// 表示倍率の許容範囲外でロックする。
const LOCK_MIN_RATIO = 0.8; // 80% 以下
const LOCK_MAX_RATIO = 1.3; // 130% より大きい
// ブラウザの一般的なズーム段階。測定ノイズで 101% になるのを防ぐ。
const BROWSER_ZOOM_STEPS = [
  25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
];

export type BrowserZoomLockReason = "too-large" | "too-small" | null;

export interface BrowserZoomLockState {
  isLocked: boolean;
  reason: BrowserZoomLockReason;
  /** 推定表示倍率（100 = 100%） */
  zoomPercent: number;
}

function getPlatformNativeDpr(): number {
  // Retina Mac はブラウザ 100% のとき DPR 2 が一般的。OS の拡大とブラウザズームを分ける。
  return navigator.platform.includes("Mac") ? 2 : 1;
}

// 差が約 2 倍なら、1x 画面なのに基準 DPR を 2 と置いている。サイドバーの膨らみではない。
const SIDEBAR_GAP_LIMIT = 1.9;

function readOuterInnerRatio(): number | null {
  const outerWidth = window.outerWidth;
  const innerWidth = window.innerWidth;
  if (outerWidth <= 0 || innerWidth <= 0) return null;

  const ratio = outerWidth / innerWidth;
  // DevTools などで極端な値になる場合は捨てる。
  if (!Number.isFinite(ratio) || ratio < 0.35 || ratio > 4) return null;
  return ratio;
}

function readDprRatio(): number | null {
  const currentDpr = window.devicePixelRatio;
  const nativeDpr = getPlatformNativeDpr();
  if (currentDpr <= 0 || nativeDpr <= 0) return null;

  const ratio = currentDpr / nativeDpr;
  return Number.isFinite(ratio) ? ratio : null;
}

/**
 * ブラウザの表示倍率を推定する。
 * outer/inner は OS の表示スケールでは膨らまないが、サイドバーの幅が outer にだけ入る。
 * そのとき DPR 比の方が小さいので、差が 2 倍未満ならそちらを使う。
 */
function getBrowserZoomRatio(): number {
  const fromOuter = readOuterInnerRatio();
  const fromDpr = readDprRatio();
  if (fromOuter == null) return fromDpr ?? 1;
  if (fromDpr == null) return fromOuter;

  const gap = fromOuter / fromDpr;
  if (fromDpr < fromOuter && gap < SIDEBAR_GAP_LIMIT) return fromDpr;
  return fromOuter;
}

function toZoomPercent(ratio: number): number {
  const rawPercent = ratio * 100;
  return BROWSER_ZOOM_STEPS.reduce((best, step) =>
    Math.abs(step - rawPercent) < Math.abs(best - rawPercent) ? step : best,
  );
}

function readZoomLockState(): BrowserZoomLockState {
  // 80% の DPR は 1.6 / 2 が 0.8000000119 になり、そのまま比べると 80% が範囲内に残る。
  const ratio = Math.round(getBrowserZoomRatio() * 1000) / 1000;
  const zoomPercent = toZoomPercent(ratio);

  if (ratio > LOCK_MAX_RATIO) {
    return { isLocked: true, reason: "too-large", zoomPercent };
  }
  if (ratio <= LOCK_MIN_RATIO) {
    return { isLocked: true, reason: "too-small", zoomPercent };
  }
  return { isLocked: false, reason: null, zoomPercent };
}

/** 表示倍率が 80% 以下、または 130% より大きいとき閲覧を止める。 */
export function useBrowserZoomLock(): BrowserZoomLockState {
  const [state, setState] = useState<BrowserZoomLockState>({
    isLocked: false,
    reason: null,
    zoomPercent: 100,
  });

  useEffect(() => {
    const sync = () => {
      setState(readZoomLockState());
    };

    sync();
    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
    };
  }, []);

  return state;
}
