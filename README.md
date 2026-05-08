# mypcrig

PC選定サイト（mypcrig.com）— 独立メディアとして運用。

## 役割

```
[mypcrig = PC選定の独立メディア]
推奨カタログ・商業特化
- WHICH（どのPCを買うべきか）を提示
- 実機ベンチマーク × 用途別マッチング診断 × 提供記事ゼロ
   │
   └── 法人読者は CTA 経由で送客 ──→ [propel-lab = 法人出口]
```

外部メディアへのリンクは含めず、mypcrig 単独で完結する独立サイトとして運用する。
唯一の外部送客先は propel-lab（法人向け LLM 開発環境構築コンサル）のみ。

詳細戦略: [iris-hub/PC_GPU_STRATEGY.md](https://github.com/kenimo49/iris-hub/blob/main/PC_GPU_STRATEGY.md)
親Issue: [iris-hub#95](https://github.com/kenimo49/iris-hub/issues/95)
セットアップIssue: [iris-hub#101](https://github.com/kenimo49/iris-hub/issues/101)

## サイト構造

```
/                  トップ「あなたに合うPCを見つける」
/match             マッチング診断UI（kaoriq方式）
/laptop/           ノートPC全般
/gaming/           ゲーミングPC
/ai-dev/           AI開発向け
/mac/              Apple Silicon
/desktop/          デスクトップ全般
/parts/            パーツ単体
/column/           雑学・基礎知識
/blog/             記事一覧
/about             編集方針・運営情報
```

## 技術スタック

- フレームワーク: Astro v6 + Tailwind v4
- デプロイ: GitHub Pages（GitHub Actions経由）
- 商品DB: context-forge 連携
- 記事生成: harness-ops 自動投稿（1日1本）
- アフィリリンク: Amazon Creators API + 楽天 OpenAPI

## 必要な GitHub Actions vars

- `PUBLIC_GA_ID` — GA4 測定 ID
- `PUBLIC_AMAZON_TAG` — Amazon Associates タグ（例: `kenimo49-22`）。`src/lib/remark-affiliate.mjs` がビルド時に Amazon URL に `?tag=...` を注入する。未設定でもビルドは通るが、収益化されないので必須

## SEO / LLMO 構成

- 記事ページ: Article + BreadcrumbList JSON-LD（review カテゴリは Product+Review、`faq` を持つ記事は FAQPage も）
- トップ: WebSite + Organization JSON-LD
- `public/llms.txt` + `dist/llms-full.txt`（ビルド時自動生成）で AI 検索引用に対応
- Amazon / マウス / ドスパラ / Apple リンクは remark プラグインで `rel="nofollow sponsored noopener" target="_blank"` 自動付与

## 関連リポジトリ（運用上の依存）

- [iris-hub](https://github.com/kenimo49/iris-hub) — 戦略・タスク管理
- [harness-ops](https://github.com/kenimo49/harness-ops) — 記事生成パイプライン
- [kaoriq](https://github.com/kenimo49/kaoriq) — Astro テンプレート流用元（参考実装）
- [context-forge](https://github.com/kenimo49/context-forge) — 商品DB / ベンチマークデータ
