---
title: "Mac Studio M3 Ultra vs RTX 5090 ローカルLLM 推論ベンチマーク 2026年版：Llama 3.3 70B / Qwen 2.5 72B を Unified Memory と VRAM で比べる"
description: "Apple Silicon の Unified Memory 256GB と RTX 5090 の VRAM 32GB は、ローカル LLM 推論で実際どちらが速いのか。Llama 3.3 70B と Qwen 2.5 72B を Q4_K_M / Q5_K_M / Q8_0 で測った公開ベンチを横断集約し、トークン/秒・コンテキスト長・$/トークンの観点で2026年5月時点の現実解を整理しました。"
date: 2026-05-20
lang: ja
category: benchmark
section: mac
tags: ["Mac Studio", "M3 Ultra", "RTX 5090", "Llama 3.3", "Qwen 2.5", "ローカルLLM", "Unified Memory", "トークン毎秒", "量子化", "ベンチマーク"]
featured: false
og_image: "/images/blog/mac-studio-m3-ultra-vs-rtx-5090-llm-benchmark-2026/cover.png"
affiliate_disclosure: true
---

![Mac Studio M3 Ultra vs RTX 5090 LLM ベンチマーク 2026:Llama 3.3 70B と Qwen 2.5 72B の量子化別トークン/秒比較](/images/blog/mac-studio-m3-ultra-vs-rtx-5090-llm-benchmark-2026/cover.png)

**結論：Llama 3.3 70B Q4_K_M を「1台で動かしたい」なら Mac Studio M3 Ultra（17〜18 tok/s）が現実解。RTX 5090 単体では 32GB VRAM に収まらず実用不可で、Q4 で回すには 2 枚必要（合算 27〜35 tok/s）。「速さ重視」なら 2x RTX 5090、「容量重視・1筐体」なら M3 Ultra、というのが2026年5月時点の素直な棲み分けです。** 価格は M3 Ultra 256GB 構成が約 130 万円〜、RTX 5090 ×2 + 自作PC が約 130〜150 万円。LLM 推論コストは大差ありませんが「電力 / 騒音 / 1筐体性」で Mac、「学習にも使える / トークン速度」で NVIDIA、と用途で分かれます。

ローカル LLM を本気で動かそうとすると、最終的に「Mac Studio M3 Ultra と RTX 5090、どっちが速い・容量がある・コスパがいい？」という問いに行き着きます。本記事では公開ベンチ（r/LocalLLaMA、llama.cpp Discussions、Tom's Hardware、各種テックブログ）を横断集約し、Llama 3.3 70B / Qwen 2.5 72B の量子化別 tok/s と $/トークンを2026 年 5 月時点で整理します。

iris-lab の自前実測ではなく、公開実測の集約ベースである点は最初に明示します。Phase 1 で iris-lab の実機データを追記する前提で、本記事は「2026年5月時点で世間が報告している tok/s レンジ」のスナップショットとして読んでください。

## 比較対象を 3 秒で

| 機種 | メモリ | 帯域 | 価格目安（2026/5）|
|---|---|---|---|
| Mac Studio M3 Ultra（256GB） | LPDDR5X Unified 256GB | 819 GB/s | 約 130〜150 万円 |
| RTX 5090（32GB）×1 + 自作PC | GDDR7 32GB | 1,792 GB/s | 約 65〜80 万円 |
| RTX 5090（32GB）×2 + 自作PC | GDDR7 32GB ×2 = 実効 64GB | 1,792 GB/s（各） | 約 130〜150 万円 |
| RTX PRO 6000 Blackwell（96GB）| GDDR7 ECC 96GB | 1,800 GB/s | 約 145 万円 |

M3 Ultra は2026年3月に 512GB オプションが世界的 DRAM 不足で撤去され、現在オーダーできる最大は 256GB。256GB 構成自体も値上げ後で「LLM向け Mac」のハイエンド枠として残っています。

RTX 5090 は 32GB VRAM。Llama 3.3 70B Q4_K_M（約 40GB）は単体に収まらないため、Q4 を動かすには 2 枚構成または別系統（PRO 6000 / Mac）が必須です。

## Llama 3.3 70B Q4_K_M：M3 Ultra vs 2x RTX 5090

公開ベンチの横断集約結果（短文プロンプト 〜2K context、llama.cpp / Ollama 系）はこのレンジです。

| 機材 | 70B Q4_K_M tok/s | 備考 |
|---|---|---|
| Mac Studio M3 Ultra（28C/60GPU） | 17〜18 tok/s | Apple Silicon GPU 単体で完結 |
| Mac Studio M3 Ultra（32C/80GPU） | 18〜20 tok/s | バス帯域フル活用 |
| RTX 5090 ×1 | 動作不可（VRAM 不足） | Q3_K_M（〜32GB）まで落として 30〜40 tok/s |
| RTX 5090 ×2（NVLinkなし、PCIe接続） | 27〜35 tok/s | Ollama 検証で 27 tok/s、最適化次第で 35 tok/s |
| RTX PRO 6000 Blackwell（96GB） | 40〜50 tok/s | 単体で 70B 級が余裕、ECC 込み |
| Mac Studio M2 Ultra（192GB） | 9〜11 tok/s | 比較参考 |
| Mac Studio M4 Max（128GB） | 11〜13 tok/s | M3 Ultra より帯域低い |

要点はこうです。

- **「1台で 70B Q4_K_M を動かす」最安解は M3 Ultra**：256GB Unified Memory なら 70B Q4 + コンテキスト 32K でも全部メモリに乗る
- **「最速を取る」と 2x RTX 5090**：1.792 TB/s × 2 の帯域で 27〜35 tok/s。M3 Ultra の倍速
- **「単体で全部入って速い」は RTX PRO 6000**：96GB VRAM + 1.8 TB/s で 70B Q4 〜 Q8 を1枚で完結

「2x RTX 5090 vs M3 Ultra」が現在の本命対決で、価格帯（130〜150万円）も似ているため、選び方は「電力 / 騒音 / 学習用途」で分かれます。

## Qwen 2.5 72B：Llama 3.3 70B とほぼ同じレンジ

Qwen 2.5 72B（Alibaba の中国語・コード強化モデル）も Llama 3.3 70B とほぼ同サイズで、Q4_K_M で約 43GB。傾向は Llama 3.3 70B と同じです。

| 機材 | 72B Q4_K_M tok/s | 備考 |
|---|---|---|
| Mac Studio M3 Ultra（256GB） | 16〜18 tok/s | Llama 3.3 とほぼ同等 |
| RTX 5090 ×2 | 25〜33 tok/s | 同上 |
| RTX PRO 6000 | 38〜48 tok/s | 同上 |

Qwen 2.5 シリーズは中国語・コード生成・math タスクで Llama 3.3 より明確に上、というベンチが多く、コード生成中心のローカル LLM 運用なら Qwen 2.5 72B を選ぶ価値があります。tok/s レンジは Llama 3.3 と同じと考えてください。

## 量子化を変えると何が起きるか

同じ M3 Ultra / RTX 5090 でも、量子化を変えるとサイズも速度も変わります。

| 量子化 | ファイルサイズ | M3 Ultra 256GB | 2x RTX 5090（64GB） | RTX PRO 6000（96GB） |
|---|---|---|---|---|
| Q3_K_M | 32GB | 19〜21 tok/s | 30〜38 tok/s（1枚で可）| 45〜55 tok/s |
| Q4_K_M | 40GB | 17〜18 tok/s | 27〜35 tok/s | 40〜50 tok/s |
| Q5_K_M | 50GB | 15〜17 tok/s | 22〜28 tok/s | 35〜42 tok/s |
| Q8_0 | 70GB | 12〜14 tok/s | 入らない | 25〜30 tok/s |
| FP16 | 140GB | 8〜10 tok/s（M3 Ultra 256GB 余裕） | 入らない | 入らない（96GB 不足） |

Q4_K_M で迷ったら Q5_K_M に上げる、というのがコミュニティの定石です。Q5 は Q4 比で VRAM +15%、tok/s -10% の代わりに「コード生成や論理推論の品質」が明確に上がります。量子化フォーマット別の体感差は「[ローカルLLM 量子化フォーマット別 推論速度ベンチマーク 2026年版](/blog/local-llm-quantization-benchmark-2026/)」で詳しく扱っています。

「FP16 を 1 台で動かす」が必要なシーンは限定的（ファインチューニング / 研究）ですが、これができるのは現状 M3 Ultra（256GB）だけです。

## コンテキスト長を伸ばすと差が広がる

短文プロンプト（〜2K）では「M3 Ultra 17 tok/s vs RTX 5090 35 tok/s」程度の差ですが、**長文（32K / 64K context）になると KV キャッシュが膨らんで挙動が変わります**。

| context 長 | 必要 KV キャッシュ（Llama 3.3 70B Q4） | M3 Ultra への影響 | RTX 5090 への影響 |
|---|---|---|---|
| 2K | 約 0.5GB | ほぼ無影響 | ほぼ無影響 |
| 8K | 約 2GB | -2〜3 tok/s | -3〜5 tok/s |
| 32K | 約 8GB | -4〜5 tok/s | 1枚で溢れる場合あり |
| 64K | 約 16GB | -6〜8 tok/s（256GB なら余裕） | 2枚目に溢れる、PCIeコピー発生 |
| 128K | 約 32GB | M3 Ultra でも顕著に遅くなる | 入らない |

長文 RAG（コードベース全文を context に入れる用途等）では「容量が物を言う」局面で M3 Ultra が逆転するケースが報告されています。逆に短文・対話中心なら 2x RTX 5090 が常に速い、という構図です。

## メモリ構造の違い：PCIe コピー税金

NVIDIA + x86 構成では、モデル重みは最初システム RAM に読み込まれ、PCIe Gen5 x16（約 64 GB/s）経由で VRAM へコピーされます。Llama 3.3 70B Q4（40GB）でも約 1 秒、FP16 なら 2 秒以上の転送が走ります。

Apple Silicon の Unified Memory ではこの転送そのものが存在せず、CPU がトークナイズしている横で GPU が同じメモリ上の重みを読み始めます。「ロードからの初回応答が速い」「複数モデル切替が軽快」というのは Mac の体感的な強みで、ベンチ数値には現れにくいけれど実運用では効いてくるポイントです。

メモリ構造そのものの比較は「[Apple Silicon の Unified Memory と NVIDIA VRAM、ローカルLLM では何が違うのか 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」で構造から扱っています。本記事はその実測値版という位置付けです。

## 消費電力・騒音

Mac Studio M3 Ultra と RTX 5090 ×2 構成は消費電力と騒音で大きく違います。

| 機材 | 推論時消費電力 | アイドル時 | 騒音 | 排熱 |
|---|---|---|---|---|
| Mac Studio M3 Ultra | 約 150〜180W | 約 8W | 静か（ファン低速） | 軽い |
| RTX 5090 ×1 + PC | 約 600〜700W | 約 60W | 中程度 | 強い |
| RTX 5090 ×2 + PC | 約 1100〜1300W | 約 100W | うるさい | 非常に強い |
| RTX PRO 6000 + PC | 約 700〜800W | 約 80W | 中程度 | 強い |

電気代の差は「年間 300 時間使う」前提で計算するとこのくらいです（東京電力従量電灯B 30円/kWh 想定）。

| 機材 | 年間電気代（推論 300 時間 + アイドル）|
|---|---|
| Mac Studio M3 Ultra | 約 4,000 円 |
| RTX 5090 ×1 + PC | 約 10,000 円 |
| RTX 5090 ×2 + PC | 約 18,000 円 |
| RTX PRO 6000 + PC | 約 12,000 円 |

毎日数時間 LLM を回す前提なら、5 年で 5〜8 万円の差が出ます。「静音 + 省電力でデスクに置ける」という Mac Studio の運用性は実運用ではかなり大きいです。

## $/トークン（コスト効率）

「1 トークン生成するのにいくらかかるか」を概算したものがこちらです。3 年使う前提・電気代込み・初期費用按分。

| 機材 | 3年 TCO（電気代込み）| 70B Q4 tok/s | 1秒あたりトークンコスト | 1M トークン換算 |
|---|---|---|---|---|
| Mac Studio M3 Ultra | 約 135 万円 | 17 tok/s | 0.024 円 | 約 2.4 円 |
| RTX 5090 ×2 + PC | 約 150 万円 | 30 tok/s | 0.015 円 | 約 1.5 円 |
| RTX PRO 6000 + PC | 約 155 万円 | 45 tok/s | 0.010 円 | 約 1.0 円 |
| GPT-4o（API、参考） | - | - | - | 約 250〜400 円（入出力）|

クラウド API と比べると、ローカル LLM の $/トークンは 100 分の 1 〜 200 分の 1 です。月に 100M トークン以上を回す用途（RAG / 自動生成パイプライン）なら、初期投資は 1 年で回収できる計算になります。

## 「学習」に使えるかどうか

ベンチが推論ばかりに見えるのは、Mac Studio が **学習で本気の競争力がない** ためです。

| 用途 | M3 Ultra | RTX 5090 / PRO 6000 |
|---|---|---|
| 推論（Inference） | ◯ 速度はそこそこ、容量で勝る | ◎ 速度で勝る |
| LoRA / QLoRA ファインチューン | △ 動くがソフト対応が薄い | ◎ Hugging Face / PEFT がフル対応 |
| フルファインチューン | × 実質非対応 | ◯ 単枚 5090 は厳しい、PRO 6000 や複数枚で可 |
| 学習スクリプト互換性 | △ PyTorch MPS の制約あり | ◎ CUDA エコシステム全部 |

「推論しかしない」前提なら M3 Ultra で十分。「LoRA で自分のデータに合わせたい」「実験で重み調整したい」なら NVIDIA 一択です。Apple は MLX という独自フレームワークを推していますが、Hugging Face エコシステムの厚みでは CUDA に及びません。

## どちらを選ぶか：用途別マトリクス

| ユーザー像 | 推奨機材 |
|---|---|
| 70B クラス推論を1筐体で完結したい、静音重視 | Mac Studio M3 Ultra 256GB |
| LoRA / QLoRA で自前データに合わせたい | RTX 5090 ×1 または PRO 6000 |
| 長文 RAG（128K context 超）を回したい | M3 Ultra 256GB |
| 短文対話の最速性能 | 2x RTX 5090 または PRO 6000 |
| LLM + 画像生成 / 動画生成も併用 | 2x RTX 5090（CUDA エコシステム） |
| 法人デスクに置く、消費電力 200W 以内に収めたい | M3 Ultra |
| ファインチューン本気でやる | PRO 6000 / 複数枚 5090 |

「速度が全て」なら RTX 5090 ×2 か RTX PRO 6000、「1筐体で容量重視、静音で寝室にも置ける」なら M3 Ultra。両方とも 130〜150 万円帯で価格差は小さく、選択は **用途と環境** で決まります。

[Mac Studio M3 Ultra を Amazon で見る](https://www.amazon.co.jp/s?k=Mac+Studio+M3+Ultra)

## 結局のところ：2026 年 5 月時点の素直な結論

- **「70B を1筐体で動かしたい」なら M3 Ultra 256GB**（17〜18 tok/s、150〜180W 静音、約 130〜150万円）
- **「速度を取る」なら 2x RTX 5090**（27〜35 tok/s、1100W、約 130〜150万円）
- **「単体で 70B Q4 〜 Q8 を完結、ECC も欲しい」なら RTX PRO 6000**（40〜50 tok/s、約 145万円）
- **「学習もしたい」なら NVIDIA 一択**（CUDA エコシステム）
- **「128K 超のコンテキスト」なら M3 Ultra**（容量で勝る）

「Mac か NVIDIA か」は信仰の問題ではなく、用途と運用環境で決まる工学的選択です。$/トークンも電力もほぼ同等、差が出るのは「速度 vs 容量 vs 学習可否 vs 静音性」のどれを取るかです。

GPU 単体の世代比較は「[RTX 5090 vs 4090 vs RTX PRO 6000：AI用途で選ぶGPU 2026](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」、70B 推論の GPU 別 tok/s 集計は「[Llama 3.3 70B GPU別トークン/秒 2026年版](/blog/llama-3-3-70b-gpu-benchmark-2026/)」を併せて読むと、Mac 含めた選択肢全体が俯瞰できます。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [Apple Silicon の Unified Memory と NVIDIA VRAM、ローカルLLM では何が違うのか 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)：構造比較の概念整理
- [Llama 3.3 70B GPU別トークン/秒 2026年版（5090 / PRO 6000 / Mac）](/blog/llama-3-3-70b-gpu-benchmark-2026/)：GPU 横断の tok/s 集計
- [ローカルLLM 量子化フォーマット別 推論速度ベンチマーク 2026年版](/blog/local-llm-quantization-benchmark-2026/)：Q4_K_M / Q5_K_M / Q8_0 / FP16 の体感差
