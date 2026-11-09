import { useState } from "react";
import { SectionHeading } from "../SectionHeading";
import { WorkItem } from "../WorkItem";
import {
  featuredProjects,
  getProjectLinks,
  getProjectPeriod,
  otherProjects,
} from "../../lib/content";
import styles from "./Works.module.css";

export function Works() {
  // 一度に拡大できるのは 1 件だけにして、1 つの制作物に集中できるようにする
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="works" className="section compact">
      <div className="container" data-shift>
        <SectionHeading
          index="02"
          label="Works"
          title="Selected Works"
          lead="課題の設定から設計・実装・公開まで取り組んだ主要なプロジェクトです。"
        />

        <div className={styles.grid}>
          {featuredProjects.map((project) => (
            <WorkItem
              key={project.id}
              project={project}
              isOpen={openId === project.id}
              onOpen={() => setOpenId(project.id)}
              onClose={() => setOpenId(null)}
            />
          ))}
        </div>

        <div className={styles.others}>
          <h3 className={styles.othersTitle}>
            Other Projects
          </h3>
          <ul className={styles.table}>
            {otherProjects.map((project) => {
              const primaryLink = getProjectLinks(project)[0];
              return (
                <li key={project.id} className={styles.row}>
                  <span className={styles.number}>{project.number}</span>
                  <span className={styles.name}>{project.title}</span>
                  <span className={styles.catch}>{project.catchphrase}</span>
                  <span className={styles.period}>{getProjectPeriod(project)}</span>
                  {primaryLink ? (
                    <a
                      href={primaryLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-link ${styles.rowLink}`}
                    >
                      {primaryLink.label} ↗
                    </a>
                  ) : (
                    <span />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
