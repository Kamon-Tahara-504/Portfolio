import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { Flip, gsap } from "../lib/gsap";

type Refs = {
  backdrop: RefObject<HTMLElement | null>;
  /** 中身を持つ拡大表示の本体 */
  card: RefObject<HTMLElement | null>;
  /** 白地と枠線だけの要素。中身と分けることで、枠を伸ばしても中身の位置計算がずれない */
  frame: RefObject<HTMLElement | null>;
};

const DURATION = 0.8;
// 格納の終点は一覧の写真より 0.5px 下に見えるため、写真だけ上へずらして着地させる
const CLOSE_IMAGE_NUDGE_Y = 0.5;
const EASE = "power3.inOut";
const PART = "[data-flip-id]";
const EXTRA = "[data-extra]";
const CARD_ONLY = "[data-card-only]";
const CARD_NUMBER = "[data-card-number]";
/** 拡大表示の中の区切り線。伸びている途中に線が見えると形が崩れて見えるため、ほぼ広がり切ってから出す */
const LINE = "[data-line]";
const FRAME_LINE = "[data-frame-line]";
const FRAME_LINE_OFF = "inset 0 0 0 1px rgba(17, 17, 17, 0)";
const LINE_AT = DURATION * 0.8;
const FADE = 0.3;
// ホバーの左バーと同じ時間。このあいだは拡大側を出さず、番号の格納を見せる
const NUMBER_OUT = 0.3;
const CLEAR = "rgba(255, 255, 255, 0)";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 画像枠は縦横比が変わるため、拡大縮小ではなく実際の幅と高さを伸ばして画像を歪ませない
const isImagePart = (el: Element) => el.querySelector("img") !== null;

// 文字の大きさは移動の後半でだけ変える。移動と同時に箱へ合わせると縦横の倍率が揃わず文字が歪むため
const GROW_AT = DURATION * 0.45;
const SHRINK_END = DURATION * 0.55;

/**
 * from の位置・文字サイズ・見えている高さを、part(拡大表示側)から見た値で返す。
 * 倍率は縦横共通にして文字を歪ませない。
 * clip は一覧で見えていた高さより下を隠す量で、3 行で切った説明文の続きが一度に現れるのを防ぐ。
 */
function textOffset(from: Element, part: HTMLElement) {
  const a = from.getBoundingClientRect();
  const b = part.getBoundingClientRect();
  const fontSize = (el: Element) => parseFloat(getComputedStyle(el).fontSize);
  const scale = fontSize(from) / fontSize(part);
  const clip = Math.max(0, part.offsetHeight - a.height / scale);

  // 行の高さや余白は一覧と拡大表示で違うため、箱ではなく文字そのものの左上が重なるように移動量を決める。
  // part は左上を基準に scale 倍されるので、箱から文字までの距離も scale 倍して差し引く
  const from0 = glyphRect(from);
  const part0 = glyphRect(part);
  return {
    x: from0.left - b.left - (part0.left - b.left) * scale,
    y: from0.top - b.top - (part0.top - b.top) * scale,
    scale,
    clip,
  };
}

/** 要素内の文字が描かれている範囲の外接矩形。行の高さによる上下の余白を含まない */
function glyphRect(el: Element) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = range.getClientRects()[0];
  return rect ?? el.getBoundingClientRect();
}

const inset = (bottom: number) => `inset(0px 0px ${bottom}px 0px)`;

function addTextOpen(tl: gsap.core.Timeline, part: HTMLElement, origin: Element) {
  const { x, y, scale, clip } = textOffset(origin, part);
  const grow = { duration: DURATION - GROW_AT, ease: "power2.inOut", immediateRender: true };
  gsap.set(part, { transformOrigin: "0 0" });
  tl.from(part, { x, y, duration: DURATION, ease: EASE }, 0)
    .fromTo(part, { scale }, { scale: 1, ...grow }, GROW_AT)
    .fromTo(part, { clipPath: inset(clip) }, { clipPath: inset(0), ...grow }, GROW_AT);
}

function addTextClose(tl: gsap.core.Timeline, part: HTMLElement, dest: Element, at: number) {
  const { x, y, scale, clip } = textOffset(dest, part);
  const shrink = { duration: SHRINK_END, ease: "power2.inOut" };
  gsap.set(part, { transformOrigin: "0 0" });
  tl.to(part, { x, y, duration: DURATION, ease: EASE }, at)
    .to(part, { scale, ...shrink }, at)
    .fromTo(part, { clipPath: inset(0) }, { clipPath: inset(clip), ...shrink }, at);
}

const findPair = (root: Element, part: HTMLElement) =>
  root.querySelector(`[data-flip-id="${part.dataset.flipId}"]`);

/**
 * 一覧のカード(source)と拡大表示で同じ data-flip-id を持つ部品同士を Flip でつなぎ、
 * 画像や文字が一覧の位置からそのまま大きくなって拡大表示へ移るように見せる。
 * 一覧にない部品(data-extra)はフェードだけで出し入れする。
 */
export function useCardExpand(refs: Refs, source: HTMLElement) {
  const closing = useRef(false);

  // 初回描画前に開始状態をセットし、拡大し終わった状態が一瞬見えるのを防ぐ
  useLayoutEffect(() => {
    const backdrop = refs.backdrop.current;
    const card = refs.card.current;
    const frame = refs.frame.current;
    if (!backdrop || !card || !frame) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.from([backdrop, frame, card], { autoAlpha: 0, duration: 0.3 });
        return;
      }

      const state = Flip.getState(source.querySelectorAll(PART));
      const parts = gsap.utils.toArray<HTMLElement>(card.querySelectorAll(PART));
      const frameVars = Flip.fit(frame, source, { getVars: true, scale: false }) as gsap.TweenVars;

      // 一覧の位置から移動してくる部品が、拡大表示のスクロール領域で切れないようにする
      gsap.set(card, { overflow: "visible" });

      const tl = gsap
        .timeline({
          delay: NUMBER_OUT,
          onComplete: () => {
            gsap.set(card, { clearProps: "overflow" });
            gsap.set(frame, { clearProps: "all" });
          },
        })
        .set([backdrop, frame, card], { autoAlpha: 1 }, 0)
        .set(source.querySelectorAll(PART), { autoAlpha: 0 }, 0)
        .from(backdrop, { autoAlpha: 0, duration: DURATION * 0.6, ease: "power1.out" }, 0)
        .from(frame, { ...frameVars, duration: DURATION, ease: EASE }, 0)
        // 枠の白地を最初から出すと下にある一覧カードの線や番号が一瞬で隠れるため、白地とカード側の装飾を入れ替えるように切り替える
        .from(frame, { backgroundColor: CLEAR, duration: FADE, ease: "power1.out" }, 0)
        .to(source.querySelectorAll(`${CARD_ONLY}:not(${CARD_NUMBER})`), { autoAlpha: 0, duration: FADE, ease: "power1.out" }, 0)
        .to(source, { borderColor: "transparent", duration: FADE, ease: "power1.out" }, 0)
        .add(
          Flip.from(state, { targets: parts.filter(isImagePart), duration: DURATION, ease: EASE, immediateRender: false }),
          0,
        );

      parts
        .filter((el) => !isImagePart(el))
        .forEach((part) => {
          const origin = findPair(source, part);
          if (origin) addTextOpen(tl, part, origin);
        });

      // 上のバーを y で動かすと、写真が止まりきったあとに写真の上の隙間が数px開く
      const extras = gsap.utils.toArray<HTMLElement>(card.querySelectorAll(EXTRA));
      tl.from(extras.filter((el) => el.dataset.extra === "pin"), { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, LINE_AT)
        .from(extras.filter((el) => el.dataset.extra !== "pin"), { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.out" }, LINE_AT)
        .from(card.querySelectorAll(LINE), { borderColor: CLEAR, duration: FADE, ease: "power1.out" }, LINE_AT)
        .from(card.querySelectorAll(FRAME_LINE), { boxShadow: FRAME_LINE_OFF, duration: FADE, ease: "power1.out" }, LINE_AT);

      // Flip の初期配置より後に隠す。番号が左へ縮むあいだ、拡大側を写真の上に出さない
      gsap.set([backdrop, frame, card], { autoAlpha: 0 });
    });
    // context の外で縮める。閉じたときの revert で scale が 1 に戻り、伸びる動きが消えるのを防ぐ
    gsap.to(source.querySelectorAll(CARD_NUMBER), {
      scaleX: 0,
      duration: NUMBER_OUT,
      ease: "power3.out",
      transformOrigin: "left top",
    });
    return () => ctx.revert();
  }, [refs, source]);

  const close = useCallback(
    (onDone: () => void) => {
      const backdrop = refs.backdrop.current;
      const card = refs.card.current;
      const frame = refs.frame.current;
      if (closing.current || !backdrop || !card || !frame) return;
      closing.current = true;

      if (prefersReducedMotion()) {
        gsap.to([backdrop, frame, card], { autoAlpha: 0, duration: 0.25, onComplete: onDone });
        return;
      }

      gsap.set(card, { overflow: "visible" });
      const tl = gsap.timeline({ onComplete: onDone });
      tl.to(card.querySelectorAll(EXTRA), { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0)
        .to(card.querySelectorAll(LINE), { borderColor: CLEAR, duration: 0.2, ease: "power1.in" }, 0)
        .to(card.querySelectorAll(FRAME_LINE), { boxShadow: FRAME_LINE_OFF, duration: 0.2, ease: "power1.in" }, 0);

      card.querySelectorAll<HTMLElement>(PART).forEach((part) => {
        const dest = findPair(source, part);
        if (!dest) return;
        if (isImagePart(part)) {
          const vars = Flip.fit(part, dest, { getVars: true, duration: DURATION, ease: EASE }) as gsap.TweenVars;
          vars.y = Number(vars.y ?? 0) - CLOSE_IMAGE_NUDGE_Y;
          tl.to(part, vars, 0.1);
        } else {
          addTextClose(tl, part, dest, 0.1);
        }
      });

      tl.add(Flip.fit(frame, source, { scale: false, duration: DURATION, ease: EASE }) as gsap.core.Tween, 0.1)
        .to(backdrop, { autoAlpha: 0, duration: DURATION * 0.5, ease: "power1.in" }, DURATION * 0.6)
        .to(frame, { backgroundColor: CLEAR, duration: FADE, ease: "power1.in" }, DURATION + 0.1 - FADE)
        .to(source.querySelectorAll(`${CARD_ONLY}:not(${CARD_NUMBER})`), { autoAlpha: 1, duration: FADE, ease: "power3.out" }, DURATION + 0.1 - FADE)
        .to(source, { borderColor: getComputedStyle(frame).borderTopColor, duration: FADE, ease: "power1.in" }, DURATION + 0.1 - FADE);
    },
    [refs, source],
  );

  return { close };
}
