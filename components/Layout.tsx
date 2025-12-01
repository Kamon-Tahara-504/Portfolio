"use client";

import React from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <main>{children}</main>
      <footer className="border-t border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-black/60">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

