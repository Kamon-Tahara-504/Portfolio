import VisionConceptEquation from "@/components/about/VisionConceptEquation";

// Visionセクションの本文入力。
interface VisionSectionProps {
  description: string;
}

// ビジョン説明文と「迷い→技術→解決」のコンセプト数式を表示する。
export default function VisionSection({ description }: VisionSectionProps) {
  return (
    <div className="space-y-4 lg:ml-10 xl:ml-16">
      <p className="text-sm font-semibold leading-relaxed text-zinc-200 whitespace-pre-line md:text-base">
        {description}
      </p>
      {/* 説明文の直下に「遅い処理 × 実装 = 高速化」の可視化。スマホ幅でははみ出し防止のため非表示 */}
      <div className="hidden md:block">
        <VisionConceptEquation />
      </div>
    </div>
  );
}
