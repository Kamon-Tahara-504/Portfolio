/** アドレスを変えずに、指定セクションへスクロールする */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView();
}

/** アドレスを変えずに、ページ先頭へ戻す */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0 });
}

/**
 * 開いたとき・再読み込みのとき、前回位置や #career などの記憶を消して先頭から始める。
 * React の描画より先に呼ぶ。
 */
export function resetEntryPosition() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  if (window.location.hash) {
    const { pathname, search } = window.location;
    history.replaceState(null, "", `${pathname}${search}`);
  }
  window.scrollTo(0, 0);
}
