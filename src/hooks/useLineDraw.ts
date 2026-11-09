import { useLayoutEffect, type RefObject } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "../lib/gsap";

/**
 * scope 内の [data-draw]（見出しの罫線やスキルバー）を左から引く。
 * 最終的な長さは CSS 側の width で決め、ここでは scaleX だけを動かす。
 */
export function useLineDraw(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia(scope);
    mm.add(MOTION_OK, () => {
      const lines = Array.from(scope.querySelectorAll<HTMLElement>("[data-draw]"));
      if (lines.length === 0) return;

      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.batch(lines, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.05,
            delay: 0.2,
          }),
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}
