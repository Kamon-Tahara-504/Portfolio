"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b border-black bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-colors hover:text-black/70"
          >
            Portfolio
          </Link>
          <ul className="flex gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-black border-b-2 border-black pb-1"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-black/60">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

