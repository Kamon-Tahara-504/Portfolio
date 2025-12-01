"use client";

import { useState, useEffect, useRef } from "react";

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
}

// 5つの映像ファイルのパス
const videoSources = [
  "/images/hero/Galaxy1.mp4",
  "/images/hero/Galaxy2.mp4",
  "/images/hero/Galaxy3.mp4",
  "/images/hero/Galaxy4.mp4",
  "/images/hero/Galaxy5.mp4",
];

export default function HeroSection({
  image,
  title,
  subtitle,
}: HeroSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // フェードアウト
      setFadeIn(false);
      
      // フェードアウト後に次の映像に切り替え
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
        setFadeIn(true);
      }, 300); // フェードトランジションの時間
    };

    video.addEventListener("ended", handleVideoEnd);

    // 映像を再生（load()は不要、srcの変更で自動的にロードされる）
    const playPromise = video.play();
    
    // play()のPromiseを処理（AbortErrorは無視）
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // AbortErrorは新しいloadが発生したことを示すだけなので無視
        if (error.name !== "AbortError") {
          console.error("Video autoplay failed:", error);
        }
      });
    }

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      // クリーンアップ時に再生を停止
      video.pause();
      video.currentTime = 0;
    };
  }, [currentVideoIndex]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={videoSources[currentVideoIndex]}
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center text-white">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

