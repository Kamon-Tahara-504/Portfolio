"use client";

import { useEffect, useState } from "react";

const MAX_ZOOM_COMPENSATION = 4;
const BASELINE_DPR_STORAGE_KEY = "portfolio-baseline-device-pixel-ratio";

function getBaselineDevicePixelRatio(): number {
  const currentDevicePixelRatio = window.devicePixelRatio;
  // macOS のRetina環境では100%時のDPRが通常2。縮小状態で初めて開いても基準を失わない。
  const platformBaseline = navigator.platform.includes("Mac") ? 2 : 1;

  try {
    const storedValue = Number(window.localStorage.getItem(BASELINE_DPR_STORAGE_KEY));
    const validStoredValue =
      Number.isFinite(storedValue) && storedValue > 0 ? storedValue : 0;
    const baselineDevicePixelRatio = Math.max(
      platformBaseline,
      currentDevicePixelRatio,
      validStoredValue
    );

    // 再読み込み後も、最初に記録した100%時の倍率を基準として使う。
    window.localStorage.setItem(
      BASELINE_DPR_STORAGE_KEY,
      String(baselineDevicePixelRatio)
    );
    return baselineDevicePixelRatio;
  } catch {
    // ストレージを利用できない環境では、現在値をこの表示中だけの基準にする。
  }

  return Math.max(platformBaseline, currentDevicePixelRatio);
}

// 初回表示時の DPR を100%時の基準として、ズームアウト分だけ逆倍率を返す。
export function useBrowserZoomCompensation(): number {
  const [compensation, setCompensation] = useState(1);

  useEffect(() => {
    const baselineDevicePixelRatio = getBaselineDevicePixelRatio();

    const syncCompensation = () => {
      const currentDevicePixelRatio = window.devicePixelRatio;
      if (currentDevicePixelRatio <= 0) return;

      // DiaなどDPRが変わらないブラウザ向けに、ズームで広がるCSS表示幅からも倍率を推定する。
      const screenWidth = window.screen.availWidth;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportCompensation =
        screenWidth > 0 ? Math.max(1, viewportWidth / screenWidth) : 1;
      const devicePixelRatioCompensation =
        baselineDevicePixelRatio / currentDevicePixelRatio;
      const nextCompensation = Math.min(
        MAX_ZOOM_COMPENSATION,
        Math.max(
          1,
          devicePixelRatioCompensation,
          viewportCompensation
        )
      );

      // 小数誤差による不要な再描画を避ける。
      setCompensation(Math.round(nextCompensation * 100) / 100);
    };

    syncCompensation();
    const documentResizeObserver = new ResizeObserver(syncCompensation);
    documentResizeObserver.observe(document.documentElement);
    window.addEventListener("resize", syncCompensation);
    window.visualViewport?.addEventListener("resize", syncCompensation);

    return () => {
      documentResizeObserver.disconnect();
      window.removeEventListener("resize", syncCompensation);
      window.visualViewport?.removeEventListener("resize", syncCompensation);
    };
  }, []);

  return compensation;
}
