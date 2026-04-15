import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Creative Portfolio",
  description: "Scroll-driven portfolio with snap sections and parallax layers.",
};

// 全ページ共通のHTML/BODYラッパー。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="no-select-surface min-h-full">{children}</div>
      </body>
    </html>
  );
}
