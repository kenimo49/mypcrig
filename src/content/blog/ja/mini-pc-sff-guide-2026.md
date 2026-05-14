---
title: "ミニPC / SFF（小型）PC 選び方ガイド 2026年版 — Strix Halo / Ryzen AI MAX+ 395 でローカルLLM が動く時代"
description: "Ryzen AI MAX+ 395（Strix Halo）と統合 GPU + 最大 128GB Unified Memory の登場で、ミニPC は「サブ機」から「メイン候補」に変わりました。MS-S1 Max / BD395i MAX / ASUS Strix Halo 機を軸に、用途別の選び方と落とし穴を整理します。"
date: 2026-05-14
lang: ja
category: guide
section: desktop
tags: ["ミニPC", "SFF PC", "Strix Halo", "Ryzen AI MAX+ 395", "MINISFORUM MS-S1 Max", "ローカルLLM", "Intel N100"]
featured: false
og_image: "/images/blog/mini-pc-sff-guide-2026/cover.png"
affiliate_disclosure: true
---

![ミニPC / SFF 選び 2026：Strix Halo / N100 / Ryzen 8000G APU 用途別マップ](/images/blog/mini-pc-sff-guide-2026/cover.png)

**結論：2026 年のミニPC は「Strix Halo を載せた MS-S1 Max クラスなら 70B 級ローカル LLM が動く」「N100 / N305 系なら 4 万円台で実用デスクトップが組める」と、用途で世界が完全に分かれています。サブ機の発想は捨ててください。今のミニPC は構成次第で RTX 5090 マシン並みの VRAM 容量を確保できます。**

「ミニPC ＝ 性能が低いサブ機」と思っていると、Ryzen AI MAX+ 395（Strix Halo）の登場を見落とします。Strix Halo は 16 コア Zen 5 ＋ 統合 Radeon 8060S ＋ 最大 128GB LPDDR5X という構成で、**iGPU に最大 96GB を VRAM として割り当てられる**。これは RTX 5090（32GB）を VRAM 容量だけで超える数字です。本記事では Strix Halo / Intel N シリーズ / Ryzen 8000G APU の 3 系統を軸に、用途別のミニPC 選びを整理します。

## ミニPC は 3 系統に分かれる

2026 年のミニPC 市場は、用途で大きく次の 3 つに分かれます。

| 系統 | 代表チップ | 価格帯 | 主な用途 |
|---|---|---|---|
| ハイエンド | Ryzen AI MAX+ 395（Strix Halo） | 30〜50 万円 | AI 開発、ローカル LLM、Mac Studio 代替 |
| 一般デスクトップ | Intel N100 / N305 / Core Ultra 7 | 4〜15 万円 | オフィス、動画視聴、軽い開発 |
| 軽ゲーミング | AMD Ryzen 8000G APU、Ryzen 9 7945HX | 8〜20 万円 | エミュレーション、ライトな 1080p ゲーミング |

ここを混同して「ミニPC が欲しい」と検索を始めると、N100 を勧める記事と Strix Halo を勧める記事が同列で並んで、選びようがなくなります。先に用途を決めるのが鉄則です。

## Strix Halo / Ryzen AI MAX+ 395 が起こしている地殻変動

CES 2026 で MINISFORUM MS-S1 Max、MINISFORUM BD395i MAX、ASUS の Strix Halo 機が一斉に出てきて、ミニPC 市場の常識が一気に塗り替わりました。Ryzen AI MAX+ 395 の仕様はこうです。

| 項目 | Ryzen AI MAX+ 395（Strix Halo） |
|---|---|
| CPU | Zen 5、16 コア 32 スレッド |
| GPU | Radeon 8060S（40 CU、RDNA 3.5） |
| NPU | XDNA 2、50 TOPS |
| メモリ | LPDDR5X-8000、最大 128GB（オンボード） |
| iGPU 用 VRAM 割当 | 最大 96GB（OS 設定で可変） |
| TDP | 55〜120W（モード可変） |
| メモリ帯域 | 約 256GB/s |

**「iGPU に 96GB の VRAM を割り当てられる」のがこのチップの最大の特徴です。** RTX 5090 の 32GB GDDR7 では VRAM に乗らない Llama 3.3 70B FP16（約 140GB → 量子化で 50GB 級）や DeepSeek-V3 Q4（約 85GB）が、Strix Halo なら 1 機で完結します。

ただし、これには大きなトレードオフがあります。

| 観点 | RTX 5090 | Ryzen AI MAX+ 395 |
|---|---|---|
| 利用可能な VRAM | 32GB | 最大 96GB |
| メモリ帯域 | 1,790 GB/s（GDDR7） | 256 GB/s（LPDDR5X） |
| 70B Q4 トークン速度 | 約 35〜45 tok/s | 約 12〜18 tok/s |
| 消費電力（システム） | 約 650W | 約 130W |
| 価格（GPU/CPU 単体換算） | 約 55 万円 | チップ約 12 万円相当 |

**「容量で勝つが、速度では負ける」** という構図です。RTX 5090 の GDDR7 1.79TB/s に対して、Strix Halo の LPDDR5X 256GB/s は約 1/7。LLM 推論は基本的にメモリ帯域律速なので、トークン速度の差はそのまま体感差として出ます。とはいえ「巨大モデルがそもそも動く」というのは絶対的なメリットで、Mac Studio M3 Ultra と同じ立ち位置の選択肢が x86 側にも生まれた、と捉えるのが正解です。

ローカル LLM 全般のスペック設計は「[ローカルLLMを動かすPCの最低スペック 2026年版：Llama 3.3 70B が動くまで](/blog/local-llm-pc-spec-2026/)」で詳しく扱っています。Mac の Unified Memory との詳細比較は「[Apple Silicon の Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/)」を参照してください。

## Strix Halo 搭載ミニPC 3 機種の比較

2026 年 5 月時点で実際に買える Strix Halo 搭載ミニPC は次の 3 機種が主力です。

| 項目 | MINISFORUM MS-S1 Max | MINISFORUM BD395i MAX | ASUS NUC 15 Pro+（仮称） |
|---|---|---|---|
| 形状 | 完成ミニPC | Mini-ITX マザーボード | 完成ミニPC |
| メモリ | 64GB / 128GB（オンボード） | 64GB / 128GB（オンボード） | 64GB / 128GB |
| ストレージ | M.2 2280 ×2 | M.2 2280 ×2、x16 PCIe Gen4 | M.2 2280 ×2 |
| 外付け GPU | 不可（M.2 経由のみ） | **可能**（PCIe x16 スロット） | 不可 |
| 価格（128GB） | 約 38 万円 | マザボ単体 12 万円 + 別途 | 約 42 万円 |
| 特徴 | 出荷量が多い、サポート安定 | 自作派向け、GPU 増設可 | 法人サポート、保証手厚い |

注目すべきは MINISFORUM BD395i MAX で、これは Strix Halo を載せた **Mini-ITX マザーボード単体** として売られており、PCIe x16 スロットを持っているため後から RTX 4060 / 5060 のような外付け GPU を追加できます。「Strix Halo の 96GB iGPU-VRAM で巨大 LLM を走らせつつ、ゲームでは外付け GPU を使う」というハイブリッド構成が組めるのが大きな利点です。完成品で確実性を取るなら MS-S1 Max、自由度を取るなら BD395i MAX、という選び分けになります。

[MINISFORUM 公式サイトを見る](https://www.minisforum.jp/)

## Intel N100 / N305 系：4 万円台で実用デスクトップ

ハイエンドの対極にあるのが、Intel N100 / N305 系の安価ミニPC です。

| チップ | 主な用途 | 価格帯 | 代表機種 |
|---|---|---|---|
| Intel N100（4 コア） | オフィス、Web、4K 動画視聴 | 3〜5 万円 | BMAX、Beelink S12 Pro |
| Intel N200（4 コア、高クロック）| 上記 + 軽い開発 | 5〜7 万円 | GMKtec NucBox |
| Intel N305（8 コア） | NAS、軽サーバー、開発 | 7〜10 万円 | MINISFORUM UN305 |
| Core Ultra 5/7（HX 系） | クリエイティブ作業 | 12〜18 万円 | Beelink SER9、GMKtec K10 |

N100 / N305 系のミニPC は、**「リモートワーク用の Web 会議＋ Office 専用機」「リビング用の動画視聴専用機」「自宅 NAS のフロントエンド」** といった用途に絶妙にハマります。Word / Excel、Zoom、ブラウザ 20 タブ、YouTube 4K 視聴くらいなら N100 で完全に足りる時代になりました。

注意点は **メモリスロット数とストレージ拡張性**。N100 系は SO-DIMM 1 スロットのみのモデルがあり、後からメモリ増設できない場合があります。購入前に「メモリスロット数」「M.2 スロット数」「最大メモリ容量」の 3 点を必ず確認してください。

[Beelink S12 Pro N100 を Amazon で見る](https://www.amazon.co.jp/s?k=Beelink+S12+Pro+N100)

## Ryzen 8000G APU：軽ゲーミング & エミュレーション特化

AMD Ryzen 8000G APU シリーズ（Ryzen 5 8600G、Ryzen 7 8700G）を載せたミニPC は、内蔵 Radeon 780M / 760M の性能が高く、1080p 低設定のゲームや PS2 / Switch エミュレーションが快適に動きます。

代表機種は MINISFORUM HX95G、Beelink SER8 など。価格帯は 8〜15 万円で、N100 系より明確に高いものの、Strix Halo まで予算が出ない層の選択肢として機能します。Ryzen AI MAX+ 395（Strix Halo）の登場で立ち位置が中途半端になりつつありますが、「ライトゲーミング＋普段使い」を 10 万円前後に収めたいならまだ現役です。

## ミニPC で外しやすい 4 つの落とし穴

ミニPC を選ぶときに、デスクトップ感覚で見落とすポイントが 4 つあります。

1. **メモリ非交換のリスク**：Strix Halo 機（MS-S1 Max など）はメモリがオンボード（マザーボード直付け）で、後から増設・交換できません。最初から最大容量（128GB）で買うかどうかを決め切る必要があります
2. **冷却容量**：Strix Halo 機は実測 70〜90W の消費電力で、コンパクト筐体の中で熱がこもります。長時間 LLM 推論を回すと CPU/GPU 温度が 85〜95℃ に達する事例あり。机の上で空気が流れる位置に置くのが必須
3. **電源容量・ACアダプタの仕様**：N100 系は 65W AC アダプタが多く、CPU 増設や USB ハブ電源が制限される。Strix Halo 機は 280W〜330W アダプタが必要で、想像より大きな AC アダプタになる
4. **M.2 スロット数と Gen 世代**：1 スロットしかない機種は SSD 増設の余地がゼロ。Gen5 対応かも要確認。詳細は「[PCIe 5.0 NVMe SSD は本当に必要か 2026年版](/blog/pcie-gen5-vs-gen4-nvme-ssd-2026/)」で扱っています

## 推奨構成 3 ライン（2026 年 5 月時点）

### 普段使い：Intel N100 系（4〜6 万円）

| 用途 | 構成 |
|---|---|
| リビング用、動画視聴専用機 | Beelink S12 Pro（N100、16GB、500GB SSD） |
| Office メイン、リモートワーク | GMKtec NucBox（N305、16GB、1TB SSD） |
| 自宅 NAS / 軽サーバー | MINISFORUM UN305（N305、16GB、Proxmox 用） |

「サブ機」「省スペース機」というミニPC 本来の用途。10 万円以下で完結する手軽さが最大の利点です。

### クリエイティブ・ライトゲーミング：Ryzen 8000G / Core Ultra 系（10〜18 万円）

| 用途 | 構成 |
|---|---|
| 写真・軽い動画編集 + 普段使い | Beelink SER8（Ryzen 7 8845HS、32GB、1TB） |
| 1080p ゲーミング + 開発 | MINISFORUM HX95G（Ryzen 9 7945HX、32GB、1TB） |

ノートPC のクリエイティブモデルを買うか、このクラスのミニPC を買うかで迷うラインです。デスク作業中心ならミニPC のほうが価格対性能で有利になります。

### AI 開発・ローカル LLM：Strix Halo 系（30〜50 万円）

| 用途 | 構成 |
|---|---|
| ローカル LLM メイン機（70B〜120B 級） | MINISFORUM MS-S1 Max（128GB、2TB） |
| 自作派、GPU も追加したい | MINISFORUM BD395i MAX + Mini-ITX ケース + RTX 5060 |
| Mac Studio 代替（Linux で運用） | ASUS NUC 15 Pro+ Strix Halo 機 |

ローカル LLM 用途では Mac Studio M3 Ultra 192GB（約 90 万円）と直接競合します。Mac は速度・静音性で勝り、Strix Halo はコストと x86/Linux 開発環境で勝る、という棲み分けです。

## どれを選ぶか：用途から逆算する

| 用途 | 推奨ライン |
|---|---|
| Word / Excel / Web / 動画視聴のみ | Intel N100 系（4〜5 万円） |
| Office + 軽い開発 + リモートワーク | Intel N305 / Core Ultra 5 系（7〜10 万円） |
| 写真編集、1080p ゲーミング | Ryzen 8000G / Core Ultra 7 系（12〜18 万円） |
| ローカル LLM（30B 以下） | Ryzen 8000G + 外付け eGPU |
| ローカル LLM（70B〜120B）+ AI 開発 | **Strix Halo 系（MS-S1 Max / BD395i MAX）** |
| 静音 + 巨大モデル運用 | Mac Studio M3 Ultra 系 |

「ミニPC で何ができるか」は 2026 年に大きく変わりました。N100 系で完結する用途と、Strix Halo でしか実現できない用途。両方を「ミニPC」と呼ぶ時代になったので、購入前に自分の用途がどのラインに乗るかを切り分けるのが選び方の本質です。

CPU 単体のアーキテクチャ比較は「[Intel Core Ultra vs Ryzen 9000 — 2026年のCPU選び](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/)」を参照してください。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [ローカルLLMを動かすPCの最低スペック 2026年版：Llama 3.3 70B が動くまで](/blog/local-llm-pc-spec-2026/) — Strix Halo がカバーするモデルサイズ帯
- [Apple Silicon の Unified Memory vs NVIDIA VRAM 2026年版](/blog/unified-memory-vs-nvidia-vram-llm-2026/) — Strix Halo の iGPU-VRAM の位置付け
- [Intel Core Ultra vs Ryzen 9000 — 2026年のCPU選び](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/) — ミニPC 内蔵 CPU の系譜
