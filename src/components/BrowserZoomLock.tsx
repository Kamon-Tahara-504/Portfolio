import type { BrowserZoomLockState } from "../hooks/useBrowserZoomLock";
import styles from "./BrowserZoomLock.module.css";

type Props = {
  lock: BrowserZoomLockState;
};

/** 表示倍率が許容範囲外のとき、崩れたレイアウトの閲覧を止める全画面ロック。 */
export function BrowserZoomLock({ lock }: Props) {
  if (!lock.isLocked) return null;

  const message = lock.reason === "too-large" ? "表示倍率が大きすぎます" : "表示倍率が小さすぎます";
  const description =
    lock.reason === "too-large"
      ? "ブラウザの表示倍率を下げてから再度お試しください。"
      : "ブラウザの表示倍率を上げてから再度お試しください。";

  // ブラウザズームで文言まで拡大縮小されないよう、検出倍率の逆数で戻す。
  const scale = 100 / Math.max(lock.zoomPercent, 1);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="browser-zoom-lock-title"
      aria-describedby="browser-zoom-lock-desc"
      className={styles.lock}
    >
      <div
        className={styles.panel}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: `min(28rem, ${85 / scale}vw)`,
        }}
      >
        <p id="browser-zoom-lock-title" className={styles.title}>
          {message}
        </p>
        <p id="browser-zoom-lock-desc" className={styles.description}>
          {description}
        </p>
        <p className={styles.current}>NOW CURRENT {lock.zoomPercent}%</p>
      </div>
    </div>
  );
}
