"use client";

import ProtectedImage from "@/components/ProtectedImage";

// モーダル左側のメイン画像表示ブロック。
export default function ProjectModalImage({
  projectTitle,
  imageSrc,
}: {
  projectTitle: string;
  imageSrc: string;
}) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-xl border border-zinc-300/20 bg-black/30 lg:mx-0 lg:aspect-square lg:max-w-none">
      <ProtectedImage
        wrapperClassName="absolute inset-0"
        src={imageSrc}
        alt={projectTitle}
        fill
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 52vw"
      />
    </div>
  );
}

