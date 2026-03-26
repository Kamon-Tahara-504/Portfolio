"use client";

import ProtectedImage from "@/components/ProtectedImage";

export default function ProjectModalImage({
  projectTitle,
  imageSrc,
}: {
  projectTitle: string;
  imageSrc: string;
}) {
  return (
    <div className="relative w-full max-w-[440px] mx-auto md:max-w-none md:mx-0 overflow-hidden aspect-[4/5] md:aspect-square bg-white">
      <ProtectedImage
        wrapperClassName="absolute inset-0"
        src={imageSrc}
        alt={projectTitle}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 95vw, 50vw"
      />
    </div>
  );
}

