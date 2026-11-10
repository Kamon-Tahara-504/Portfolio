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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const go = (id: string) => {
    close();
    scrollToSection(id);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <button
          type="button"
          className={styles.brand}
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
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button type="button" className={styles.link} onClick={() => go(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.cta} onClick={() => go("contact")}>
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
