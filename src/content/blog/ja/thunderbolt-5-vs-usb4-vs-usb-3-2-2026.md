---
title: "Thunderbolt 5 / USB4 / USB 3.2 の違い 2026年版：USB-C 端子の見た目だけでは分からないスペック早見表"
description: "Thunderbolt 5 は 80Gbps（バンドブースト時 120Gbps）、USB4 は 20-40Gbps、USB 3.2 は 5-20Gbps。端子は同じ USB-C でもケーブル次第で 1/24 まで速度差が出ます。eGPU、8K ディスプレイ、外付け Gen5 SSD で「どの規格までが必要か」を 2026 年版で整理します。"
date: 2026-05-15
lang: ja
category: comparison
section: column
tags: ["Thunderbolt 5", "USB4", "USB 3.2", "USB-C", "eGPU", "ドッキングステーション", "8Kディスプレイ", "外付けSSD"]
featured: false
og_image: "/images/blog/thunderbolt-5-vs-usb4-vs-usb-3-2-2026/cover.png"
affiliate_disclosure: true
---

![Thunderbolt 5 / USB4 / USB 3.2 違い 2026:同じ USB-C 端子でも 5Gbps から 120Gbps まで 24 倍差が出るスペック早見表](/images/blog/thunderbolt-5-vs-usb4-vs-usb-3-2-2026/cover.png)

**結論：端子の形が USB-C でも、中身は 5Gbps から 120Gbps まで実に 24 倍の差があります。eGPU / 8K HDR / 外付け Gen5 SSD なら Thunderbolt 5 必須、4K 60Hz モニタと普通の外付け SSD なら USB4、キーボード・マウス・有線 LAN なら USB 3.2 で十分。「対応していれば速い」とは限らないので、規格・ケーブル・実装の 3 点を必ず確認する必要があります。**

USB-C 端子の規格は 2026 年に入って完全に「見た目では区別できない」状態になりました。MacBook Pro M4 Max には Thunderbolt 5 が搭載され、Razer / OWC / Kensington から TB5 ドックが揃い、Windows ノート側でも Lunar Lake / Arrow Lake / Strix Halo 機が Thunderbolt 5 を載せ始めています。本記事では Thunderbolt 5 / USB4 v2 / USB4 / USB 3.2 の 4 規格を、用途別の判断軸とスペック早見表で 2026 年版に整理します。

## まずスペック早見表を一枚で

ブックマーク用の早見表から始めます。

| 規格 | 最大速度 | 給電 | ディスプレイ | 一貫性 | 後方互換 |
|---|---|---|---|---|---|
| **Thunderbolt 5** | 80 Gbps（バンドブースト時 120 Gbps）| 140〜240W 必須 | 8K / 高Hz 複数 | **仕様で固定** | TB3/4/USB4 と互換 |
| USB4 v2.0 | 40〜80 Gbps（実装依存）| 7.5W〜（任意）| 任意 | バラバラ | USB4 と互換 |
| USB4 | 20〜40 Gbps（実装依存）| 7.5W〜（任意）| 任意 | バラバラ | USB 3.2 と互換 |
| USB 3.2 Gen 2x2 | 20 Gbps | 任意 | DP Alt 任意 | バラバラ | USB 3.2 Gen 2 と互換 |
| USB 3.2 Gen 2 | 10 Gbps | 任意 | DP Alt 任意 | バラバラ | USB 3.2 Gen 1 と互換 |
| USB 3.2 Gen 1 | 5 Gbps | 任意 | DP Alt 任意 | バラバラ | USB 2.0 と互換 |

Thunderbolt 5 だけが「最大速度・最低給電・最大ディスプレイ出力がすべて仕様で固定されている」のがポイントです。USB4 や USB 3.2 は実装側の自由度が高く、ロゴ通りに買っても実際の速度や給電仕様はメーカー次第で分散します。**「USB-C なら全部同じでしょ」が最大の罠** なのは、この一貫性の差です。

## Thunderbolt 5：80Gbps を「常に出る」と保証する規格

Thunderbolt 5（2024 年実装、2025 年から本格普及）は Intel が策定して USB4 v2 に Thunderbolt 仕様を被せた規格です。

- **双方向 80 Gbps**、ディスプレイ転送時は片方向 120 Gbps（Bandwidth Boost）
- 給電は **140W 必須、最大 240W**
- DisplayPort 2.1 を内包、**8K 60Hz HDR / 4K 240Hz が複数本** いける
- **PCIe Gen4 x4 相当（32Gbps）の外部接続**：eGPU / 外付け Gen5 SSD で実用化
- Thunderbolt 3 / 4 / USB4 ケーブルと後方互換（速度は下のほうに合わせる）

「仕様で全部固定」が Thunderbolt のいつもの強みで、TB5 のロゴが付いていれば 80Gbps と 140W 給電が保証されます。

### Thunderbolt 5 が本領発揮する 3 用途

1. **eGPU**：TB4 の 40Gbps では PCIe Gen3 x4 相当（28Gbps 程度）が天井で、RTX 4090 / 5090 級では 30〜40% の性能ロス。TB5 では PCIe Gen4 x4 相当（32Gbps）まで広がり、ロスが 10〜15% に縮小。Razer Core X V2 / OWC Mercury Helios 3 が対応
2. **8K HDR / 4K 240Hz 複数ディスプレイ**：DisplayPort 2.1 を内包、UHBR20 で 8K 60Hz HDR が 1 本のケーブルで送れる
3. **外付け Gen5 SSD**：内蔵 Gen5 SSD の 14GB/s には届かないが、外付けで 6GB/s 級。動画編集の外部ストレージとして実用域に入った

### Thunderbolt 5 搭載機（2026 年 5 月時点）

- Mac：MacBook Pro 14"/16" M4 Pro / M4 Max、Mac Studio M4 Max / M3 Ultra
- Windows ノート：Lunar Lake / Arrow Lake-H 系の上位機、Strix Halo（Ryzen AI Max+）の一部
- Windows デスクトップ：マザーボードに後付け（GIGABYTE / ASRock の TB5 拡張カード）

## USB4 と USB4 v2：仕様は緩い、実装は様々

USB4 は 2019 年策定、USB4 v2 は 2022 年策定の比較的新しい規格です。Thunderbolt 3 の仕様を USB Implementers Forum が継承して標準化したものですが、Thunderbolt と違って **多くの項目が「任意」** になっており、ロゴだけでは中身が決まりません。

| 項目 | USB4（必須） | USB4 v2（必須） | 実装で異なる |
|---|---|---|---|
| 最大速度 | 20Gbps | 80Gbps | 40 / 80 / 120 Gbps |
| 給電 | USB PD 対応のみ | USB PD 対応のみ | 7.5W 〜 240W |
| DisplayPort Alt Mode | 任意 | 任意 | DP 1.4 / 2.0 / 2.1 |
| PCIe トンネリング | 任意 | 任意 | あり / なし |

「USB4 ロゴが付いているのに 20Gbps しか出ない」「USB4 でも eGPU が動かない（PCIe トンネリング非対応）」「USB4 でも 100W 給電してくれない」が普通に起こります。仕様としては全部「規格内」です。

USB4 機を選ぶときは、メーカー仕様欄に **「USB4 40Gbps、PD 100W、DisplayPort 1.4 Alt Mode、PCIe トンネリング対応」** のように個別項目で書かれているかを確認するのが安全です。「USB4 ポート搭載」だけしか書かれていない機種は地雷の可能性があります。

## USB 3.2：4 系統の罠（さらに USB 3.0 / 3.1 とは違うのか問題）

USB 3.2 はおそらく USB 規格史上もっとも分かりにくい命名で、同じ名前のままで 4 種類に枝分かれしています。

| 名前 | 旧称 | 速度 | レーン構成 |
|---|---|---|---|
| USB 3.2 Gen 1 | USB 3.0 | 5 Gbps | 1 レーン × 5Gbps |
| USB 3.2 Gen 1x2 | （新規）| 10 Gbps | 2 レーン × 5Gbps |
| USB 3.2 Gen 2 | USB 3.1 Gen 2 | 10 Gbps | 1 レーン × 10Gbps |
| USB 3.2 Gen 2x2 | （新規）| 20 Gbps | 2 レーン × 10Gbps |

旧 USB 3.0（5Gbps）は今や USB 3.2 Gen 1 と呼ばれ、最新の USB 3.2 Gen 2x2 とは速度に 4 倍差があるのに、ロゴ表記は USB Implementers Forum が定めた SuperSpeed USB 5Gbps / 10Gbps / 20Gbps の系列に切り替わっています。**メーカーが正直に Gbps 値を表記しているかどうかが分かりやすさの分かれ目** で、「USB 3.2 対応」とだけ書かれている製品は 5Gbps の可能性が十分あります。

実用上は、

- 5 Gbps：キーボード・マウス・有線 LAN・USB メモリ・SATA SSD 外付け
- 10 Gbps：NVMe SSD 外付けの実用ライン（Gen3 SSD 程度）
- 20 Gbps：NVMe SSD 外付けの上限（Gen4 SSD でも頭打ち）

を覚えておけば困りません。

## ケーブルが規格と一致していないと、最高速度は出ない

ケーブルは規格別に専用品が必要です。同じ USB-C コネクタ形状でも、内部の信号配線が違うので、TB5 ポート + 古い USB 3.2 ケーブルでは 5〜10 Gbps しか出ません。

| 速度クラス | パッシブケーブル長 | アクティブ／光ケーブル |
|---|---|---|
| 5〜10 Gbps（USB 3.2） | 〜2m | — |
| 20 Gbps（USB 3.2 Gen 2x2） | 〜1m | アクティブで〜3m |
| 40 Gbps（USB4 / Thunderbolt 3/4） | 〜0.8m | アクティブで〜2m、光ファイバで〜50m |
| 80 Gbps（Thunderbolt 5 / USB4 v2） | 〜1m（パッシブ）| アクティブ必須、光ファイバ品が主流 |
| 120 Gbps（Thunderbolt 5 ブースト） | 〜1m | アクティブ品のみ |

Thunderbolt 5 のフル 80Gbps を 1m 超で引き回したいなら、**Apple や OWC の Thunderbolt 5 専用ケーブル（5,000〜10,000 円）** を別買いする必要があります。ケーブルをケチると規格通りの速度は出ないので、せっかくの TB5 機を活かしきれません。

## eGPU を本気でやるなら：TB4 と TB5 で何が違うか

eGPU は Thunderbolt 5 の登場で実用度が一段階上がりました。

| 構成 | 帯域上限 | RTX 4090 / 5090 のロス |
|---|---|---|
| TB3（40Gbps）+ eGPU | PCIe Gen3 x4 ≒ 28Gbps | 40〜50% |
| TB4（40Gbps）+ eGPU | PCIe Gen3 x4 ≒ 28Gbps | 35〜45% |
| **TB5（80Gbps）+ eGPU** | PCIe Gen4 x4 ≒ 32Gbps | **10〜15%** |
| OCuLink + eGPU | PCIe Gen4 x4 ≒ 64Gbps | 5〜10%（最速）|

OCuLink（オクリンク）は GPD WIN Max / Minisforum 系の一部ノートに載っている直結 PCIe ポートで、まだ普及していませんが速度的にはトップ。汎用性なら Thunderbolt 5、コストなら Thunderbolt 4、最速なら OCuLink、というのが 2026 年の eGPU 構成の整理です。

GPU 単体の選び方は「[RTX 5090 / RTX 4090 / RTX PRO 6000 Blackwell：AI開発GPU比較 2026年版](/blog/rtx-5090-vs-4090-vs-pro-6000-ai-2026/)」を参照してください。

## 用途別：どの規格まで必要か（決定樹）

| 用途 | 必要規格 | 理由 |
|---|---|---|
| キーボード・マウス・有線 LAN | USB 3.2 Gen 1（5Gbps）| 帯域は余裕、転送速度は無関係 |
| USB メモリ・SATA SSD 外付け | USB 3.2 Gen 2（10Gbps）| Gen2 で SATA SSD は飽和 |
| 1〜2TB の NVMe Gen3 SSD 外付け | USB 3.2 Gen 2x2（20Gbps）| ここから「速い外付け SSD」 |
| 4K 60Hz モニタ 1〜2 枚 + 一般作業 | USB4（40Gbps）| 余裕 |
| 動画編集 + 外付け Gen4 SSD（プレビュー）| USB4 v2（80Gbps）| Gen4 SSD 7GB/s を活かせる |
| **eGPU（RTX 4090〜5090 級）** | **Thunderbolt 5** | TB4 比でロスが 30 ポイント減 |
| **8K 60Hz HDR モニタ** | **Thunderbolt 5** | DisplayPort 2.1 UHBR20 必須 |
| **動画編集 + 外付け Gen5 SSD** | **Thunderbolt 5** | 6GB/s 級の外部ストレージ |
| 4K 240Hz / 5K2K 高 Hz 複数 | Thunderbolt 5 | TB4 では帯域不足 |

「USB 3.2 で十分」「USB4 で十分」「TB5 が要る」のラインを把握しておくと、ノート PC を選ぶときの判断がぶれません。

## ドッキングステーションを買うときの注意

ドッキングステーションは規格表記だけ見て買うと、家に帰ってから「あれ、4K モニタが 30Hz でしか出ない」「100W 充電しない」となりがちです。

- **USB4 / TB4 ドック**：4K 60Hz × 1〜2、PD 60〜100W、SD カードリーダー、有線 LAN、一般用途の標準
- **Thunderbolt 5 ドック**：4K 240Hz / 8K 60Hz、PD 140〜180W、Gen4 SSD 用 M.2 スロット内蔵モデルもあり、価格 4〜8 万円
- **USB 3.2 ハブ**：給電なしの USB ポート増設用、ディスプレイ出力は DP Alt 経由で 4K 60Hz × 1 が限度

[Anker PowerExpand 7-in-1 USB-C ハブを Amazon で見る](https://www.amazon.co.jp/s?k=Anker+PowerExpand+7-in-1+USB-C)

ノート PC 側がそもそも TB5 / USB4 / USB 3.2 のどれを実装しているかで、選ぶドックが決まります。「ノート側 USB4 + ドック側 TB5」では TB5 側にダウンして USB4 として動くので、過剰投資になります。

## まとめ：USB-C を 2026 年に正しく読むために

- **同じ USB-C 端子でも、規格次第で速度差は最大 24 倍（5Gbps 〜 120Gbps）**
- Thunderbolt 5 だけは「仕様で全部固定」、それ以外（USB4 / USB 3.2）は実装でバラつく
- ロゴだけでは判断できず、メーカー仕様の **Gbps / PD / DP / PCIe** 4 項目を確認
- 用途に対して規格が過剰でも金の無駄、過小では性能が出ない
- ケーブルが規格と一致していないと最大速度は出ない（とくに 40Gbps 以上）

eGPU / 8K HDR / 外付け Gen5 SSD のどれかに本気で踏み込むなら Thunderbolt 5、それ以外は USB4 か USB 3.2 で十分、というのが 2026 年の現実的な切り分けです。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match/)

## 関連記事

- [PCIe 5.0 NVMe SSD は本当に必要か 2026年版：Gen5 / Gen4 / Gen3 の違いと体感差](/blog/pcie-gen5-vs-gen4-nvme-ssd-2026/)。内蔵 SSD 側の規格と外部 I/O の関係
- [マザーボードチップセットの選び方 2026年版](/blog/motherboard-chipset-comparison-2026/)。Z890 / X870 の Thunderbolt / USB4 対応の違い
- [クリエイターノートPCの選び方ガイド 2026年版](/blog/creator-laptop-guide-2026/)。TB5 / USB4 を活かすノート構成
