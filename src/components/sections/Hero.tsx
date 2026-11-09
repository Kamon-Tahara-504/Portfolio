import { useLayoutEffect, useRef } from "react";
import { asset } from "../../lib/asset";
import { about, hero, splitParagraphs } from "../../lib/content";
import { gsap, MOTION_OK } from "../../lib/gsap";
import styles from "./Hero.module.css";

const headline = splitParagraphs(about.about.description)[0];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      // 初回表示: 名前の各行が左下から斜めに入り、続けて本文と CTA が揃う
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from("[data-hero-media]", { scale: 1.12, duration: 2.2, ease: "power2.out" }, 0)
        .from(
          "[data-hero-line]",
          { xPercent: -12, yPercent: 110, skewX: -6, duration: 1.3, stagger: 0.12 },
          0.15,
        )
        .from(
          "[data-hero-fade]",
          { x: -40, y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1 },
          0.6,
        );

      // 背景だけ縦方向に遅らせ、セクション全体の斜め移動に奥行きを足す
      gsap.to("[data-hero-media]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    });

    return () => mm.revert();
  }, []);

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
