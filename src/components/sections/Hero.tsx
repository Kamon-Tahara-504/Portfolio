import { useLayoutEffect, useRef } from "react";
import { asset } from "../../lib/asset";
import { about, hero, splitParagraphs } from "../../lib/content";
import { beginHeroEnter, finishHeroEnter } from "../../lib/heroEnter";
import { gsap, MOTION_OK } from "../../lib/gsap";
import { scrollToSection } from "../../lib/scroll";
import styles from "./Hero.module.css";

// スクロール遷移でセクションを送り出す横移動量と同じ割合
const SHIFT_RATIO = 0.45;
const ROW_STAGGER = 0.12;
const ROW_DURATION = 0.9;

const headline = splitParagraphs(about.about.description)[0];

type Props = {
  /** 導入ゲージが終わったら true。白が消えるまで Hero を画面外に置いておく */
  ready: boolean;
};

export function Hero({ ready }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    let settle = () => {};
    mm.add(MOTION_OK, () => {
      const entering = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-hero-in]"));
      if (entering.length > 0) {
        const offscreen = -window.innerWidth * SHIFT_RATIO;
        // 退場は外側の data-hero-row が持つ。入場は内側だけを動かし、同じ x を奪わない
        gsap.set(entering, { x: ready ? 0 : offscreen });
        if (ready) {
          beginHeroEnter();
          let settled = false;
          settle = () => {
            if (settled) return;
            settled = true;
            gsap.set(entering, { clearProps: "x" });
            finishHeroEnter();
          };
          gsap.fromTo(
            entering,
            { x: offscreen },
            { x: 0, duration: ROW_DURATION, stagger: ROW_STAGGER, ease: "power3.inOut", onComplete: settle, onInterrupt: settle },
          );
        }
      }

      // 背景だけ縦方向に遅らせ、セクション全体の斜め移動に奥行きを足す
      gsap.to(gsap.utils.selector(root)("[data-hero-media]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    });

    return () => {
      // 入場の途中で破棄されても、段を画面外に残さない
      settle();
      mm.revert();
    };
  }, [ready]);

  return (
    <section id="top" ref={rootRef} className={styles.hero} data-ready={ready || undefined}>
      <div className={styles.media} aria-hidden="true">
        <div className={styles.flip}>
          <img
            data-hero-media
            src={asset("/images/section/Top1.1.png")}
            alt=""
            className={styles.image}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={`container ${styles.content}`} data-shift>
        <p className={styles.role} data-hero-row>
          <span data-hero-in>{hero.developerTitle}</span>
        </p>

        <h1 className={styles.brand}>
          <span className={styles.mask} data-hero-row>
            <span className={styles.line} data-hero-in>{hero.nameEn.split(" ")[0]}</span>
          </span>
          <span className={styles.mask} data-hero-row>
            <span className={styles.line} data-hero-in>{hero.nameEn.split(" ")[1]}</span>
          </span>
          <span className={styles.nameJa} data-hero-row>
            <span data-hero-in>{hero.name}</span>
          </span>
        </h1>

        <p className={styles.headline} data-hero-row>
          <span data-hero-in>{headline}</span>
        </p>

        <div className={styles.actions} data-hero-row>
          <span data-hero-in className={styles.actionIn}>
          <button type="button" className={styles.primary} onClick={() => scrollToSection("works")}>
            制作実績を見る
          </button>
          <button type="button" className={styles.secondary} onClick={() => scrollToSection("contact")}>
            お問い合わせ
          </button>
          </span>
        </div>
      </div>

      <div className={styles.scroll} data-hero-row aria-hidden="true">
        <span>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
