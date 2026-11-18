import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type Props = {
  index: string;
  label: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  /** true のとき action をホバーなしでも表示する（展開中の閉じる操作など） */
  actionVisible?: boolean;
};

export function SectionHeading({
  index,
  label,
  title,
  lead,
  action,
  actionVisible = false,
}: Props) {
  return (
    <header className={styles.heading}>
      <div className={styles.meta}>
        <span className={styles.index}>{index}</span>
        {/* data-draw: スクロール到達時に左から罫線を引く */}
        <span className={styles.rule} data-draw aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{title}</h2>
        {action ? (
          <div className={styles.action} data-visible={actionVisible || undefined}>
            {action}
          </div>
        ) : null}
      </div>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}
