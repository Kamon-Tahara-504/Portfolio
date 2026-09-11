"use client";

import type { BrowserZoomLockState } from "@/lib/useBrowserZoomCompensation";

interface BrowserZoomLockProps {
  lock: BrowserZoomLockState;
}

// 表示倍率が許容範囲外のとき、崩れたレイアウトの閲覧を止める全画面ロック。
export default function BrowserZoomLock({ lock }: BrowserZoomLockProps) {
  if (!lock.isLocked) return null;

  const message =
    lock.reason === "too-large"
      ? "表示倍率が大きすぎます"
      : "表示倍率が小さすぎます";

  const description =
    lock.reason === "too-large"
      ? "ブラウザの表示倍率を下げてから再度お試しください。"
      : "ブラウザの表示倍率を上げてから再度お試しください。";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="browser-zoom-lock-title"
      aria-describedby="browser-zoom-lock-desc"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black px-6"
    >
      <div className="max-w-md text-center text-zinc-100">
        <p
          id="browser-zoom-lock-title"
          className="text-lg font-semibold tracking-[0.18em] uppercase sm:text-xl"
        >
          {message}
        </p>
        <p
          id="browser-zoom-lock-desc"
          className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base"
        >
          {description}
        </p>
        <p className="mt-6 font-mono text-xs tracking-[0.2em] text-zinc-500 tabular-nums">
          NOW CURRENT {lock.zoomPercent}%
        </p>
      </div>
    </div>
  );
}
