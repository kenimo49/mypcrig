---
title: "Llama 3.3 70B を各GPUで動かしたトークン/秒 2026年版 — RTX 5090 / PRO 6000 / Mac Studio 実測比較"
description: "Llama 3.3 70B Q4 を実際に動かしたとき、RTX 5090 / RTX PRO 6000 Blackwell / Mac Studio M3 Ultra でトークン/秒はどれだけ違うのか。公開ベンチと実測報告を横断集約し、量子化精度・コンテキスト長・バックエンドごとの速度差を整理しました。"
date: 2026-05-08
lang: ja
category: benchmark
section: ai-dev
tags: ["Llama 3.3", "ローカルLLM", "RTX 5090", "RTX PRO 6000", "Mac Studio", "M3 Ultra", "トークン毎秒", "GPUベンチマーク"]
featured: false
og_image: "/images/blog/llama-3-3-70b-gpu-benchmark-2026/cover.png"
affiliate_disclosure: true
---

![Llama 3.3 70B GPU別トークン/秒 2026:RTX 5090 / RTX PRO 6000 / Mac Studio M3 Ultra の3軸比較](/images/blog/llama-3-3-70b-gpu-benchmark-2026/cover.png)

**結論：Llama 3.3 70B を最速で回したいなら RTX 5090（Q4_K_M で 20〜30 tok/s）。FP16 や Q8 を1台で扱うなら RTX PRO 6000 Blackwell か Mac Studio M3 Ultra。Mac は速度より「巨大モデルが乗る余裕」、NVIDIA は速度と量子化前提の運用、と棲み分けが明確です。**

Llama 3.3 70B はMetaが2024年12月に公開した、70B サイズで 405B 並みの性能を出すモデルです。2026年5月時点で AI 開発者の標準テストモデルとして定着し、「自分のGPUで何 tok/s 出るのか」を確かめたいニーズが顕在化しています。本記事では公開ベンチと r/LocalLLaMA / Hugging Face Discussions / 国内 note・Qiita 等の実測報告を横断集約し、現実的に出る速度レンジを整理します。

iris-lab の自前実測ではなく、公開実測の集約ベースである点は最初に明示しておきます。Phase 1 で iris-lab の実機データを追記する前提で、本記事は「世間で報告されている tok/s レンジ」のスナップショットとして読んでください。

## Llama 3.3 70B の前提を3秒で

ファイルサイズの目安は次の通りです。

| 量子化 | ファイルサイズ目安 | 用途 |
|---|---|---|
| FP16 | 約 140GB | 研究・ファインチューニング前提 |
| Q8 | 約 70GB | 精度を落としたくない実運用 |
| Q4_K_M | 約 40〜43GB | 個人・小規模法人の実用ライン |
| Q3_K_M | 約 32GB | 24GB VRAM に押し込む妥協ライン |

「Q4_K_M（実用ライン）」が消費者向けGPU での定番です。Q3 まで落とすと長文での論理が時々崩れる、Q5 まで上げるとほぼ FP16 と区別がつかない、というのが体感のコンセンサスです。

## GPU別トークン/秒（2026年5月時点、Q4_K_M ベース）

「公開ベンチで報告されているレンジ」を 1 つの表にまとめます。短文プロンプト（〜2K context）、llama.cpp 系または同等バックエンドでの数値です。

| GPU / SoC | VRAM・Unified Mem | 70B Q4_K_M tok/s | 70B Q8 tok/s | 70B FP16 tok/s |
|---|---|---|---|---|
| RTX 5090 | 32GB GDDR7 | 20〜30 | △ VRAM不足 | ✗ |
| RTX 4090 | 24GB GDDR6X | 12〜18 | ✗ | ✗ |
| RTX PRO 6000 Blackwell | 96GB GDDR7 | 25〜35 | 12〜18 | 6〜10 |
| Mac Studio M3 Ultra 192GB | 192GB Unified | 10〜15 | 6〜10 | 3〜5 |
| Mac Studio M3 Ultra 512GB | 512GB Unified | 10〜15 | 6〜10 | 3〜5 |
| MacBook Pro M4 Max 128GB | 128GB Unified | 8〜12 | 4〜7 | ✗ 容量ギリギリ |

5090 が「単純な速度では一番速いが、Q8 以上はそもそも乗らない」、PRO 6000 が「単体で量子化を選べる唯一の選択肢」、Mac Studio M3 Ultra が「速度を諦めれば FP16 まで素直に動く」、という 3 つのキャラクターに分かれます。

数値は短文プロンプトのデコード速度が中心で、長文のプロンプト処理（プリフィル）は別問題です。プロンプトが 32K になれば NVIDIA も Apple も全体スループットが落ちる、というのは後ろの章で触れます。

## 量子化精度ごとの判断軸

### Q4_K_M（実用ライン）

迷ったらこれ。RTX 5090 単体で 20〜30 tok/s、ChatGPT を体感速度で追い越せる帯です。70B Q4_K_M は重みだけで約 39〜43GB なので、24GB の RTX 4090 単体では KV キャッシュ込みで微妙に溢れ、コンテキスト長を切り詰めて運用することになります。32GB の RTX 5090 から「素直に乗る」ラインに入ります。

### Q8（精度重視）

VRAM が 80GB 級ないと現実的ではありません。RTX PRO 6000 Blackwell（96GB）か、Mac Studio M3 Ultra（192GB / 512GB）が単体で実行できる選択肢です。Q4_K_M との品質差はベンチマークスコアでは数%ですが、長文生成や論理推論の安定感が変わるため「業務エージェントとして 24 時間回す」用途では Q8 を選ぶ価値があります。

### FP16（研究・フルファインチューニング前提）

70B FP16 は重みだけで 140GB を超えます。1 台で扱えるのは RTX PRO 6000 Blackwell と Mac Studio M3 Ultra 192GB / 512GB だけです。NVIDIA で複数枚に分散する手もありますが、ホスト・電源・ケースを丸ごと揃える話になり、個人ユースの現実解からは外れます。

## バックエンドごとの差

同じGPU でも、推論バックエンドで tok/s が 1.5〜3 倍変わります。

- **llama.cpp（CUDA / Metal）**：もっとも普及。NVIDIA / Apple 両対応で、Q4_K_M の事実上の標準。チューニングは少ないが安定して動きます。
- **MLX（Apple 公式）**：2025 年以降 70B 対応が安定し、Metal バックエンドの llama.cpp と同等〜やや速い領域に来ました。Apple Silicon の Unified Memory を素直に使い切ります。
- **vLLM / SGLang**：バッチ推論を前提にしたサーバ系。単発の tok/s は llama.cpp と大差ないが、並列リクエストでスループット 2〜3 倍。法人デプロイ向け。
- **TensorRT-LLM（NVIDIA 専用）**：FP4 / FP8 対応で、RTX 5090 や PRO 6000 でさらに加速可能。設定難度はもっとも高いが、ピーク速度が欲しいなら選択肢に入ります。

「自分の数値が世間より遅い」と感じたら、まずバックエンドを疑うのが早道です。llama.cpp デフォルトと TensorRT-LLM では、同じ 5090 でも体感が変わります。

## コンテキスト長の影響：32K で6〜7割、128K は別の話

ベンチマーク数値は短文プロンプトでの値です。コンテキストが伸びると KV キャッシュが線形に膨らみ、速度が落ちます。

| コンテキスト | 速度の目安（対 4K 比） |
|---|---|
| 4K | 100%（基準） |
| 32K | 約 60〜70% |
| 128K | 約 30〜50%（VRAM に乗りきらない場合は急落） |

128K context で 70B を回すと、Q4_K_M でも KV キャッシュが 20〜30GB 級になり、RTX 5090 では足りません。Mac Studio M3 Ultra の Unified Memory を最大の長所として使うなら、ここの「巨大コンテキスト」用途が一番映えます。

## 用途別の現実解

| 用途 | 現実解 |
|---|---|
| 個人開発のコーディング補助 | RTX 5090 + Q4_K_M、20〜30 tok/s で十分 |
| 業務エージェントとして 24h 回す | RTX PRO 6000 + Q8、品質と発熱の両立 |
| 研究・フルファインチューニング | RTX PRO 6000 か Mac Studio M3 Ultra 192GB+ |
| 巨大コンテキスト（128K〜） | Mac Studio M3 Ultra（速度より容量を取る） |
| 法人 API 代替 / 並列リクエスト | RTX PRO 6000 + vLLM / SGLang |

「とりあえず 70B を高速で回したい」なら 5090、「速度を妥協して FP16 を 1 台で扱いたい」なら Mac Studio、「両方欲しい」なら PRO 6000、という三択です。Mac Studio は重戦車、5090 はスポーツカー、PRO 6000 は両用 SUV、と言い換えても大きく外しません。

価格帯は GPU 単品で次の通りです。実勢価格の詳しい動きは別記事「[RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell：AI用途で選ぶGPU 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」で扱っています。

- RTX 5090：55〜62万円（AIB 抽選販売）
- RTX PRO 6000 Blackwell：130〜160万円（B2B / ワークステーション経由）
- Mac Studio M3 Ultra 192GB：80〜95万円（Apple 直販）

[RTX 5090 を Amazon で見る](https://www.amazon.co.jp/s?k=RTX+5090)

## 数値の見方の注意

ベンチマーク値は揺れます。揺れる理由を 3 つだけ挙げます。

1. **短文／長文プロンプトの違い**：Twitter / Reddit で見かける「30 tok/s 出た」は短文のデコード速度であることが多く、実利用では 6〜8 割に落ちます。
2. **量子化方式の差**：Q4_K_M と Q4_0、IQ4_XS では速度も品質も微妙に違います。「Q4」とだけ書かれた数値は、内訳を確認する価値があります。
3. **バックエンドのバージョン**：llama.cpp は四半期ごとに最適化が入ります。半年前のベンチは古い前提のことがあります。

数値を引用するなら、量子化方式・コンテキスト長・バックエンドの 3 点をセットで明示するのが最低ラインです。本記事も、続編で iris-lab 自前実測を追記する際は同じ書式で揃える予定です。

## VRAM の容量論との関係

「速度」の話と「そもそも乗るか」の話は別レイヤーです。Mac Studio が遅く見えても、512GB Unified Memory のおかげで「乗る」という事実だけで NVIDIA を超えるシーンがあります。容量の話は別記事「[VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)」と「[Apple Silicon の Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」で詳しく扱っています。

本記事の「速度」と、容量論の記事を 2 本セットで読むと、GPU 選定の判断軸が立体的に揃います。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [ローカルLLMを動かすPCの最低スペック 2026年版：Llama 3.3 70B が動くまで](/blog/local-llm-pc-spec-2026/)
- [RTX 5090 vs RTX 4090 vs RTX PRO 6000 Blackwell：AI用途で選ぶGPU 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)
- [Apple Silicon の Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)
- [VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)
