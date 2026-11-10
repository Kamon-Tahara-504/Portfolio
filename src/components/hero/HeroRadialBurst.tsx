import styles from "./HeroStartGauge.module.css";

const RAY_COUNT = 12;

/** ゲージが 100% に達した瞬間に、円の外側へ線を放射して完了を伝える */
export function HeroRadialBurst() {
  return (
    <div className={styles.burst} aria-hidden="true">
      {Array.from({ length: RAY_COUNT }, (_, index) => (
        <span
          key={index}
          className={styles.ray}
          style={{ rotate: `${(360 / RAY_COUNT) * index}deg` }}
        />
      ))}
    </div>
  );
}
