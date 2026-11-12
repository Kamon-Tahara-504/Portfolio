import { useLayoutEffect } from "react";
import { ScrollTrigger } from "../lib/gsap";
import { whenHeroEnterSettled } from "../lib/heroEnter";

/**
 * マウント中は背景のページスクロールを止める。
 * スクロールバーが消えて本文が横にずれないよう、その幅を padding で補う。
 */
export function useScrollLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };

    root.style.overflow = "hidden";
    root.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
      // ロック中に幅が変わると斜めスクロールの開始位置がずれるため再計算する。
      // 直後に実行すると、ゲージが消えたあとに動いている Hero の入場と画像フェードが
      // 途中で初期状態へ戻される。両方が終わる 1.6 秒よりあとまで待つ
      window.setTimeout(() => {
        whenHeroEnterSettled().then(() => ScrollTrigger.refresh());
      }, 4000);
    };
  }, []);
}
