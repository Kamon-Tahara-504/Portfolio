import { useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Hero } from "./components/sections/Hero";
import { Skills } from "./components/sections/Skills";
import { Works } from "./components/sections/Works";
import { useDiagonalScroll } from "./hooks/useDiagonalScroll";
import { useLineDraw } from "./hooks/useLineDraw";
import { ScrollTrigger } from "./lib/gsap";

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
      <Header />
      {/* useDiagonalScroll は main の直下の要素をセクション単位として扱う */}
      <main ref={mainRef}>
        <Hero />
        <About />
        <Works />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
