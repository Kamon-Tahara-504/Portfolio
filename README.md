# Portfolio Kamon-Tahara-504

## 技術スタック

### フレームワーク・ライブラリ
- **Next.js 16** (App Router)
- **React 19.2.0**
- **React DOM 19.2.0**

### 言語・型システム
- **TypeScript 5**

### スタイリング
- **TailwindCSS 4**
- **PostCSS**

### メール送信
- **EmailJS** (@emailjs/browser)

### その他
- **React Context API** (状態管理)
- **Custom Hooks** (再利用可能なロジック)
- **Next.js Image** (画像最適化)
- **SSG** (Static Site Generation) で高速化

## 機能

### Top
- 動画背景（動画を自動ループ再生）
- 動画の色検出機能（ナビゲーションバーの色を動的に変更）
- 名前、タイトル、開発者タイトルを表示

### About
- プロフィール画像と自己紹介
- 基本情報
- 連絡先情報
- GitHubリンク
- お問い合わせフォーム（EmailJSを使用したモーダル）

### Experience
- タイムライン形式で経験を表示
- 各経験のタイトル、会社、期間、説明

### Skills
- スキルカテゴリ別表示（Frontend、Backend、Mobile、Tools）
- 各スキルの自信レベル表示
- Learning Timeline（スキルの学習期間をタイムラインで可視化）
  - 再生機能付き（自動スクロールアニメーション）

### Projects
- プロジェクトグリッド表示
- プロジェクトカードクリックでモーダル表示
- プロジェクト詳細（画像ギャラリー、技術スタック、日付、GitHub/Demoリンク）

### Navigation
- 固定ナビゲーションバー（右側）
- セクション間のスムーズスクロール
- 上下移動ボタン（↑ ↓）
- アクティブセクションのハイライト表示

##  commitメッセージ

- feat：新機能追加
- fix：バグ修正
- hotfix：クリティカルなバグ修正
- add：新規（ファイル）機能追加
- update：機能修正（バグではない）
- change：仕様変更
- clean：整理（リファクタリング等）
- disable：無効化（コメントアウト等）
- remove：削除（ファイル）
- upgrade：バージョンアップ
- revert：変更取り消し
- docs：ドキュメント修正（README、コメント等）
- tyle：コードフォーマット修正（インデント、スペース等）
- perf：パフォーマンス改善
- test：テストコード追加・修正
- ci：CI/CD 設定変更（GitHub Actions 等）
- build：ビルド関連変更（依存関係、ビルドツール設定等）
- chore：雑務的変更（ユーザーに直接影響なし）