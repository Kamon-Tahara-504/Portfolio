// Skillsセクション内の表示フェーズ。
export type SkillsPhase = "skills" | "toTimeline" | "timeline" | "toSkills";

// カードが中心へ収束する際の移動量定義。
export const CARD_CONVERGE = [
  { x: "52%", y: "54%" },
  { x: "-52%", y: "54%" },
  { x: "52%", y: "-54%" },
  { x: "-52%", y: "-54%" },
] as const;

// Skillsセクション遷移のアニメーション定数群。
export const CARD_MOTION_DURATION = 0.7;
export const CARD_MOTION_EASE = [0.4, 0, 0.2, 1] as const;
export const TIMELINE_SWITCH_RATIO = 0.7;

export const TIMELINE_ENTER_DURATION = 1.0;
export const TIMELINE_EXIT_DURATION = 0.6;
export const TIMELINE_CONTENT_REVEAL_RATIO = 0.5;
export const TIMELINE_HIDE_TO_EXIT_FRAME_MS = 16;
export const TIMELINE_ENTER_EASE = [0.16, 1, 0.3, 1] as const;
export const TIMELINE_EXIT_EASE = [0.6, 0, 0.6, 0] as const;

export const CONTENT_FADE_DURATION = 0.3;
export const CONTENT_FADE_EASE = [0.4, 0, 0.2, 1] as const;
