"use client";

import { useEffect, type RefObject } from "react";

// 値が小さいほど慣性・重さが増す。
const LERP = 0.1;
// 停止後の吸い寄せは、通常追従よりゆっくり。
const ATTRACT_LERP = 0.045;
// ホイール入力の減衰（大きいほど軽く進む）。
const WHEEL_SCALE = 0.78;
// これ以下の差分で補間を止める。
const SETTLE_THRESHOLD = 0.5;
// すでに十分近いときは吸い寄せない（微振動防止）。
const ATTRACT_SKIP_THRESHOLD = 3;
// トラックパッドの微小ノイズを無視する。
const WHEEL_NOISE_THRESHOLD = 0.75;
// 横スクロール領域上では、この量未満の縦入力をバイブ防止のため捨てる。
const NESTED_VERTICAL_TAKEOVER_THRESHOLD = 8;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getNativeScrollRoot(
  target: EventTarget | null,
  root: HTMLElement
): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const nested = target.closest<HTMLElement>("[data-native-scroll]");
  if (!nested || nested === root) return null;
  return nested;
}

function canScrollAxis(element: HTMLElement, axis: "x" | "y"): boolean {
  if (axis === "x") {
    return element.scrollWidth > element.clientWidth + 1;
  }
  return element.scrollHeight > element.clientHeight + 1;
}

/** ビューポート内で見えている面積が最大のセクション先頭位置。 */
function getDominantSectionTop(container: HTMLElement): number {
  const sections = Array.from(container.querySelectorAll<HTMLElement>("section[id]"));
  if (sections.length === 0) return container.scrollTop;

  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;
  const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);

  let bestTop = sections[0].offsetTop;
  let bestVisible = -1;

  for (const section of sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const visible = Math.max(0, Math.min(bottom, viewBottom) - Math.max(top, viewTop));
    if (visible > bestVisible) {
      bestVisible = visible;
      bestTop = top;
    }
  }

  return Math.max(0, Math.min(maxScrollTop, bestTop));
}

/**
 * 重いスムーススクロール。
 * CSS スナップは使わず、停止後に見える面積が大きいセクションへゆっくり吸い寄せる。
 */
export function useHeavySmoothScroll(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || prefersReducedMotion()) return;

    let targetScrollTop = container.scrollTop;
    let currentScrollTop = container.scrollTop;
    let frameId = 0;
    let isAnimating = false;
    let isAttracting = false;

    const finishAnimation = () => {
      isAnimating = false;
      isAttracting = false;
      currentScrollTop = Math.round(currentScrollTop);
      targetScrollTop = currentScrollTop;
      container.scrollTop = currentScrollTop;
      frameId = 0;
    };

    // ネスト領域へ操作を渡すときは現在位置を保ったまま止める。
    const softStopAnimation = () => {
      if (!isAnimating) return;
      if (frameId) cancelAnimationFrame(frameId);
      isAnimating = false;
      isAttracting = false;
      currentScrollTop = container.scrollTop;
      targetScrollTop = currentScrollTop;
      frameId = 0;
    };

    const beginAttractionIfNeeded = () => {
      const dominantTop = getDominantSectionTop(container);
      if (Math.abs(dominantTop - currentScrollTop) <= ATTRACT_SKIP_THRESHOLD) {
        finishAnimation();
        return;
      }

      isAttracting = true;
      isAnimating = true;
      targetScrollTop = dominantTop;
      frameId = requestAnimationFrame(animate);
    };

    const animate = () => {
      const delta = targetScrollTop - currentScrollTop;
      if (Math.abs(delta) <= SETTLE_THRESHOLD) {
        currentScrollTop = targetScrollTop;
        container.scrollTop = currentScrollTop;

        // 通常追従の停止後に、見える面積が大きいセクションへ吸い寄せる。
        if (!isAttracting) {
          beginAttractionIfNeeded();
          return;
        }

        finishAnimation();
        return;
      }

      currentScrollTop += delta * (isAttracting ? ATTRACT_LERP : LERP);
      container.scrollTop = currentScrollTop;
      frameId = requestAnimationFrame(animate);
    };

    const startOrContinueAnimation = () => {
      if (!isAnimating) {
        isAnimating = true;
        currentScrollTop = container.scrollTop;
        frameId = requestAnimationFrame(animate);
      }
    };

    const applyVerticalWheel = (deltaY: number) => {
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      // 新しい入力が入ったら吸い寄せを中断して追従に戻す。
      isAttracting = false;
      targetScrollTop = Math.max(
        0,
        Math.min(maxScrollTop, targetScrollTop + deltaY * WHEEL_SCALE)
      );
      startOrContinueAnimation();
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < WHEEL_NOISE_THRESHOLD && absY < WHEEL_NOISE_THRESHOLD) {
        event.preventDefault();
        return;
      }

      const nested = getNativeScrollRoot(event.target, container);
      if (nested) {
        const horizontalIntent = absX > absY;
        const verticalIntent = absY >= absX;

        // ネストが受けられる軸の入力だけネイティブに渡し、それ以外は本体へ。
        if (horizontalIntent && canScrollAxis(nested, "x")) {
          softStopAnimation();
          return;
        }
        if (verticalIntent && canScrollAxis(nested, "y")) {
          softStopAnimation();
          return;
        }

        // Works のように横専用領域上の縦ホイールは本体スムースへ回す。
        if (verticalIntent) {
          event.preventDefault();
          if (absY < NESTED_VERTICAL_TAKEOVER_THRESHOLD) return;
          applyVerticalWheel(event.deltaY);
          return;
        }

        softStopAnimation();
        return;
      }

      event.preventDefault();
      applyVerticalWheel(event.deltaY);
    };

    const onScrollEndSync = () => {
      if (isAnimating) return;
      targetScrollTop = container.scrollTop;
      currentScrollTop = container.scrollTop;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("scroll", onScrollEndSync, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("scroll", onScrollEndSync);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [containerRef, enabled]);
}
