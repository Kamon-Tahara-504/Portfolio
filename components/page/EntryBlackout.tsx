"use client";

interface EntryBlackoutProps {
  /** 0 = 透明、1 = 完全な黒 */
  opacity: number;
  /** フェード時間（ms）。cover / reveal で切り替える */
  durationMs: number;
  onTransitionEnd: () => void;
}

// 導入→本編の切替で、背景画像の飛びを隠す全画面の黒。
export default function EntryBlackout({
  opacity,
  durationMs,
  onTransitionEnd,
}: EntryBlackoutProps) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[150] bg-black"
      style={{
        opacity,
        transitionProperty: "opacity",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
      onTransitionEnd={(event) => {
        if (event.propertyName !== "opacity") return;
        if (event.target !== event.currentTarget) return;
        onTransitionEnd();
      }}
    />
  );
}
