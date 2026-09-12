/**
 * "YYYY-MM" を月インデックス（0-based）に変換
 */
export function parseDate(dateStr: string): number {
  const [year, month] = dateStr.split("-").map(Number);
  return year * 12 + month - 1;
}

/**
 * "YYYY-MM" を "YYYY年M月" 形式で表示
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `${year}年${parseInt(month)}月`;
}

/**
 * 2つの期間が重なっているか判定
 */
export function hasOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return start1 < end2 && start2 < end1;
}

/** タイムライン開始月（2022年1月） */
export const FIXED_START_MONTH = 2022 * 12 + 0;

/** 1ヶ月あたりのピクセル幅 */
export const PIXELS_PER_MONTH = 50;

/** 上側5層・下側5層のレイヤー高さ（px） */
export const LAYER_HEIGHTS = {
  above: [-58, -116, -174, -232, -290],
  below: [58, 116, 174, 232, 290],
};

/** タイムライン領域の高さ（px）。スキルカード群に近いボリュームにする。 */
export const TIMELINE_HEIGHT = 550;

/** 中央基準線の上端位置（px） */
export const BASE_LINE_TOP = 275;
