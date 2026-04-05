"use client";

import { useEffect, useMemo } from "react";
import { collectLocalAssetUrls } from "@/lib/collectLocalAssetUrls";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

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
    img.onload = () => {
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {}).finally(done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = url;
  });
}

/**
 * ベストエフォートで HTTP キャッシュを温める（パス誤りはここでも失敗する）。
 * 失敗しても表示コンポーネント側の挙動は変えない。
 */
export default function AssetWarmup() {
  const { imageUrls, videoUrls } = useMemo(
    () => collectLocalAssetUrls(basePath),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (const url of imageUrls) {
        if (cancelled) return;
        await new Promise<void>((r) => scheduleIdle(() => r()));
        if (cancelled) return;
        await warmupImage(url);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [imageUrls]);

  return (
    <div
      className="pointer-events-none fixed top-0 -left-[9999px] z-0 h-px w-px overflow-hidden opacity-0"
      aria-hidden
    >
      {videoUrls.map((src) => (
        <video
          key={src}
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      ))}
    </div>
  );
}
