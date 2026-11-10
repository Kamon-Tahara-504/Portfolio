import { SectionHeading } from "../SectionHeading";
import { about, splitParagraphs } from "../../lib/content";
import styles from "./About.module.css";

const [lead, ...body] = splitParagraphs(about.about.description);
const currentAffiliation = about.affiliations.find((item) => item.isCurrent);

const profile = [
  { term: "生年月日", value: about.about.birthDate.replace(" ", ".").replace("/", ".") },
  { term: "出身", value: about.about.birthplace },
  {
    term: "所属",
    value: currentAffiliation
      ? `${currentAffiliation.name}（${currentAffiliation.stage}）`
      : "",
  },
  { term: "趣味", value: about.about.hobby },
].filter((item) => item.value);

export function About() {
  return (
    <section id="about" className="section compact">
      <div className="container" data-shift>
        <SectionHeading index="01" label="About" title="Philosophy" />

        <div className={styles.grid}>
          <figure className={styles.portrait}>
            <img src={about.about.image} alt={about.name} />
            <figcaption className={styles.caption}>
              <span>{about.name}</span>
              <span>{about.nameEn}</span>
            </figcaption>
          </figure>

          <div className={styles.body}>
            <p className={styles.lead}>
              {lead}
            </p>
            {body.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}

            <dl className={styles.profile}>
              {profile.map((item) => (
                <div key={item.term} className={styles.row}>
                  <dt>{item.term}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
