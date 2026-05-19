---
title: "NPU (Neural Processing Unit) とは何か 2026年版:Apple Neural Engine / Qualcomm Hexagon / Intel AI Boost / AMD XDNA の違いと TOPS の見方"
description: "NPU とは何か、なぜ Copilot+ PC で 40 TOPS が基準になるのかを基礎から解説。Apple Neural Engine / Qualcomm Hexagon / Intel AI Boost / AMD XDNA の4方式と GPU/CPU との役割分担を整理し、TOPS 値の正しい読み方を示します。"
date: 2026-05-19
lang: ja
category: comparison
section: column
tags: ["NPU", "Neural Engine", "Qualcomm Hexagon", "Intel AI Boost", "AMD XDNA", "TOPS", "Copilot+ PC", "AI推論"]
featured: false
og_image: "/images/blog/npu-explained-2026/cover.png"
affiliate_disclosure: true
---

![NPU とは何か 2026:Apple Neural Engine / Qualcomm Hexagon / Intel AI Boost / AMD XDNA の4方式とTOPSの見方](/images/blog/npu-explained-2026/cover.png)

**結論:NPU は AI 推論専用の行列演算ユニットで、CPU の汎用性も GPU の並列性能もなく、その代わり「常駐推論を低消費電力で回す」ことに特化しています。TOPS は INT8 ベースの理論値で、FP16 では半減します。Apple Neural Engine 38 / Qualcomm Hexagon 45 / Intel AI Boost 48 / AMD XDNA 2 が 50 TOPS で、Copilot+ PC の 40 TOPS 基準を分ける線です。**

「ノートPCの CPU 名のあとに『NPU 50 TOPS』とあるが、これは GPU と何が違うのか」「TOPS の数字が大きいほど AI が速いのか」という質問は、Copilot+ PC が普及した 2026 年に入って急増しました。本記事では、NPU の正体・なぜ専用回路が必要なのか・主要 4 方式の違い・TOPS 値の正しい読み方を、ハードウェア寄りに整理します。

## NPU とは何か:GPU でも CPU でもない第3の演算装置

NPU(Neural Processing Unit)は、**AI 推論に必要な行列演算と畳み込み演算に特化した専用回路** です。CPU のような汎用性はなく、GPU のような数千コアの並列演算もない代わりに、「行列の積和算を電力効率最高で回す」という一点に最適化されています。

| 項目 | CPU | GPU | NPU |
|---|---|---|---|
| 役割 | 汎用計算、OS 制御 | 並列計算、グラフィックス、AI 学習・大規模推論 | AI 推論専用、常駐 |
| 演算ユニット | 数〜数十コア | 数千コア(CUDA / Stream Processor) | 行列演算アレイ + アクセラレータ |
| 主な演算精度 | FP32 / FP64 / INT64 | FP32 / FP16 / FP8 / INT8 | INT8 / FP16 / FP8(世代次第) |
| 電力効率(推論) | 1 倍(基準) | 10〜20 倍 | **30〜50 倍** |
| ピーク性能 | 数十 GFLOPS | 数十〜数百 TFLOPS | 数十 TOPS |
| 適用領域 | OS、ブラウザ、ビジネスアプリ | ゲーム、画像生成、LLM 学習 | 常駐 AI 機能、軽量推論 |

NPU の電力効率は GPU 比で 2〜3 倍、CPU 比では数十倍に達します。具体的には、Apple Neural Engine の論文ベンチで、同じ画像分類タスクを CPU で 1W、GPU で 0.5W、NPU で 0.05W で処理できる、という比較値が出ています。**バッテリー駆動のノートPCで AI 機能を常駐させる** ための前提性能が、ここまで電力効率を落とさないと得られない、というのが NPU の存在理由です。

GPU の汎用 AI コアとの違いは「[Tensor Core / CUDA Core / RT Core の違い 2026年版](/blog/tensor-cuda-rt-core-explained-2026/)」で整理しています。本記事の NPU は、その3種のいずれとも異なる、SoC 内蔵の専用回路です。

## なぜ NPU が必要なのか:常駐推論のための回路

「GPU で AI 推論を回せば良いのでは」という疑問には、3 つの答えがあります。

### 1. 常駐ワークロードに GPU は重すぎる

Live Captions(リアルタイム字幕)、Windows Studio Effects(Web カメラ背景ぼかし)、Recall(画面履歴インデックス)などの Copilot+ 固有機能は、**1 日中常駐して動き続ける** 性質のものです。これらを dGPU(RTX 4060 など)で回すと、アイドル時の消費電力(20W 程度)が常に発生し、ノートPC のバッテリーが半日持たなくなります。

NPU なら同じ推論を 0.5〜2W で回せます。100倍の電力効率差が、常駐型 AI 機能のノートPC 実装を成立させています。

### 2. ノートPC の SoC に組み込みやすい

NPU は CPU パッケージ内に統合する設計が標準で、追加のチップやメモリを必要としません。Snapdragon X Elite / Lunar Lake / Strix Point はいずれも 1 チップ SoC で、ノートPC の薄型筐体に収められます。dGPU を載せると筐体厚・重量・冷却・消費電力のすべてが跳ね上がるため、ノートPC の主流デザインとは両立しません。

### 3. 専用回路の方が単位面積あたり性能が高い

GPU のテンソルコアは汎用性を残しているため、INT8 行列演算だけを取り出すと、専用 NPU の方が単位ダイ面積あたり 2〜3 倍速くなります。NPU は「特化することで効率を取る」アーキテクチャです。

## 主要 NPU 4方式:Apple / Qualcomm / Intel / AMD

2026 年のコンシューマ向け NPU は実質 4 方式に集約されています。

| 方式 | 開発元 | 搭載 SoC 例 | TOPS(INT8) | 特徴 |
|---|---|---|---|---|
| **Apple Neural Engine** | Apple | M4 / M4 Pro / M4 Max / A18 Pro | 38 | macOS / iOS の AI 機能の基盤、Core ML 経由でアプリから利用 |
| **Qualcomm Hexagon NPU** | Qualcomm | Snapdragon X Elite / X Plus / 8 Gen 4 | 45 | Snapdragon 系の Arm ノート / スマホで採用、Hexagon DSP の進化版 |
| **Intel AI Boost(NPU 4)** | Intel | Core Ultra 200V(Lunar Lake) | 48 | Movidius VPU 由来、Lunar Lake で第 4 世代 |
| **AMD XDNA 2** | AMD | Ryzen AI 300 / AI PRO 400 | 50 / 60 | Xilinx 由来の AI Engine、ノート最大の TOPS |

### Apple Neural Engine:M シリーズの AI 基盤

Apple Neural Engine は M1(2020 年)から本格的にコンシューマ Mac に登場し、現行 M4 世代で第 16 世代に進化しています。M4 / M4 Pro / M4 Max いずれも **NPU 38 TOPS(INT8)** で、SoC のサイズに関係なくこの値が共通です(M3 Ultra は M3 Max を 2 個つないだ構造のため、Neural Engine が 2 系統で実効 36 × 2 = 72 TOPS)。

特徴は **macOS / iOS の AI 機能(Apple Intelligence、写真の被写体抽出、Live Text、Siri、Genmoji)がすべて Neural Engine で動く** こと。サードパーティアプリも Core ML 経由で同じ NPU を利用できるため、Mac エコシステムの AI 機能は基盤として安定しています。

Copilot+ PC の 40 TOPS 基準には届かないため、Apple Silicon は Copilot+ 認定の対象外ですが、これは Microsoft の認定基準であって、Apple Intelligence の機能が劣るという意味ではありません。

### Qualcomm Hexagon NPU:Snapdragon の AI コア

Qualcomm Hexagon NPU は元々 DSP(信号処理プロセッサ)として発展してきた回路で、現行の Snapdragon X Elite では **45 TOPS(INT8)** に達しています。Snapdragon 8 Gen 4(スマホ用)も同系列の Hexagon を搭載し、フラッグシップ Android スマホの AI 機能の基盤となっています。

ノートPC では Surface Pro 11 / Surface Laptop 7 / ThinkPad T14s Gen 6 / HP OmniBook X / Dell XPS 13 などで採用。バッテリー駆動と静音を活かす設計が多く、AI 常駐機能をフルに使うモバイル用途に最適化されています。Copilot+ PC の主要ラインの一つです。

### Intel AI Boost(NPU 4):Lunar Lake で世代刷新

Intel の NPU は Movidius VPU(2016 年買収)由来で、Meteor Lake(2023 年)の NPU 3(11 TOPS)、Lunar Lake(2024 年)の NPU 4(**48 TOPS**)と世代を重ねています。Arrow Lake-H(性能優先のノート向け)では NPU 3 系の 13 TOPS にとどまり、Copilot+ 認定要件には届きません。

Lunar Lake の NPU 4 はメモリオンパッケージの LPDDR5X と直結し、低レイテンシで推論が回ります。**x86 互換性を保ちつつ NPU 48 TOPS** を実現したのが、Lunar Lake の最大の特徴です。

### AMD XDNA 2:Xilinx 由来の AI Engine

AMD XDNA 2 は Xilinx(2022 年買収)の AI Engine 技術を取り込んだ NPU で、Ryzen AI 300 シリーズで **50 TOPS**、Ryzen AI PRO 400 シリーズで **60 TOPS** に達しています。2026 年現在、コンシューマ・法人向けノートPC で最も高い NPU TOPS を誇るラインです。

特徴は **データフロー型アーキテクチャ** で、行列演算アレイ間でデータを直接受け渡しする設計のため、メモリ帯域への依存度が低く、ピーク性能を持続的に発揮しやすい構造になっています。法人向けの Ryzen AI PRO 400 では XDNA 2 を 60 TOPS まで引き上げ、AI 推論のヘッドルームを最大化しています。

## TOPS の正しい読み方:INT8 と FP16 で半減する

NPU のスペックで「45 TOPS」「50 TOPS」と並ぶ数字は、**INT8(8 ビット整数)精度での理論ピーク性能** を示しています。注意点は3つです。

### 1. 精度を上げると TOPS は半減する

| 精度 | TOPS(相対値) | 用途 |
|---|---|---|
| INT8 | 1.0(基準) | 量子化された推論モデル |
| FP16 | 0.5 | 中精度の推論、画像処理 |
| FP32 | 0.25(NPUでは非対応のことが多い) | 学習、高精度推論 |

「Snapdragon X Elite 45 TOPS」は INT8 ベースで、FP16 で測ると約 22 TFLOPS、FP32 では NPU では非対応か桁違いに遅くなります。ローカル LLM の推論は INT8 / INT4 量子化が前提なので、TOPS 値が直接効きますが、画像認識タスクで FP16 が必要な場合は、表記値の半分を見込む必要があります。

### 2. 理論値であって実効スループットではない

TOPS は「行列演算アレイがフル稼働した場合の理論ピーク」で、実際の推論ワークロードでは **メモリ帯域・データ依存・モデル構造** で 30〜70% に落ちます。Apple Neural Engine 38 TOPS と Qualcomm Hexagon 45 TOPS の差は、実効では誤差レベルになることが多くあります。

### 3. ベンダー間でベンチ条件が揃わない

Apple は社内ベンチ、Qualcomm は MLPerf Mobile、Intel と AMD は独自ベンチを使うため、TOPS 値だけでは正確な性能比較ができません。**ML Commons の MLPerf Inference** の Edge / Mobile カテゴリの数値が、ベンダー横断比較に最も近い客観指標です。

## なぜ 40 TOPS が Copilot+ 基準なのか

Microsoft が Copilot+ PC の最低要件として **NPU 40 TOPS** を設定したのは、以下のワークロードを同時に走らせる前提です。

| 機能 | 要する NPU 性能(目安) |
|---|---|
| Live Captions(リアルタイム字幕) | 5〜10 TOPS |
| Windows Studio Effects(背景ぼかし + 視線補正) | 10〜15 TOPS |
| Recall(画面履歴の OCR + インデックス) | 5〜10 TOPS |
| Cocreator(画像生成、軽量モデル) | 15〜20 TOPS |
| 常駐余裕 + 将来機能用ヘッドルーム | 5〜10 TOPS |

合計で 35〜50 TOPS が必要、という見立てから 40 TOPS が設定されました。Snapdragon X Elite(45)/ Core Ultra 200V(48)/ Ryzen AI 300(50)はいずれも余裕を持ってこの基準を超えています。Apple Neural Engine(38)はわずかに届かない数値ですが、macOS 側のソフトウェア最適化(Core ML、Metal Performance Shaders)で実効性能を補う設計です。

## NPU で動くワークロード / 動かないワークロード

NPU は常駐型 AI 機能には最適ですが、すべての AI ワークロードに使えるわけではありません。

| ワークロード | NPU で動く? | 理由 |
|---|---|---|
| Live Captions、Studio Effects | ◎ | 軽量モデル、常駐、消費電力最重要 |
| Recall の OCR | ◎ | バックグラウンド常駐、低レイテンシ |
| ローカル LLM 1B〜3B(量子化) | ○ | Phi-3.5、Llama 3.2 3B などは NPU で実用速度 |
| ローカル LLM 7B(INT4 量子化) | △ | 動くが速度は GPU の 1/3〜1/2 |
| ローカル LLM 70B | × | NPU では実行不可、GPU + 大容量 VRAM 必須 |
| Stable Diffusion(軽量量子化版) | △ | 動くが GPU の方が大幅に速い |
| Stable Diffusion XL / Flux.1 | × | NPU では性能不足、dGPU 24GB+ が現実解 |
| LLM の学習・ファインチューニング | × | 学習には FP16 / FP32 と高帯域メモリが必要、NPU は推論専用 |

つまり NPU は **「常駐的に低消費電力で回す軽量〜中量級の推論」** の領域に特化していて、本格的な LLM 推論・画像生成・学習は GPU の領域に残ります。ノートPC で重量級 AI 用途をこなしたい場合、NPU TOPS ではなく **VRAM 容量と GPU 帯域** で選ぶ必要があります。

VRAM 容量とローカル LLM の関係は「[VRAMとは何か。ローカルLLM推論で必要な量の決まり方 2026年版](/blog/vram-explained-llm-inference-2026/)」で詳しく扱っています。

## Apple Silicon の Unified Memory との関係

Apple Silicon の Neural Engine 38 TOPS は、見た目には Copilot+ 基準を満たしませんが、**Unified Memory** との組み合わせで別の優位性を持ちます。

| 軸 | Windows Copilot+ PC | Apple Silicon Mac |
|---|---|---|
| NPU TOPS | 40〜60 | 38(M4 系) |
| メモリアーキテクチャ | LPDDR5X 16〜32GB(CPU 直結 or オンパッケージ) | Unified Memory 16〜512GB |
| ローカル LLM 70B | GPU + VRAM 24GB+ 必須(dGPU) | M3 Ultra 192GB なら 1 台で動く |
| 常駐 AI 機能 | NPU で完結 | Neural Engine + Apple Intelligence |

つまり、NPU TOPS は「常駐推論の効率」を測る指標ですが、「**重量級モデルを 1 台で動かせるか**」という別軸では、Unified Memory 容量が決定要因になります。Apple Silicon は前者で劣り、後者で有利、という棲み分けです。Unified Memory と VRAM の比較は「[Apple Silicon Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」を参照してください。

## まとめ:NPU を理解するための 5 つのポイント

1. **NPU は AI 推論専用の行列演算回路** で、GPU の汎用 AI コアより 2〜3 倍電力効率が良い
2. **TOPS は INT8 ベースの理論ピーク値**、FP16 では半減、実効は 30〜70%
3. **Copilot+ PC の 40 TOPS 基準** は Live Captions + Studio Effects + Recall + Cocreator を同時に走らせる前提
4. **常駐 AI 機能** には NPU が必須、**重量級 LLM・画像生成** には GPU + VRAM が必要
5. **Apple Neural Engine(38)/ Qualcomm Hexagon(45)/ Intel AI Boost(48)/ AMD XDNA 2(50)** は実効性能の差は小さく、SoC 全体の特性(バッテリー / x86 互換性 / CPU 性能)で選ぶ

NPU は「PC のスペック表に新しく登場した謎の数字」ではなく、**AI 機能を常駐させるための設計上の必然** として登場したユニットです。Copilot+ PC を選ぶときも、Apple Silicon Mac を選ぶときも、「NPU が何を担当し、何を担当しないか」を理解しておくと、3 年後の AI 機能の進化にも判断軸がブレません。

実際の Copilot+ PC 選びの判断軸は「[Copilot+ PC ノートPC選び方ガイド 2026年版](/blog/copilot-plus-pc-ai-laptop-guide-2026/)」で、Snapdragon X Elite / Core Ultra 200V / Ryzen AI 300 / Apple Silicon の選び分けまで含めて整理しています。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [Tensor Core / CUDA Core / RT Core の違い 2026年版](/blog/tensor-cuda-rt-core-explained-2026/)
- [Apple Silicon Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)
