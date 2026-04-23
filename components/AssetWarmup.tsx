"use client";

import { useEffect, useMemo } from "react";
import { collectLocalAssetUrls } from "@/lib/collectLocalAssetUrls";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
const MAX_WARMUP_IMAGES = 8;

function scheduleIdle(fn: () => void) {
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    ric(() => fn(), { timeout: 2500 });
  } else {
    setTimeout(fn, 48);
  }
}

function warmupImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = url;
  });
}

/**
 * ベストエフォートで HTTP キャッシュを温める（パス誤りはここでも失敗する）。
 * 失敗しても表示コンポーネント側の挙動は変えない。
 */
export default function AssetWarmup() {
  const { imageUrls } = useMemo(
    () => collectLocalAssetUrls(basePath),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const shouldSkipWarmup = () => {
      const connection = navigator.connection;
      return Boolean(
        connection?.saveData ||
          connection?.effectiveType === "slow-2g" ||
          connection?.effectiveType === "2g"
      );
    };

    const run = async () => {
      if (shouldSkipWarmup()) return;
      const warmupTargets = imageUrls.slice(0, MAX_WARMUP_IMAGES);
      for (const url of warmupTargets) {
        if (cancelled) return;
        await new Promise<void>((r) => scheduleIdle(() => r()));
        if (cancelled) return;
        await warmupImage(url);
      }
    };

    const startWarmup = () => {
      // 初期表示中の帯域競合を避けるため、ロード完了後にウォームアップを開始する。
      scheduleIdle(() => {
        if (!cancelled) {
          run();
        }
      });
    };

    if (document.readyState === "complete") {
      startWarmup();
    } else {
      window.addEventListener("load", startWarmup, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", startWarmup);
    };
  }, [imageUrls]);

  return null;
}
