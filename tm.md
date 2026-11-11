# スキル習得ロードマップ（Learning Timeline）の実装要点

Skills セクションのカード表示から切り替える、言語・フレームワークの習得期間タイムラインです。横軸は月、バーは開始〜終了（または現在）です。

---

## ファイル分担

| 役割 | ファイル |
| --- | --- |
| 期間データ | [`data/skills.json`](./data/skills.json) |
| 型（`startDate` / `endDate`） | [`types/profile.ts`](./types/profile.ts) |
| 切替ボタン | [`components/skills/SkillsModeToggle.tsx`](./components/skills/SkillsModeToggle.tsx) |
| フェーズ状態 | [`components/skills/SkillsViewContext.tsx`](./components/skills/SkillsViewContext.tsx) |
| 遷移の時間定数 | [`components/skills/skillsTransition.ts`](./components/skills/skillsTransition.ts) |
| カード ↔ タイムラインの入れ替え | [`components/skills/SkillsSection.tsx`](./components/skills/SkillsSection.tsx) |
| カードの収束アニメ | [`components/skills/SkillsGridPanel.tsx`](./components/skills/SkillsGridPanel.tsx) |
| バー配置計算 | [`hooks/useTimelineLayout.ts`](./hooks/useTimelineLayout.ts) |
| 月インデックス・重なり判定 | [`utils/timelineUtils.ts`](./utils/timelineUtils.ts) |
| 描画コンテナ | [`components/skills/SkillsTimeline.tsx`](./components/skills/SkillsTimeline.tsx) |
| 目盛り | [`components/skills/TimelineRuler.tsx`](./components/skills/TimelineRuler.tsx) |
| 1本のバー | [`components/skills/TimelineSkillBar.tsx`](./components/skills/TimelineSkillBar.tsx) |
| 再生スクロール | [`hooks/useTimelineAutoScroll.ts`](./hooks/useTimelineAutoScroll.ts) |
| 言語色 | [`utils/githubLanguageColors.ts`](./utils/githubLanguageColors.ts) |

`SkillsViewProvider` は [`components/page.tsx`](./components/page.tsx) で Skills セクションだけを包みます。切替ボタンと本体が同じ状態を共有するためです。

---

## データ

`Skill` はカード用の `level` と、タイムライン用の期間を持ちます。

```ts
startDate?: string;   // "YYYY-MM"
endDate?: string | null; // null は進行中
```

タイムラインに出す条件は **`startDate` があること** です。`level` だけの項目（HTML / CSS / GitHub など）はカードにだけ出ます。

カードに出さずタイムラインだけ出す項目は、JSON ではなく [`SkillsTimeline.tsx`](./components/skills/SkillsTimeline.tsx) に直書きしています（C# の初期学習、AWS）。

Django は JSON に期間がありますが、カード一覧では名前指定で除外しています。タイムライン側は `startDate` があるので出ます。

---

## 横軸の決め方

実装: [`utils/timelineUtils.ts`](./utils/timelineUtils.ts) / [`useTimelineLayout.ts`](./hooks/useTimelineLayout.ts)

- 月は `year * 12 + month - 1` の整数に変換する
- 左端は固定で **2022年1月**（`FIXED_START_MONTH`）
- 1ヶ月 = **50px**（`PIXELS_PER_MONTH`）
- 右端は「データ上の最遅月末」「今年の1月」「今月+2ヶ月」のうち遅い方
- バーの `left` / `width` は、この幅に対する **パーセント** で置く（横スクロールしても比率が崩れない）
- 進行中（`endDate === null`）の終端は「今月 + 0.5ヶ月」

年ラベルは各年の1月位置、月目盛りは1ヶ月ごとです。高さは 550px、基準線は中央 275px です。

---

## バーが重ならない配置

開始月の早い順に並べ、上5段・下5段（`LAYER_HEIGHTS`）へ詰めます。

1. 開始順が偶数なら上、奇数なら下を先に試す  
   例外: `SwiftUI / Swift` は上側を優先（`PREFER_ABOVE_SKILLS`）
2. その側で期間が重ならない段があればそこに置く
3. 埋まっていれば反対側を同じように探す
4. どちらも埋まっていれば、重なり幅の合計が最小の段へ入れる

`React.js` を置いた段を覚えておき、`React Native` は同じ側・同じ段を先に試します。重ならなければ並べて見えるようにするためです。

色は GitHub Linguist 寄せです。`Next.js` の黒は背景で消えるので、バー描画時だけ `#a1a1aa` に差し替えています。

---

## 進行中バーの見た目

`endDate === null` の右端ドットに `animate-wobble` を付けます。揺れ開始はスキル名の文字コードから遅延を作り、全部同時に揺れないようにしています。ラベルは `YYYY年M月 ～ 現在` です。

---

## カード ↔ タイムラインの切替

フェーズ: `skills` → `toTimeline` → `timeline` → `toSkillsPrep` → `toSkills` → `skills`

**カードからタイムライン**

1. 4枚のカードが中央へ寄って縮小する（`CARD_CONVERGE`、0.7s）
2. その 70% 経過でタイムラインを scale 0.55 → 1 で出す
3. 入場の半分が過ぎてから中身（目盛り・バー）の opacity を 1 にする  
   拡大中に文字が読めるとちらつくため

**タイムラインからカード**

1. 中身を先に消す
2. タイムラインを縮小して外す
3. `onExitComplete` でカードを中央から元位置へ戻す

切替中はボタンを `disabled` にして連打でフェーズが壊れないようにしています。

---

## 再生ボタン

初期表示は右端（新しい月）にスクロールしています。再生すると:

1. 左端（2022年）へ smooth scroll
2. 1.5秒止まる
3. 9秒かけて右端まで ease-in-out で進む
4. 再生中は手動スクロールを無効化（`pointer-events: none` + scroll 位置の固定）

横スクロール容器には `data-native-scroll` が付いています。ページ全体の重いスムーススクロールが、この横移動を奪わないようにするためです。

---

## 項目を足すとき

1. [`data/skills.json`](./data/skills.json) に `name` / `level` / `startDate` / `endDate` を足す
2. カードに出したくないだけなら、`SkillsTimeline.tsx` の直書き配列へ足す
3. 色が灰色になる場合は [`githubLanguageColors.ts`](./utils/githubLanguageColors.ts) に名前を登録する
4. 上側に置きたい場合は `PREFER_ABOVE_SKILLS` に名前を足す
5. 開始月が 2022-01 より前なら、`FIXED_START_MONTH` も動かす
