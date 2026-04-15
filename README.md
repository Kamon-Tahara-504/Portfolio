# Portfolio Kamon-Tahara-504

**Live Site**: [https://kamon-tahara-504.github.io/Portfolio/](https://kamon-tahara-504.github.io/Portfolio/)

> 本プロジェクトは趣味のポートフォリオサイトのため、**GitHub の Issue やトピックブランチを積極的に使う運用はしていません**。<br>
> 変更は主に既定ブランチへのコミットで積み上げています。<br>
> チーム開発向けのブランチ戦略や Issue 駆動の履歴は期待しないでください。

## 技術スタック

### フレームワーク・ライブラリ
- **Next.js 16** (App Router)
- **React 19.2.0**
- **Framer Motion**

### 言語・型システム
- **TypeScript 5**

### スタイリング
- **TailwindCSS 4**
- **PostCSS**

### メール送信
- **EmailJS** (@emailjs/browser)

### その他
- **Next.js Image** (画像最適化)
- **SSG** (Static Site Generation)

## 画面構成（現行）

### 1. Hero（導入画面）
- CLI/タブ風の導入アニメーション
- 「Lead」操作で本編へ遷移

### 2. Profile
- 自画像、所属、氏名、自己紹介
- 生年月日・出身・好きなことのチップ表示
- GitHub / Contact ボタン（Contact はモーダル）
- 画面幅 780px 未満で画像と本文を縦並び表示

### 3. Vision
- ビジョン本文
- 「遅い処理 × 実装 = 高速化」を表現した可視化オブジェクト（`md` 以上で表示）
- 画面幅に応じた要素サイズ調整で、はみ出しを抑制

### 4. Career
- ノード接続型の経歴タイムライン
- モバイルではノード列・カード列の重なりを避ける専用レイアウト

### 5. Skills
- Frontend / Backend / Mobile / Tools の4カード表示
- 理解度ゲージ表示
- タイムライン表示への切替（モバイルでは切替ボタン非表示）
- エンジニア歴カードは横幅 1130px 未満で非表示

### 6. Works
- プロジェクトカード一覧
- 選択時に詳細モーダルを表示

### 7. Stack
- Design Philosophy / Implementation Highlights / Learnings / Future Improvements
- Date 情報
- Tech Stack 一覧
- GitHub ボタンはセクション見出し右側に配置

## 共通UI・挙動（現行）

- セクション単位のスナップスクロール（本編）
- アクティブセクション連動の背景画像クロスフェード
- ヘッダーナビ（モバイルはタイトルのみ）
- 右下固定のコピーライト
- 右側固定の縦ラベル `2026 4/15 RENEWAL`
- 全体選択不可ラッパー（テキスト選択・画像ドラッグ抑止）

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