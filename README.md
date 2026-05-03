# mypcrig

PC選定サイト（mypcrig.com）— Hub & Spoke 構造のスポーク側。

## 役割

```
[kenimoto.dev = ハブ]                    [mypcrig = スポーク (このリポジトリ)]
情報メディア・教育的コンテンツ            推奨カタログ・商業特化
- WHY / WHAT を語る                     - WHICH を提示する
   │                                     ↑
   └────── 内部リンクで送客 ──────────────┘

[propel-lab = 法人出口]
```

詳細戦略: [iris-hub/PC_GPU_STRATEGY.md](https://github.com/kenimo49/iris-hub/blob/main/PC_GPU_STRATEGY.md)
親Issue: [iris-hub#95](https://github.com/kenimo49/iris-hub/issues/95)
セットアップIssue: [iris-hub#101](https://github.com/kenimo49/iris-hub/issues/101)

## サイト構造（予定）

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
```

## 技術スタック

- フレームワーク: Astro
- デプロイ: Cloudflare Pages
- 商品DB: context-forge 連携
- 記事生成: harness-ops 自動投稿
- アフィリリンク: Amazon Creators API + 楽天 OpenAPI

## 関連リポジトリ

- [iris-hub](https://github.com/kenimo49/iris-hub) — 戦略・タスク管理
- [kenimoto-dev](https://github.com/kenimo49/kenimoto-dev) — ハブ側（教育コンテンツ）
- [kaoriq](https://github.com/kenimo49/kaoriq) — テンプレート流用元
- [propel-lab-website](https://github.com/kenimo49/propel-lab-website) — 法人出口
- [context-forge](https://github.com/kenimo49/context-forge) — 商品DB
