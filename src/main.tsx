import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { resetEntryPosition } from "./lib/scroll";

resetEntryPosition();
window.addEventListener("pageshow", (event) => {
  // 戻るキャッシュから復帰したときも、途中セクションではなく先頭から始める
  if (event.persisted) resetEntryPosition();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
