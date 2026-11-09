import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages の公開 URL を以前と同じ /Portfolio/ に保つ
export default defineConfig({
  base: "/Portfolio/",
  plugins: [react()],
});
