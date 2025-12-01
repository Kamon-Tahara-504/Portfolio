# Portfolio

白と黒を基調とした建築設計図風のデザインで、Webアプリケーションとモバイルアプリケーションの作品を展示するポートフォリオサイトです。

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **SSG** (Static Site Generation) で高速化

## 機能

- トップページ：ヒーローセクションと作品プレビュー
- 作品一覧ページ：全作品をグリッド表示
- 作品詳細ページ：個別作品の詳細情報と画像ギャラリー
- Aboutページ：自己紹介とスキル

## データ管理

作品データは `data/projects.json` で管理されています。新しい作品を追加する場合は、このファイルを編集してください。

## 映像ファイルの配置

ヒーローセクションで使用する映像ファイルは `public/videos/hero/` ディレクトリに配置してください。

必要なファイル：
- `video1.mp4`
- `video2.mp4`
- `video3.mp4`
- `video4.mp4`
- `video5.mp4`

これらの映像は順番に自動再生され、最後の映像の後は最初の映像に戻ってループします。

## Getting Started

開発サーバーを起動:

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

本番用ビルド:

```bash
npm run build
npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
