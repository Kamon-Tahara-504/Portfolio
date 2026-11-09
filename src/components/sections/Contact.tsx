import { about, hero } from "../../lib/content";
import styles from "./Contact.module.css";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Contact() {
  const { email, github } = about.contact;

  return (
    <footer id="contact" className={`compact ${styles.contact}`}>
      <div className="container" data-shift>
        <div className={styles.meta}>
          <span>05</span>
          <span className={styles.rule} data-draw aria-hidden="true" />
          <span>Contact</span>
        </div>

        <h2 className={styles.title}>
          Let’s build
          <br />
          something clear.
        </h2>
        <p className={styles.lead}>
          開発のご相談、インターン・採用に関するご連絡はメールにてお気軽にどうぞ。
        </p>

        <div className={styles.actions}>
          <a href={`mailto:${email}`} className={styles.mail}>
            <span className={styles.mailLabel}>Email</span>
            <span className={styles.mailAddress}>{email}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </a>
          <a href={github} target="_blank" rel="noreferrer" className="text-link">
            GitHub ↗
          </a>
        </div>

        <div className={styles.bottom}>
          <span>{hero.nameEn}</span>
          <span>© {COPYRIGHT_YEAR}</span>
        </div>
      </div>
    </footer>
  );
}
