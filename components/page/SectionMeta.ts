// ページ内スナップセクションの識別子。
export type SectionId = "about" | "vision" | "career" | "skills" | "works" | "stack";

// ナビゲーションと見出し描画に必要なメタ情報。
export type SectionMeta = {
  id: SectionId;
  label: string;
  title: string;
};

// セクション描画順と表示ラベルを定義する定数。
export const SECTION_META: SectionMeta[] = [
  { id: "about", label: "01 / About", title: "ABOUT" },
  { id: "vision", label: "02 / Vision", title: "VISION" },
  { id: "career", label: "03 / Carrer", title: "CARRER" },
  { id: "skills", label: "04 / Skills", title: "SKILLS" },
  { id: "works", label: "05 / Works", title: "WORKS" },
  { id: "stack", label: "06 / Stack", title: "STACK" },
];
