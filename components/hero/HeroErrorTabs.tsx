import {
  BORDER_RED_TO_GREEN_MS,
  ErrorTabPhase,
  ERROR_TAB_SURFACES,
  TAB_CLOSE_ANIM_MS,
} from "@/components/hero/errorTabs";

// エラータブ群レンダリング用の入力。
interface HeroErrorTabsProps {
  phases: ErrorTabPhase[];
}

// 各タブのフェーズに応じて色・消失状態を描画する。
export default function HeroErrorTabs({ phases }: HeroErrorTabsProps) {
  return (
    <>
      {ERROR_TAB_SURFACES.map((surf, index) => {
        const tabPhase = phases[index];
        if (tabPhase === "removed") return null;
        const isActive = tabPhase === "active";
        const isClosing = tabPhase === "closing";
        const rounded = surf.variant === "mac" ? "rounded-xl" : "rounded-sm";
        return (
          <div
            key={`error-tab-${index}`}
            className={`pointer-events-none fixed z-[38] overflow-hidden bg-zinc-900/95 shadow-2xl ${surf.positionClass} ${surf.widthClass} ${rounded} transition-[border-color,opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive
                ? "border-2 border-red-500/85 opacity-100 scale-100"
                : isClosing
                  ? "border-2 border-emerald-400/95 opacity-0 scale-[0.96]"
                  : "border-2 border-emerald-400/95 opacity-100 scale-100"
            }`}
            style={{
              transitionDuration: isClosing ? `${TAB_CLOSE_ANIM_MS}ms` : `${BORDER_RED_TO_GREEN_MS}ms`,
            }}
          >
            {surf.variant === "mac" ? (
              <>
                <div className="flex items-center gap-2 border-b border-zinc-300/15 bg-zinc-800/90 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs font-medium text-zinc-300">Unexpected Error</span>
                </div>
                <div className="space-y-2 px-4 py-3 text-sm text-zinc-200">
                  <p className="font-semibold">macOS reported an unexpected error.</p>
                  <p className="text-zinc-400">LEAD handlers are duplicated and need recovery.</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-zinc-300/15 bg-zinc-800/95 px-3 py-2">
                  <span className="text-xs font-medium text-zinc-200">Windows Error</span>
                  <span className="text-xs text-zinc-400">X</span>
                </div>
                <div className="space-y-2 px-4 py-3 text-sm text-zinc-200">
                  <p className="font-semibold">Unexpected system exception occurred.</p>
                  <p className="text-zinc-400">Portfolio rendering pipeline requires manual resolve.</p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
