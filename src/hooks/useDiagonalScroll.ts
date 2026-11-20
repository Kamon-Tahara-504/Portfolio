import { useLayoutEffect, type RefObject } from "react";
import { gsap, MOTION_OK } from "../lib/gsap";

// セクション境界で横にずらす量（画面幅に対する割合）
const SHIFT_RATIO = 0.45;

/**
 * スクロール量に連動して、サイト全体が斜め下へ進んでいるように見せる。
 *
 * scope の直下にある各セクションの境目ごとに、
 * 前のセクションの中身を横へ送り出し、次のセクションの中身を反対側から迎え入れる。
 * 背景グリッドも同じ量だけ動かすことで「要素が動く」のではなく「視点が動く」印象にする。
 * 境目ごとに向きを反転させ、右下・左下へジグザグに進む。
 *
 * 横に動かすのは section 内の [data-shift]（中身）だけにする。
 * 画面幅いっぱいの背景画像や塗りまで動かすと、ずれた瞬間にその端が画面内に見えてしまうため、
 * section 自体は不透明度だけを変える。
 *
 * 境目の区間だけを動かし、セクションの中を読んでいる間は静止させる。
 */
export function useDiagonalScroll(
  scopeRef: RefObject<HTMLElement | null>,
  gridRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const grid = gridRef.current;
    if (!scope || !grid) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const sections = Array.from(scope.children) as HTMLElement[];
      const shift = () => window.innerWidth * SHIFT_RATIO;
      const contentOf = (section: HTMLElement) =>
        section.querySelector<HTMLElement>("[data-shift]") ?? section;

      // グリッドは境目を通過するたびに移動先が積み上がるため、各境目の開始位置を持っておく
      let gridOffset = 0;

      sections.slice(1).forEach((next, index) => {
        const prev = sections[index];
        // 偶数番目の境目は内容が左へ流れる（＝視点が右下へ進む）
        const direction = index % 2 === 0 ? -1 : 1;
        const gridFrom = gridOffset;
        const gridTo = gridOffset + direction;
        gridOffset = gridTo;

        const rows = prev.querySelectorAll<HTMLElement>("[data-hero-row]");
        // Hero は中身が先に消えるため、About だけ入場を上寄せする
        const fromHero = rows.length > 0;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: next,
            start: fromHero ? "top 82%" : "top 65%",
            end: fromHero ? "top 32%" : "top 15%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        if (fromHero) {
          // 名前などの段も、About 入場を待たず Hero スクロール直後に送り出す
          gsap.fromTo(
            rows,
            { x: 0 },
            {
              x: () => direction * shift(),
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: prev,
                start: "top top",
                end: "+=25%",
                scrub: 0.3,
                invalidateOnRefresh: true,
              },
            },
          );
          // オブジェクトはセクション遷移を待たず、Hero を少しスクロールした時点で格納する
          const media = prev.querySelector("[data-hero-media]")?.parentElement;
          if (media) {
            gsap.fromTo(
              media,
              { yPercent: 0, opacity: 1 },
              {
                yPercent: -45,
                opacity: 0,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: prev,
                  start: "top top",
                  end: "+=22%",
                  scrub: 0.3,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
        } else {
          // prev は一つ前の境目で入場済みの状態から始まるため、生成時に値を上書きしない
          tl.fromTo(prev, { autoAlpha: 1 }, { autoAlpha: 0, immediateRender: false }, 0).fromTo(
            contentOf(prev),
            { x: 0 },
            { x: () => direction * shift(), immediateRender: false },
            0,
          );
        }

        tl.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1 }, 0)
          .fromTo(contentOf(next), { x: () => -direction * shift() }, { x: 0 }, 0)
          .fromTo(
            grid,
            { x: () => gridFrom * shift() },
            { x: () => gridTo * shift(), immediateRender: false },
            0,
          );
      });
    });

    return () => mm.revert();
  }, [scopeRef, gridRef]);
}
