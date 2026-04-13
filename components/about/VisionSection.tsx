// Visionセクションの本文入力。
interface VisionSectionProps {
  description: string;
}

// ビジョン説明文を改行付きで表示する。
export default function VisionSection({ description }: VisionSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold leading-relaxed text-zinc-200 whitespace-pre-line md:text-base">
        {description}
      </p>
    </div>
  );
}
