"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useVideoColor } from "@/contexts/VideoColorContext";
import { useVideoColorDetection } from "@/hooks/useVideoColorDetection";

const basePath =
  process.env.NODE_ENV === "production" ? "/Portfolio" : "";

const videoSources = [
  `${basePath}/images/profile/Galaxy1.mp4`,
  `${basePath}/images/profile/Galaxy2.mp4`,
  `${basePath}/images/profile/Galaxy3.mp4`,
];

export default function FixedVideoBackground() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isNextVideoActive, setIsNextVideoActive] = useState(false);
  const [displayedVideoElement, setDisplayedVideoElement] =
    useState<HTMLVideoElement | null>(null);

  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoPreloadedRef = useRef<boolean>(false);
  const { setIsDark } = useVideoColor();

  const getNextIndex = useCallback(
    (index: number) => (index + 1) % videoSources.length,
    []
  );

  const { canvasRef } = useVideoColorDetection({
    videoElement: displayedVideoElement,
    onColorDetected: setIsDark,
    enabled: true,
  });

  // Sync displayedVideoElement when isNextVideoActive changes (refs don't trigger re-render)
  useEffect(() => {
    const el = isNextVideoActive ? nextVideoRef.current : activeVideoRef.current;
    setDisplayedVideoElement(el);
  }, [isNextVideoActive]);

  // Initial load: set first video on activeVideo
  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    if (!activeVideo) return;

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
    activeVideo.src = videoSources[0];
    activeVideo.load();
    nextVideoPreloadedRef.current = false;

    return () => {
      activeVideo.removeEventListener("error", handleError);
      activeVideo.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  // Initial play on activeVideo (when not showing next yet)
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
    if (activeVideo.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      activeVideo.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const preloadNextVideo = useCallback(() => {
    if (nextVideoPreloadedRef.current) return;

    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;
    const nextIndex = getNextIndex(currentVideoIndex);
    const currentSrc = waitingVideo.src || "";

    if (!currentSrc.includes(videoSources[nextIndex])) {
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
      nextVideoPreloadedRef.current = true;
    }
  }, [currentVideoIndex, isNextVideoActive, getNextIndex]);

  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleLoadedMetadata = () => {
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      if (!currentVideo.duration || isNaN(currentVideo.duration)) return;
      if (currentVideo.duration <= 1.0 && !nextVideoPreloadedRef.current) {
        preloadNextVideo();
      }
    };

    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    if (
      currentVideo.readyState >= 1 &&
      currentVideo.duration &&
      !isNaN(currentVideo.duration) &&
      currentVideo.duration <= 1.0 &&
      !nextVideoPreloadedRef.current
    ) {
      preloadNextVideo();
    }

    return () => {
      currentVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentVideoIndex, isNextVideoActive, preloadNextVideo]);

  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleTimeUpdate = () => {
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      if (!currentVideo.duration || isNaN(currentVideo.duration)) return;
      const timeRemaining =
        currentVideo.duration - currentVideo.currentTime;
      if (timeRemaining <= 1.0 && !nextVideoPreloadedRef.current) {
        preloadNextVideo();
      }
    };

    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentVideoIndex, isNextVideoActive, preloadNextVideo]);

  useEffect(() => {
    const activeVideo = activeVideoRef.current;
    const nextVideo = nextVideoRef.current;
    if (!activeVideo || !nextVideo) return;

    const handleVideoEnd = () => {
      const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
      const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;

      if (waitingVideo.readyState >= 3) {
        setIsNextVideoActive(!isNextVideoActive);

        const playPromise = waitingVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              currentVideo.pause();
              currentVideo.currentTime = 0;
              setCurrentVideoIndex(getNextIndex(currentVideoIndex));
              nextVideoPreloadedRef.current = false;
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Next video autoplay failed:", error);
              }
              setIsNextVideoActive(!isNextVideoActive);
            });
        } else {
          currentVideo.pause();
          currentVideo.currentTime = 0;
          setCurrentVideoIndex(getNextIndex(currentVideoIndex));
          nextVideoPreloadedRef.current = false;
        }
      } else {
        const handleCanPlay = () => {
          waitingVideo.removeEventListener("canplay", handleCanPlay);
          handleVideoEnd();
        };
        waitingVideo.addEventListener("canplay", handleCanPlay, {
          once: true,
        });
      }
    };

    const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
    currentVideo.addEventListener("ended", handleVideoEnd);
    return () => {
      currentVideo.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentVideoIndex, isNextVideoActive, getNextIndex]);

  const setActiveRef = useCallback(
    (el: HTMLVideoElement | null) => {
      activeVideoRef.current = el;
      if (!isNextVideoActive) setDisplayedVideoElement(el);
    },
    [isNextVideoActive]
  );

  const setNextRef = useCallback(
    (el: HTMLVideoElement | null) => {
      nextVideoRef.current = el;
      if (isNextVideoActive) setDisplayedVideoElement(el);
    },
    [isNextVideoActive]
  );

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-black"
      aria-hidden
    >
      <div className="absolute inset-0">
        <video
          ref={setActiveRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover ${
            !isNextVideoActive ? "z-10" : "z-0"
          }`}
        />
        <video
          ref={setNextRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover ${
            isNextVideoActive ? "z-10" : "z-0"
          }`}
        />
        <div className="absolute inset-0 z-20 bg-black/40" />
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
