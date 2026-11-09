import styles from "./SectionHeading.module.css";

type Props = {
  index: string;
  label: string;
  title: string;
  lead?: string;
};

export function SectionHeading({ index, label, title, lead }: Props) {
  return (
    <header className={styles.heading}>
      <div className={styles.meta}>
        <span className={styles.index}>{index}</span>
        {/* data-draw: スクロール到達時に左から罫線を引く */}
        <span className={styles.rule} data-draw aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}
