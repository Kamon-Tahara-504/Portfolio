/*
 * FixedVideoBackground — 映像背景機能（現在無効）
 *
 * 再有効化する場合:
 *   1. 下記コメントアウトを解除
 *   2. components/Layout.tsx に以下を追加:
 *        import FixedVideoBackground from "./FixedVideoBackground";
 *        <FixedVideoBackground />  ← <ViewContext.Provider> 直下に配置
 */

// "use client";
//
// import { useState, useEffect, useRef, useCallback } from "react";
//
// const basePath =
//   process.env.NODE_ENV === "production" ? "/Portfolio" : "";
//
// const videoSources = [
//   `${basePath}/images/profile/Galaxy1.mp4`,
//   `${basePath}/images/profile/Galaxy2.mp4`,
//   `${basePath}/images/profile/Galaxy3.mp4`,
// ];
//
// export default function FixedVideoBackground() {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [isNextVideoActive, setIsNextVideoActive] = useState(false);
//
//   const activeVideoRef = useRef<HTMLVideoElement>(null);
//   const nextVideoRef = useRef<HTMLVideoElement>(null);
//   const nextVideoPreloadedRef = useRef<boolean>(false);
//
//   const getNextIndex = useCallback(
//     (index: number) => (index + 1) % videoSources.length,
//     []
//   );
//
//   useEffect(() => {
//     const activeVideo = activeVideoRef.current;
//     if (!activeVideo) return;
//     const handleError = (e: Event) => {
//       const video = e.target as HTMLVideoElement;
//       console.error("Video loading error:", { src: video.src, error: video.error });
//     };
//     const handleLoadedData = () => {
//       console.log("Video loaded successfully:", activeVideo.src);
//     };
//     activeVideo.addEventListener("error", handleError);
//     activeVideo.addEventListener("loadeddata", handleLoadedData);
//     activeVideo.src = videoSources[0];
//     activeVideo.load();
//     nextVideoPreloadedRef.current = false;
//     return () => {
//       activeVideo.removeEventListener("error", handleError);
//       activeVideo.removeEventListener("loadeddata", handleLoadedData);
//     };
//   }, []);
//
//   useEffect(() => {
//     const activeVideo = activeVideoRef.current;
//     if (!activeVideo || isNextVideoActive) return;
//     const handleCanPlay = () => {
//       const playPromise = activeVideo.play();
//       if (playPromise !== undefined) {
//         playPromise.catch((error) => {
//           if (error.name !== "AbortError") console.error("Video autoplay failed:", error);
//         });
//       }
//     };
//     activeVideo.addEventListener("canplay", handleCanPlay);
//     if (activeVideo.readyState >= 3) handleCanPlay();
//     return () => { activeVideo.removeEventListener("canplay", handleCanPlay); };
//   }, []);
//
//   const preloadNextVideo = useCallback(() => {
//     if (nextVideoPreloadedRef.current) return;
//     const activeVideo = activeVideoRef.current;
//     const nextVideo = nextVideoRef.current;
//     if (!activeVideo || !nextVideo) return;
//     const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;
//     const nextIndex = getNextIndex(currentVideoIndex);
//     if (!(waitingVideo.src || "").includes(videoSources[nextIndex])) {
//       waitingVideo.addEventListener("error", () => {}, { once: true });
//       waitingVideo.src = videoSources[nextIndex];
//       waitingVideo.load();
//     }
//     nextVideoPreloadedRef.current = true;
//   }, [currentVideoIndex, isNextVideoActive, getNextIndex]);
//
//   useEffect(() => {
//     const activeVideo = activeVideoRef.current;
//     const nextVideo = nextVideoRef.current;
//     if (!activeVideo || !nextVideo) return;
//     const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
//     const handleTimeUpdate = () => {
//       if (!currentVideo.duration || isNaN(currentVideo.duration)) return;
//       if (currentVideo.duration - currentVideo.currentTime <= 1.0 && !nextVideoPreloadedRef.current)
//         preloadNextVideo();
//     };
//     currentVideo.addEventListener("timeupdate", handleTimeUpdate);
//     return () => { currentVideo.removeEventListener("timeupdate", handleTimeUpdate); };
//   }, [currentVideoIndex, isNextVideoActive, preloadNextVideo]);
//
//   useEffect(() => {
//     const activeVideo = activeVideoRef.current;
//     const nextVideo = nextVideoRef.current;
//     if (!activeVideo || !nextVideo) return;
//     const handleVideoEnd = () => {
//       const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
//       const waitingVideo = isNextVideoActive ? activeVideo : nextVideo;
//       if (waitingVideo.readyState >= 3) {
//         setIsNextVideoActive(!isNextVideoActive);
//         const playPromise = waitingVideo.play();
//         if (playPromise !== undefined) {
//           playPromise
//             .then(() => {
//               currentVideo.pause();
//               currentVideo.currentTime = 0;
//               setCurrentVideoIndex(getNextIndex(currentVideoIndex));
//               nextVideoPreloadedRef.current = false;
//             })
//             .catch((error) => {
//               if (error.name !== "AbortError") console.error("Next video autoplay failed:", error);
//               setIsNextVideoActive(!isNextVideoActive);
//             });
//         } else {
//           currentVideo.pause();
//           currentVideo.currentTime = 0;
//           setCurrentVideoIndex(getNextIndex(currentVideoIndex));
//           nextVideoPreloadedRef.current = false;
//         }
//       } else {
//         const handleCanPlay = () => { waitingVideo.removeEventListener("canplay", handleCanPlay); handleVideoEnd(); };
//         waitingVideo.addEventListener("canplay", handleCanPlay, { once: true });
//       }
//     };
//     const currentVideo = isNextVideoActive ? nextVideo : activeVideo;
//     currentVideo.addEventListener("ended", handleVideoEnd);
//     return () => { currentVideo.removeEventListener("ended", handleVideoEnd); };
//   }, [currentVideoIndex, isNextVideoActive, getNextIndex]);
//
//   return (
//     <div className="fixed inset-0 z-0 pointer-events-none bg-black" aria-hidden>
//       <div className="absolute inset-0">
//         <video ref={activeVideoRef} muted playsInline preload="auto"
//           className={`absolute inset-0 h-full w-full object-cover ${!isNextVideoActive ? "z-10" : "z-0"}`} />
//         <video ref={nextVideoRef} muted playsInline preload="auto"
//           className={`absolute inset-0 h-full w-full object-cover ${isNextVideoActive ? "z-10" : "z-0"}`} />
//         <div className="absolute inset-0 z-20 bg-black/40" />
//       </div>
//     </div>
//   );
// }

export default function FixedVideoBackground() {
  return null;
}
