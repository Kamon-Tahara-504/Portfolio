import Image from "next/image";
import { About } from "@/types/profile";

interface AboutSectionProps {
  name: string;
  title: string;
  about: About;
}

export default function AboutSection({
  name,
  title,
  about,
}: AboutSectionProps) {
  return (
    <section
      id="about"
      className="border-b border-black bg-white py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl">
          About
        </h2>
        <div className="flex flex-col items-center gap-16 md:flex-row md:items-start">
          {/* 4:3比率の画像 - エリアを拡大 */}
          <div className="relative aspect-[4/3] w-full max-w-lg flex-shrink-0 overflow-hidden border border-black bg-black/5 md:w-2/5">
            <Image
              src={about.image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* テキストコンテンツ */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
                {name}
              </h3>
              <p className="text-lg text-black/70 md:text-xl">{title}</p>
            </div>
            <p className="leading-relaxed text-black/80 md:text-lg">
              {about.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

