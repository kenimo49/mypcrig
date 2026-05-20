---
title: "DLSS 4 / FSR 4 / XeSS 2 の違い 2026年版：Blackwell・RDNA 4・Arc Battlemage 世代でアップスケーラーはどう進化したか"
description: "RTX 50 シリーズの DLSS 4 / 4.5 はマルチフレーム生成を 4x → 6x へ拡張、Radeon RX 9000 の FSR 4 は機械学習ベースに転換し、Intel XeSS 3 も MFG 対応へ。3社のアップスケーラーが2026年に何を変えたか、対応GPU・対応タイトル数・入力遅延までを横並びで整理しました。"
date: 2026-05-20
lang: ja
category: comparison
section: column
tags: ["DLSS 4", "DLSS 4.5", "FSR 4", "XeSS 2", "XeSS 3", "Blackwell", "RDNA 4", "Battlemage", "Multi Frame Generation", "アップスケーリング"]
featured: false
og_image: "/images/blog/dlss4-fsr4-xess2-comparison-2026/cover.png"
affiliate_disclosure: true
---

![DLSS 4 / FSR 4 / XeSS 2 の違い 2026:Blackwell・RDNA 4・Battlemage 世代の比較](/images/blog/dlss4-fsr4-xess2-comparison-2026/cover.png)

**結論：DLSS 4.5 は対応タイトル 250本超 + 6x MFG で総合首位。FSR 4 はようやくML化し RDNA 4 専用で対応 200本超まで急進。XeSS 3 は MFG 対応で範囲が一気に広がり、内蔵 iGPU まで届く守備範囲の広さが武器。「画質・対応タイトル数」で選ぶなら DLSS、「RDNA 4 オーナーなら自前のFSR 4 で十分」、「Arc / Core Ultra なら XeSS」の三択構造です。**

2025〜2026 年でアップスケーラー界隈は大きく動きました。NVIDIA は DLSS 4 で「Multi Frame Generation（MFG）」を導入し、DLSS 4.5 では 4x → 6x までフレームを増やせるように。AMD は FSR 4 で長年シェーダーベースだった本体をようやく機械学習ベースに転換し、Intel は XeSS 2 → XeSS 3 で MFG 対応と Arc 統合 GPU まで対応を広げました。本記事ではこの 3 社の現状を、対応 GPU・対応タイトル数・画質モード・入力遅延の観点で2026 年 5 月時点の情報で整理します。

## まず用語を 30 秒で揃える

アップスケーリング系には複数の機能が混在しているので、まずここを整理しておきます。

| 用語 | 何の機能か |
|---|---|
| Super Resolution（SR） | 低解像度で描画 → ML で4K相当に拡大。元 fps を維持しつつ画質を上げる |
| Frame Generation（FG） | 描画されたフレーム間に1枚追加。fps を約2倍に |
| Multi Frame Generation（MFG） | フレーム間に 2〜3枚（最大）追加。fps を3〜4倍に |
| 6x MFG | DLSS 4.5 の最新モード。最大 6x まで動的に切り替え |
| Reflex / Anti-Lag+ / XeLL | 入力遅延を補正する付属技術 |
| Ray Reconstruction | パストレースのデノイズをMLに置き換える機能 |

「アップスケーラー本体」と「フレーム生成」は別物で、両方有効にして初めて「平均144fps」「4K 240Hz」のような数値が出ます。

## 各社のスタック早見表

|  | DLSS 4 / 4.5 | FSR 4 / 4.1 | XeSS 2 / 3 |
|---|---|---|---|
| アップスケーラー本体 | DLSS Super Resolution（第2世代Transformer） | FSR ML（INT8/INT4 行列演算） | XeSS（XMX命令） |
| フレーム生成 | DLSS Frame Generation | FSR Frame Generation | XeSS Frame Generation |
| マルチフレーム生成 | DLSS MFG（最大 6x、動的） | FSR MFG（FSR Redstone、4x） | XeSS 3 MFG（最大 4x、3:1） |
| 入力遅延補正 | NVIDIA Reflex 2 | AMD Anti-Lag+ | Intel XeLL |
| Ray Reconstruction | DLSS Ray Reconstruction | FSR Ray Regeneration 1.1 | XeSS RR（一部） |
| 対応 GPU（本体） | RTX 20 / 30 / 40 / 50 | RDNA 4（一部 RDNA 3 へ展開中） | Arc Alchemist / Battlemage / Core Ultra iGPU |
| 対応 GPU（MFG） | RTX 50 のみ | RDNA 4 のみ | Arc 全般 + Core Ultra |
| 対応タイトル数 | 250本超（MFG含む） | 200本超（Redstone） | 200本超（XeSS全体） |

## DLSS 4 / DLSS 4.5：6x MFG で4K 240Hz パストレースを実用化

NVIDIA は CES 2026 で DLSS 4.5 を発表しました。要点は次の 2 つです。

1. **第2世代 Transformer Super Resolution**：従来の CNN ベースから Transformer ベースに刷新したのが DLSS 4、4.5 ではさらに精度を向上。動きの速い場面のリッチなテクスチャ復元に強い
2. **6x Dynamic MFG**：フレーム生成の倍率を 1x / 2x / 4x / 6x で動的に切り替え。シーンの負荷に応じて自動調整され、4K パストレースで 240Hz を狙えるようになった

具体例として Black Myth: Wukong は RTX 5090 + 4K + Path Tracing + DLSS 4.5（6x MFG）で 246fps を記録。CES 2026 ではこの構成が公式デモとして示されました。

DLSS 4 対応タイトルは 250 本以上で、CES 2026 時点で 007 First Light、Active Matter、Phantom Blade Zero、PRAGMATA 等が新規対応。既存タイトルでは Borderlands 4、Dragon Age: The Veilguard、F1 25、God of War Ragnarök、Indiana Jones and the Great Circle、Marvel's Spider-Man 2、Monster Hunter Wilds、The Elder Scrolls IV: Oblivion Remastered、The Outer Worlds 2 等が「Enhanced Frame Generation」対応として 6x MFG を利用できます。

### DLSS 4 / 4.5 の対応 GPU 区分

| 機能 | 対応 GPU |
|---|---|
| DLSS Super Resolution | RTX 20 / 30 / 40 / 50 全シリーズ |
| DLSS Ray Reconstruction | RTX 20 / 30 / 40 / 50 全シリーズ |
| DLSS Frame Generation（2x） | RTX 40 / 50 シリーズ |
| DLSS Multi Frame Generation（4x） | RTX 50 シリーズのみ |
| DLSS 4.5 Dynamic 6x MFG | RTX 50 シリーズのみ |

6x MFG が RTX 50 限定なのは、第 5 世代 Tensor Core と改良された Optical Flow Accelerator が必要だからです。RTX 40 オーナーは2x FG が上限、Super Resolution 自体は DLSS 4 化された最新版を享受できます。

## FSR 4 / FSR 4.1：ようやくML化、RDNA 4 専用で追従

AMD は2026年3月に Radeon RX 9070 / RX 9070 XT と同時に FSR 4 をリリース。RDNA 4 の AI アクセラレータ（INT8 / INT4 行列演算ユニット）を使う **機械学習ベースの本物のML アップスケーラー** として登場しました。これは AMD にとって大きな転換点で、長年「シェーダーベースで画質が DLSS に届かない」と言われていた状態から脱却した瞬間です。

直近の更新内容を時系列で整理します。

| 時期 | 内容 |
|---|---|
| 2026/3 | FSR 4 リリース（RDNA 4 専用 ML upscaler）、Radeon RX 9070 / 9070 XT と同時 |
| 2025/12 | FSR Redstone スイート発表（MFG / Ray Regeneration / Radiance Caching）、200本超対応 |
| 2026/3 | FSR 4.1 リリース（Ray Regeneration 1.1、ML部分の精度向上） |
| 2026年内予定 | FSR 4.1 を RX 7000 系（RDNA 3）にも段階展開 |
| 2027 予定 | FSR 4.1 を RX 6000 系（RDNA 2）にも展開 |

FSR Redstone は AMD のフレーム生成・Ray Regeneration・Radiance Caching をまとめたスイートで、2025年12月にローンチ。2026年5月時点で 200 本超のゲームで FSR 4 系のアップスケーリングが利用できます。

### FSR 4 / FSR Redstone の対応 GPU

| 機能 | 対応 GPU |
|---|---|
| FSR 4 ML Upscaling | RDNA 4（RX 9070 / 9070 XT 等） |
| FSR 4.1 ML Upscaling | RDNA 4 + RDNA 3（2026 年内）+ RDNA 2（2027） |
| FSR Frame Generation | RDNA 3 以降（一部 RDNA 2） |
| FSR Multi Frame Generation | RDNA 4 のみ |
| FSR Ray Regeneration 1.1 | RDNA 4 のみ |

注意点として、FSR 4 本体は RDNA 4 専用ですが、FSR 4.1 で「RDNA 3 への展開」が始まりました。RX 7900 XTX オーナーは 2026 年内に FSR 4.1 のML アップスケーラーが使えるようになる予定です。RX 6800 / 6900 オーナーは2027年まで待つことになります。

## XeSS 2 / XeSS 3：MFG 対応で Arc iGPU まで届く守備範囲

Intel は2024年末に Battlemage（Arc B シリーズ）と同時に XeSS 2 を投入し、フレーム生成と低遅延モード（XeLL）を追加しました。2026 年に入って **XeSS 3** へ進化し、Multi Frame Generation 対応が広がっています。

|  | XeSS 2 | XeSS 3 |
|---|---|---|
| アップスケーラー | XeSS（XMX命令、ML） | XeSS（同上、改良版） |
| フレーム生成 | 2x FG | 2x / 4x MFG（3:1 まで） |
| 入力遅延補正 | XeLL（Xe Low Latency） | XeLL 改良版 |
| 対応 GPU | Arc Alchemist / Battlemage / Core Ultra iGPU | 同左 + Core Ultra Series 2 |

XeSS 3 の特徴は「**XeSS 2 対応ゲームならドライバ側で MFG をオーバーライドできる**」点です。Intel Graphics Software の制御パネルでオン/オフ可能で、ゲーム側の対応を待たずに MFG が体験できるのは現状 Intel だけです。

Tom's Hardware の検証では、XeSS 3 MFG は「2x → 4x で約1.7倍の fps 向上、入力遅延は +15〜25ms」と報告されています。MFG は内挿フレームを生成する性質上、入力遅延は必ず増加するので、競技 FPS には不向き、シングルプレイヤーのリッチタイトルには嬉しい、という棲み分けです。

### XeSS 2 / 3 対応タイトルの例

公式対応または XeSS 3 ドライバオーバーライドで動くものとして、F1 24、Marvel Rivals、Dying Light 2、STALKER 2、Assassin's Creed Shadows 等があります。XeSS 全体としては 200 本超のゲームで対応しています。

## 画質比較：DLSS 4.5 > FSR 4 ≈ XeSS 3 が現状の評価

第三者の比較動画（Digital Foundry / Hardware Unboxed / Computer Base 等）が概ね一致しているのは次のような順位です。

| 順位 | アップスケーラー | 評価コメント |
|---|---|---|
| 1 | DLSS 4.5 (Quality / Performance) | 動きの速い場面の安定性で頭一つ抜けている |
| 2 | FSR 4 (Quality / Native AA) | DLSS 4 と画質差はかなり縮まったが、髪・葉のディテールでまだ差 |
| 2 | XeSS 3 (Quality, XMX) | FSR 4 と同等。XMX 命令を使う Arc 上で本領発揮 |
| 4 | XeSS 3 (DP4a fallback) | NVIDIA / AMD で動かす場合のフォールバック版。明確に画質が落ちる |
| 5 | FSR 2.x / 3.x（旧シェーダー版） | テンポラルアーティファクトが顕著。世代が古い |

「DLSS 4 と FSR 4 / XeSS 3 の画質差」はもう昔ほど大きくありません。一方で「対応タイトル数」「フレーム生成の上限（6x vs 4x）」「ML フォールバック品質」では DLSS 4.5 が依然リード、というのが2026 年 5 月時点の素直な評価です。

## 入力遅延：MFG は競技勢には合わない

フレーム生成は「すでに描画したフレーム」と「次に描画するフレーム」の間を補完するため、最低でも 1 フレーム分の遅延が乗ります。MFG（4x / 6x）になるとさらに増えます。

| モード | 入力遅延（参考値、4K 60fps ベース） |
|---|---|
| 通常レンダリング（DLSS なし） | 約 30〜40ms |
| DLSS SR のみ | 約 25〜35ms（fps上昇で減）|
| DLSS FG（2x） | 約 45〜55ms |
| DLSS MFG（4x） | 約 55〜70ms |
| DLSS 4.5 MFG（6x） | 約 60〜80ms |
| Reflex 2 適用後 | 約 -15〜-25ms（補正） |

CS2 / VALORANT / Apex の競技勢では「MFG はオフ、Reflex のみ」が定石。フレーム生成は「シングルプレイ Cyberpunk 系・MMO 系・シム系」のような入力遅延を気にしないジャンル向けです。

詳しいGPUコアの仕組みは「[Tensor Core / CUDA Core / RT Core の違い 2026年版](/blog/tensor-cuda-rt-core-explained-2026/)」で扱っています。第 5 世代 Tensor Core が DLSS 4 / MFG の足場になっている話はそちら側に書きました。

## GPU 選びへの示唆：3 つの軸で選ぶ

「結局どの GPU を選べばいいか」のシンプルなマトリクスはこうです。

| ユーザー像 | 推奨 GPU | アップスケーラー |
|---|---|---|
| 4K 240Hz / 6x MFG をフル活用 | RTX 5080 / 5090 | DLSS 4.5 |
| 1440p 高設定、長く使う | RTX 5070 Ti / RX 9070 XT | DLSS 4 / FSR 4 |
| 競技 FPS 中心、MFG は使わない | RTX 5060 Ti 16GB / RX 9060 XT | DLSS SR / FSR 4 SR |
| AMD エコシステム派 | RX 9070 XT | FSR 4 + FSR MFG |
| Intel エコシステム派 / 安価 | Arc B580 / B770 | XeSS 3 |
| Mini PC / iGPU 込み | Core Ultra 285K / 9 285HX | XeSS 3（iGPU でも動く）|

「DLSS 4.5 が一番強い」のは事実ですが、価格と消費電力のバランスでは RX 9070 XT + FSR 4 も実用的に肉薄しています。RTX 5070 と RX 9070 XT は実勢価格で1〜2万円差、消費電力は 9070 XT が約 30〜40W 多く、競合関係にあります。

[Radeon RX 9070 XT を Amazon で見る](https://www.amazon.co.jp/s?k=Radeon+RX+9070+XT)

## まとめ：3社の現状と選び方

- **DLSS 4 / 4.5**：対応タイトル 250本超 + 6x MFG で総合首位。RTX 50 オーナーは 6x MFG をフル活用できる。RTX 40 オーナーも 2x FG までは引き続き利用可
- **FSR 4 / Redstone**：ようやくML化、RDNA 4 専用。対応 200本超、FSR 4.1 で RDNA 3 にも段階展開予定。Radeon オーナーには「やっと使える FSR」が来た
- **XeSS 2 / 3**：Arc Alchemist / Battlemage / Core Ultra iGPU まで対応する守備範囲の広さが武器。XeSS 3 はドライバ側で MFG をオーバーライドできるのが独自の強み
- **競技勢**：MFG はオフ、Reflex / Anti-Lag+ / XeLL のみで低遅延を確保
- **シングルプレイ勢**：MFG をフル活用して 4K 240Hz / パストレースを実用化

GPU 上位モデルの世代比較は「[RTX 5090 vs 4090 vs RTX PRO 6000 — AI用途で選ぶGPU 2026](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」で詳しく扱っています。アップスケーラーは「GPU を選んだあとに、その GPU でどこまで体感を伸ばすか」の補助技術と捉えると、選び方がぶれません。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [Tensor Core / CUDA Core / RT Core の違い 2026年版：Blackwell世代で何が変わったか](/blog/tensor-cuda-rt-core-explained-2026/)：DLSS / FSR / XeSS を支える GPU コアの内部構造
- [RTX 5090 vs 4090 vs RTX PRO 6000 — AI用途で選ぶGPU 2026](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)：Blackwell ハイエンド GPU の世代比較
