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
import { whenHeroEnterSettled } from "./lib/heroEnter";
import { markIntroSeen, shouldSkipIntro, watchIntroAway } from "./lib/intro";
import { resetEntryPosition } from "./lib/scroll";

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(shouldSkipIntro);
  const [showGauge, setShowGauge] = useState(() => !shouldSkipIntro());
  const finishIntro = useCallback(() => {
    markIntroSeen();
    setIntroDone(true);
  }, []);
  const hideGauge = useCallback(() => setShowGauge(false), []);
  const zoomLock = useBrowserZoomLock();
  useContentGuard();
  // 斜めスクロールの初期位置は、この時点のスクロール量で決まる。
  // 前回位置のまま作ると Hero の段が退場の途中で固定される。
  useLayoutEffect(() => {
    resetEntryPosition();
  }, []);
  useDiagonalScroll(mainRef, gridRef);
  useLineDraw(mainRef);

  useEffect(() => {
    if (introDone) markIntroSeen();
    return watchIntroAway();
  }, [introDone]);

  // フォントと読み込み完了の再計算は、Hero の入場が終わってから行う
  useEffect(() => {
    const refresh = () => {
      whenHeroEnterSettled().then(() => ScrollTrigger.refresh());
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      {/* セクションと一緒に横へ流し、視点が移動している感覚を作る背景 */}
      <div ref={gridRef} className="grid-layer" aria-hidden="true" />
      {showGauge && <HeroStartGauge onReveal={finishIntro} onComplete={hideGauge} />}
      <Header ready={introDone} />
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
