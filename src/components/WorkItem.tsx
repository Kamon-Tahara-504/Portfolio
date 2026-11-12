import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Project } from "../types/content";
import { getCategoryLabel, getProjectLinks, getProjectPeriod } from "../lib/content";
import { gsap } from "../lib/gsap";
import { useCardExpand } from "../hooks/useCardExpand";
import { useScrollLock } from "../hooks/useScrollLock";
import styles from "./WorkItem.module.css";

type Props = {
  project: Project;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function WorkItem({ project, isOpen, onOpen, onClose }: Props) {
  // 拡大表示の起点として描画中に参照するため、ref ではなく state で持つ
  const [card, setCard] = useState<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);

  // 番号はモーダルの下で伸ばしても見えない。閉じたあとに、ホバーの左バーと同じく左端から出す
  useLayoutEffect(() => {
    if (!card) return;
    if (isOpen) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const number = card.querySelector<HTMLElement>("[data-card-number]");
    if (!number) return;
    gsap.killTweensOf(number);
    gsap.fromTo(
      number,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.3, ease: "power3.out", transformOrigin: "left top" },
    );
  }, [isOpen, card]);

  return (
    <>
      {/* 拡大中も一覧での大きさを保つため、カードは残して移動する部品だけを隠す */}
      <button
        ref={setCard}
        type="button"
        className={`${styles.item} ${isOpen ? styles.hidden : ""}`}
        aria-expanded={isOpen}
        onClick={onOpen}
      >
        <div className={styles.frame} data-flip-id={flipId(project, "image")}>
          <img
            src={project.images[0]}
            alt={`${project.title} のスクリーンショット`}
            loading="lazy"
            className={styles.image}
          />
          <span className={styles.number} data-card-only data-card-number>
            {project.number}
          </span>
        </div>

        <div className={styles.body}>
          {/* 左右に離して置いているため、行ごと拡大すると右側の期間がずれる。項目ごとに動かす */}
          <p className={styles.meta}>
            <span data-flip-id={flipId(project, "category")}>{getCategoryLabel(project)}</span>
            <span data-flip-id={flipId(project, "period")}>{getProjectPeriod(project)}</span>
          </p>
          <h3 className={styles.title} data-flip-id={flipId(project, "title")}>
            {project.title}
          </h3>
          <p className={styles.catch} data-flip-id={flipId(project, "catch")}>
            {project.catchphrase}
          </p>
          <p className={styles.description} data-flip-id={flipId(project, "desc")}>
            {project.description}
          </p>
          {/* 上の線と余白は一覧だけの装飾なので、移動させるのは文字だけにする */}
          <p className={styles.tech} data-card-only>
            <span data-flip-id={flipId(project, "tech")}>{project.technologies.join(" / ")}</span>
          </p>
          <span className={styles.more} data-card-only>
            View Detail +
          </span>
        </div>
      </button>

      {isOpen && card && (
        <ExpandedCard
          project={project}
          source={card}
          onClosed={() => {
            onClose();
            // visibility:hidden が外れる再描画の後でないとフォーカスできない
            requestAnimationFrame(() => card.focus({ preventScroll: true }));
          }}
        />
      )}
    </>
  );
}

type ExpandedProps = {
  project: Project;
  /** 拡大アニメーションの起点になる一覧のカード */
  source: HTMLElement;
  /** 閉じるアニメーションが終わった後に呼ばれる */
  onClosed: () => void;
};

/** 一覧と拡大表示で同じ役割の部品を Flip で対応付けるための ID */
const flipId = (project: Project, part: string) => `work-${project.id}-${part}`;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ExpandedCard({ project, source, onClosed }: ExpandedProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const refs = useMemo(
    () => ({ backdrop: backdropRef, card: cardRef, frame: frameRef }),
    [],
  );
  const { close } = useCardExpand(refs, source);
  useScrollLock();

  const links = getProjectLinks(project);
  const titleId = `work-title-${project.id}`;
  const requestClose = () => close(onClosed);

  // 中身は表示アニメーション中 visibility:hidden でフォーカスできないため、カード本体に当てる
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      requestClose();
      return;
    }
    if (event.key !== "Tab" || !cardRef.current) return;

    // aria-modal だけでは背景へフォーカスが抜けるため、カード内で循環させる
    const items = cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // カードの外側をクリックしたときだけ閉じる
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };

  // 親の data-shift には transform がかかっており、その中では position: fixed が画面基準にならないため body 直下に出す
  return createPortal(
    <div className={styles.overlay} onKeyDown={handleKeyDown}>
      <div ref={backdropRef} className={styles.backdrop} onClick={handleBackdropClick} />
      {/* 白地と枠線は中身と分けておき、枠だけを一覧カードの大きさから広げられるようにする */}
      <div ref={frameRef} className={styles.frameBox} aria-hidden="true" />

      <div
        ref={cardRef}
        className={styles.expanded}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.expandedInner}>
          <div className={styles.topBar} data-extra="pin">
            <span className={styles.topNumber}>Project No.{project.number}</span>
            <button type="button" className={styles.close} onClick={requestClose}>
              Close ×
            </button>
          </div>

          <div className={styles.mainFrame} data-flip-id={flipId(project, "image")} data-frame-line>
            <img
              src={project.images[0]}
              alt={`${project.title} のスクリーンショット`}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.detail}>
            {/* 左右に離して置いているため、行ごと拡大すると右側の期間がずれる。項目ごとに動かす */}
            <p className={styles.meta}>
              <span data-flip-id={flipId(project, "category")}>{getCategoryLabel(project)}</span>
              <span data-flip-id={flipId(project, "period")}>{getProjectPeriod(project)}</span>
            </p>
            <h3 id={titleId} className={styles.detailTitle} data-flip-id={flipId(project, "title")}>
              {project.title}
            </h3>
            <p className={styles.catch} data-flip-id={flipId(project, "catch")}>
              {project.catchphrase}
            </p>
            <p className={styles.fullDescription} data-flip-id={flipId(project, "desc")}>
              {project.description}
            </p>

            <dl className={styles.facts} data-line>
              <div className={styles.fact} data-line>
                <dt data-extra>Tech</dt>
                <dd data-flip-id={flipId(project, "tech")}>{project.technologies.join(" / ")}</dd>
              </div>
              <div className={styles.fact} data-extra>
                <dt>Period</dt>
                <dd>{getProjectPeriod(project)}</dd>
              </div>
            </dl>

            {links.length > 0 && (
              <ul className={styles.links} data-extra>
                {links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-link">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
