"use client";

interface TimelineHeaderProps {
  onPlay: () => void;
  isPlaying: boolean;
}

export default function TimelineHeader({ onPlay, isPlaying }: TimelineHeaderProps) {
  return (
    <div className="absolute top-[18px] left-0 right-0 flex items-center justify-center gap-3 z-30">
      <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
        Learning Timeline
      </h3>
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className={`relative rounded-full bg-black p-2 text-white transition-all duration-200 hover:opacity-80 active:scale-95 ${
          isPlaying ? "animate-pulse-scale" : ""
        }`}
        style={isPlaying ? { opacity: 1 } : {}}
        aria-label={isPlaying ? "再生中" : "再生"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}
