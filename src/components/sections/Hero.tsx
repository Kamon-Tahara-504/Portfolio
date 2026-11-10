import { useLayoutEffect, useRef } from "react";
import { asset } from "../../lib/asset";
import { about, hero, splitParagraphs } from "../../lib/content";
import { gsap, MOTION_OK } from "../../lib/gsap";
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
    mm.add(MOTION_OK, () => {
      const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-hero-row]"));
      if (rows.length > 0) {
        const offscreen = -window.innerWidth * SHIFT_RATIO;
        // 導入ゲージの白が消えるまで各段を画面外に置く。塊では動かさず、上から順に入れる
        gsap.set(rows, { x: ready ? 0 : offscreen });
        if (ready) {
          gsap.fromTo(rows, { x: offscreen }, { x: 0, duration: ROW_DURATION, stagger: ROW_STAGGER, ease: "power3.inOut" });
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
            src={asset("/images/section/Top1.1.png")}
            alt=""
            className={styles.image}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={`container ${styles.content}`} data-shift>
        <p className={styles.role} data-hero-row>
          {hero.developerTitle}
        </p>

        <h1 className={styles.brand}>
          <span className={styles.mask} data-hero-row>
            <span className={styles.line}>{hero.nameEn.split(" ")[0]}</span>
          </span>
          <span className={styles.mask} data-hero-row>
            <span className={styles.line}>{hero.nameEn.split(" ")[1]}</span>
          </span>
          <span className={styles.nameJa} data-hero-row>
            {hero.name}
          </span>
        </h1>

        <p className={styles.headline} data-hero-row>
          {headline}
        </p>

        <div className={styles.actions} data-hero-row>
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
