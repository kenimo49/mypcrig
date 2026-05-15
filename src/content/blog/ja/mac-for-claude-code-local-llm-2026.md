---
title: "Mac で Claude Code とローカルLLM を動かす Apple Silicon 構成 2026年版"
description: "M4 / M4 Pro / M4 Max / M3 Ultra のうち、Claude Code と Ollama を実用速度で同時に回せるのはどこからか。Unified Memory の必要量、Qwen3-14B MLX で 11.5 tok/s が出るスイートスポット、メモリ不足でスワップ崩壊する閾値を 2026 年の最新ベンチで整理します。"
date: 2026-05-15
lang: ja
category: guide
section: mac
tags: ["Apple Silicon", "Claude Code", "ローカルLLM", "Ollama", "MLX", "M4 Pro", "M4 Max", "M3 Ultra", "Unified Memory"]
featured: false
og_image: "/images/blog/mac-for-claude-code-local-llm-2026/cover.png"
affiliate_disclosure: true
---

![Mac で Claude Code とローカルLLM を同居させる 2026:M4/M4 Pro/M4 Max/M3 Ultra の Unified Memory 必要量マップ](/images/blog/mac-for-claude-code-local-llm-2026/cover.png)

**結論：Claude Code だけならクラウド側で推論するので M4 16GB の MacBook Air でも回る。ただしローカルLLMを併走させるなら 24GB がスタートライン、Qwen3 14B を 11 tok/s 級で快適に回すなら M4 Pro 48GB が現実解、70B クラスまで欲しければ M4 Max 64GB 以上か M3 Ultra 96GB+ になります。**

「Mac でも Claude Code は使えますか」と「Mac でローカルLLM ってどこまで動きますか」は、最近の Mac 購入相談で最頻出の組み合わせです。両方を同時に動かす想定が普通になってきたので、この記事では Apple Silicon の M4 / M4 Pro / M4 Max / M3 Ultra について、Claude Code と Ollama / MLX 経由のローカル推論を併走させた場合に「どこから実用」「どこから余裕」「どこから過剰」になるのかを 2026 年 5 月時点のベンチで整理します。

Claude Code 単体での負荷については「[Claude Code を快適に動かすPC構成 2026年版（必要スペック）](/blog/claude-code-pc-spec-benchmark-2026/)」も合わせてどうぞ。本記事はその Mac 版 + ローカルLLM 併走編という位置付けです。

## なぜ Mac で Claude Code を動かすと意外と重いのか

Claude Code は Anthropic のクラウドで推論されるので、原理上 PC 側に推論負荷は乗らないはずです。しかし実際の Mac では以下の事情でメモリが食われます。

- Claude Code 本体（Node.js）プロセスが大規模リポを開くと 2〜4GB
- VS Code / Cursor 側のプロセスが 2〜3GB
- ローカルでフォーマッタ・LSP・tsserver を走らせると合計 2〜4GB
- Chrome / Safari のタブが裏で 4〜8GB

ここまでで素の Claude Code 環境だけで 10〜18GB が常時占有されます。MacBook Air 16GB だとここで既に Swap が走り始めることがあり、ローカル LLM を併用しようとすると 16GB は明確に足りません。**Claude Code を一日中まわす + ローカル LLM を時々使う** という標準的な開発ワークフローなら、Unified Memory は 24GB から、できれば 32GB 以上から考えるのが現実的です。

## チップ別の役割：Claude Code / ローカルLLM の併走能力

2026 年 5 月時点の Apple Silicon は、ローカルLLM 用途で見ると 4 つの階層に分かれます。

| チップ | 最大 UM | LLM 用に使える上限 | Claude Code との同居 | 推奨用途 |
|---|---|---|---|---|
| M4 | 32 GB | 〜 8B (Q4) | ◎（ローカルLLM なしなら） | クラウドAI 中心、軽量モデル併用 |
| M4 Pro | 48 GB | 〜 14B (Q4) / 32B (Q3 ギリ) | ◎ | Claude Code + 中規模ローカル併用の本命 |
| M4 Max | 64〜128 GB | 〜 32B (Q4) / 70B (Q3) | ◎◎ | フルスタック AI 開発機 |
| M3 Ultra | 256〜512 GB | 〜 70B (FP16) / 100B+ | ◎◎ | LLM 推論サーバ寄り |

macOS は Unified Memory の約 75% を GPU 側（≒ LLM 推論側）に割り当てる挙動が知られており、48GB 機なら理論上 36GB をモデルに使えます。残り 25% に OS と Claude Code 環境を押し込む計算なので、48GB 機で 32B Q4（約 20GB）まではいけても、Claude Code を裏で動かしている前提だと 14B クラスを上限と見るのが安全です。

## ベンチの実測：Qwen3 14B MLX が「快適ライン」のスイートスポット

Apple Silicon × ローカルLLM の 2026 年の到達点を、実用シナリオに近い 2 モデルで見ます。MLX（Apple 純正フレームワーク）と llama.cpp の 2 系統で測った値です。

| 構成 | モデル / 量子化 | フレームワーク | 推論速度 |
|---|---|---|---|
| M4 16GB（Air） | Llama 3.2 3B Q4 | Ollama (llama.cpp) | 約 32 tok/s |
| M4 24GB（Air） | Llama 3.1 8B Q4 | Ollama | 約 16 tok/s |
| M4 Pro 48GB | Qwen3 14B MLX | MLX | 約 11.5 tok/s |
| M4 Pro 48GB | Qwen3 14B Q4 | Ollama | 約 9.2 tok/s |
| M4 Max 64GB | Qwen2.5 32B Q4 | Ollama | 約 8.0 tok/s |
| M4 Max 128GB | Llama 3.3 70B Q4 | Ollama | 約 6.5 tok/s |
| M3 Ultra 256GB | Llama 3.3 70B FP16 | MLX | 約 12 tok/s |

人間が読み流す速度は概ね 8〜10 tok/s。**Qwen3 14B を M4 Pro 48GB + MLX で回したときの 11.5 tok/s が「思考の速度に追いつく快適ライン」のスイートスポットで、ここを境にローカル LLM が "実験用具" から "日常の相棒" に変わります。** llama.cpp 系より MLX のほうが 20〜30% 速いのは、Apple Silicon の AMX (Apple Matrix coprocessor) 命令を MLX が活用しているためです。

「[ローカルLLMを動かすPCの最低スペック 2026年版：Llama 3.3 70B が動くまで](/blog/local-llm-pc-spec-2026/)」では x86 + NVIDIA 系の VRAM 要件を整理していますが、Mac は同じモデルを「VRAM 個別ではなく Unified Memory から削り出す」だけ判断軸が変わります。

## メモリ不足で起きる「スワップ崩壊」現象

Apple Silicon は仮想メモリで SSD を Swap として使えますが、LLM 推論でこれが発生すると速度が一気に崩れます。32B クラスのモデルを M4 Pro 24GB 機にロードしようとした際の実測例です。

| ロード方法 | 状態 | 推論速度 |
|---|---|---|
| Q4（理論 20GB） | UM に乗る | 約 6 tok/s |
| Q5（理論 24GB） | 一部 Swap | 約 1.8 tok/s |
| Q8（理論 38GB） | ほぼ全部 Swap | **約 0.28 tok/s** |

理論値で 10 tok/s 出るはずのモデルが、Swap に落ちた瞬間に 0.28 tok/s（理論の 1/35）まで崩壊します。SSD は NVMe Gen4 でも 7GB/s 級で、Unified Memory（M4 Pro で 273GB/s、M4 Max で 410〜546GB/s）に対して 1/40〜1/80 の帯域しかないので、推論の各ステップでモデル重みを読み直すような挙動になり、実質止まったように見えます。

**「ギリギリ載るかな？」のメモリ容量で構成を組むのは Mac で最もやってはいけないこと**で、必ず「使いたいモデルの実効サイズ + Claude Code 環境 16GB + OS 4GB」を上回る容量を取る必要があります。

## Claude Code + ローカルLLM のハイブリッド運用

2026 年に入って広がってきたのが、Claude Code をクラウドの主力にしつつ、Ollama や LM Studio をローカルで立てて Anthropic 互換 API として横に置く構成です。`claude-code-router` 系のツールを挟むと、ファイル要約・テスト生成・コミットメッセージ作成のような「小回り系」だけローカルに振り、設計や難しいリファクタは Claude Code 本体（クラウド）に投げる、という分業ができます。

| タスク | 振り先 | 想定モデル |
|---|---|---|
| 設計・難リファクタ | Claude Code（クラウド） | Sonnet 4.6 / Opus 4.7 |
| ファイル要約・小修正 | ローカル | Qwen3 14B MLX |
| コミットメッセージ生成 | ローカル | Llama 3.1 8B Q4 |
| インラインコメント補完 | ローカル | DeepSeek Coder 6.7B |

この構成だと「Claude Code の従量課金を月数千円に抑えつつ、24/7 のコード補完はオフラインで回す」が両立するので、M4 Pro 48GB クラスを買って一気にハイブリッドに行く人がじわじわ増えています。Ollama を Anthropic 互換 API として晒すサンプル構成は、最近の OSS 実装でほぼ確立済みです。

## Mシリーズ別の推奨構成ライン

ここまでを 4 つのプリセットに整理します。

### 入門：Claude Code はクラウド利用、ローカル LLM は実験程度

| 項目 | 構成 |
|---|---|
| 機種 | MacBook Air M4 / iMac M4 |
| メモリ | 16 GB（Claude Code のみ） / 24 GB（軽量 LLM も） |
| 用途 | クラウドAI 主体、3B〜8B のローカル LLM を時々試す |
| 価格目安 | 16〜22 万円 |

[MacBook Air M4 を Amazon で見る](https://www.amazon.co.jp/s?k=MacBook+Air+M4)

### 実用：Claude Code + 中規模ローカル併用（おすすめの中心点）

| 項目 | 構成 |
|---|---|
| 機種 | MacBook Pro 14" M4 Pro / Mac mini M4 Pro |
| メモリ | 48 GB |
| 用途 | Claude Code 常駐 + Qwen3 14B MLX を 11.5 tok/s で日常運用 |
| 価格目安 | 36〜44 万円 |

このラインが 2026 年に「Mac × AI 開発」のスイートスポットになっており、本記事の最推奨構成です。

[MacBook Pro 14" M4 Pro を Amazon で見る](https://www.amazon.co.jp/s?k=MacBook+Pro+14+M4+Pro)

### フル：32〜70B クラスを常時手元で

| 項目 | 構成 |
|---|---|
| 機種 | MacBook Pro 16" M4 Max / Mac Studio M4 Max |
| メモリ | 64〜128 GB |
| 用途 | Qwen2.5 32B Q4 を 8 tok/s、Llama 3.3 70B Q4 を 6.5 tok/s |
| 価格目安 | 60〜95 万円 |

### サーバ寄り：70B FP16 / 100B+ クラスを 1 台で

| 項目 | 構成 |
|---|---|
| 機種 | Mac Studio M3 Ultra |
| メモリ | 256〜512 GB |
| 用途 | Llama 3.3 70B FP16、DeepSeek-V3 などの 100B+ |
| 価格目安 | 110〜180 万円 |

Mac Studio M3 Ultra と NVIDIA GPU でどちらを取るかは「[Apple Silicon の Unified Memory と NVIDIA VRAM、ローカルLLM では何が違うのか 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」で構造から比較しています。**1 台で 100B+ を回したいなら M3 Ultra、推論速度や学習を取るなら NVIDIA** が現状の結論です。

## MLX と llama.cpp、Mac で使うのはどちらか

2026 年 5 月時点では、Mac でローカル LLM を回すなら **MLX 優先、対応モデルが無いときだけ llama.cpp** がほぼコンセンサスです。

- MLX：Apple 純正、AMX 命令を活用、Q4 / Q8 / FP16 で 20〜30% 速い、対応モデルは公式 + コミュニティで急速に増加中
- llama.cpp（Ollama / LM Studio が内部で使う）：汎用、対応モデル数は最多、量子化形式（GGUF）が豊富

MLX のモデル変換は Hugging Face の `mlx-community` org にプリビルドが大量にあり、Qwen3 / Llama 3.3 / Gemma 2 / Phi-4 などの主要モデルはほぼ揃っています。LM Studio もバージョン 0.3 以降で MLX バックエンドを標準サポートしたので、GUI で MLX を回すハードルは下がりました。

## まとめ：2026 年 5 月時点の Mac × AI 開発の現実解

- Claude Code 単体なら 16GB Air でも動くが、リポが大きくなると 24GB 以上を勧める
- ローカル LLM を併用するなら **M4 Pro 48GB が中央値の正解**、Qwen3 14B MLX で 11.5 tok/s
- 32B〜70B を常時手元なら M4 Max 64〜128GB、100B+ なら M3 Ultra
- **「ギリギリ載る」構成は絶対に避ける**、Swap に落ちると速度は 1/30〜1/40 に崩壊
- MLX 優先、対応モデルが無いときだけ llama.cpp（Ollama）

クラウドの Claude Code とローカル LLM を併走させる時代がいよいよ普通になってきました。MacBook Pro M4 Pro 48GB は、その流れの中央にある「ちょうどいい一台」です。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [Apple Silicon Mac の選び方ガイド 2026年版（MacBook Air / Pro / Mac Studio / iMac × 用途別）](/blog/apple-silicon-mac-buying-guide-2026/) — Mac ライン全体の用途別整理
- [Apple Silicon の Unified Memory と NVIDIA VRAM、ローカルLLM では何が違うのか 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/) — Mac と NVIDIA、構造の違い
- [ローカルLLMを動かすPCの最低スペック 2026年版：Llama 3.3 70B が動くまで](/blog/local-llm-pc-spec-2026/) — x86 + NVIDIA 側の VRAM 要件
