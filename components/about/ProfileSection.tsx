"use client";

import { useState } from "react";
import Image from "next/image";
import ContactModal from "@/components/about/ContactModal";
import { AboutData, HeroData } from "@/types/profile";

// public/images/about/TAHARA.jpg の実ピクセル比（Next/Image の width/height に使用し縦横比を維持する）
const PROFILE_IMAGE_WIDTH = 2560;
const PROFILE_IMAGE_HEIGHT = 1706;

// Profileセクションの入力データ。
interface ProfileSectionProps {
  about: AboutData;
  hero: HeroData;
  profileChips: string[];
}

function getAgeFromBirthDate(birthDate?: string): number | null {
  if (!birthDate) return null;
  const match = birthDate.match(/^(\d{4})\s+(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  if (!birthYear || !birthMonth || !birthDay) return null;

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

// プロフィール画像・基本情報・チップを表示する。
export default function ProfileSection({ about, hero, profileChips }: ProfileSectionProps) {
  // Contactモーダル表示状態。
  const [isContactOpen, setIsContactOpen] = useState(false);
  // GitHubリンク（未設定時は空文字）。
  const githubUrl = about.contact?.github ?? "";
  const currentAffiliation =
    about.affiliations?.find((affiliation) => affiliation.isCurrent) ?? about.affiliations?.[0];
  const currentAge = getAgeFromBirthDate(about.about.birthDate);

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="my-2 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:my-0 lg:max-w-none">
            <Image
              src={about.about.image}
              alt={`${about.name} portrait`}
              width={PROFILE_IMAGE_WIDTH}
              height={PROFILE_IMAGE_HEIGHT}
              sizes="(max-width: 640px) min(100vw, 32rem) (max-width: 1024px) min(100vw, 42rem) (max-width: 1536px) 48vw 42vw"
              className="h-auto w-full rounded-2xl border border-zinc-300/20 bg-black/30"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 text-[9px] font-semibold text-zinc-100 sm:text-[10px] md:text-[11px]">
            {about.about.birthDate ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300/25 bg-zinc-900/55 px-2.5 py-1 backdrop-blur-sm">
                <span className="text-zinc-400 whitespace-nowrap">生年月日</span>
                <span>{about.about.birthDate}</span>
              </span>
            ) : null}
            {about.about.birthplace ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300/25 bg-zinc-900/55 px-2.5 py-1 backdrop-blur-sm">
                <span className="text-zinc-400 whitespace-nowrap">出身</span>
                <span>{about.about.birthplace}</span>
              </span>
            ) : null}
            {about.about.hobby ? (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-300/25 bg-zinc-900/55 px-2.5 py-1 backdrop-blur-sm lg:max-w-full">
                <span className="text-zinc-400 whitespace-nowrap">好きなこと</span>
                <span className="truncate">{about.about.hobby}</span>
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="space-y-1">
            {currentAffiliation ? (
              <p className="mb-2 max-w-full text-[clamp(0.5625rem,2.15vw,0.875rem)] font-medium leading-tight tracking-wide text-zinc-300 max-md:overflow-x-auto max-md:whitespace-nowrap sm:text-xs md:overflow-visible md:whitespace-normal lg:text-sm">
                {currentAffiliation.name}
                {currentAffiliation.stage ? ` / ${currentAffiliation.stage}` : ""}
              </p>
            ) : null}
            <div className="flex flex-wrap items-end gap-x-2 gap-y-1 sm:gap-3">
              <p className="min-w-0 text-[clamp(1.55rem,5.8vw,3.3rem)] leading-none font-bold tracking-tight text-white">
                {about.name}
              </p>
              {currentAge !== null ? (
                <p className="shrink-0 pb-0.5 text-xs font-semibold text-zinc-300 sm:pb-1 sm:text-sm md:text-base">
                  {currentAge}歳
                </p>
              ) : null}
            </div>
            <p className="mb-2 text-sm font-semibold text-zinc-200/90 sm:text-base lg:mb-3 lg:text-lg xl:text-2xl">
              {about.nameEn}
            </p>
          </div>

          {profileChips.filter(Boolean).length > 0 ? (
            <p className="text-sm leading-relaxed text-zinc-200 lg:text-base">
              {profileChips.filter(Boolean).join(" / ")}
            </p>
          ) : null}

          {about.about.introduction ? (
            <p className="text-xs font-semibold leading-[1.75] text-pretty whitespace-pre-line text-zinc-200 sm:text-sm lg:leading-relaxed lg:text-base">
              {about.about.introduction}
            </p>
          ) : null}

          <div className="h-px w-full bg-white/40" aria-hidden />

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href={githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!githubUrl}
              className={`group inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold tracking-wide transition-[transform,box-shadow,background-color,border-color] duration-300 sm:h-12 ${
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
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300/25 bg-zinc-900/70 px-5 text-sm font-bold tracking-wide text-zinc-100 shadow-md transition-[transform,box-shadow,background-color,border-color] duration-300 hover:scale-105 hover:border-zinc-300/45 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm sm:h-12"
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
