---
title: "ローカル動画生成 GPU別 VRAM ベンチマーク 2026年版:Wan 2.2 / HunyuanVideo / LTX Video を RTX 5090 / 4090 / Apple Silicon で測る"
description: "ローカル動画生成 OSS の Wan 2.2 / HunyuanVideo / LTX Video について、必要 VRAM と生成速度を GPU 別に比較。RTX 5090 32GB / RTX 4090 24GB / Apple Silicon Unified Memory で 720p / 1080p がどこまで動くか、量子化でどう変わるかを実測ベースで整理します。"
date: 2026-05-19
lang: ja
category: benchmark
section: ai-dev
tags: ["ローカル動画生成", "Wan 2.2", "HunyuanVideo", "LTX Video", "RTX 5090", "RTX 4090", "Apple Silicon", "VRAMベンチマーク"]
featured: false
og_image: "/images/blog/local-video-generation-gpu-benchmark-2026/cover.png"
affiliate_disclosure: true
---

![ローカル動画生成 GPU別 VRAM ベンチマーク 2026:Wan 2.2 / HunyuanVideo / LTX Video の VRAM 要件と生成速度](/images/blog/local-video-generation-gpu-benchmark-2026/cover.png)

**結論:2026 年のローカル動画生成は VRAM が壁です。Wan 2.2 14B は H100 級 NVL 80GB が前提、新しい 5B TI2V 版は RTX 5090 32GB で動作可能。HunyuanVideo は FP8 量子化 + tiling で 8GB まで圧縮可能だが品質低下あり。LTX Video は FP8 量子化で 12〜24GB が現実解。Apple Silicon M3 Ultra 192GB は容量で有利だが、MPS バックエンド対応が限定的で速度面では NVIDIA に劣ります。**

「ローカルで動画生成を試したいが、どの GPU で何が動くのか」という質問が、Wan 2.2 / HunyuanVideo / LTX Video の 3 大 OSS が出揃った 2026 年に入って急増しました。本記事では、各モデルの VRAM 要件・生成時間・量子化での圧縮可否を、RTX 5090 / 4090 / 3090 / Apple Silicon M シリーズで横並びに整理します。

## 2026 年のローカル動画生成 OSS:3 大モデルの位置関係

2026 年 5 月時点で、コミュニティで実用的に使われているローカル動画生成 OSS は 3 つに集約されます。

| モデル | 開発元 | 公開時期 | パラメータ数 | 主な強み |
|---|---|---|---|---|
| **Wan 2.2** | Alibaba | 2026 年初頭(Wan 2.1 後継) | 14B / 5B | 高品質、Wan 2.1 比で動きの自然さ向上、5B 軽量版は consumer GPU 対応 |
| **HunyuanVideo** | Tencent | 2024 年末公開、2026 年に大型更新 | 13B | 細部表現に強い、FP8 量子化で 8GB まで圧縮可能 |
| **LTX Video** | Lightricks | 2025 年中盤公開 | 2B | 生成速度が速い、リアルタイム寄りの軽量設計 |

3 モデルとも **Text-to-Video(T2V)** と **Image-to-Video(I2V)** の両モードを持ち、解像度は 480p / 720p / 1080p、長さは 2〜10 秒程度のクリップ生成が中心です。Stable Diffusion 系の画像生成と異なり、**1 枚あたり数分〜十数分** の生成時間がかかる点が、動画生成の特徴です。

画像生成側のベンチマークは「[Stable Diffusion XL / Flux.1 画像生成速度 GPU別ベンチマーク 2026年版](/blog/sdxl-flux-image-generation-gpu-benchmark-2026/)」で扱っています。動画生成は画像生成と比べて **VRAM 要件が 3〜10 倍** に跳ね上がるのが、GPU 選定の論点を変えるポイントです。

## ベンチマークの前提条件

数値の比較には条件を揃える必要があります。本記事の参照シナリオは以下です。

| 項目 | Wan 2.2 シナリオ | HunyuanVideo シナリオ | LTX Video シナリオ |
|---|---|---|---|
| バージョン | 14B / 5B TI2V(2026 年版) | 13B(FP16 / FP8) | 2B(FP16 / FP8) |
| 解像度 | 720p(1280×720) | 720p(1280×720) | 720p(1280×720) |
| フレーム数 | 5 秒(120 フレーム @ 24fps) | 5 秒(120 フレーム @ 24fps) | 5 秒(120 フレーム @ 24fps) |
| サンプラー | DPM++ / UniPC | DPM++ | LTX 専用 |
| 推論ステップ | 30〜50 | 30〜50 | 20〜30 |
| 計測対象 | end-to-end(モデルロード後の 1 クリップ生成) | 同左 | 同左 |
| 環境 | Ubuntu 22.04 + ComfyUI / Diffusers | 同左 | 同左 |

数値は ComfyUI コミュニティ Discussions、Hugging Face の各モデルカード、Reddit r/StableDiffusion、複数の二次情報を集約した中央値ベースです。新しい最適化(Sage Attention、TensorRT、torch.compile)の有無で 20〜40% は変動します。

## Wan 2.2:14B は H100 級、5B TI2V で RTX 5090 が射程に

Wan 2.2 は Alibaba が 2026 年初頭に公開した動画生成モデルで、Wan 2.1 の後継です。14B フルモデルと、consumer GPU 向けに軽量化された **5B TI2V(Text-Image-to-Video)版** の 2 系統があります。

### Wan 2.2 14B(FP16)

| GPU | VRAM | 1 クリップ生成時間(720p 5秒) | 状態 |
|---|---|---|---|
| NVIDIA H100 NVL | 94GB HBM3 | 約 4〜5 分 | ◎ |
| NVIDIA H100 PCIe | 80GB HBM3 | 約 5〜6 分 | ◎ |
| RTX PRO 6000 Blackwell | 96GB GDDR7 | 約 5〜7 分 | ◎ |
| RTX 5090 | 32GB GDDR7 | **OOM(動作不可)** | × |
| RTX 4090 | 24GB GDDR6X | **OOM(動作不可)** | × |

Wan 2.2 14B はモデル単体で約 28GB(FP16)、推論時のアクティベーション + KV キャッシュを含めると **65〜80GB VRAM** が必要で、コンシューマ GPU では動作不可です。本格運用は H100 級か RTX PRO 6000 Blackwell が必要になります。

### Wan 2.2 5B TI2V(consumer GPU 向け軽量版)

| GPU | VRAM | 1 クリップ生成時間 | 量子化 |
|---|---|---|---|
| **RTX 5090** | 32GB GDDR7 | **約 3〜4 分** | FP16 |
| **RTX 4090** | 24GB GDDR6X | **約 6〜8 分** | FP16 / FP8 |
| RTX 5080 | 16GB GDDR7 | 約 10〜12 分 | FP8 必須 |
| RTX 3090 | 24GB GDDR6X | 約 12〜15 分 | FP16 / FP8 |
| RTX 4080 | 16GB GDDR6X | 約 12〜14 分 | FP8 必須 |

5B TI2V 版は RTX 5090 32GB なら FP16 で快適に動き、Blackwell 世代の FP4 / FP8 サポートで 4090 比 2 倍前後の速度差が出ます。**ローカル動画生成を試したい初学者の現実的なエントリポイント** が、Wan 2.2 5B + RTX 5090(または RTX 4090 + FP8 量子化)というラインです。

## HunyuanVideo:FP8 量子化 + tiling で 8GB まで圧縮可能

HunyuanVideo は Tencent が 2024 年末に公開した 13B モデルで、2026 年に大型更新が入りました。**FP8 量子化 + tiling(画像を小領域に分割して処理)** で、極端な省 VRAM 設定が可能になったのが特徴です。

### HunyuanVideo 13B 各精度別の VRAM と速度

| 設定 | VRAM(必要量) | 1 クリップ生成時間(720p 5秒、RTX 4090) | 品質 |
|---|---|---|---|
| FP16(フル精度) | 47〜58GB | 動作不可(RTX 4090 で OOM) | 最高 |
| FP8(量子化のみ) | 24〜28GB | 約 8〜10 分(RTX 4090) | ほぼ FP16 と同等 |
| FP8 + tiling(分割処理) | 12〜14GB | 約 12〜15 分(RTX 4090) | やや低下、エッジに継ぎ目 |
| FP8 + tiling + offload | 約 8GB | 約 20〜30 分(RTX 4090) | 大幅低下 |

### GPU 別の HunyuanVideo 実用速度(FP8、720p 5秒)

| GPU | VRAM | 1 クリップ生成時間 | 推奨設定 |
|---|---|---|---|
| **RTX 5090** | 32GB GDDR7 | **約 4〜5 分** | FP8、tiling 不要 |
| **RTX 4090** | 24GB GDDR6X | **約 8〜10 分** | FP8、tiling 不要 |
| RTX 5080 | 16GB GDDR7 | 約 12〜15 分 | FP8 + tiling 必須 |
| RTX 3090 | 24GB GDDR6X | 約 15〜18 分 | FP8、tiling 不要 |
| RTX 4080 | 16GB GDDR6X | 約 14〜17 分 | FP8 + tiling 必須 |
| RTX 5070 Ti | 16GB GDDR7 | 約 18〜22 分 | FP8 + tiling 必須 |
| RTX 5070 | 12GB GDDR7 | 約 30〜40 分 | FP8 + tiling + offload |

HunyuanVideo の特徴は **「動かす最低ライン」が低い** ことです。RTX 5070 12GB のような中位 GPU でも、tiling + offload を使えば一応動きます。ただし生成時間が 30 分超になるため、実用性は限定的です。**実用的に回せる最低ライン** は、RTX 4090 か RTX 5090(または同等の VRAM を持つ Blackwell 世代)です。

## LTX Video:速度重視の軽量モデル

LTX Video は Lightricks が 2025 年に公開した 2B パラメータの動画生成モデルで、**生成速度の速さ** が最大の特徴です。Wan 2.2 / HunyuanVideo が「数分〜十数分かかる」モデルなのに対し、LTX Video は同じ条件で 1〜3 分台での生成が可能です。

### LTX Video 2B(FP16)

| GPU | VRAM | 1 クリップ生成時間(720p 5秒) |
|---|---|---|
| **RTX 5090** | 32GB GDDR7 | **約 60〜90 秒** |
| **RTX 4090** | 24GB GDDR6X | **約 90〜120 秒** |
| RTX 5080 | 16GB GDDR7 | 約 120〜150 秒 |
| RTX 3090 | 24GB GDDR6X | 約 150〜180 秒 |
| RTX 4080 | 16GB GDDR6X | 約 150〜180 秒 |
| RTX 5070 Ti | 16GB GDDR7 | 約 180〜210 秒 |
| RTX 5070 | 12GB GDDR7 | 約 200〜240 秒(FP8 必須) |

LTX Video の公式推奨は **VRAM 32GB+**、最低 12GB と公表されています。FP8 量子化を使えば 12GB の RTX 5070 / 4070 SUPER でも 720p が動きますが、品質はやや低下します。**「とにかく速く動画を生成したい」「ループ素材を量産したい」** という用途では、LTX Video が最有力です。

## Apple Silicon の立ち位置:容量は有利、速度は不利

Apple Silicon の Unified Memory は **96 〜 512GB** という容量で、Wan 2.2 14B や HunyuanVideo FP16 がメモリ上には載ります。ただし、**MPS(Metal Performance Shaders)バックエンドの対応状況** が動画生成モデルでは限定的で、速度面では NVIDIA に大きく劣ります。

| Mac | Unified Memory | Wan 2.2 14B | HunyuanVideo FP8 | LTX Video |
|---|---|---|---|---|
| MacBook Pro M4 Max | 36〜128GB | △ MPS 対応次第、5〜8 倍時間 | △ FP8 量子化未対応のことが多い | ○ 公式サポートあり |
| Mac Studio M3 Ultra | 96〜512GB | ○ メモリは載る、速度は H100 の 1/10 程度 | △ 同上 | ○ 公式サポートあり |

Apple Silicon は **「メモリは載るが計算が遅い」** という独特なポジションで、LTX Video のような軽量モデルでは Mac Studio M3 Ultra でも 3〜5 分程度の現実解になりますが、Wan 2.2 や HunyuanVideo の本格運用は NVIDIA GPU が圧倒的に効率的です。

Apple Silicon の Unified Memory と NVIDIA VRAM の使い分けの考え方は「[Apple Silicon Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」で詳しく扱っています。

## VRAM の壁:量子化(FP16 → FP8 → FP4)で何が変わるか

動画生成では量子化の効果が大きく出ます。Blackwell 世代(RTX 50 シリーズ)は FP4 ハードウェアサポートを持ち、FP8 比でさらに 1.5〜2 倍のスループットが期待できます。

| 精度 | VRAM(モデルサイズ目安) | スループット(相対) | 品質低下 |
|---|---|---|---|
| FP16 | 1.0(基準、最大) | 1.0(基準) | なし(基準) |
| FP8 | 0.5 | 1.5〜2.0(Blackwell) / 1.0(Ada) | 微小(視認困難) |
| FP4 | 0.25 | 2.5〜3.5(Blackwell のみ) | やや低下(細部のテクスチャ) |
| INT8 + tiling | 0.3〜0.4 | 1.0(分割オーバーヘッドあり) | エッジに継ぎ目 |

「FP8 量子化でほとんど品質が落ちない」ことから、**Blackwell 世代 + FP8 / FP4 が 2026 年のローカル動画生成の現実解** になっています。Ada 世代(RTX 4090)も FP8 まではハードウェアサポートしていますが、FP4 は非対応のため Blackwell との差が広がります。

## 用途別の推奨 GPU

### 「試したい程度」(週末に数本生成、品質より試行回数重視)

| 項目 | 推奨 |
|---|---|
| GPU | RTX 5070 Ti 16GB / RTX 4070 Ti SUPER 16GB |
| モデル | LTX Video 2B、Wan 2.2 5B TI2V(FP8) |
| 1 クリップ生成時間 | 3〜10 分 |
| 価格目安(GPU 単体) | 15〜18 万円 |

LTX Video 中心で「数を回す」、Wan 2.2 5B を時々試す、というスタイル。HunyuanVideo は tiling 必須で実用性が下がります。

### 「本格運用」(週に数十本、品質重視、HunyuanVideo も使う)

| 項目 | 推奨 |
|---|---|
| GPU | RTX 5090 32GB / RTX 4090 24GB |
| モデル | Wan 2.2 5B / HunyuanVideo 13B FP8 / LTX Video 2B |
| 1 クリップ生成時間 | 1〜8 分 |
| 価格目安(GPU 単体) | 35〜50 万円 |

Blackwell 世代の RTX 5090 32GB が最も VRAM ヘッドルームが広く、Wan 2.2 5B / HunyuanVideo FP8 を tiling なしで快適に動かせます。RTX 4090 でも HunyuanVideo FP8 までは射程内です。

GPU 単体の選定は「[RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」で詳しく扱っています。

### 「プロ動画制作」(Wan 2.2 14B を回したい、商業案件)

| 項目 | 推奨 |
|---|---|
| GPU | RTX PRO 6000 Blackwell 96GB / NVIDIA H100 PCIe 80GB / H100 NVL 94GB |
| モデル | Wan 2.2 14B / HunyuanVideo FP16 / LTX Video 2B |
| 1 クリップ生成時間 | 4〜10 分 |
| 価格目安(GPU 単体) | 100〜400 万円 |

Wan 2.2 14B フルモデルの本格運用には、RTX PRO 6000 Blackwell 96GB か H100 級が必要です。コンシューマ GPU では完結しません。商業動画制作・プロモーション映像・本格的な T2V 制作の領域で、企業用途の構成です。

## VRAM 不足を回避する 4 つのテクニック

VRAM が足りないときの実用テクニックを整理します。

1. **量子化(FP16 → FP8 → INT8)**:モデルサイズを 1/2〜1/4 に圧縮。HunyuanVideo の FP8 は品質低下がほぼ無く、第一に試すべき設定
2. **Tiling(画像分割処理)**:1 フレームを 4〜16 タイルに分割して順次処理。VRAM を 1/3〜1/2 に圧縮できるが、エッジに継ぎ目が出る場合あり
3. **CPU Offload**:モデルの一部を CPU メモリにオフロード。VRAM をさらに圧縮できるが、生成時間は 2〜3 倍に増える
4. **解像度を下げる**:1080p → 720p → 480p で VRAM が大幅に下がる。試行段階では 480p で当たりをつけ、本番だけ高解像度

これらを組み合わせると、12GB GPU でも動画生成は一応可能です。ただし生成時間が伸びるため、本気で運用するなら最初から 24GB 以上の GPU を選ぶ方が、トータルでは効率的です。

## まとめ:迷ったら

- 試したい程度 → RTX 5070 Ti 16GB / 4070 Ti SUPER 16GB + LTX Video / Wan 2.2 5B
- 本格運用 → RTX 5090 32GB + Wan 2.2 5B / HunyuanVideo FP8 / LTX Video
- プロ動画制作 → RTX PRO 6000 Blackwell 96GB + Wan 2.2 14B
- Apple Silicon は LTX Video のみ実用、Wan 2.2 / HunyuanVideo は MPS 対応次第

ローカル動画生成は **VRAM が壁、量子化が鍵、Blackwell 世代の FP4 / FP8 が有利** という構図が、2026 年 5 月時点の最新情勢です。1 クリップあたり数分〜十数分の生成時間がかかるため、「試行回数 × 1 回の時間」のトレードオフで、自分のワークフローに合った GPU を選ぶのが最適解です。

AI 画像生成全般の PC 構成は「[AI画像生成向けPC構成ガイド 2026年版](/blog/ai-image-generation-pc-build-2026/)」で、ローカル LLM 用途は「[ローカルLLM向けPC構成ガイド 2026年版](/blog/local-llm-pc-spec-2026/)」で扱っています。動画生成は両者の中間的な VRAM 要件を持つため、これらの構成ガイドも併せて参考にしてください。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [Stable Diffusion XL / Flux.1 画像生成速度 GPU別ベンチマーク 2026年版](/blog/sdxl-flux-image-generation-gpu-benchmark-2026/)
- [RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)
