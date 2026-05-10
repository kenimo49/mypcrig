---
title: "Stable Diffusion XL / Flux.1 画像生成速度 GPU別ベンチマーク 2026年版 — RTX 5090 / 5080 / 4090 / Apple Silicon で測る"
description: "Stable Diffusion XL と Flux.1 を RTX 5090 / 5080 / 4090 / Apple Silicon で動かすと、画像生成速度はどう違うのか。1024px・LoRA 適用・バッチ生成の標準シナリオで世代を跨ぐベンチマーク数値を整理し、AI 画像生成向け GPU 選びの実用指針を示します。"
date: 2026-05-10
lang: ja
category: benchmark
section: ai-dev
tags: ["Stable Diffusion XL", "Flux.1", "RTX 5090", "RTX 5080", "RTX 4090", "Apple Silicon", "画像生成", "GPUベンチマーク"]
featured: false
og_image: "/images/blog/sdxl-flux-image-generation-gpu-benchmark-2026/cover.png"
affiliate_disclosure: true
---

![SDXL / Flux.1 画像生成 GPU ベンチマーク 2026:RTX 5090 / 5080 / 4090 / Apple Silicon の 1 枚あたり生成秒数](/images/blog/sdxl-flux-image-generation-gpu-benchmark-2026/cover.png)

**結論：SDXL 1024px 25 ステップでは RTX 5090 が 2.2 秒/枚で最速、RTX 4090 が 5.2 秒/枚で 2.4 倍差。Flux.1 dev は VRAM 要件が高く、24GB 以上の RTX 4090 / 5090 が現実解、12GB の RTX 5070 では量子化必須。Apple Silicon は M3 Max で SDXL 11 秒/枚、Flux はメモリ帯域幅の壁で NVIDIA 比 2〜3 倍遅いが、Unified Memory で大型モデルがロードできる別軸の価値があります。**

「画像生成 AI 用に GPU を選びたいが、何を買えば何秒で 1 枚出るのか」という質問は、2026 年に入ってから検索が増えています。LLM 推論ベンチマーク（トークン/秒）はネット上に充実していますが、画像生成は **モデル・解像度・ステップ数・サンプラー・VAE・バッチサイズ** で数値が大きくぶれるため、横並び比較が難しい領域です。本記事では、2026 年 5 月時点で公開されている主要ベンチマーク数値を集約し、SDXL と Flux.1 の 2 モデルで GPU 選定の実用指針を整理します。

## ベンチマークの前提条件

数値の比較には条件を揃える必要があります。本記事で参照するシナリオは以下に統一します。

| 項目 | SDXL シナリオ | Flux.1 シナリオ |
|---|---|---|
| モデル | SDXL Base 1.0（FP16） | Flux.1 dev（FP8）/ Flux.1 schnell（FP8） |
| 解像度 | 1024 × 1024 | 1024 × 1024 |
| ステップ数 | 25 ステップ | dev: 20 / schnell: 4 |
| サンプラー | Euler a | Euler |
| VAE | デフォルト（含む） | デフォルト（含む） |
| バッチサイズ | 1 | 1 |
| 計測対象 | end-to-end（モデルロード後の 1 枚生成時間） | 同左 |
| 環境 | Windows 11 + ComfyUI / Diffusers | 同左 |

数値は複数の二次情報（Tom's Hardware、Puget Systems、ComfyUI 公式 Discussions、コミュニティ計測）を集約した中央値ベースで、実機での再現性を保証するものではありません。新しいモデル・最適化（Sage Attention、TensorRT、xFormers）の有無で 20〜40% は変動します。

## SDXL 1024×1024 ベンチマーク

### 1 枚あたり生成時間（25 ステップ、バッチ 1）

| GPU | VRAM | アーキテクチャ | 1 枚あたり時間 | iter/s |
|---|---|---|---|---|
| **RTX 5090** | 32GB GDDR7 | Blackwell | **約 2.2 秒** | 約 11.4 |
| RTX 5080 | 16GB GDDR7 | Blackwell | 約 4.8 秒 | 約 5.2 |
| **RTX 4090** | 24GB GDDR6X | Ada Lovelace | **約 5.2 秒** | 約 4.8 |
| RTX 4080 | 16GB GDDR6X | Ada Lovelace | 約 6.5 秒 | 約 3.8 |
| RTX 5070 Ti | 16GB GDDR7 | Blackwell | 約 6.8 秒 | 約 3.7 |
| RTX 5070 | 12GB GDDR7 | Blackwell | 約 8.5 秒 | 約 2.9 |
| RTX 4070 Ti SUPER | 16GB GDDR6X | Ada Lovelace | 約 7.5 秒 | 約 3.3 |
| RTX 4070 SUPER | 12GB GDDR6X | Ada Lovelace | 約 9.0 秒 | 約 2.8 |
| Mac Studio M3 Ultra | 96〜512GB Unified | Apple Silicon | 約 9〜12 秒 | 約 2.1 |
| MacBook Pro M3 Max | 36〜128GB Unified | Apple Silicon | 約 11 秒（30 step） | 約 2.7 |

特徴的なのが **RTX 5090 → RTX 4090 の 2.4 倍差** です。これは GDDR7 の帯域幅 1,792 GB/s（4090 の 1.78 倍）と Tensor Core 第 5 世代（FP8 対応）の効果が複合した結果で、SDXL のノイズ予測ループが帯域幅律速になっている領域です。一方、**RTX 5080 → RTX 4090 では 4090 の方がやや速い** という逆転現象が起きており、これは VRAM 容量（16GB vs 24GB）の差で 4090 がよりロード余地を持てる構造のためです。

### バッチサイズ別のスケーリング

バッチサイズを上げると 1 枚あたり時間は劇的に短縮されます。

| GPU | Batch 1 | Batch 2 | Batch 4 | Batch 8 | 1 枚換算（B8） |
|---|---|---|---|---|---|
| RTX 5090 | 2.2 秒 | 4.0 秒 | 7.5 秒 | 14 秒 | 1.75 秒 |
| RTX 4090 | 5.2 秒 | 9.5 秒 | 18 秒 | 35 秒 | 4.4 秒 |
| RTX 5080 | 4.8 秒（VRAM限界） | 9.0 秒 | OOM | OOM | — |
| RTX 5070 12GB | 8.5 秒 | OOM | OOM | OOM | — |

**RTX 5070 12GB はバッチ 1 でも VRAM が逼迫** し、バッチ 2 以降は OOM（Out of Memory）になります。SDXL を本格的にバッチ運用したいなら、最低でも 16GB、できれば 24GB の VRAM が必要です。

### LoRA 適用時の速度低下

LoRA を 1 つ適用すると、おおむね **+5〜10% の生成時間増** が発生します。LoRA 数を 3 つ重ねると +20% 程度。動的にレイヤを差し替える Stack 系の LoRA は更に重く、+30〜40% になることもあります。RTX 5090 で LoRA 3 つ適用しても 1 枚 2.6〜2.7 秒、RTX 4090 で 6.0〜6.3 秒という体感です。

## Flux.1 ベンチマーク：VRAM の壁が厳しい

Flux.1 は Black Forest Labs が公開した 2024 年後半のモデルで、SDXL より精細・テキスト忠実度が高い反面、**モデルサイズが約 24GB（FP16）と巨大** で VRAM 要件が一段上がります。

### Flux.1 dev（20 ステップ）

| GPU | VRAM | 1 枚あたり時間 | 注意点 |
|---|---|---|---|
| **RTX 5090** | 32GB GDDR7 | **約 9 秒** | FP8 ネイティブで快適 |
| RTX 5080 | 16GB GDDR7 | 約 18〜25 秒 | FP8 量子化必須、xFormers SDPA 必要 |
| **RTX 4090** | 24GB GDDR6X | **約 15〜17 秒** | FP16 ロード可、xFormers SDPA 推奨 |
| RTX 4080 | 16GB GDDR6X | 約 22〜30 秒 | 量子化前提 |
| RTX 5070 12GB | 12GB GDDR7 | 量子化必須、約 30〜45 秒 | INT4/NF4 量子化版を使う |
| RTX 4070 12GB | 12GB GDDR6X | 同上、約 35〜50 秒 | 同上 |
| Mac Studio M3 Ultra | 96GB+ Unified | 約 35〜60 秒 | モデルロードは余裕、推論帯域幅で律速 |

Flux.1 dev は **24GB VRAM 以上が事実上の必須ライン**。VRAM 12GB だと NF4（4bit 量子化）版を使うことになり、画質が若干落ちる代わりに動作はします。ただし量子化版でも生成時間は本家の 2 倍程度かかるため、Flux を真剣にやるなら RTX 4090 24GB 以上が現実解です。

### Flux.1 schnell（4 ステップ高速版）

schnell は Apache 2.0 ライセンスの蒸留版で、4 ステップで 1 枚を生成できる軽量モデル。商用利用も可能で、現実的な選択肢として人気があります。

| GPU | 1 枚あたり時間 |
|---|---|
| RTX 5090 | 約 1.8〜2.2 秒 |
| RTX 4090 | 約 2.5〜4.0 秒 |
| RTX 5080 | 約 4.0〜5.5 秒 |
| RTX 5070 12GB | 約 6.5〜9.0 秒（量子化版） |
| Mac Studio M3 Ultra | 約 8〜15 秒 |

schnell であれば **RTX 4090 でも 2.5〜4 秒/枚** で生成でき、SDXL と同等の感覚で量産が可能です。Flux dev と schnell のどちらを使うかは、画質と速度のトレードオフで決まります。

## なぜ RTX 5090 がここまで速いか：3 つの要因

ベンチマークで頻出する「RTX 5090 が世代を跨いで圧倒的に速い」現象には、以下 3 つの要因があります。

### 1. メモリ帯域幅 1,792 GB/s（4090 比 1.78 倍）

画像生成のノイズ予測ループは、各ステップで巨大な特徴マップを VRAM から読み書きします。**メモリ帯域幅が iter/s に直接効く** 構造のため、GDDR7 採用の RTX 5090 は世代差が大きく出ます。一方 RTX 5080 は GDDR7 でも帯域 960 GB/s に絞られており、5090 ほどの優位性は出ません。

### 2. Blackwell Tensor Core の FP8 対応

第 5 世代 Tensor Core は FP8 演算をネイティブサポートし、Flux.1 のような巨大モデルで FP8 量子化の恩恵を最大化します。RTX 4090 でも FP8 は動きますが、エミュレーションに近く性能が出ません。**Flux 系モデルでは特に Blackwell の優位性が大きい** のはこの理由です。

### 3. VRAM 32GB の余裕

Flux.1 dev（FP8 で約 12GB）+ T5 テキストエンコーダ（10GB）+ KV キャッシュ + VAE で実質 25〜28GB を消費します。**RTX 5090 の 32GB はこれを丸ごと VRAM に乗せられる唯一の現実的な選択肢**（業務用 RTX PRO 6000 96GB を除く）で、CPU オフロードによる速度低下を完全に回避できます。

## Apple Silicon の位置付け：別軸の価値

Mac Studio M3 Ultra や MacBook Pro M3 Max は SDXL / Flux ベンチマークで NVIDIA に対して 2〜3 倍遅いですが、**Unified Memory が 96GB〜512GB と桁違いに大きい** という別軸の強みがあります。

| 観点 | NVIDIA RTX 5090 | Apple Silicon M3 Ultra |
|---|---|---|
| SDXL 1 枚速度 | 圧倒的に速い（2.2 秒） | 4〜5 倍遅い（9〜12 秒） |
| ロード可能モデルサイズ | 32GB まで | 最大 512GB |
| 消費電力（推論時） | 575W 級 | 100〜180W |
| ファン音 | 大きい | 静音 |
| エコシステム | CUDA / xFormers / TensorRT | MLX / Core ML / Diffusers |
| 商用ツール対応 | ほぼ全て対応 | 一部未対応 |
| 価格 | GPU 単体 50〜70 万円 | Mac Studio M3 Ultra 64GB から 56 万円〜 |

**「速度が必要な仕事」なら NVIDIA、「巨大モデルを動かしたい・静音で常時動かしたい・既に Mac 環境がある」なら Apple Silicon**、という棲み分けです。Mac Studio の Unified Memory については別記事「[NVIDIA VRAM と Apple Unified Memory の違い 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」で構造から比較しています。

## VRAM × モデルの対応マトリクス

実用シナリオで「自分の GPU で何が動くか」を判断する材料として、以下のマトリクスが目安になります。

| VRAM | SDXL Base | SDXL + LoRA | SDXL Refiner | Flux schnell | Flux dev | Flux dev + LoRA |
|---|---|---|---|---|---|---|
| 8GB | △（量子化） | ✕ | ✕ | △（INT4） | ✕ | ✕ |
| 12GB | ◎ | ○ | △ | ○（FP8） | △（NF4） | ✕ |
| 16GB | ◎ | ◎ | ○ | ◎ | ○（FP8） | △ |
| 24GB | ◎ | ◎ | ◎ | ◎ | ◎ | ◎ |
| 32GB | ◎ | ◎ | ◎ | ◎ | ◎ | ◎（学習も可） |

◎ = 快適 / ○ = 動作するが余裕は少ない / △ = 量子化や工夫で動く / ✕ = 困難

**「画像生成 AI を真剣にやるなら VRAM 24GB 以上」** が 2026 年時点の境目です。LoRA 学習やコントロールネット重ね掛けまで視野に入れるなら、RTX 5090 32GB を選ぶ価値が出てきます。

[NVIDIA GeForce RTX 5090 を Amazon で見る](https://www.amazon.co.jp/s?k=rtx+5090)

## 実用シーン別の GPU 選定指針

### シーン 1：SDXL を量産したい（個人クリエイター）

- **第一候補**: RTX 4090 24GB（中古相場 25〜35 万円、コスパ最強）
- **次点**: RTX 5070 Ti 16GB（新品 17〜20 万円、SDXL 中心ならこれで十分）
- **避ける**: RTX 5070 12GB（VRAM がギリギリ、バッチ運用不可）

### シーン 2：Flux.1 dev で精細生成したい

- **第一候補**: RTX 5090 32GB（FP8 ネイティブ + 32GB の余裕）
- **次点**: RTX 4090 24GB（FP16 で動く、速度は半分）
- **避ける**: 16GB 以下の GPU（FP8 量子化しても窮屈）

### シーン 3：LoRA 学習や ControlNet 多重まで視野

- **第一候補**: RTX 5090 32GB（学習速度も世代最速）
- **業務用候補**: RTX PRO 6000 Blackwell 96GB（130〜160 万円、ECC 付き）
- **クラウド代替**: RunPod / Vast.ai で時間借り（H100 80GB が時間 $2〜3）

詳しい GPU 選定の判断軸は、別記事「[RTX 5090 vs 4090 vs PRO 6000 — AI 用 GPU 選定 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」で消費電力・価格・将来性まで含めて整理しています。

### シーン 4：在宅で静音・低消費電力を優先

- **第一候補**: Mac Studio M3 Ultra 96GB（180W、ファン音ほぼ無し）
- **代替**: RTX 4070 SUPER 12GB の自作（GPU 220W、消費電力控えめ）

## まとめ：画像生成 GPU 選びは「VRAM と帯域幅」で決まる

- **SDXL 中心**: RTX 4090 24GB が中古でコスパ最強、新品なら RTX 5070 Ti 16GB
- **Flux.1 dev 中心**: RTX 5090 32GB が現状唯一の快適解
- **両方を視野**: RTX 5090 が将来の Flux 派生モデルにも余裕で対応
- **静音・大型モデルロード**: Mac Studio M3 Ultra（速度より大型モデル運用優先）
- **VRAM 12GB 以下**: 量子化前提、本格運用には不向き

画像生成 AI は **モデルサイズの肥大化が止まらない領域** で、2024 年に SDXL（6GB）、2025 年に Flux（24GB）と急速に拡大してきました。2026〜2027 年は更に大型のモデル（推測で 40GB 級）が出る可能性が高く、**今 GPU を買うなら VRAM 24GB 以上を最低ラインにしておく** のが、3 年後に陳腐化しない最低条件になります。LLM 推論用途との関係は別記事「[Llama 3.3 70B トークン/秒 GPU 別ベンチマーク 2026年版](/blog/llama-3-3-70b-gpu-benchmark-2026/)」で同じ GPU 群を比較していますので、AI 用途を統合的に検討する場合は併せて参照してください。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [Llama 3.3 70B トークン/秒 GPU 別ベンチマーク 2026年版](/blog/llama-3-3-70b-gpu-benchmark-2026/)：同じ ai-dev section の LLM 推論ベンチ
- [RTX 5090 vs 4090 vs PRO 6000 — AI 用 GPU 選定 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)：GPU 選定の判断軸
- [VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)：VRAM 容量の意味の前提知識
