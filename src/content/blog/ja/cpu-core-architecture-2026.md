---
title: "CPUコア数とP-core/E-core/Zen 5 CCDの違い 2026年版:Arrow Lake / Zen 5 で「コア数の見方」はどう変わったか"
description: "Intel Arrow Lake(P-core + E-core)と AMD Zen 5(全コア対称 + CCD分割)で、CPUの「コア数」の意味がどう違うのかを解説。AI開発・ゲーミング・配信で本当に効くコア構成と、コア数の正しい読み方を整理します。"
date: 2026-05-13
lang: ja
category: comparison
section: column
tags: ["CPU", "Pコア", "Eコア", "Arrow Lake", "Zen 5", "CCD", "X3D"]
featured: false
og_image: "/images/blog/cpu-core-architecture-2026/cover.png"
affiliate_disclosure: true
---

![CPUコア数の読み方 2026:P-core / E-core と Zen 5 CCDで「コア数」の意味が違う](/images/blog/cpu-core-architecture-2026/cover.png)

**結論:CPUのコア数は数字だけ見ても意味を読めない。Intel Arrow Lake は P-core + E-core の混在構成、AMD Zen 5 は CCD(Core Complex Die)で分割された対称コア構成という、まったく違う設計思想に変わっている。ゲーミングは6-8コアあれば十分、配信は E-core / 多コアが効く、AI ローカル推論はGPU依存でCPU 6-8コアで足りる、Web開発は線形にコア数が効く。用途で「効くコア」が違うので、24コアの上位モデルが万能ではない。**

「Core Ultra 9 285K は24コア、Ryzen 9 9950X は16コア。Intelの方が多いから速い」。これは2026年の現実ではほぼ誤りです。両社のコア設計思想は完全に分かれており、コア数を単純比較するだけでは性能が判定できません。以下、Arrow Lake と Zen 5 のコア構造を順に整理し、用途別に「本当に効くコア」とは何かを見ていきます。

## まずは2026年のフラッグシップを並べる

| モデル | 総コア数 | P-core / E-core | スレッド数 | HT/SMT | ベース/ブースト |
|---|---|---|---|---|---|
| Core Ultra 9 285K(Arrow Lake) | 24 | 8P + 16E | 24 | HT廃止 | P 3.7 / 5.7GHz |
| Core Ultra 7 265K(Arrow Lake) | 20 | 8P + 12E | 20 | HT廃止 | P 3.9 / 5.5GHz |
| Core Ultra 5 245K(Arrow Lake) | 14 | 6P + 8E | 14 | HT廃止 | P 4.2 / 5.2GHz |
| Ryzen 9 9950X(Zen 5) | 16 | 16(対称) | 32 | SMTあり | 4.3 / 5.7GHz |
| Ryzen 9 9900X(Zen 5) | 12 | 12(対称) | 24 | SMTあり | 4.4 / 5.6GHz |
| Ryzen 7 9800X3D(Zen 5 + 3D V-Cache) | 8 | 8(対称) | 16 | SMTあり | 4.7 / 5.2GHz |
| Ryzen 7 9700X(Zen 5) | 8 | 8(対称) | 16 | SMTあり | 3.8 / 5.5GHz |

スレッド数の見え方が違うことに注意してください。Arrow Lake は**HyperThreading(HT)を廃止**したのでコア数 = スレッド数。Zen 5 は SMT 維持なのでコア数の2倍がスレッド数です。

## Intel Arrow Lake:P-core + E-core の混合構成

Intel は12th Gen(Alder Lake)以降、「P-core(Performance core)」と「E-core(Efficient core)」の二種類を1つのCPUに混載しています。Arrow Lake はその進化版で、HTを廃止して以下の構成になりました。

### P-core と E-core の役割

| 項目 | P-core(Lion Cove) | E-core(Skymont) |
|---|---|---|
| 設計目標 | 単発処理を最速化 | 並列・バックグラウンド処理を効率良く |
| L1キャッシュ | 80KB | 96KB |
| L2キャッシュ | 3MB / コア | 4MB / 4コアクラスタ共有 |
| クロック | 5.5-5.7GHz | 4.6-4.9GHz |
| IPC | 高 | P-coreの約80%(Skymontで大幅改善) |
| 電力効率(IPCあたり) | 中 | 高 |
| HT/SMT | 廃止 | なし(元から) |

**P-core が「重い1つの処理」を担当し、E-core が「軽い処理を並列に多数」捌く設計**です。OSのスレッドスケジューラ(Windows 11 / Intel Thread Director)が、各スレッドの特性を判定して適切なコアに配置します。

### HT廃止の意味

11世代以前の Intel CPU は1つのP-coreに2スレッドを載せる HyperThreading を持っていました。Arrow Lake で HT を廃止した理由は以下です。

1. **同時実行スレッドが多数のサイドチャネル攻撃(Spectre / MDS系)の温床**になっていた
2. **E-coreが増えてスレッド総数は確保できる**ようになった(16Eで実質16スレッド追加)
3. **HTオーバーヘッド(共有リソースの取り合い)が一部ワークロードで足を引っ張る**

結果、Core Ultra 9 285K のスレッド数は 24(8P + 16E)で、12th-14th Gen の同等モデルより**スレッド数は減ったが、各スレッドの実効性能は上がった**形になりました。

### スケジューラ依存性

P/E混合構成の問題点は、**OSスケジューラの正しさに依存する**ことです。

- Windows 11 + Intel Thread Director:基本的に良好だが、一部の古いゲームやベンチマークでE-coreに重い処理が乗ってしまう事故あり
- Linux:5.18以降で Thread Director サポート。ディストリ・カーネル世代に依存
- 仮想化(VMware/Hyper-V):VM内ではP/E判別が見えないので、ピン留めしない限り E-core に全負荷が乗ることも

「[Intel Core Ultra 200 vs AMD Ryzen 9000](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/)」でも触れていますが、本格的に Linux でAI開発をやる場合、Zen 5 の対称構成のほうがスケジューリングで悩むことが少ないという声があります。

## AMD Zen 5:対称コア + CCD分割

AMD はZen 2(Ryzen 3000)以降、コアを**CCD(Core Complex Die)** という小さなチップに分割し、それを複数組み合わせる「チップレット設計」を採用しています。Zen 5 でこの設計が成熟し、Ryzen 9 9950X は 2 CCD × 8 コア = 16コアの構成です。

### CCD の構造

| 構成 | 1 CCD 構成例 | 2 CCD 構成例 |
|---|---|---|
| 該当モデル | Ryzen 7 9700X / 9800X3D | Ryzen 9 9900X / 9950X |
| CCDあたりコア | 8(対称) | 8(対称、×2 CCD) |
| L3キャッシュ | 32MB / CCD | 32MB × 2 = 64MB(分離) |
| 9800X3Dの3D V-Cache | +64MB(積層) | 該当なし(現状) |
| IOダイ | 1個 | 1個 |
| メモリコントローラ | IOダイに集約 | 同上 |

各CCDは独立した32MB L3キャッシュを持ち、CCD間の通信は**IOダイ(Infinity Fabric)経由**で行われます。これが Zen 5 の特性を決定づける構造です。

### CCDをまたぐ通信遅延

CCD A のコアが CCD B のキャッシュにアクセスする場合、Infinity Fabric を経由するため**70-90ns 程度のレイテンシ**が発生します(同一CCD内の L3 アクセスは 9-15ns)。

このため、**シングルスレッド負荷が高いゲームや CCD をまたぐ並列処理**では遅延がボトルネックになることがあり、Windows Game Bar / AMD のドライバが「ゲームスレッドを1 CCDに固定する」最適化を入れています。

### 3D V-Cache(X3D)の効き方

Ryzen 7 9800X3D は CCD の上に64MB の追加L3キャッシュを積層しており、合計 96MB L3 になります。これが**ゲーミングで非常に効く**のは、ゲームのデータセットがキャッシュに収まりやすくなり、DRAMアクセスが激減するためです。

| ワークロード | 9800X3D vs 9700X(非X3D) | 効き方 |
|---|---|---|
| CS2 / VALORANT / League of Legends | +15-25% fps | 強く効く |
| Cyberpunk 2077 / Hogwarts Legacy | +10-15% fps | 効く |
| Blender / Cinema 4D レンダリング | -2 〜 +3% | ほぼ無影響 |
| ローカルLLM推論(CPU) | +5-10% | 軽く効く |
| Web開発ビルド | -3 〜 +5% | 場合により |

X3D はゲーミング特化と思って正解です。レンダリングや動画書き出しでは効果薄く、価格差(2-3万円)を考えると、ゲーム中心でなければ非X3Dモデルが妥当です。

## 用途別の「効くコア数」早見表

コア数だけで判断せず、用途別に効くコアを整理します。

### ゲーミング

| ゲーム種別 | 効くコア | 必要コア数 | 備考 |
|---|---|---|---|
| FPS(競技系) | P-core / X3D | 6-8 | シングル性能で決まる |
| AAAタイトル(オープンワールド) | P-core + E-core | 8-12 | バックグラウンド処理にE-coreが効く |
| シミュレーション(Cities Skylines 2等) | コア数線形 | 12-16 | 大量Entity処理で多コアが効く |

**「ゲームは6-8コア」が依然として真理**で、24コアを買ってもFPSはあまり伸びません。Ryzen 7 9800X3D が「ゲーミング最強」と言われるのは8コアだから不足するというより、X3Dキャッシュとシングル性能が支配的だからです。

### ライブ配信(OBS)

| 配信モード | 効くコア | 必要コア数 |
|---|---|---|
| NVENC / Apple Silicon ハードエンコ | P-core数本 + E-core | 8コア程度 |
| x264 CPUエンコ(高画質) | コア数線形 | 12-16コア |
| AV1 NVENC + ノイズリダクション | P-core 6 + E-core 8 | 8-12コア相当 |

CPU エンコードは E-core や SMT スレッドが線形に効き、Core Ultra 9 285K の 24 スレッドが活きる代表例です。**ただしハードエンコ(NVENC/QSV/Media Engine)主流の2026年は、6-8コアあれば配信は問題なく成立**します。

### AI開発(ローカルLLM・Stable Diffusion)

| ワークロード | CPU依存度 | 推奨コア数 |
|---|---|---|
| LLM 推論(llama.cpp GPU offload) | 低 | 6-8コア |
| LLM 推論(CPU only) | 高 | コア数線形 |
| LLM ファインチューニング(GPU) | 低 | 6-8コア |
| データ前処理(Pandas/NumPy) | 中 | 8-12コア |
| Stable Diffusion(GPU) | 低 | 6-8コア |

**ローカルLLM推論で本当に効くのはVRAMとGPU**で、CPUは「データを GPU に流す」役目です。6-8コアあれば足ります。詳細は「[VRAMの違いがローカルLLM推論に与える影響 2026年版](/blog/vram-explained-llm-inference-2026/)」「[ローカルLLMを動かすPCの最低スペック 2026年版](/blog/local-llm-pc-spec-2026/)」を参照してください。

### Web開発・コンパイル

| ワークロード | コア数効果 |
|---|---|
| npm/yarn パッケージ並列ビルド | 線形(8-16コアで顕著) |
| Cargo(Rust)並列コンパイル | 線形(12-16コアで顕著) |
| TypeScript インクリメンタルビルド | シングル性能依存 |
| Docker マルチコンテナビルド | 線形(8-16コアで顕著) |
| ESLint / Prettier 全体実行 | 線形(8-12コアで顕著) |

**「コア数が一番効く」のがビルド作業**で、ここは Core Ultra 9 285K の24スレッドや Ryzen 9 9950X の32スレッドが真価を発揮します。Web開発本職なら12-16コアクラスがコスト対効果で良いラインです。

## よくある誤解

### 「24コアあれば何でも速くなる」

ほとんどのワークロードは8-12コアで頭打ちです。24コア構成が効くのは「Web開発の大規模ビルド」「動画CPUエンコ」「数値シミュレーション」など、明確に並列化されたワークロードに限られます。**ゲーミング・AI・配信のみが用途なら、12コアクラスで十分**です。

### 「E-coreは要らない」

これは Arrow Lake 発表時に流れた誤解ですが、E-core はバックグラウンドのOSタスク・ブラウザタブ・Discord・Spotifyを引き受けて、P-core をゲームやコンパイルに専念させる役目があります。**「E-core を切ると P-core にOS雑用が乗って性能が落ちる」現象**が普通に観測されます。

### 「Zen 5 のCCD分割は弱点」

確かにCCD間通信は遅延があり、シングルスレッドゲーミングでは1 CCD構成の 9800X3D が9950X より速いことがあります。しかし**大半のワークロードでは2 CCD構成の方が単純に処理能力が高い**ので、用途次第です。9950X は動画書き出し・データ処理・コンパイルが主用途なら依然として最強クラスです。

### 「HTを廃止したから Arrow Lake は遅くなった」

スレッド数は減りましたが、E-core が大幅に増えた(265K で12E、285K で16E)ため、合計スレッド数はむしろ増えています。HT が効いていた一部のワークロード(極端な高並列ライブラリ等)では確かに不利な場面もありますが、ほとんどの用途では問題になりません。

## 「結局どれ買えばいいか」フローチャート

1. **ゲーミング中心(FPS / AAA)** → Ryzen 7 9800X3D(8コア / X3D)
2. **ゲーム + 配信 + 軽い動画編集** → Ryzen 7 9700X / Core Ultra 7 265K(8-12コア)
3. **Web開発 + AI開発 + 配信** → Ryzen 9 9900X / Core Ultra 9 285K(12-16コア相当)
4. **動画編集 + 3D + 大規模ビルド** → Ryzen 9 9950X / Core Ultra 9 285K(16-24コア相当)
5. **AI推論 + ローカルLLM中心** → 8-12コアで十分、予算をGPU(VRAM)に振る
6. **Linux + 仮想化 + サーバ用途** → Zen 5(対称構成のほうがスケジューリングがシンプル)

## まとめ:数字より構造を見る

- **Intel Arrow Lake**:P-core(高IPC) + E-core(効率)の混在 + HT廃止
- **AMD Zen 5**:対称コア + CCD分割 + 3D V-Cache(X3D)のオプション
- **コア数 = 性能ではない**:ゲーミングは6-8、配信は8-12、ビルドは線形、AIはGPU依存
- **24コア構成が活きるのは限定的**(動画CPUエンコ / 大規模ビルド / シミュレーション)
- **OSスケジューラの最適化レベル**で実効性能が変わる(Windows 11が安定、Linuxは要確認)

「コア数の数字」だけで CPU を比較するのは2026年では成立しません。**自分の主用途で本当に効くコア構造**を理解してから機種を選んでください。世代別の比較は「[Intel Core Ultra 200 vs AMD Ryzen 9000](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/)」、GPU側の「コア」概念は「[Tensor Core / CUDA Core / RT Core の違い](/blog/tensor-cuda-rt-core-explained-2026/)」もあわせて読むと、PC選定の全体像がつかみやすくなります。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [Intel Core Ultra 200 vs AMD Ryzen 9000:用途別の選び方](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/):世代対決の実用評価
- [Tensor Core / CUDA Core / RT Core の違い](/blog/tensor-cuda-rt-core-explained-2026/):GPU側の「コア」概念解説
- [メモリ 16GB / 32GB / 64GB の違い 2026年版](/blog/ram-16gb-32gb-64gb-explained-2026/):コア数とメモリのバランス
