const SEEN = "portfolio-intro-seen";
const AWAY_AT = "portfolio-away-at";
// 表示が続いたら「離れた」記録を消し、そのあとの再読み込みではゲージを出す
const AWAY_CLEAR_MS = 3000;
// 再読み込み直前の非表示は、離席ではなく更新操作そのもの
const RELOAD_HIDE_MS = 2000;

type DiscardedDocument = Document & { wasDiscarded?: boolean };

function navigationType() {
  const entry = performance.getEntriesByType("navigation")[0];
  return entry instanceof PerformanceNavigationTiming ? entry.type : "";
}

function hiddenFor() {
  const awayAt = Number(sessionStorage.getItem(AWAY_AT) || 0);
  return awayAt > 0 ? Date.now() - awayAt : 0;
}

/** 動きを減らす設定、またはタブを離れたあとの開き直しではゲージを出さない */
export function shouldSkipIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const seen = sessionStorage.getItem(SEEN) === "1";
  const discarded = (document as DiscardedDocument).wasDiscarded === true;
  const type = navigationType();
  const returnedAfterAway = discarded || hiddenFor() > RELOAD_HIDE_MS;

  if (type === "reload" && !returnedAfterAway) return false;
  if (!seen && type !== "back_forward") return false;
  return true;
}

export function markIntroSeen() {
  sessionStorage.setItem(SEEN, "1");
}

/** ページを隠した時刻を記録し、表示が続いたら消す */
export function watchIntroAway() {
  let timer = 0;
  const onVisibility = () => {
    window.clearTimeout(timer);
    if (document.visibilityState === "hidden") {
      sessionStorage.setItem(AWAY_AT, String(Date.now()));
      return;
    }
    timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") sessionStorage.removeItem(AWAY_AT);
    }, AWAY_CLEAR_MS);
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.clearTimeout(timer);
  };
}
