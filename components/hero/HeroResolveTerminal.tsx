// 中央CLIパネル描画の入力。
interface HeroResolveTerminalProps {
  phase: "error" | "resolving";
  errorTabCount: number;
  onResolve: () => void;
}

// エラー修復コマンドUI（待機/実行中）を表示する。
export default function HeroResolveTerminal({ phase, errorTabCount, onResolve }: HeroResolveTerminalProps) {
  return (
    <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,22rem)] -translate-x-1/2 -translate-y-1/2 select-none">
      <div
        className={`overflow-hidden rounded-lg border border-black/25 bg-[#1a1a1a] shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] ${
          phase === "error" ? "cursor-pointer" : ""
        }`}
        role={phase === "error" ? "button" : undefined}
        tabIndex={phase === "error" ? 0 : undefined}
        aria-label={phase === "error" ? "fix-lead コマンドを実行してエラーを解消" : undefined}
        onClick={(e) => {
          if (phase !== "error") return;
          e.stopPropagation();
          onResolve();
        }}
        onKeyDown={(e) => {
          if (phase !== "error") return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onResolve();
          }
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#2a2a2a] px-2.5 py-1.5">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono text-[10px] font-medium tracking-wide text-white/45">portfolio-cli — zsh</span>
        </div>

        {phase === "error" ? (
          <div className="group w-full px-3 py-2.5 text-left font-mono text-[11px] leading-snug text-emerald-300/90 transition-colors hover:bg-white/[0.06] active:bg-white/[0.08]">
            <p className="mb-1 text-white/40">ERR: duplicate LEAD handlers ({errorTabCount})</p>
            <p className="mb-2 text-[10px] text-white/28">hint: run purge to consolidate</p>
            <p>
              <span className="text-sky-400/90">portfolio</span>
              <span className="text-white/40">@</span>
              <span className="text-violet-300/85">site</span>
              <span className="text-white/40">:</span>
              <span className="text-amber-200/75">~</span>
              <span className="text-white/40">$ </span>
              <span className="text-amber-100/95 group-hover:underline decoration-amber-100/40 underline-offset-2">
                npx portfolio-cli fix-lead --purge
              </span>
              <span
                className="ml-0.5 inline-block h-3 w-1 translate-y-px bg-emerald-400 align-middle animate-pulse"
                aria-hidden
              />
            </p>
            <p className="mt-2 text-[10px] text-white/30">クリックで実行</p>
          </div>
        ) : (
          <div className="px-3 py-2.5 font-mono text-[11px] leading-snug text-emerald-300/90">
            <p className="mb-1.5">
              <span className="text-sky-400/90">portfolio</span>
              <span className="text-white/40">@</span>
              <span className="text-violet-300/85">site</span>
              <span className="text-white/40">:</span>
              <span className="text-amber-200/75">~</span>
              <span className="text-white/40">$ </span>
              <span className="text-amber-100/90">npx portfolio-cli fix-lead --purge</span>
            </p>
            <p className="flex items-center gap-2 text-white/55">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/25 border-t-emerald-400" />
              <span className="animate-pulse">purging ghost LEAD buttons…</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
