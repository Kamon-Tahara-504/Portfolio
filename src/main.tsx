import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { preloadPageImages } from "./lib/preloadImages";
import { resetEntryPosition } from "./lib/scroll";

resetEntryPosition();
// ゲージで隠しているあいだに、Hero と About、制作カードの画像を先に取る
preloadPageImages();
// 描画後にブラウザが前回位置を戻しても、その直後に先頭へ戻す
window.addEventListener("load", resetEntryPosition);
window.addEventListener("pageshow", resetEntryPosition);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
