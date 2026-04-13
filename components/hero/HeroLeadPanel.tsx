// ヒーローのタイトル/LEADボタン表示に必要な入力。
interface HeroLeadPanelProps {
  nameEn?: string;
  isResolved: boolean;
  onEnterMain: () => void;
}

// 未解決時にプレースホルダー表示する矢印アイコン。
const leadArrow = (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ヒーロー中央のタイトルとLEAD導線を描画する。
export default function HeroLeadPanel({ nameEn, isResolved, onEnterMain }: HeroLeadPanelProps) {
  if (!nameEn) return null;

  return (
    <div className="relative z-10 flex flex-col items-center gap-1 px-6 text-center select-none pointer-events-none">
      <p className="font-ink font-bold leading-none text-white" style={{ fontSize: "clamp(100px, 16vw, 260px)" }}>
        Portfolio
      </p>
      <h1 className="w-full max-w-[min(640px,80vw)] text-right pr-3 md:pr-6 mb-1">
        <span className="font-ink font-bold leading-tight text-white text-2xl md:text-3xl lg:text-4xl">
          - Kamon Tahara
        </span>
      </h1>
      <div className="mt-1 flex h-[72px] items-center justify-center">
        {isResolved ? (
          <button
            type="button"
            onClick={onEnterMain}
            className="pointer-events-auto group inline-flex items-center gap-3 rounded-full border border-zinc-200/40 bg-zinc-950/65 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-lg backdrop-blur-sm transition-[border-color,transform,box-shadow] duration-300 hover:scale-105 hover:border-zinc-100/70 active:scale-[1.02]"
            aria-label="ポートフォリオを見る"
          >
            <span>LEAD</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div
            className="invisible inline-flex items-center gap-3 rounded-full border-2 border-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.25em]"
            aria-hidden
          >
            <span>LEAD</span>
            {leadArrow}
          </div>
        )}
      </div>
    </div>
  );
}
