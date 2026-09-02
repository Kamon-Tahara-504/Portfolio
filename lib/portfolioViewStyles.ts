import type { PortfolioViewMode } from "@/types/portfolioView";

type ViewStyleOptions = {
  personal: string;
  recruiter: string;
};

// ビューモードに応じてクラス文字列を返す。
export function viewClass(viewMode: PortfolioViewMode, options: ViewStyleOptions): string {
  return viewMode === "recruiter" ? options.recruiter : options.personal;
}

export function isRecruiterView(viewMode: PortfolioViewMode): boolean {
  return viewMode === "recruiter";
}

/** セクション本文の muted テキスト。 */
export function mutedText(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-zinc-300",
    recruiter: "text-foreground-muted",
  });
}

/** カード型サーフェス。 */
export function surfaceCard(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "rounded-lg border border-zinc-300/20 bg-black/30 p-4 sm:p-5",
    recruiter: "rounded-lg border border-border bg-surface p-4 sm:p-5",
  });
}

/** 見出し（小）。 */
export function sectionHeading(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-sm font-semibold tracking-wide text-zinc-100 uppercase sm:text-base",
    recruiter: "text-sm font-semibold tracking-wide text-foreground uppercase sm:text-base",
  });
}

/** 本文。 */
export function bodyText(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-sm leading-relaxed text-zinc-300 sm:text-base",
    recruiter: "text-sm leading-relaxed text-foreground-muted sm:text-base",
  });
}

/** プライマリボタン（Contact / GitHub 等）。 */
export function primaryButton(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "inline-flex items-center justify-center rounded-full border border-zinc-300/30 bg-zinc-900/55 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-300/50 hover:bg-zinc-900/75",
    recruiter:
      "inline-flex items-center justify-center rounded-full border border-border bg-surface-muted px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-zinc-400 hover:bg-zinc-100",
  });
}

/** モーダルパネル。 */
export function modalPanel(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-300/20 bg-zinc-950/95 text-zinc-100 shadow-2xl",
    recruiter:
      "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface text-foreground shadow-2xl",
  });
}

/** モーダルバックドロップ。 */
export function modalBackdrop(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "fixed inset-0 z-50 bg-black/75 backdrop-blur-md",
    recruiter: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
  });
}

/** 固定ラベル（縦書き・Copyright）。 */
export function fixedLabel(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-zinc-200/75",
    recruiter: "text-zinc-500/80",
  });
}

/** ナビゲーションテキスト。 */
export function navText(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-zinc-200/85",
    recruiter: "text-foreground-muted",
  });
}

/** チップ（Profile 等）。 */
export function chip(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "inline-flex items-center gap-1 rounded-full border border-zinc-300/25 bg-zinc-900/55 px-2.5 py-1 backdrop-blur-sm text-zinc-100",
    recruiter: "inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-foreground",
  });
}

/** CTA ボタン（GitHub / Contact / モーダルリンク）。 */
export function ctaButton(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300/25 bg-zinc-900/70 px-5 text-sm font-bold tracking-wide text-zinc-100 shadow-md transition-[transform,box-shadow,background-color,border-color] duration-300 hover:scale-105 hover:border-zinc-300/45 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm sm:h-12",
    recruiter:
      "group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface-muted px-5 text-sm font-bold tracking-wide text-foreground shadow-sm transition-[transform,box-shadow,background-color,border-color] duration-300 hover:scale-105 hover:border-zinc-400 hover:bg-zinc-100 hover:shadow-md active:scale-[1.02] sm:h-12",
  });
}

/** 区切り線。 */
export function divider(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "h-px w-full bg-white/40",
    recruiter: "h-px w-full bg-border",
  });
}

/** モーダル閉じるボタン。 */
export function modalCloseButton(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/30 bg-zinc-900/90 text-zinc-100 shadow-md transition-[transform,box-shadow] duration-200 hover:bg-zinc-800 active:translate-y-0.5 active:shadow-sm sm:right-4 sm:top-4",
    recruiter:
      "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground shadow-sm transition-[transform,box-shadow] duration-200 hover:bg-zinc-100 active:translate-y-0.5 sm:right-4 sm:top-4",
  });
}

/** フォームラベル。 */
export function formLabel(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "mb-2 block text-sm font-semibold text-zinc-200 sm:text-base",
    recruiter: "mb-2 block text-sm font-semibold text-foreground sm:text-base",
  });
}

/** フォーム入力。 */
export function formInput(viewMode: PortfolioViewMode, hasError: boolean): string {
  const base = viewClass(viewMode, {
    personal:
      "w-full rounded-md border bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 sm:text-base",
    recruiter:
      "w-full rounded-md border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 sm:text-base",
  });
  const border = hasError ? "border-red-500" : viewClass(viewMode, { personal: "border-zinc-300/30", recruiter: "border-border" });
  return `${base} ${border}`;
}

/** モーダル見出し（h3）。 */
export function modalHeading(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-xl font-bold tracking-tight text-zinc-100 md:text-2xl",
    recruiter: "text-xl font-bold tracking-tight text-foreground md:text-2xl",
  });
}

/** 技術タグ。 */
export function tagPill(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "rounded-md border border-zinc-300/20 bg-zinc-900/55 px-3 py-1.5 text-sm font-semibold text-zinc-200",
    recruiter: "rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm font-semibold text-foreground",
  });
}

/** Works カード外枠。 */
export function worksCard(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "group relative h-[14.5rem] w-[11.5rem] snap-start overflow-hidden rounded-2xl border border-zinc-300/20 bg-zinc-900/40 text-left shadow-lg shadow-black/35 transition hover:scale-[1.01] hover:border-zinc-300/40 sm:h-[16.5rem] sm:w-[13.5rem] lg:h-[17.5rem] lg:w-[14.5rem]",
    recruiter:
      "group relative h-[14.5rem] w-[11.5rem] snap-start overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-md transition hover:scale-[1.01] hover:border-zinc-400 sm:h-[16.5rem] sm:w-[13.5rem] lg:h-[17.5rem] lg:w-[14.5rem]",
  });
}

/** Career カード。 */
export function careerCard(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "w-full min-w-0 rounded-2xl border border-zinc-300/20 bg-black/30 px-3.5 py-3 backdrop-blur-[2px] md:px-4",
    recruiter: "w-full min-w-0 rounded-2xl border border-border bg-surface px-3.5 py-3 md:px-4",
  });
}

/** 小見出し（Career タイトル等）。 */
export function titleStrong(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "text-base leading-none font-semibold text-white sm:text-lg md:text-xl",
    recruiter: "text-base leading-none font-semibold text-foreground sm:text-lg md:text-xl",
  });
}

/** GitHub ヘッダーボタン（Stack）。 */
export function headerActionButton(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "inline-flex shrink-0 items-center gap-2 rounded-md border border-zinc-300/30 bg-zinc-900/55 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-300/50 hover:bg-zinc-900/75 sm:px-4 sm:py-2.5 sm:text-sm",
    recruiter:
      "inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:border-zinc-400 hover:bg-zinc-100 sm:px-4 sm:py-2.5 sm:text-sm",
  });
}

/** モーダル内リンクボタン。 */
export function modalLinkButton(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal:
      "group inline-flex items-center gap-1.5 rounded-full border border-zinc-300/25 bg-zinc-900/70 px-4 py-2 text-sm font-bold text-zinc-100 shadow-md transition-[transform,box-shadow,background-color] duration-300 hover:scale-105 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm",
    recruiter:
      "group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-[transform,box-shadow,background-color] duration-300 hover:scale-105 hover:bg-zinc-100 hover:shadow-md active:scale-[1.02]",
  });
}

/** ナビホバー。 */
export function navHover(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "hover:text-white",
    recruiter: "hover:text-foreground",
  });
}

/** アクティブナビ下線。 */
export function navUnderline(viewMode: PortfolioViewMode): string {
  return viewClass(viewMode, {
    personal: "bg-zinc-100",
    recruiter: "bg-foreground",
  });
}
