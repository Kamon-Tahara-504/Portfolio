import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { skillCategories } from "../../lib/content";
import { collectTimelineSkills, formatDate, layoutTimeline } from "../../lib/timeline";
import styles from "./SkillsTimeline.module.css";

const PAUSE_MS = 1500;
const PLAY_MS = 9000;
// 一番外側のバーのラベルが箱の線に掛からない分
const LABEL_ROOM = 36;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export function SkillsTimeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const layout = layoutTimeline(collectTimelineSkills(skillCategories));
  const laneOffsets = layout.skillPositions.map((bar) => bar.lineHeight);
  const minLane = Math.min(0, ...laneOffsets);
  const maxLane = Math.max(0, ...laneOffsets);
  // 使っていない外側の段は高さに含めない
  const baseTop = LABEL_ROOM - minLane;
  const trackHeight = maxLane - minLane + LABEL_ROOM * 2;

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, []);

  useEffect(() => {
    if (!playing) return;
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    let pause = 0;
    let stopped = false;

    const finish = () => {
      if (stopped) return;
      stopped = true;
      setSweeping(false);
      setPlaying(false);
    };

    el.scrollTo({ left: 0, behavior: "smooth" });

    const waitUntilStart = () => {
      if (stopped) return;
      if (el.scrollLeft <= 1) {
        pause = window.setTimeout(() => {
          if (stopped) return;
          setSweeping(true);
          const startLeft = el.scrollLeft;
          const endLeft = Math.max(0, el.scrollWidth - el.clientWidth);
          const started = performance.now();
          const step = (now: number) => {
            if (stopped) return;
            const progress = Math.min((now - started) / PLAY_MS, 1);
            el.scrollLeft = startLeft + (endLeft - startLeft) * easeInOut(progress);
            if (progress < 1) frame = requestAnimationFrame(step);
            else finish();
          };
          frame = requestAnimationFrame(step);
        }, PAUSE_MS);
        return;
      }
      frame = requestAnimationFrame(waitUntilStart);
    };
    frame = requestAnimationFrame(waitUntilStart);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(pause);
    };
  }, [playing]);

  const play = () => {
    const el = scrollerRef.current;
    if (!el || playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = 0;
      return;
    }
    setPlaying(true);
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.toolbar}>
        <h3 className={styles.heading}>習得期間</h3>
        <p className={styles.note}>横軸は月です。バーは始めた月から、終えた月または現在までです。</p>
      </div>
      <button
        type="button"
        className={styles.play}
        data-playing={playing || undefined}
        onClick={play}
        disabled={playing}
        aria-label="再生"
      >
        <svg className={styles.playRing} viewBox="0 0 40 40" aria-hidden="true">
          <circle className={styles.playTrack} cx="20" cy="20" r="18" />
          <circle className={styles.playArc} cx="20" cy="20" r="18" />
          <polygon className={styles.playMark} points="17,13 17,27 28,20" />
        </svg>
      </button>

      <div className={styles.viewport} data-sweeping={sweeping || undefined}>
      <div ref={scrollerRef} className={styles.scroller} data-playing={playing || undefined}>
        <div
          className={styles.track}
          style={{ width: layout.minTimelineWidth, height: trackHeight }}
        >
          <div className={styles.baseline} style={{ top: baseTop }} />

          {layout.monthlyTickPositions.map((position) => (
            <span
              key={position}
              className={styles.tick}
              style={{ left: `${position}%`, top: baseTop }}
              aria-hidden="true"
            />
          ))}

          {layout.yearMarks.map((mark) => (
            <span key={mark.year} className={styles.year} style={{ left: `${mark.position}%`, top: baseTop }}>
              {mark.year}
            </span>
          ))}

          {layout.skillPositions.map((bar, index) => {
            const seed = bar.skill.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), index);
            const delay = ((seed % 100) / 100) * 3;
            return (
              <div
                key={`${bar.skill.name}-${bar.startDate}`}
                className={styles.bar}
                style={{
                  left: `${bar.left}%`,
                  width: `${bar.width}%`,
                  top: baseTop,
                  color: bar.color,
                }}
              >
                <span
                  className={styles.line}
                  style={{ top: bar.lineHeight, width: bar.endDate === null ? "calc(100% - 1px)" : "100%" }}
                />
                <span className={styles.dot} style={{ top: bar.lineHeight }} />
                <span
                  className={`${styles.dot} ${styles.end} ${bar.endDate === null ? styles.wobble : ""}`}
                  style={{ top: bar.lineHeight, animationDelay: bar.endDate === null ? `${delay}s` : undefined }}
                />
                <span className={styles.label} style={{ top: bar.lineHeight }}>
                  <span className={styles.name}>{bar.skill.name}</span>
                  <span className={styles.dates}>
                    {formatDate(bar.startDate)} ～ {bar.endDate ? formatDate(bar.endDate) : "現在"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <span className={styles.playhead} aria-hidden="true" />
      </div>
    </div>
  );
}
