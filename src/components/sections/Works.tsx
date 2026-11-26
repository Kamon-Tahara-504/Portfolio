import { useEffect, useState } from "react";
import { SectionHeading } from "../SectionHeading";
import { WorkItem } from "../WorkItem";
import { featuredProjects, otherProjects } from "../../lib/content";
import { BOARD_MOTION_MS, useWorksBoard } from "../../hooks/useWorksBoard";
import type { Project } from "../../types/content";
import styles from "./Works.module.css";

// 展開前のグリッドと同じ列数。追加カードもこの行数で右へ列を足す
const FEATURED_COLUMNS = 2;
const BOARD_ROWS = Math.ceil(featuredProjects.length / FEATURED_COLUMNS);

export function Works() {
  // 一度に拡大できるのは 1 件だけにして、1 つの制作物に集中できるようにする
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [shown, setShown] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  // 展開前のカード幅と高さを固定する。列を足してもカードは縮めない
  const [frame, setFrame] = useState<{ height: number; card: number; bleed: number } | null>(null);
  const board = useWorksBoard(expanded);

  const renderCard = (project: Project) => (
    <WorkItem
      key={project.id}
      project={project}
      isOpen={openId === project.id}
      onOpen={() => setOpenId(project.id)}
      onClose={() => setOpenId(null)}
    />
  );

  useEffect(() => {
    if (!expanded || closing) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [expanded, closing]);

  useEffect(() => {
    if (!shown || closing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setOpening(false), reduced ? 0 : BOARD_MOTION_MS);
    return () => window.clearTimeout(id);
  }, [shown, closing]);

  const toggle = async () => {
    if (closing || opening) return;
    if (expanded) {
      setClosing(true);
      setShown(false);
      setOpenId(null);
      await board.settle();
      setExpanded(false);
      setFrame(null);
      setClosing(false);
      return;
    }
    const stage = board.stageRef.current;
    const card = stage?.querySelector("button");
    if (!stage || !card) return;
    setFrame({
      height: stage.offsetHeight,
      card: card.getBoundingClientRect().width,
      // 親の斜め移動を含んだ、画面上の左端。枠を画面端まで戻す量
      bleed: stage.getBoundingClientRect().left,
    });
    setOpening(true);
    setExpanded(true);
  };

  return (
    <section id="works" className="section compact">
      <div className="container" data-shift>
        <SectionHeading
          index="02"
          label="Works"
          title="Selected Works"
          lead="課題の設定から設計・実装・公開まで取り組んだ主要なプロジェクトです。"
          actionVisible={expanded}
          action={
            <button
              type="button"
              className={styles.expand}
              data-board-toggle
              data-open={expanded || undefined}
              aria-expanded={expanded}
              aria-label={expanded ? "閉じる" : "展開"}
              disabled={opening || closing}
              onClick={toggle}
            >
              <span className={styles.expandIcon} aria-hidden="true" />
            </button>
          }
        />

        <div
          ref={board.stageRef}
          className={styles.stage}
          data-expanded={expanded || undefined}
          data-dragging={board.dragging || undefined}
          style={{
            ...(expanded && frame ? { height: frame.height } : {}),
            ...(board.stageWidth ? { ["--stage-width" as string]: `${board.stageWidth}px` } : {}),
            ["--board-rows" as string]: String(BOARD_ROWS),
            ...(frame
              ? {
                  ["--card-width" as string]: `${frame.card}px`,
                  ["--bleed-left" as string]: `${frame.bleed}px`,
                }
              : {}),
          }}
          {...board.handlers}
        >
          <div ref={board.boardRef} className={styles.board}>
            <div className={styles.grid}>{featuredProjects.map(renderCard)}</div>
            {expanded && (
              <div className={styles.extra} data-shown={shown || undefined}>
                {otherProjects.map(renderCard)}
              </div>
            )}
          </div>
          {/* 横長でない画面では、下端でカードが直線に切れるのを霧で隠す */}
          <div className={styles.fogBottom} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
