"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VideoColorContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const VideoColorContext = createContext<VideoColorContextType | undefined>(
  undefined
);

export function VideoColorProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <VideoColorContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </VideoColorContext.Provider>
  );
}

export function useVideoColor() {
  const context = useContext(VideoColorContext);
  if (context === undefined) {
    throw new Error("useVideoColor must be used within a VideoColorProvider");
  }
  return context;
}

