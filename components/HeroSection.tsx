"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useVideoColor } from "@/contexts/VideoColorContext";
import { useVideoColorDetection } from "@/hooks/useVideoColorDetection";

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
  nameEn?: string;
  developerTitle?: string;
}

// basePathの定義（GitHub Pages用）
const basePath = '/Portfolio';

// 3つの映像ファイルのパス
const videoSources = [
  `${basePath}/images/profile/Galaxy1.mp4`,
  `${basePath}/images/profile/Galaxy2.mp4`,
  `${basePath}/images/profile/Galaxy3.mp4`,
];

export default function HeroSection({
  image,
  title,
  subtitle,
  nameEn,
  developerTitle,
}: HeroSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isNextVideoActive, setIsNextVideoActive] = useState(false); // 次の動画が表示中かどうか
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const { setIsDark } = useVideoColor();
  
  // 次の動画の読み込み済みフラグ（重複読み込みを防止）
  const nextVideoPreloadedRef = useRef<boolean>(false);

  // 次の動画のインデックスを計算
  const getNextIndex = (index: number) => (index + 1) % videoSources.length;

  // 色検出（表示中のvideo要素から検出）
  const { canvasRef } = useVideoColorDetection({
    videoElement: isNextVideoActive ? nextVideoRef.current : activeVideoRef.current,
    onColorDetected: setIsDark,
    enabled: true,
  });

  // 初期化：最初の動画をactiveVideoに読み込み（2つ目は終了1秒前に読み込み開始）
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    if (!activeVideo) return;

    // エラーハンドリングを追加
    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      console.error("Video loading error:", {
        src: video.src,
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState,
      });
    };

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", activeVideo.src);
    };

    activeVideo.addEventListener("error", handleError);
    activeVideo.addEventListener("loadeddata", handleLoadedData);

    // activeVideoに1つ目の動画を設定
    activeVideo.src = videoSources[0];
    activeVideo.load();
    
    // 2つ目の動画は終了1秒前に読み込み開始（timeupdateイベントで処理）
    nextVideoPreloadedRef.current = false;

    return () => {
      activeVideo.removeEventListener("error", handleError);
      activeVideo.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  // activeVideoの再生管理（初期再生時のみ）
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    if (!activeVideo || isNextVideoActive) return;

    const handleCanPlay = () => {
      const playPromise = activeVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Video autoplay failed:", error);
          }
        });
      }
    };

    activeVideo.addEventListener("canplay", handleCanPlay);

    // 既に読み込まれている場合は再生
    if (activeVideo.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      activeVideo.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // 次の動画を読み込む関数
  const preloadNextVideo = useCallback(() => {
    if (nextVideoPreloadedRef.current) return;
    
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;
    const nextIndex = getNextIndex(currentVideoIndex);
    
    // 既に読み込まれていない場合のみ読み込み開始
    const currentSrc = waitingVideo.src || "";
    if (!currentSrc.includes(videoSources[nextIndex])) {
      // エラーハンドリングを追加
      const handleError = (e: Event) => {
        const video = e.target as HTMLVideoElement;
        console.error("Next video loading error:", {
          src: video.src,
          error: video.error,
          networkState: video.networkState,
        });
      };

      waitingVideo.addEventListener("error", handleError, { once: true });
      waitingVideo.src = videoSources[nextIndex];
      waitingVideo.load();
      nextVideoPreloadedRef.current = true;
    } else {
      // 既に読み込まれている場合はフラグを設定
      nextVideoPreloadedRef.current = true;
    }
  }, [currentVideoIndex, isNextVideoActive, getNextIndex]);

  // loadedmetadataイベントでdurationを取得し、動画が1秒未満の場合は即座に読み込み開始
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleLoadedMetadata = () => {
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      
      // durationが取得できているか確認
      if (!currentVideo.duration || isNaN(currentVideo.duration)) return;
      
      // 動画が1秒未満の場合は即座に次の動画を読み込み開始
      if (currentVideo.duration <= 1.0 && !nextVideoPreloadedRef.current) {
        preloadNextVideo();
      }
    };

    // 現在表示中の動画のloadedmetadataイベントを監視
    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

    // 既にメタデータが読み込まれている場合
    if (currentVideo.readyState >= 1 && currentVideo.duration && !isNaN(currentVideo.duration)) {
      if (currentVideo.duration <= 1.0 && !nextVideoPreloadedRef.current) {
        preloadNextVideo();
      }
    }

    return () => {
      currentVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentVideoIndex, isNextVideoActive, preloadNextVideo]);

  // timeupdateイベントで終了1秒前を監視し、次の動画の読み込みを開始
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleTimeUpdate = () => {
      // 現在表示中の動画を特定
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      
      // durationが取得できているか確認
      if (!currentVideo.duration || isNaN(currentVideo.duration)) return;
      
      // 終了1秒前かどうかをチェック
      const timeRemaining = currentVideo.duration - currentVideo.currentTime;
      
      // 終了1秒前になったら、次の動画の読み込みを開始
      if (timeRemaining <= 1.0 && !nextVideoPreloadedRef.current) {
        preloadNextVideo();
      }
    };

    // 現在表示中の動画のtimeupdateイベントを監視
    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentVideoIndex, isNextVideoActive, preloadNextVideo]);

  // 動画終了時の処理
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleVideoEnd = () => {
      // 現在表示中の動画を特定
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;

      // waitingVideoが既に読み込まれていることを確認
      if (waitingVideo.readyState >= 3) {
        // waitingVideoを前面に表示して再生開始
        setIsNextVideoActive(!isNextVideoActive);
        
        const playPromise = waitingVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // currentVideoを停止
              currentVideo.pause();
              currentVideo.currentTime = 0;

              // currentVideoIndexを更新
              const newIndex = getNextIndex(currentVideoIndex);
              setCurrentVideoIndex(newIndex);

              // 読み込み済みフラグをリセット
              nextVideoPreloadedRef.current = false;

              // currentVideoに次の次の動画は終了1秒前に読み込み開始（timeupdateイベントで処理）
              // ここでは読み込まない
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Next video autoplay failed:", error);
              }
              setIsNextVideoActive(!isNextVideoActive); // 元に戻す
            });
        }
      }
    };

    // 現在表示中の動画のendedイベントを監視
    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("ended", handleVideoEnd);

    return () => {
      currentVideo.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentVideoIndex, isNextVideoActive]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-black">
        {/* activeVideo: 現在表示・再生中の動画 */}
        <video
          ref={activeVideoRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover ${
            !isNextVideoActive ? "z-10" : "z-0"
          }`}
        />
        {/* nextVideo: 次の動画を事前読み込み */}
        <video
          ref={nextVideoRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover ${
            isNextVideoActive ? "z-10" : "z-0"
          }`}
        />
        <div className="absolute inset-0 bg-black/40 z-20" />
      </div>
      {/* 色検出用のCanvas（非表示） */}
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative z-30 flex flex-col items-center justify-center text-center text-white px-4">
        {/* PORTFOLIO ラベル */}
        <div className="mb-6 animate-fade-in-left">
          <span className="inline-block px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/80 border border-white/30 rounded-full backdrop-blur-sm bg-white/5">
            PORTFOLIO
          </span>
        </div>

        {/* 名前（英語） */}
        {nameEn && (
          <h1 className="mb-6 animate-fade-in-left delay-100">
            <span className="block text-6xl font-extrabold tracking-tight md:text-8xl lg:text-9xl bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_0_40px_rgba(255,255,255,0.3)]">
              {nameEn}
            </span>
        </h1>
        )}

        {/* 開発者タイトル */}
        {developerTitle && (
          <div className="mb-4 animate-fade-in-left delay-200">
            <p className="text-lg font-medium tracking-wide md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              {developerTitle}
            </p>
          </div>
        )}

        {/* 既存のsubtitle（フォールバック） */}
        {!developerTitle && subtitle && (
          <div className="mb-4 animate-fade-in-left delay-200">
            <p className="text-lg font-medium tracking-wide md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

