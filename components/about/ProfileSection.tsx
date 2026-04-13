import Image from "next/image";
import { AboutData, HeroData } from "@/types/profile";

// Profileセクションの入力データ。
interface ProfileSectionProps {
  about: AboutData;
  hero: HeroData;
  profileChips: string[];
}

// プロフィール画像・基本情報・チップを表示する。
export default function ProfileSection({ about, hero, profileChips }: ProfileSectionProps) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4 self-start">
        <div className="relative my-3 h-72 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-300/20 bg-black/30 md:h-96">
          <Image
            src={about.about.image}
            alt={`${about.name} portrait`}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {profileChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-zinc-300/30 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="grid gap-2 text-sm text-zinc-200">
          <p className="rounded-md bg-zinc-900/35 px-3 py-2">Birth: {about.about.birthDate}</p>
          <p className="rounded-md bg-zinc-900/35 px-3 py-2">Hobby: {about.about.hobby}</p>
          <p className="rounded-md bg-zinc-900/35 px-3 py-2">Contact: {about.contact?.email}</p>
        </div>
      </div>
      <div className="mt-6 grid auto-rows-min content-start self-start grid-cols-1 gap-3 sm:grid-cols-2 md:mt-10">
        {[
          { label: "Name", value: about.name },
          { label: "Name En", value: about.nameEn },
          { label: "Role", value: hero.developerTitle },
          { label: "GitHub", value: "Available" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-zinc-300/20 bg-black/30 px-3 py-2"
          >
            <p className="text-lg leading-snug font-semibold text-white md:text-xl">{item.value}</p>
            <p className="text-[10px] tracking-wide text-zinc-300 uppercase md:text-[11px]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
