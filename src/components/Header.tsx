import { useEffect, useRef, useState } from "react";
import { hero } from "../lib/content";
import { scrollToSection, scrollToTop } from "../lib/scroll";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "works", label: "Works" },
  { id: "career", label: "Career" },
  { id: "skills", label: "Skills" },
] as const;

// バーが出てから、左の文字ほど先に出す
const TEXT_DELAY = 0.42;
const TEXT_STEP = 0.07;

type Props = {
  /** 導入ゲージが消え始めたら true。それまでヘッダーは出さない */
  ready: boolean;
};

const SECTION_IDS = [...NAV_ITEMS.map((item) => item.id), "contact"] as const;

export function Header({ ready }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const [line, setLine] = useState({ left: 0, top: 0, width: 0 });
  const close = () => setIsOpen(false);

  const go = (id: string) => {
    close();
    scrollToSection(id);
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const header = headerRef.current;
      const nav = navRef.current;
      if (!header || !nav) return;
      const read = header.getBoundingClientRect().bottom;
      const navBox = nav.getBoundingClientRect();
      let matched = false;
      let next = { left: 0, top: 0, width: 0 };
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        const item = itemRefs.current.get(id);
        if (!section || !item) continue;
        const box = section.getBoundingClientRect();
        if (box.height <= 0 || read < box.top || read > box.bottom) continue;
        const itemBox = item.getBoundingClientRect();
        matched = true;
        next = {
          left: itemBox.left - navBox.left,
          top: itemBox.bottom - navBox.top + 4,
          width: itemBox.width * ((read - box.top) / box.height),
        };
      }
      setLine((prev) => (matched ? next : { ...prev, width: 0 }));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    // 文字の入場は transform なので、終了後にもう一度位置を取る
    const nav = navRef.current;
    const observer = new ResizeObserver(onScroll);
    for (const item of itemRefs.current.values()) {
      if (item) observer.observe(item);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    nav?.addEventListener("animationend", onScroll);
    nav?.addEventListener("transitionend", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      nav?.removeEventListener("animationend", onScroll);
      nav?.removeEventListener("transitionend", onScroll);
    };
  }, [isOpen, ready]);

  return (
    <header ref={headerRef} className={styles.header} data-ready={ready || undefined}>
      <div className={styles.bar} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <button
          type="button"
          className={styles.brand}
          style={{ animationDelay: ready ? `${TEXT_DELAY}s` : undefined }}
          onClick={() => {
            close();
            scrollToTop();
          }}
        >
          {hero.nameEn}
        </button>

        <button
          type="button"
          className={styles.toggle}
          style={{ animationDelay: ready ? `${TEXT_DELAY + TEXT_STEP}s` : undefined }}
          aria-expanded={isOpen}
          aria-controls="global-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>

        <nav
          ref={navRef}
          id="global-nav"
          className={styles.nav}
          data-open={isOpen}
          aria-label="Global"
        >
          <ul className={styles.list}>
            {NAV_ITEMS.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  ref={(node) => {
                    itemRefs.current.set(item.id, node);
                  }}
                  className={styles.link}
                  style={{ animationDelay: ready ? `${TEXT_DELAY + TEXT_STEP * (index + 1)}s` : undefined }}
                  onClick={() => go(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            ref={(node) => {
              itemRefs.current.set("contact", node);
            }}
            className={styles.cta}
            style={{ animationDelay: ready ? `${TEXT_DELAY + TEXT_STEP * (NAV_ITEMS.length + 1)}s` : undefined }}
            onClick={() => go("contact")}
          >
            Contact
          </button>
          <span
            className={styles.progress}
            style={{ left: line.left, top: line.top, width: line.width }}
            aria-hidden="true"
          />
        </nav>
      </div>
    </header>
  );
}
