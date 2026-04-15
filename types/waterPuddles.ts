export type WaterPuddleClipVariant = "1" | "2" | "3" | "4" | "5";

export interface WaterPuddle {
  id: string;
  image: string;
  alt: string;
  top: string;
  left: string;
  width: string;
  height: string;
  rotate?: number;
  clipVariant: WaterPuddleClipVariant;
}
