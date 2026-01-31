"use client";

import React, { useEffect } from "react";
import Navigation from "./Navigation";
import { VideoColorProvider } from "@/contexts/VideoColorContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <VideoColorProvider>
      <div className="min-h-screen bg-white text-black">
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-black bg-white">
          <div className="mx-auto max-w-7-5xl px-6 py-8 text-center text-sm text-black/60">
            <p>©︎ 2025 Kamon-Tahara-504</p>
            <p className="mt-2">Licensed under MIT License</p>
          </div>
        </footer>
      </div>
    </VideoColorProvider>
  );
}

