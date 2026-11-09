import { useState } from "react";
import { hero } from "../lib/content";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#works", label: "Works" },
  { href: "#career", label: "Career" },
  { href: "#skills", label: "Skills" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.brand} onClick={close}>
          {hero.nameEn}
        </a>

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
              <li key={item.href}>
                <a href={item.href} className={styles.link} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className={styles.cta} onClick={close}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
