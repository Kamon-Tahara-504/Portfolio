export type ErrorTabVariant = "mac" | "win";

// エラータブ1枚分のレイアウト定義。
export interface ErrorTabSurface {
  variant: ErrorTabVariant;
  positionClass: string;
  widthClass: string;
}

export type ErrorTabPhase = "spawning" | "active" | "green" | "closing" | "removed";

// 画面周辺に散らすタブの配置定義。
export const ERROR_TAB_SURFACES: ErrorTabSurface[] = [
  { variant: "mac", positionClass: "left-[3vw] top-[6vh]", widthClass: "w-[min(84vw,19rem)]" },
  { variant: "win", positionClass: "left-[28vw] top-[4vh]", widthClass: "w-[min(80vw,18rem)]" },
  { variant: "mac", positionClass: "right-[4vw] top-[8vh]", widthClass: "w-[min(82vw,19rem)]" },
  { variant: "win", positionClass: "left-[6vw] top-[24vh]", widthClass: "w-[min(78vw,17rem)]" },
  { variant: "mac", positionClass: "right-[8vw] top-[22vh]", widthClass: "w-[min(80vw,18rem)]" },
  { variant: "win", positionClass: "left-[34vw] top-[18vh]", widthClass: "w-[min(76vw,17rem)]" },
  { variant: "mac", positionClass: "left-[4vw] bottom-[20vh]", widthClass: "w-[min(80vw,18rem)]" },
  { variant: "win", positionClass: "right-[5vw] bottom-[21vh]", widthClass: "w-[min(80vw,18rem)]" },
  { variant: "mac", positionClass: "left-[18vw] bottom-[8vh]", widthClass: "w-[min(78vw,17rem)]" },
  { variant: "win", positionClass: "right-[16vw] bottom-[7vh]", widthClass: "w-[min(78vw,17rem)]" },
  { variant: "mac", positionClass: "left-1/2 bottom-[4vh] -translate-x-[60%]", widthClass: "w-[min(76vw,17rem)]" },
  { variant: "win", positionClass: "left-1/2 bottom-[3vh] -translate-x-[10%]", widthClass: "w-[min(76vw,17rem)]" },
];

// 視覚上の上->下に近い順で解消するための順序。
export const ERROR_TAB_RESOLVE_ORDER = [1, 0, 2, 5, 4, 3, 7, 6, 8, 9, 10, 11] as const;
// タブ関連処理で共通利用する件数。
export const ERROR_TAB_COUNT = ERROR_TAB_SURFACES.length;

// 解消アニメーションのタイミング定数群。
export const CLI_RESOLVE_WARMUP_MS = 2000;
export const TAB_GREEN_STAGGER_MS = 68;
export const GREEN_TO_CLOSE_DELAY_MS = 90;
export const TAB_CLOSE_STAGGER_MS = 40;
export const TAB_CLOSE_ANIM_MS = 240;
export const BORDER_RED_TO_GREEN_MS = 200;
export const AFTER_LAST_TAB_PAD_MS = 400;
