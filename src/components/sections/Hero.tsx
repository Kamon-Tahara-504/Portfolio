import { useLayoutEffect, useRef } from "react";
import { asset } from "../../lib/asset";
import { about, hero, splitParagraphs } from "../../lib/content";
import { gsap, MOTION_OK } from "../../lib/gsap";
import styles from "./Hero.module.css";

// スクロール遷移でセクションを送り出す横移動量と同じ割合
const SHIFT_RATIO = 0.45;

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
    mm.add(MOTION_OK, () => {
      const content = root.querySelector("[data-shift]");
      if (content) {
        // 導入ゲージの白が消えるまで画面外に置く。ready になってから斜めに入ってくる
        gsap.set(content, { x: ready ? 0 : -window.innerWidth * SHIFT_RATIO });
        if (ready) {
          gsap.fromTo(
            content,
            { x: -window.innerWidth * SHIFT_RATIO },
            { x: 0, duration: 1.1, ease: "power3.inOut" },
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

    return () => mm.revert();
  }, [ready]);

  return (
    <section id="top" ref={rootRef} className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <div className={styles.flip}>
          <img
            data-hero-media
            src={asset("/images/section/Top1.png")}
            alt=""
            className={styles.image}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={`container ${styles.content}`} data-shift>
        <p className={styles.role} data-hero-fade>
          {hero.developerTitle}
        </p>

        <h1 className={styles.brand}>
          <span className={styles.mask}>
            <span data-hero-line className={styles.line}>
              {hero.nameEn.split(" ")[0]}
            </span>
          </span>
          <span className={styles.mask}>
            <span data-hero-line className={styles.line}>
              {hero.nameEn.split(" ")[1]}
            </span>
          </span>
          <span className={styles.nameJa} data-hero-fade>
            {hero.name}
          </span>
        </h1>

        <p className={styles.headline} data-hero-fade>
          {headline}
        </p>

        <div className={styles.actions} data-hero-fade>
          <a href="#works" className={styles.primary}>
            制作実績を見る
          </a>
          <a href="#contact" className={styles.secondary}>
            お問い合わせ
          </a>
        </div>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <span>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
