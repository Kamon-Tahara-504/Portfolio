/**
 * public 配下のパスを、GitHub Pages の公開先(/Portfolio/)でも解決できる形に揃える。
 * Vite の base を変えても、呼び出し側は "/images/..." のままでよい。
 */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
}
