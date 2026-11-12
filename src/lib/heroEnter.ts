import { ScrollTrigger } from "./gsap";

let pending = Promise.resolve();
let release = () => {};

/** 入場の途中は ScrollTrigger の再計算を待たせる */
export function beginHeroEnter() {
  pending = new Promise((resolve) => {
    release = () => {
      release = () => {};
      resolve();
    };
  });
}

export function whenHeroEnterSettled() {
  return pending;
}

/** 入場が終わった、または途中で止めたあとに位置を確定して再計算する */
export function finishHeroEnter() {
  release();
  ScrollTrigger.refresh();
}
