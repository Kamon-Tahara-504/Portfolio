import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { HeroRadialBurst } from "./HeroRadialBurst";
import styles from "./HeroStartGauge.module.css";

type Props = {
  /** フェードアウトまで終わった後に呼ばれる */
  onComplete: () => void;
};

type Phase = "filling" | "burst" | "fading";

const IDLE = 400;
const FILL = 2200;
const STEP = 500;
const HOLD = 720;
// 放射が終わったあと、100% を読み取れる程度だけ残して白を消す。
// Hero の入場はこの覆いが消えてから始まるので、ここに入場時間を足すと数字が止まった白が長く残る。
const REVEAL_AT = 280;
const FADE = 500;

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * 経過時間から進捗(小数)を決める。
 * 98 から 100 へ一気に飛ぶと終わりが唐突に見えるため、99 と 100 は一定時間ずつ段階表示する。
 */
function progressAt(elapsed: number): number {
  if (elapsed < IDLE) return 0;
  if (elapsed < IDLE + FILL) return 98 * easeInOutCubic((elapsed - IDLE) / FILL);
  if (elapsed < IDLE + FILL + STEP) return 99;
  return 100;
}

/**
 * 初回表示の導入ゲージ。見た目の演出であり、アセットの読み込み進捗ではない。
 * 中央の数字と円弧を同じ値で動かすため、CSS アニメーションではなく経過時間から毎フレーム計算する。
 * 毎フレーム React を再描画すると数字の切り替わりが重く見えるため、数字と円弧は DOM を直接書き換える。
 */
export function HeroStartGauge({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("filling");
  useScrollLock();

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let shown = -1;

    const render = (now: number) => {
      const progress = progressAt(now - start);
      const rounded = Math.round(progress);
      arcRef.current?.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress / 100)));
      if (rounded !== shown) {
        shown = rounded;
        if (valueRef.current) valueRef.current.textContent = String(rounded);
        rootRef.current?.setAttribute("aria-valuenow", String(rounded));
      }
      if (progress >= 100) {
        setPhase("burst");
        return;
      }
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase === "filling") return;
    const timer =
      phase === "burst"
        ? window.setTimeout(() => setPhase("fading"), HOLD + REVEAL_AT)
        : window.setTimeout(onComplete, FADE);
    return () => window.clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <div
      ref={rootRef}
      className={`${styles.overlay} ${phase === "fading" ? styles.fading : ""}`}
      style={{ transitionDuration: `${FADE}ms` }}
      role="progressbar"
      aria-label="サイトを準備しています"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className={styles.gauge}>
        <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden="true">
          <circle className={styles.track} cx="100" cy="100" r={RADIUS} />
          <circle
            ref={arcRef}
            className={styles.arc}
            cx="100"
            cy="100"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <span className={styles.value}>
          <span ref={valueRef}>0</span>
          <span className={styles.unit}>%</span>
        </span>
        {phase !== "filling" && <HeroRadialBurst />}
      </div>
    </div>
  );
}
