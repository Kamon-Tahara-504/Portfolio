"use client";

import { useEffect, useState } from "react";

// 表示倍率の許容範囲外でロックする。
const LOCK_MIN_RATIO = 0.5; // 50% 以下
const LOCK_MAX_RATIO = 1.3; // 130% より大きい
// ブラウザの一般的なズーム段階。測定ノイズで +1% になるのを防ぐ。
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
  // Retina Mac はブラウザ 100% 時に DPR 2 が一般的。
  return navigator.platform.includes("Mac") ? 2 : 1;
}

/**
 * ブラウザの表示倍率を推定する。
 * outer/inner は OS の表示スケールと分離でき、ブラウザズーム自体を拾いやすい。
 * 使えない環境だけ DPR 比へフォールバックする。
 */
function getBrowserZoomRatio(): number {
  const outerWidth = window.outerWidth;
  const innerWidth = window.innerWidth;

  if (outerWidth > 0 && innerWidth > 0) {
    const ratio = outerWidth / innerWidth;
    // DevTools 等で極端な値になる場合は捨てる。
    if (Number.isFinite(ratio) && ratio >= 0.35 && ratio <= 4) {
      return ratio;
    }
  }

  const currentDpr = window.devicePixelRatio;
  const nativeDpr = getPlatformNativeDpr();
  if (currentDpr > 0 && nativeDpr > 0) {
    return currentDpr / nativeDpr;
  }

  return 1;
}

function toZoomPercent(ratio: number): number {
  const rawPercent = ratio * 100;
  return BROWSER_ZOOM_STEPS.reduce((best, step) =>
    Math.abs(step - rawPercent) < Math.abs(best - rawPercent) ? step : best
  );
}

function readZoomLockState(): BrowserZoomLockState {
  const ratio = getBrowserZoomRatio();
  const zoomPercent = toZoomPercent(ratio);

  if (ratio > LOCK_MAX_RATIO) {
    return { isLocked: true, reason: "too-large", zoomPercent };
  }
  if (ratio <= LOCK_MIN_RATIO) {
    return { isLocked: true, reason: "too-small", zoomPercent };
  }
  return { isLocked: false, reason: null, zoomPercent };
}

/** 表示倍率が 50% 以下 / 130% より大きいとき閲覧ロックする。 */
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

/** 既存呼び出し互換。自動拡大縮小は行わない。 */
export function useBrowserZoomCompensation(): number {
  return 1;
}
