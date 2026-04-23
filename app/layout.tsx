import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { collectCriticalImageUrls } from "@/lib/collectLocalAssetUrls";
import "./globals.css";

// UI全体で使うサンセリフ系フォント設定。
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// UI全体で使う等幅フォント設定。
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Next.js が参照するアプリ共通メタデータ。
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Scroll-driven portfolio with snap sections and parallax layers.",
};

// 全ページ共通のHTML/BODYラッパー。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
  const criticalImageUrls = collectCriticalImageUrls(basePath);

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {criticalImageUrls.map((href) => (
          <link key={href} rel="preload" as="image" href={href} />
        ))}
      </head>
      <body className="min-h-full">
        <div className="no-select-surface min-h-full">{children}</div>
      </body>
    </html>
  );
}
