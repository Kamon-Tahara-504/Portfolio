import { SectionHeading } from "../SectionHeading";
import { experiences } from "../../lib/content";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section id="career" className="section compact">
      <div className="container" data-shift>
        <SectionHeading index="03" label="Career" title="Timeline" />

        <ol className={styles.timeline}>
          {experiences.map((item) => (
            <li key={item.id} className={styles.item}>
              <time className={styles.period}>{item.period}</time>
              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.company}>{item.company}</p>
                <p className={styles.description}>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
