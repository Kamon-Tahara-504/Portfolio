import { Metadata } from "next";
import GridPattern from "@/components/GridPattern";

export const metadata: Metadata = {
  title: "About | Portfolio",
  description: "About me and my skills",
};

export default function AboutPage() {
  return (
    <div className="relative border-b border-black bg-white py-16 md:py-24">
      <GridPattern className="opacity-20" size={80} strokeWidth={0.5} />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            About
          </h1>
        </div>

        <div className="space-y-8 text-lg text-black/80">
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-black">
              Introduction
            </h2>
            <p className="leading-relaxed">
              こんにちは。Webアプリケーションとモバイルアプリケーションの開発をしています。
              ユーザー体験を重視した、使いやすく美しいアプリケーションを作ることを心がけています。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-black">
              Skills
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-semibold">Frontend</h3>
                <p className="text-black/70">
                  React, Next.js, TypeScript, TailwindCSS
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Mobile</h3>
                <p className="text-black/70">React Native, Expo</p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Tools</h3>
                <p className="text-black/70">Git, GitHub, Vercel</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-black">
              Contact
            </h2>
            <p className="leading-relaxed text-black/70">
              お問い合わせやご相談がございましたら、お気軽にご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

