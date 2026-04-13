"use client";

import { useState } from "react";
import Image from "next/image";
import ContactModal from "@/components/about/ContactModal";
import { AboutData, HeroData } from "@/types/profile";

// Profileセクションの入力データ。
interface ProfileSectionProps {
  about: AboutData;
  hero: HeroData;
  profileChips: string[];
}

// プロフィール画像・基本情報・チップを表示する。
export default function ProfileSection({ about, hero, profileChips }: ProfileSectionProps) {
  // Contactモーダル表示状態。
  const [isContactOpen, setIsContactOpen] = useState(false);
  // GitHubリンク（未設定時は空文字）。
  const githubUrl = about.contact?.github ?? "";

  return (
    <>
      <div className="grid items-start gap-6 md:grid-cols-[1.25fr_1fr]">
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
        </div>
        <div className="mt-6 flex flex-col gap-4 md:mt-10">
          <div className="space-y-1">
            <p className="text-4xl leading-none font-bold tracking-tight text-white md:text-5xl">
              {about.name}
            </p>
            <p className="text-lg font-semibold text-zinc-200/90 md:text-2xl">{about.nameEn}</p>
            <p className="text-sm font-medium text-zinc-300/90 md:text-base">{hero.developerTitle}</p>
          </div>

          <p className="text-sm leading-relaxed text-zinc-200">
            {profileChips.filter(Boolean).join(" / ")}
          </p>

          <div className="space-y-1 text-sm leading-relaxed text-zinc-200">
            <p>Birth: {about.about.birthDate}</p>
            <p>Hobby: {about.about.hobby}</p>
            <p>Contact: {about.contact?.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!githubUrl}
              className={`group col-span-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold tracking-wide transition-[transform,box-shadow,background-color,border-color] duration-300 ${
                githubUrl
                  ? "border-zinc-300/25 bg-zinc-900/70 text-zinc-100 shadow-md hover:scale-105 hover:border-zinc-300/45 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm"
                  : "pointer-events-none border-zinc-300/20 bg-zinc-900/30 text-zinc-500"
              }`}
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="group col-span-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-300/25 bg-zinc-900/70 px-4 text-sm font-bold tracking-wide text-zinc-100 shadow-md transition-[transform,box-shadow,background-color,border-color] duration-300 hover:scale-105 hover:border-zinc-300/45 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.93a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              Contact
            </button>
          </div>
        </div>
      </div>

      {isContactOpen ? <ContactModal onClose={() => setIsContactOpen(false)} /> : null}
    </>
  );
}
