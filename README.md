# Tahara Kamon | Portfolio

田原 果門（Tahara Kamon）のポートフォリオサイトです。  
Web / Mobile アプリケーションの設計と開発を中心に紹介しています。

**Live Site**: [https://kamon-tahara-504.github.io/Portfolio/](https://kamon-tahara-504.github.io/Portfolio/)

> 本プロジェクトは個人のポートフォリオのため、Issue 駆動や細かいトピックブランチ運用はしていません。  
> 変更は主に既定ブランチへのコミットで積み上げています。

## 技術スタック

- **Vite 8** + **React 19**
- **TypeScript 7**
- **GSAP**（ScrollTrigger / Flip）
- **CSS Modules** + CSS カスタムプロパティ
- **oxlint**

## 画面構成

1. **Hero**  
   氏名とリードの導入。背景画像のパララックス。
2. **About**  
   プロフィール画像、リード、自己紹介、基本情報。
3. **Works**  
   Selected Works のカード一覧。クリックでカード自体が拡大表示され、表示中は背景スクロールをロックします。Other Projects は一覧表で表示します。
4. **Career**  
   経歴タイムライン。
5. **Skills**  
   Frontend / Backend / Mobile / Tools のスキル表示。
6. **Contact**  
   連絡先への導線。

## 主な挙動

- セクション単位の斜めスクロール遷移（GSAP ScrollTrigger）
- Works カードの拡大開閉（GSAP Flip + 文字移動）
- `prefers-reduced-motion` への対応
- コンテンツは `data/*.json` から読み込み

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