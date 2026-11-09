# ポートフォリオの便利機能

画面構成は [README.md](./README.md) を参照。この文書は、見た目の裏で効いている仕組みと、実装の置き場所をまとめたものです。

---

## 1. 表示倍率の制限

ブラウザのズームが **50% 以下** または **130% より大きい** とき、崩れたレイアウトの閲覧を止めて全画面ロックを出します。

| 役割 | ファイル |
| --- | --- |
| 倍率の推定と判定 | [`lib/useBrowserZoomCompensation.ts`](./lib/useBrowserZoomCompensation.ts) |
| ロック画面 UI | [`components/page/BrowserZoomLock.tsx`](./components/page/BrowserZoomLock.tsx) |
| 呼び出し | [`components/page.tsx`](./components/page.tsx) で `useBrowserZoomLock()` |

### 実装の要点

ブラウザズームは CSS だけでは止められないので、**推定した倍率でロックする**方式です。

1. `window.outerWidth / window.innerWidth` でブラウザズームを推定する（OS の Retina スケールと切り分けやすい）
2. 使えない環境だけ `devicePixelRatio` 比へフォールバックする（Mac は基準 DPR を 2 とみなす）
3. 測定ノイズで 101% などになるのを防ぐため、一般的なズーム段階（100 / 110 / 125 ...）へ丸める
4. `resize` と `visualViewport.resize` で追従する

ロック中の文言は、ブラウザズームで一緒に拡大縮小されないよう、検出倍率の逆数で `transform: scale()` しています。

```ts
const LOCK_MIN_RATIO = 0.5; // 50% 以下
const LOCK_MAX_RATIO = 1.3; // 130% より大きい
```

`useBrowserZoomCompensation()` は過去の自動補正の名残で、現在は常に `1` を返します。固定ラベルなどには `style={{ zoom }}` が残っていますが、補正は行っていません。

---

## 2. 画像・文字の保護ラッパー

右クリック保存・ドラッグ保存・テキスト選択を抑止します。2 層あります。

### 全体ラッパー（文字・画像の選択）

[`app/layout.tsx`](./app/layout.tsx) のルートを `.no-select-surface` で包み、[`app/globals.css`](./app/globals.css) で配下すべてに `user-select: none` を付けています。`img` / `svg` は `-webkit-user-drag: none` も付けます。

```tsx
<body className="min-h-full">
  <div className="no-select-surface min-h-full">{children}</div>
</body>
```

### 画像ラッパー `ProtectedImage`

[`components/ProtectedImage.tsx`](./components/ProtectedImage.tsx) は `next/image` の薄いラッパーです。About の顔写真、Works カード、プロジェクト詳細の画像で使っています。

やっていること:

- ラッパーで `contextmenu` / `dragstart` を `preventDefault`
- 画像自体は `draggable={false}` と `pointer-events-none`
- 透明な `span` を画像の上に重ね、保存メニューの対象にしない

```tsx
<ProtectedImage
  src={about.image}
  alt="..."
  wrapperClassName="relative overflow-hidden rounded-2xl"
/>
```

`wrapperClassName` は呼び出し側のレイアウト用です。内部で `relative` を常時付けないのは、`absolute inset-0` の fill 画像と競合して消えるためです。

完全なコピー防止ではありません。ブラウザの開発者ツールからは取得できます。見た目上の抑止です。

---


## 4. 画像の先行読み込み

初期表示で必要な画像と、あとで出す画像を分けています。

| 種類 | 内容 | 実装 |
| --- | --- | --- |
| critical | About 写真、Hero、Top1、Top2 | [`app/layout.tsx`](./app/layout.tsx) で `<link rel="preload" as="image">` |
| warmup | Top3 以降、作品画像、App Store バッジ | [`components/AssetWarmup.tsx`](./components/AssetWarmup.tsx) |

URL の集約は [`lib/collectLocalAssetUrls.ts`](./lib/collectLocalAssetUrls.ts) です。本番の `basePath`（`/Portfolio`）をここで付けます。

ウォームアップ側の注意:

- `window.load` のあとに始める（初期表示の帯域を奪わない）
- `requestIdleCallback` で 1 枚ずつ
- 最大 10 枚
- `Save-Data` や 2G 系ではスキップする

パスが間違っていても表示コンポーネントは止めません。キャッシュを温めるためのベストエフォートです。


--

## 1. 導入ゲージ（0% → 100%）

最初に出る円ゲージです。充填が終わるとモード選択へ進みます。見た目の演出であり、アセット読み込みの進捗ではありません。

| 役割 | ファイル |
| --- | --- |
| ゲージ本体 | [`components/hero/HeroStartGauge.tsx`](./components/hero/HeroStartGauge.tsx) |
| 完了後に picker へ切替 | [`components/hero/HeroSection.tsx`](./components/hero/HeroSection.tsx) |
| 100% 時の放射 | [`components/hero/HeroRadialBurst.tsx`](./components/hero/HeroRadialBurst.tsx) |

### 進捗の出し方

50ms ごとに経過時間からパーセントを計算します。CSS アニメーションだけに任せないのは、中央の数字と円弧を同じ値にするためです。

1. 最初の 400ms は 0% のまま置く
2. 続く 2200ms で 0 → 98。`easeInOutCubic`（前半加速、後半減速）
3. 99 と 100 は各 500ms ずつ段階表示する（98 から一気に 100 に飛ばない）
4. 100% で放射を出し、720ms ホールドしたあと 480ms でフェードアウトし、`onComplete()` する

円弧は SVG の `stroke-dasharray` / `stroke-dashoffset` です。円周 `2πr`（r = 88）に対して、未到達分だけ offset を残します。

```ts
const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);
```

`prefers-reduced-motion: reduce` のときは充填を飛ばして 100% にし、すぐ `onComplete()` します。

ホバーで円が満タンになるほうは別実装です。[`HeroViewModePicker.tsx`](./components/hero/HeroViewModePicker.tsx) が `requestAnimationFrame` で 0→1 を詰め、満タンになるまでクリックできません。

---