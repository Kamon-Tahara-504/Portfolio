import { useState } from "react";
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

export function Header({ ready }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const go = (id: string) => {
    close();
    scrollToSection(id);
  };

  return (
    <header className={styles.header} data-ready={ready || undefined}>
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
            className={styles.cta}
            style={{ animationDelay: ready ? `${TEXT_DELAY + TEXT_STEP * (NAV_ITEMS.length + 1)}s` : undefined }}
            onClick={() => go("contact")}
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
