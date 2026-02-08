"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { About, Contact } from "@/types/profile";
import EngineerExperienceCard from "./EngineerExperienceCard";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import ContactModal from "./ContactModal";
import AboutMoreInfoCard from "./AboutMoreInfoCard";

// basePathの定義（開発環境では空、本番環境では'/Portfolio'）
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

interface AboutSectionProps {
  name: string;
  nameEn?: string;
  age?: number | string;
  title: string;
  about: About;
  contact?: Contact;
}

export default function AboutSection({
  name,
  nameEn,
  age,
  title,
  about,
  contact,
}: AboutSectionProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // 英語名を分割: "Tahara Kamon" -> ["Tahara", "kamon"]
  const nameEnParts = nameEn?.split(' ').map((part, index) => 
    index === 0 ? part : part.toLowerCase()
  ) || [];

  const titleRef = useFadeInOnScroll({ delay: 0 });
  const imageRef = useFadeInOnScroll({ delay: 100 });
  const contentRef = useFadeInOnScroll({ delay: 200 });

  return (
    <section
      id="about"
      className="relative border-b border-black pt-12 pb-48 md:pt-28 md:pb-56"
    >
      <div className="mx-auto max-w-7-5xl px-6">
        <h2
          ref={titleRef.ref as React.RefObject<HTMLHeadingElement>}
          className={`mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl fade-in-from-left section-title-blink ${titleRef.isVisible ? "visible" : ""}`}
        >
          About
        </h2>
        <div className="flex flex-col gap-16 md:flex-row md:items-center">
          {/* 4:3比率の画像 - 大きく左寄せ */}
          <div 
            ref={imageRef.ref as React.RefObject<HTMLDivElement>}
            className={`relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden border border-black bg-black/5 md:w-1/2 fade-in-from-left ${imageRef.isVisible ? 'visible' : ''}`}
          >
            <Image
              src={about.image.startsWith('/') ? `${basePath}${about.image}` : about.image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* テキストコンテンツ */}
            <div 
            ref={contentRef.ref as React.RefObject<HTMLDivElement>}
            className={`flex-1 space-y-6 fade-in-from-left ${contentRef.isVisible ? 'visible' : ''}`}
            >
            {/* 切り替えボタン */}
            {about.moreInfo && (
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="relative bg-white text-black border-[3px] !border-black rounded-2xl px-5 py-3 text-base font-bold text-center min-w-[160px] shadow-xl hover:shadow-2xl hover:scale-105 transition-all mb-2 before:content-[''] before:absolute before:bottom-0 before:left-4 before:translate-y-full before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-t-[10px] before:!border-t-black"
              >
                {showMoreInfo ? "基本情報に戻る" : "もっと知る"}
              </button>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {name}
                </h3>
                {age && (
                  <span className="text-lg font-medium text-black/70 md:text-xl whitespace-nowrap">
                    {age}歳
                  </span>
                )}
                <EngineerExperienceCard />
              </div>
              {nameEnParts.length > 0 && (
                <div className="flex items-baseline gap-2">
                  {nameEnParts.map((part, index) => (
                    <span
                      key={index}
                      className="text-sm font-medium tracking-tight text-black/60 md:text-base"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              {/* 自己紹介文 - 通常のフロー */}
              <div className="space-y-3 leading-relaxed text-black/80 md:text-lg">
                {about.description.split("\n").map((line, index) => (
                  <p key={index} className="break-keep break-words">
                    {line}
                  </p>
                ))}
              </div>

              {/* 連絡先情報（TELまで） */}
              {contact && (
                <div className="space-y-2 pt-4 text-sm text-black/70 md:text-base">
                  {about.birthDate && (
                    <div className="flex items-center gap-2">
                      <span><span className="font-bold">生年月日</span>:</span>
                      <span>{about.birthDate}</span>
                    </div>
                  )}
                  {about.birthplace && (
                    <div className="flex items-center gap-2">
                      <span><span className="font-bold">出身</span>:</span>
                      <span>{about.birthplace}</span>
                    </div>
                  )}
                  {about.hobby && (
                    <div className="flex items-center gap-2">
                      <span><span className="font-bold">好きなこと</span>:</span>
                      <span>{about.hobby}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <span><span className="font-bold">Email</span>:</span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-black transition-colors underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <span><span className="font-bold">TEL</span>:</span>
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:text-black transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 詳細情報カード - 重ねて表示 */}
              {about.moreInfo && (
                <AboutMoreInfoCard
                  moreInfo={about.moreInfo}
                  isVisible={showMoreInfo}
                />
              )}
            </div>
            {/* 連絡先情報のボタン（GitHub、お問い合わせ） */}
            {contact && (
              <div className="flex flex-wrap gap-4">
                {contact.github && (
                    <Link
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90 md:text-base"
                    >
                      <svg
                        className="h-5 w-5"
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
                    </Link>
                  )}
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-black bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5 md:text-base"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    お問い合わせ
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}
    </section>
  );
}

