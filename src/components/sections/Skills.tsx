import { SectionHeading } from "../SectionHeading";
import { skillCategories } from "../../lib/content";
import styles from "./Skills.module.css";
import { SkillsTimeline } from "./SkillsTimeline";

export function Skills() {
  return (
    <section id="skills" className="section compact">
      <div className="container" data-shift>
        <SectionHeading
          index="04"
          label="Skills"
          title="Capabilities"
          lead="バーは各技術に対する現時点での自己評価です。"
        />

        <div className={styles.grid}>
          {skillCategories.map((category) => (
            <div key={category.key} className={styles.column}>
              <h3 className={styles.label}>{category.label}</h3>
              <ul className={styles.list}>
                {category.skills.map((skill) => (
                  <li key={skill.name} className={styles.skill}>
                    <span className={styles.name}>{skill.name}</span>
                    <span className={styles.track} aria-hidden="true">
                      <span className={styles.fill} style={{ width: `${skill.level}%` }} data-draw />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SkillsTimeline />
      </div>
    </section>
  );
}
