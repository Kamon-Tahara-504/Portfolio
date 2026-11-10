import { useEffect } from "react";

function isMediaTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest("img, svg") !== null;
}

/**
 * 画像と SVG の右クリック保存・ドラッグ保存だけを止める。
 * CSS の user-drag だけでは「画像を保存」が残る。余白のメニューは残す。
 */
export function useContentGuard() {
  useEffect(() => {
    const blockMediaAction = (event: Event) => {
      if (isMediaTarget(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockMediaAction);
    document.addEventListener("dragstart", blockMediaAction);
    return () => {
      document.removeEventListener("contextmenu", blockMediaAction);
      document.removeEventListener("dragstart", blockMediaAction);
    };
  }, []);
}
