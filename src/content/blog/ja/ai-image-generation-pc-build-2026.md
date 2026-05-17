---
title: "AI画像生成向けPC構成ガイド 2026年版:SDXL / Flux.1 / ComfyUI をローカルで快適に動かす VRAM とCPU"
description: "Stable Diffusion XL・Flux.1・ComfyUI をローカルで快適に動かすための PC 構成を 2026 年最新事情で整理。VRAM の最低ライン、推奨 GPU（RTX 5070 Ti / 5080 / 5090）、CPU・メモリ要件、Apple Silicon の現実、用途別（趣味 / 商用 / 動画拡張）の判断軸を解説します。"
date: 2026-05-17
lang: ja
category: guide
section: ai-dev
tags: ["Stable Diffusion XL", "Flux.1", "ComfyUI", "AI画像生成", "VRAM", "RTX 5070 Ti", "RTX 5080", "RTX 5090", "PC構成"]
featured: false
og_image: "/images/blog/ai-image-generation-pc-build-2026/cover.png"
affiliate_disclosure: true
---

![AI画像生成向けPC構成 2026:SDXL / Flux.1 / ComfyUI の VRAM・GPU・メモリ要件](/images/blog/ai-image-generation-pc-build-2026/cover.png)

**結論:2026 年の AI 画像生成 PC は VRAM 容量で選択肢が決まります。SDXL だけなら 12GB で足りますが、Flux.1 dev を量子化なしで回すなら 24GB が最低ライン。趣味用途なら RTX 5070 Ti 16GB + 32GB RAM、商用本格なら RTX 5090 32GB + 64GB RAM、ComfyUI で動画拡張も視野なら RTX 5090 + 64GB + NVMe 4TB が落としどころ。CPU は Ryzen 7 9700X / Core Ultra 5 245K クラスで十分で、画像生成はほぼ GPU 律速です。**

「Stable Diffusion XL や Flux.1 をローカルで動かしたい」という需要は 2024 年の Flux.1 リリース以降、急速に増えています。LLM 推論と違って画像生成は **VRAM の壁・解像度・モデルサイズ・ComfyUI の重ね掛け**で要求スペックが大きく変わり、必要構成の判断は意外と複雑です。本記事では、SDXL / Flux.1 / ComfyUI の 3 つのワークフローを軸に、2026 年 5 月時点の現実的な PC 構成を整理します。

## VRAM 容量で決まる:モデル別の最低ライン

画像生成 PC で最初に決めるべきは GPU の VRAM 容量です。これが足りないと、量子化や CPU オフロードでお茶を濁す運用になり、生成速度が大きく落ちます。

| モデル | 推論精度 | 必要 VRAM(目安) | 備考 |
|---|---|---|---|
| Stable Diffusion 1.5 | FP16 | 4〜6GB | 旧世代モデル、軽量 |
| Stable Diffusion XL (SDXL) | FP16 | 8〜10GB | 2026 年の標準ワークホース |
| SDXL + LoRA + ControlNet | FP16 | 10〜12GB | LoRA 1〜2 個 + ControlNet 1 個程度 |
| Flux.1 schnell | FP16 | ~16GB | 4 ステップ高速版 |
| Flux.1 schnell | FP8 / NF4 | ~8〜10GB | 量子化版、12GB GPU で動く |
| Flux.1 dev | FP16 | ~24GB | フル精度、量子化なし |
| Flux.1 dev | FP8 | ~12〜14GB | 半精度量子化、16GB GPU で動く |
| Flux.1 dev | NF4 (4bit) | ~8〜10GB | 4bit 量子化、12GB GPU でも動く |
| AnimateDiff / Wan 2.1 (動画拡張) | FP16 | 16〜24GB | フレーム数次第でさらに増える |

**SDXL なら 12GB、Flux.1 dev を量子化なしで回したいなら 24GB** が一つの境界です。NF4 量子化を許容すれば 12〜16GB の GPU でも Flux.1 が動きますが、品質が体感で 1 段落ちることと、ComfyUI で ControlNet や Upscaler を重ねた瞬間にメモリが足りなくなる点に注意。

VRAM がそもそも何で決まるか、LLM 推論との関係は別記事「[VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)」で詳しく扱っています。

## ComfyUI で「重ね掛け」が増えると追加 VRAM が要る

A1111 (Automatic1111) や Forge で単純に 1 枚生成するだけなら上記の VRAM 目安で足りますが、ComfyUI のワークフロー組み合わせを使い込むと、想定より早く VRAM が枯渇します。

- **ControlNet 重ね掛け** :OpenPose + Depth + Canny の 3 種を同時にかけると、ベースモデル + 3 × 1〜2GB
- **Upscaler (Ultimate SD Upscale / 4x-UltraSharp)** :タイル分割で +2〜4GB
- **AnimateDiff / Wan 2.1 で動画拡張** :16 フレーム生成で +8〜12GB
- **LoRA 多段重ね** :3〜5 個積むと +1〜3GB
- **VAE / CLIP を別 GPU にオフロード** :メイン GPU に余裕がない場合の苦肉の策

ComfyUI で快適にワークフローを組みたいなら、**SDXL 中心でも 16GB、Flux.1 中心なら 24GB** を最低ラインに置くと、構成段階での詰みが減ります。

## 推奨 GPU 帯(2026 年 5 月時点)

NVIDIA RTX 50 シリーズが行き渡って、画像生成用途の選択肢はおおむね以下に収束しています。

| GPU | VRAM | TBP | 価格目安 | 適性 |
|---|---|---|---|---|
| RTX 5060 Ti 16GB | 16GB | 180W | 8〜9 万円 | 入門、SDXL + LoRA + 軽量 Flux |
| RTX 5070 Ti 16GB | 16GB | 285W | 13〜15 万円 | バランス型、Flux.1 dev FP8 が快適 |
| RTX 5080 16GB | 16GB | 360W | 18〜22 万円 | 準ハイエンド、生成速度重視、VRAM 同じ |
| RTX 5090 32GB | 32GB | 575W | 38〜45 万円 | 上限なし、Flux.1 dev FP16 / 動画拡張 |
| RTX PRO 6000 Blackwell 96GB | 96GB | 600W | 100 万円〜 | 商用 / バッチ生成 / 大型モデル |

**5060 Ti 16GB と 5070 Ti 16GB の VRAM は同じ** ですが、生成速度は 1.7 倍程度違います。「VRAM 容量で詰むモデルは同じ範囲、でも 1 枚あたりの生成秒数で大差がつく」のが両者の関係です。

**5070 Ti と 5080 の VRAM も同じ 16GB**。価格差(約 6〜8 万円)を払って 5080 を選ぶ価値があるのは、「1 枚生成 = 0 円ではないバッチ運用」を想定している層です。1 日 100 枚以上生成するなら時短分でペイしますが、趣味用途では 5070 Ti が CP 高め。

5090 32GB は **Flux.1 dev FP16 / Wan 2.1 / AnimateDiff** のような大型ワークフローを 1 GPU で完結させたいときに効きます。ComfyUI で 7 枚バッチ生成 + Upscaler + ControlNet 3 段を一気にかける、というような重ね掛け運用には 32GB が効きます。

GPU 別の SDXL / Flux.1 生成速度の実測値は「[Stable Diffusion XL / Flux.1 画像生成速度 GPU別ベンチマーク 2026年版](/blog/sdxl-flux-image-generation-gpu-benchmark-2026/)」でまとめています。

## CPU は脇役、メモリは中堅、ストレージは意外と効く

画像生成では CPU はほぼ無関係(GPU 律速)、というのが過去 3 年で確立した知見です。

### CPU

- **Ryzen 7 9700X** / **Core Ultra 5 245K** クラスで完全に十分
- 8 コア以上は不要、シングル性能もそれほど効かない
- ハイエンド CPU に予算を回すなら GPU の VRAM 容量に充てるのが正解

### メモリ

- **32GB が標準ライン**
- モデル切り替え時(SDXL → Flux.1 dev など)で OS スワップが発生すると、ロード時間が体感で数倍伸びる
- ComfyUI でモデル複数同時ロードする場合は 64GB が安心
- Apple Silicon Mac だと Unified Memory なので扱いが違う(後述)

### ストレージ

- **NVMe Gen 4 1TB が最低、2TB 推奨**
- モデル 1 個のサイズ:SDXL = 6.5GB、Flux.1 dev FP16 = 23GB、Flux.1 dev FP8 = 12GB
- LoRA / ControlNet / Upscaler / VAE を一通り揃えると、すぐ 1TB が埋まる
- ComfyUI で動画拡張も視野なら 4TB
- 出力画像も枚数によっては数十 GB 単位

PCIe Gen 5 NVMe にする価値があるかは「[PCIe Gen5 vs Gen4 NVMe SSD 2026年版](/blog/pcie-gen5-vs-gen4-nvme-ssd-2026/)」で詳しく扱っています。画像生成用途では Gen 4 で十分です。

## Apple Silicon Mac の現実(2026 年 5 月時点)

NVIDIA を持っていない場合、Mac での画像生成は選択肢になりますが、現実には NVIDIA 比で速度が落ちます。

| Mac 構成 | SDXL (1024px / 25 step) | Flux.1 dev |
|---|---|---|
| M4 / 16GB | 約 18〜22 秒/枚 | 厳しい |
| M4 Pro / 36GB | 約 12〜15 秒/枚 | NF4 量子化なら動く |
| M4 Max / 48GB | 約 8〜11 秒/枚 | FP8 量子化なら動く |
| M4 Max / 64GB | 約 8〜11 秒/枚 | Flux.1 dev FP16 が動く |
| M3 Ultra / 192GB | 約 6〜8 秒/枚 | FP16 余裕、動画拡張も視野 |

参考に RTX 5070 Ti は SDXL 1024px 25 step で 3〜4 秒/枚なので、**M4 Max でも NVIDIA RTX 5070 Ti の 2〜3 倍遅い** のが実情です。ただし Unified Memory の特性で「大きなモデルがそもそもロードできる」のは Mac の強みで、Flux.1 dev FP16(23GB)を 16GB VRAM の Windows GPU で量子化なしで回すのは難しいのに対し、M4 Max 64GB なら普通にロードできます。

「Mac しか持っていない、追加で Windows PC を組むつもりはない」という人にとって M4 Max 48GB / 64GB は十分な選択肢ですが、本気で速度を求めるなら NVIDIA 一択です。

## 用途別の現実的な PC 構成

### 趣味用途(SDXL 中心、Flux.1 は量子化で OK)

| 項目 | 構成 |
|---|---|
| GPU | RTX 5070 Ti 16GB |
| CPU | Ryzen 7 9700X / Core Ultra 5 245K |
| メモリ | 32GB DDR5-6000 |
| ストレージ | NVMe Gen 4 2TB |
| 電源 | 850W 80+ Gold |
| ケース | ATX ミドルタワー |
| 価格目安 | 27〜33 万円 |

SDXL を中心に、Flux.1 dev FP8 量子化版まで動かす想定。LoRA + ControlNet 1 段重ねまで快適。1 日 20〜50 枚程度の生成なら過不足なし。

### 商用 / 本格運用(Flux.1 dev FP16、動画拡張も視野)

| 項目 | 構成 |
|---|---|
| GPU | RTX 5090 32GB |
| CPU | Ryzen 9 9900X / Core Ultra 7 265K |
| メモリ | 64GB DDR5-6000 |
| ストレージ | NVMe Gen 4 4TB |
| 電源 | 1200W 80+ Platinum(RTX 5090 は推奨 1000W 以上) |
| ケース | ATX フルタワー(冷却重視) |
| 価格目安 | 65〜80 万円 |

Flux.1 dev FP16 + ControlNet 3 段 + Upscaler + バッチ 4 枚生成、を ComfyUI で一気に流す想定。商用イラストレーター・写真合成・広告クリエイティブで「1 日 数百〜数千枚」を回す層向け。

### 動画拡張も本気(AnimateDiff / Wan 2.1 / マルチショット)

| 項目 | 構成 |
|---|---|
| GPU | RTX 5090 32GB(あるいは RTX PRO 6000 Blackwell 96GB) |
| CPU | Ryzen 9 9950X / Core Ultra 9 285K |
| メモリ | 128GB DDR5-5600 |
| ストレージ | NVMe Gen 4 4TB + データ HDD 16TB |
| 電源 | 1200W 80+ Platinum |
| ケース | フルタワー、ラジエータ 360mm 搭載可 |
| 価格目安 | 95〜130 万円 |

動画拡張は VRAM 24GB が境目で、ここを超えると 1 ショット数十 GB のメモリを使うため、64GB RAM では足りないシーンが出てきます。RTX 5090 32GB でも Wan 2.1 の長尺ショットは厳しい局面があり、そこから上は RTX PRO 6000 96GB の世界です。

### 開発者向け予算 20 万円構成

ローカルで AI 開発を始めたいが予算を抑えたい層には、「[20万円で組む AI 開発向けPC 2026年版](/blog/budget-200k-dev-pc-build-2026/)」も合わせて参考にしてください。SDXL + LoRA 学習程度なら 20 万円帯でも組めます。

## CUDA / cuDNN / PyTorch 周りの注意

ハードウェアだけ揃えれば動くわけではなく、ソフトウェア環境にも 2026 年特有のポイントがあります。

- **CUDA 12.6 以上 + cuDNN 9.x** :Blackwell (RTX 50 / RTX PRO 6000) の最適化には必須
- **PyTorch 2.4 以上** :SM_120 (Blackwell) ネイティブ対応はバージョンに依存
- **xFormers / Flash Attention** :SDXL / Flux.1 で速度向上に必須、Blackwell 対応バージョンを確認
- **ComfyUI Manager** :拡張ノードの依存ライブラリでバージョン衝突が起きやすい、venv 推奨

Linux (Ubuntu 24.04 / 25.04) で動かすほうが NVIDIA ドライバ周りの安定性が高く、Stable Diffusion 系コミュニティの情報量も多めです。Windows 11 + WSL2 で運用する場合は、WSL2 経由の GPU パススルー設定を確認してから組むのがおすすめ。

## まとめ:迷ったら

- 趣味で SDXL 中心 → RTX 5070 Ti 16GB + 32GB RAM + 2TB NVMe
- Flux.1 dev FP16 を量子化なしで使いたい → RTX 5090 32GB + 64GB RAM
- ComfyUI で動画拡張も視野 → RTX 5090 32GB + 64GB〜128GB RAM + 4TB NVMe
- Mac しかない・追加 PC は無理 → M4 Max 64GB(NVIDIA 比 2〜3 倍遅いが Unified Memory で大型モデル可)

画像生成 PC は **VRAM 容量から逆算する** のが鉄則で、CPU やストレージ Gen は二の次。「Flux.1 dev を量子化なしで動かしたいか」だけで GPU の選択肢はほぼ RTX 5090 32GB に絞られます。3 年後にどんなモデルが出てくるかを考えると、**今 16GB VRAM の GPU を買うと早めに買い替えになる可能性が高い** 点は念頭に置いておく方が安全です。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [Stable Diffusion XL / Flux.1 画像生成速度 GPU別ベンチマーク 2026年版](/blog/sdxl-flux-image-generation-gpu-benchmark-2026/)
- [VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)
- [ローカルLLMを動かすPCの最低スペック 2026年版](/blog/local-llm-pc-spec-2026/)
