"use client";

import { useRef, useEffect, useState } from "react";

export function useTimelineAutoScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentScrollTargetRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      if (!isPlaying) {
        isPlayingRef.current = false;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (currentScrollTargetRef.current !== null) {
        const targetPosition = currentScrollTargetRef.current;
        const currentPosition = container.scrollLeft;
        if (Math.abs(currentPosition - targetPosition) > 1) {
          container.scrollLeft = targetPosition;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (!scrollContainerRef.current || isPlaying) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    const container = scrollContainerRef.current;

    container.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    const checkScrollComplete = () => {
      let lastScrollLeft = container.scrollLeft;
      let stableFrameCount = 0;
      const requiredStableFrames = 3;

      const checkFrame = () => {
        const currentScrollLeft = container.scrollLeft;

        if (Math.abs(currentScrollLeft) < 1) {
          if (Math.abs(currentScrollLeft - lastScrollLeft) < 0.1) {
            stableFrameCount++;
            if (stableFrameCount >= requiredStableFrames) {
              currentScrollTargetRef.current = 0;

              timeoutIdRef.current = setTimeout(() => {
                const startScrollLeft = container.scrollLeft;
                const endScrollLeft = Math.max(
                  0,
                  container.scrollWidth - container.clientWidth
                );
                const scrollDistance = endScrollLeft - startScrollLeft;
                const duration = 9000;
                const startTime = Date.now();

                const animateScroll = () => {
                  if (!container) {
                    setIsPlaying(false);
                    animationFrameIdRef.current = null;
                    return;
                  }

                  const elapsed = Date.now() - startTime;
                  const scrollProgress = Math.min(elapsed / duration, 1);

                  const easeInOut = (t: number) => {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                  };

                  const easedProgress = easeInOut(scrollProgress);
                  const currentScrollLeft =
                    startScrollLeft + scrollDistance * easedProgress;

                  currentScrollTargetRef.current = currentScrollLeft;
                  container.scrollLeft = currentScrollLeft;

                  if (scrollProgress < 1) {
                    animationFrameIdRef.current =
                      requestAnimationFrame(animateScroll);
                  } else {
                    container.scrollLeft = endScrollLeft;
                    currentScrollTargetRef.current = endScrollLeft;
                    setIsPlaying(false);
                    isPlayingRef.current = false;
                    animationFrameIdRef.current = null;
                    currentScrollTargetRef.current = null;
                  }
                };

                animationFrameIdRef.current = requestAnimationFrame(animateScroll);
              }, 1500);
              return;
            }
          } else {
            stableFrameCount = 0;
          }
        } else {
          stableFrameCount = 0;
        }

        lastScrollLeft = currentScrollLeft;
        requestAnimationFrame(checkFrame);
      };

      requestAnimationFrame(checkFrame);
    };

    checkScrollComplete();
  };

  return { scrollContainerRef, isPlaying, handlePlay };
}
