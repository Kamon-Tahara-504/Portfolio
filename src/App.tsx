import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserZoomLock } from "./components/BrowserZoomLock";
import { Header } from "./components/Header";
import { HeroStartGauge } from "./components/hero/HeroStartGauge";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Hero } from "./components/sections/Hero";
import { Skills } from "./components/sections/Skills";
import { Works } from "./components/sections/Works";
import { useBrowserZoomLock } from "./hooks/useBrowserZoomLock";
import { useContentGuard } from "./hooks/useContentGuard";
import { useDiagonalScroll } from "./hooks/useDiagonalScroll";
import { useLineDraw } from "./hooks/useLineDraw";
import { ScrollTrigger } from "./lib/gsap";
import { resetEntryPosition } from "./lib/scroll";

// 動きを減らす設定では導入ゲージ自体を出さず、最初から本文を見せる
const skipIntro = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(skipIntro);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const zoomLock = useBrowserZoomLock();
  useContentGuard();
  // 斜めスクロールの初期位置は、この時点のスクロール量で決まる。
  // 前回位置のまま作ると Hero の段が退場の途中で固定される。
  useLayoutEffect(() => {
    resetEntryPosition();
  }, []);
  useDiagonalScroll(mainRef, gridRef);
  useLineDraw(mainRef);

  // Web フォントの差し替えで行の高さが変わり、トリガー位置がずれるため再計算する
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      {/* セクションと一緒に横へ流し、視点が移動している感覚を作る背景 */}
      <div ref={gridRef} className="grid-layer" aria-hidden="true" />
      {!introDone && <HeroStartGauge onComplete={finishIntro} />}
      <Header />
      {/* useDiagonalScroll は main の直下の要素をセクション単位として扱う */}
      <main ref={mainRef}>
        <Hero ready={introDone} />
        <About />
        <Works />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <BrowserZoomLock lock={zoomLock} />
    </>
  );
}
