---
title: "Tensor Core / CUDA Core / RT Core の違い 2026年版：Blackwell世代で何が変わったか"
description: "GPUのスペック表に並ぶ Tensor Core / CUDA Core / RT Core の3つは何が違うのか。汎用計算・AI推論・レイトレーシングそれぞれの役割と、Blackwell世代で導入されたFP4/FP6対応・第5世代Tensor Core・Tensor Memoryまで、PC選びに直結する形で解説します。"
date: 2026-05-07
lang: ja
category: comparison
section: column
tags: ["Tensor Core", "CUDA Core", "RT Core", "Blackwell", "RTX 5090", "GPU 仕組み", "FP4", "DLSS"]
featured: false
og_image: "/images/blog/tensor-cuda-rt-core-explained-2026/cover.png"
affiliate_disclosure: true
---

![Tensor Core / CUDA Core / RT Core の違い 2026:Blackwell世代の SM 構成と3種類のコアの役割](/images/blog/tensor-cuda-rt-core-explained-2026/cover.png)

**結論：CUDA Core は汎用計算、Tensor Core はAI、RT Core はレイトレ専用。Blackwell世代では Tensor Core が FP4 / FP6 まで対応し、AI推論性能が前世代比で2〜4倍に。GPU選びはこの3種のバランスで決まります。**

GPU のスペック表を見ると「CUDA Core 21,760 / 第5世代 Tensor Core / 第4世代 RT Core」のような表記が並んでいます。何となく数が多いほど偉そう、という印象はあっても、それぞれが何を担当していて、どう違うのかは意外と整理されていないものです。この記事では、3種類のコアの役割を一段ずつ分解し、Blackwell世代（RTX 50シリーズ / RTX PRO Blackwell）で何が変わったかをまとめます。

## そもそも GPU は何をしているか

CPU が「複雑な仕事を1〜2人で順番にこなす」のに対して、GPU は「単純な仕事を数千人で並列にこなす」装置です。「画面のピクセル100万個に同じ計算を当てる」「行列の要素100万個に同じ演算を当てる」といった処理が、CPU では桁違いに不得意です。

GPU の中には数千個の小さな演算ユニットがあり、それらが似たような計算を同時並行で進めます。NVIDIA の GPU では、これらの演算ユニットが **SM (Streaming Multiprocessor)** という塊で束ねられており、Blackwell 世代では 1SM あたり以下の構成です。

| ユニット | 1SM あたりの数 | 役割 |
|---|---|---|
| CUDA Core | 128 | 汎用計算（INT32 / FP32） |
| 第5世代 Tensor Core | 4 | 行列演算特化（AI 推論・学習） |
| 第4世代 RT Core | 1 | レイトレーシング高速化 |

つまり GPU は「CUDA Core」「Tensor Core」「RT Core」という、得意分野が違う3種類のチームを内蔵した装置です。

## CUDA Core：汎用の「何でも屋」

CUDA Core は GPU の中で一番昔からある汎用演算ユニットです。INT32（整数）と FP32（単精度浮動小数点）の演算を担当し、ゲーム描画のシェーダー処理から、科学計算、画像処理、暗号通貨マイニングまで、幅広い計算を引き受けます。

スペック表で「CUDA コア 21,760」とあれば、それだけ並列に走らせられる単純計算の本数が増える、ということです。ゲーム性能や汎用 GPGPU 計算（CUDA で書かれた科学計算など）は CUDA Core 数が直接効きます。

ただし、行列演算のように「特定の形をした計算」に対しては、専用回路を持つ Tensor Core のほうが圧倒的に速い。ここから先は分業の時代です。

## Tensor Core：行列演算の「専門家」

Tensor Core は 2017年の Volta アーキテクチャで初登場した、**行列演算（行列の積）に特化した専用回路** です。AI のディープラーニングは、99% が行列の積です。これを CUDA Core で計算すると遅いため、専用回路を別途搭載した、というのが Tensor Core の出自です。

Volta から Blackwell まで、Tensor Core は5世代の進化を遂げています。

| 世代 | アーキテクチャ | 登場年 | 主な追加機能 |
|---|---|---|---|
| 第1世代 | Volta | 2017 | FP16 行列演算（初登場） |
| 第2世代 | Turing | 2018 | INT8 / INT4 推論対応 |
| 第3世代 | Ampere | 2020 | TF32 / BF16 / 構造的スパース性 |
| 第4世代 | Hopper / Ada | 2022 | FP8 Transformer Engine |
| 第5世代 | Blackwell | 2024-2025 | **FP4 / FP6 対応**, 第2世代 FP8 TE, TMEM |

精度（bit数）を半分に落とすと、スループットがおおむね2倍になります。FP16 → FP8 → FP4 と進むほど、AI 推論の単位時間あたり処理量が増えます。Blackwell 世代の FP4 対応は、前世代 (FP8 まで) の約2倍の推論スループットを意味します。

### Blackwell 第5世代 Tensor Core の3つの変化

1. **FP4 / FP6 対応**：4bit / 6bit の浮動小数点演算が可能に。LLM 推論で量子化されたモデルを直接ハードウェアで走らせられる
2. **行列+畳み込み統合**：行列演算に加え、畳み込み演算もサポート。推論カーネルの実装が単純化
3. **Tensor Memory (TMEM)**：第5世代 Tensor Core 専用の新メモリ階層。Hopper 世代で問題だったレジスタ圧迫を解消し、Tensor Core の実効スループットを引き上げ

「FP4 とは何か」を補足すると、4bit で1つの浮動小数を表現する量子化形式です。表現できる値の幅は狭いものの、推論時の品質低下が許容できるケース（たとえば LLM の長文生成）では、FP8 や FP16 と比べて品質劣化が小さい割にスループットが大幅に上がる、というトレードオフが成立します。

## RT Core：「光の追跡屋」

RT Core は 2018年の Turing アーキテクチャで初登場した、**レイトレーシングを高速化する専用回路** です。

レイトレーシングは「画面のピクセルから光線を逆向きに飛ばし、シーンの中のどの物体に当たったか、反射してどう跳ねたかを追跡する」描画手法です。シーン中に三角形が数百万個ある状況で、光線とすべての三角形の交差判定をやると CUDA Core では現実的な速度になりません。RT Core は **BVH (Bounding Volume Hierarchy) のトラバーサルと交差判定を専用回路でやる** ため、リアルタイムレイトレが成立します。

RT Core の世代進化はこんな感じです。

| 世代 | アーキテクチャ | 登場年 | 主な変化 |
|---|---|---|---|
| 第1世代 | Turing | 2018 | レイトレーシング対応の初登場 |
| 第2世代 | Ampere | 2020 | スループット約2倍 |
| 第3世代 | Ada Lovelace | 2022 | OMM (Opacity Micro-Map), DMM 等 |
| 第4世代 | Blackwell | 2024-2025 | Mega Geometry 対応、Path Tracing 高速化 |

Cyberpunk 2077 / Alan Wake 2 / Indiana Jones などの Path Tracing 対応タイトルで RT Core 世代の差がはっきり出ます。古い世代の RT Core では Path Tracing は実用速度に届きません。

## Blackwell 世代の SM 構成を図示する

Blackwell 世代の 1SM は、ざっくり以下のような構成です。

```
+---------------------------------------+
|  SM (Streaming Multiprocessor)        |
|                                       |
|  [CUDA Core] x 128                    |  ← 汎用計算
|                                       |
|  [第5世代 Tensor Core] x 4            |  ← AI / 行列演算
|     - FP4 / FP6 / FP8 / FP16 / BF16   |
|     - Tensor Memory (TMEM)            |
|                                       |
|  [第4世代 RT Core] x 1                |  ← レイトレーシング
|     - Mega Geometry 対応              |
|                                       |
+---------------------------------------+
```

RTX 5090 はこの SM を 170 個積んでいます。CUDA Core 総数 21,760、第5世代 Tensor Core 680基、第4世代 RT Core 170基という計算です。

## PC 選びにどう効くか

3種類のコアの役割が分かると、用途別に「どのコアの世代と数を見るべきか」が明確になります。

### AI / LLM 推論を主用途に

- **見るべき指標**：Tensor Core 世代と FP4 / FP8 対応
- **目安**：Blackwell 世代 (第5世代 Tensor Core) が圧倒的優位。FP4 ハードウェアサポートは LLM 推論の新基準
- **VRAM も合わせて見る**：[VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/ja/vram-explained-llm-inference-2026/)

### ゲーム主用途

- **見るべき指標**：CUDA Core 数 + RT Core 世代 + DLSS 対応世代
- **目安**：レイトレ重視なら RTX 40 / 50 シリーズ。DLSS 4 + Frame Generation で 4K 高画質も実用域

### Path Tracing / フォトリアル重視

- **見るべき指標**：RT Core 世代（第4世代 = Blackwell）と DLSS 4
- **目安**：Cyberpunk 2077 オーバードライブモードを快適に動かすなら RTX 4080 以上、安心は RTX 5080 / 5090

### 汎用 GPGPU / CUDA 計算（科学計算など）

- **見るべき指標**：CUDA Core 数とブースト クロック
- **目安**：シミュレーション系は CUDA Core 数とメモリ帯域が効く

具体的な機種選びは「[RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell 2026年版](/blog/ja/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」で詳しく扱っています。

## 「Tensor Core が多いほど AI が速い」は本当か

ほぼ正しいですが、注意点が3つあります。

1. **Tensor Core の世代が違うと単純比較できない**：第3世代 (Ampere) の Tensor Core 数を第5世代 (Blackwell) と比べても意味が薄い
2. **メモリ帯域が同時に効く**：Tensor Core が速くても、VRAM からデータを引き出す帯域が足りないと真価が出ない
3. **VRAM 容量がモデルサイズの上限を決める**：そもそもモデルが乗らないと推論が始まらない

つまり Tensor Core は「速度」、VRAM は「乗るかどうか」、メモリ帯域は「Tensor Core を遊ばせないための補給線」という関係です。AI 用途で GPU を選ぶときは、この3点を同時に見る必要があります。

[RTX 5090 を Amazon で見る](https://www.amazon.co.jp/s?k=RTX+5090)

## 用語まとめ：1行擬人化

- **CUDA Core** = 何でも屋（ゲーム描画も汎用計算も担当）
- **Tensor Core** = AI の専門家（行列演算だけを高速にこなす）
- **RT Core** = 光追跡屋（レイトレ専用の交差判定マシン）

GPU のスペック表でこれら3つを見るときは、「うちのチームには何が何人いるか」を確認している、と思えば直感的に読めるはずです。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/ja/vram-explained-llm-inference-2026/) -- 姉妹記事:GPU の「メモリ」軸
- [RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell：AI用途で選ぶGPU 2026年版](/blog/ja/rtx-5090-vs-4090-vs-pro-6000-ai-2026/) -- Blackwell世代の選定実例
- [Apple Silicon Unified Memory vs NVIDIA VRAM 2026年版](/blog/ja/unified-memory-vs-nvidia-vram-llm-2026/) -- Mac勢の補完軸

法人で AI開発環境を構築する方は [propel-lab](https://propel-lab.co.jp) へ。
