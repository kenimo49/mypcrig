---
title: "CPUクーラーの選び方と比較 2026年版:空冷ハイエンド / 240mm / 360mm AIO・Arrow Lake と Zen 5 の発熱事情"
description: "CPUクーラーを 2026 年最新事情で比較。空冷ハイエンド（Noctua NH-D15 G2 / Thermalright Peerless Assassin 120 SE）・240mm/280mm/360mm 簡易水冷・本格水冷を、Core Ultra 200 (Arrow Lake) / Ryzen 9000 (Zen 5) の発熱動向と合わせて整理。冷却性能 / 静音性 / 価格 / ケース互換の判断軸を解説します。"
date: 2026-05-17
lang: ja
category: comparison
section: parts
tags: ["CPUクーラー", "空冷", "簡易水冷", "AIO", "Noctua NH-D15 G2", "Thermalright Peerless Assassin", "Arrow Lake", "Ryzen 9000"]
featured: false
og_image: "/images/blog/cpu-cooler-comparison-2026/cover.png"
affiliate_disclosure: true
---

![CPUクーラー比較 2026:空冷 / 240mm AIO / 360mm AIO の冷却性能・静音性・価格](/images/blog/cpu-cooler-comparison-2026/cover.png)

**結論:2026 年は「空冷ハイエンドが 360mm AIO に迫る」「Arrow Lake で発熱が下がり、Ryzen 9000 は引き続き 95℃ 張り付き運用」が現実です。ゲーミング中心 / Core Ultra 7 265K なら Thermalright Peerless Assassin 120 SE (8000 円帯) で十分、配信や AI 開発で 9950X / Core Ultra 9 285K を常用するなら 360mm AIO、静音重視なら Noctua NH-D15 G2 が向いています。**

CPU クーラー選びは「ハイエンド CPU には水冷」と決め打ちされがちですが、2026 年の状況はもう少し複雑です。Arrow Lake (Core Ultra 200) で発熱が大幅に下がったこと、Noctua NH-D15 G2 / Thermalright Peerless Assassin 120 SE などの新世代空冷が 360mm AIO に迫るレベルまで到達したこと、AIO のポンプ寿命と空冷の長期信頼性の差。これらを踏まえて、本記事では空冷ハイエンド・240mm / 280mm / 360mm AIO・本格水冷を **冷却性能 / 静音性 / 価格 / ケース互換** の 4 軸で比較し、CPU 別の推奨を整理します。

## 2026 年の CPU 発熱事情

クーラー選びは CPU の発熱量から逆算するのが基本です。世代ごとに発熱の挙動が大きく変わっているため、まず現状を整理します。

| CPU | TDP / PBP | 実消費電力(全コア) | 発熱挙動 |
|---|---|---|---|
| Core Ultra 9 285K (Arrow Lake) | 125W / PL2 250W | 240W 前後 | 13900K / 14900K より大幅減、空冷余裕 |
| Core Ultra 7 265K (Arrow Lake) | 125W / PL2 250W | 180〜210W | 空冷ハイエンドで十分 |
| Core Ultra 5 245K (Arrow Lake) | 125W / PL2 159W | 130〜160W | 中堅空冷で OK |
| Core i9-14900K (Raptor Lake Refresh) | 125W / PL2 253W | 320W 超 | 360mm AIO 推奨、空冷では厳しい |
| Ryzen 9 9950X3D (Zen 5) | 170W TDP | 200W 前後 | 95℃ 張り付き設計、放熱より「いかに 95℃ に張り付けるか」 |
| Ryzen 9 9950X (Zen 5) | 170W TDP | 230W 前後 | 同上、360mm AIO で性能伸びる |
| Ryzen 9 9900X (Zen 5) | 120W TDP | 160W 前後 | 空冷ハイエンドで十分 |
| Ryzen 7 9800X3D (Zen 5) | 120W TDP | 130W 前後 | 中堅空冷で OK、3D V-Cache 冷却に注意 |
| Ryzen 7 9700X (Zen 5) | 65W TDP | 90W 前後 | エントリー空冷でも余裕 |

**Arrow Lake (Core Ultra 200) は前世代 14900K と比べて発熱が大幅減** したのが大きな変化です。14900K で 360mm AIO 必須だったところが、Core Ultra 9 285K では空冷ハイエンドで OnDie 限界に届かないレベルまで落ち着きました。Intel ハイエンドを組むなら、世代差で空冷が選択肢に戻ってきたのが 2026 年の状況です。

一方 **Ryzen 9000 (Zen 5) は「設計上 95℃ に張り付かせる」アプローチを継続** しています。Tjmax 95℃ までクロックを伸ばし続ける設計で、より良い冷却を当てると 95℃ までの到達が遅れる = ブーストクロックが伸びる、という挙動。AIO を選ぶ理由は「温度を下げるため」というより「持続クロックを伸ばすため」になっています。

世代別の詳しい違いは別記事「[Intel Core Ultra 200 vs AMD Ryzen 9000 2026年版](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/)」で扱っています。

## 空冷ハイエンドの実力(2024〜2025 新世代)

過去 2 年で空冷ハイエンドの世代交代が進み、360mm AIO に迫るモデルが揃いました。

| 空冷モデル | ヒートシンク高さ | TDP 対応 | 価格目安 | 特徴 |
|---|---|---|---|---|
| Noctua NH-D15 G2 | 168mm | 280W+ | 24,000 円 | 静音性トップ、品質・保証 6 年 |
| Noctua NH-U12A | 158mm | 230W | 19,000 円 | 高さ抑えめで小型ケース可、静音 |
| Thermalright Peerless Assassin 120 SE | 157mm | 245W | 6,000〜8,000 円 | CP 最強、ハイエンドに迫る |
| Thermalright Phantom Spirit 120 EVO | 154mm | 260W | 9,000 円 | Peerless Assassin の上位 |
| be quiet! Dark Rock Pro 5 | 168mm | 270W | 14,000 円 | 静音性高、見た目落ち着き |
| Deepcool Assassin IV | 164mm | 280W | 16,000 円 | スイッチで静音 / 性能切替 |

注目は **Thermalright Peerless Assassin 120 SE と Phantom Spirit 120 EVO** で、6,000〜9,000 円の価格帯で 360mm AIO の温度に 5〜8℃ 差まで詰めてきます。「とにかく安く、ハイエンド冷却を取りに行く」なら、現状この 2 つが第一候補。

**Noctua NH-D15 G2** は冷却性能で空冷トップクラス、静音性は AIO を含めても最も静か。価格は 24,000 円とハイエンドですが、6 年保証と長期信頼性を踏まえれば妥当です。

### 空冷で詰みやすいポイント

- **ヒートシンク高さ** :168mm の Noctua NH-D15 G2 / Dark Rock Pro 5 が入らないケースがある。ケース仕様の「CPU クーラー最大高さ」を必ず確認
- **メモリクリアランス** :背の高い RGB メモリ(45mm 以上)と干渉することがある。Noctua NH-D15 G2 は片方のファンを 5mm 上げて回避可
- **VRM ヒートシンクとの干渉** :マザーボード上部 VRM ヒートシンクと干渉する稀ケース
- **重量と PCB たわみ** :空冷ハイエンドは 1.3〜1.5kg。マザボのバックプレート補強と垂直設置必須

## 簡易水冷 (AIO) のクラス別比較

簡易水冷はラジエータサイズで冷却性能が決まります。

| サイズ | 冷却性能 | 価格目安 | 適合 CPU | ケース要件 |
|---|---|---|---|---|
| 120mm | 弱 | 6,000 円 | Ryzen 5 / Core Ultra 5 まで | リアファン位置で OK |
| 240mm | 中 | 12,000〜16,000 円 | Core Ultra 7 265K / Ryzen 7 9700X | フロント / トップ 240mm |
| 280mm | 中強 | 14,000〜18,000 円 | Core Ultra 7 265K / Ryzen 7 9800X3D | 280mm 対応ケース(E-ATX 寄り) |
| 360mm | 強 | 18,000〜35,000 円 | Core Ultra 9 285K / Ryzen 9 9950X | フロント / トップ 360mm |
| 420mm | 最強 | 25,000〜40,000 円 | OC 運用 / Threadripper / Xeon W | 巨大ケース(O11 XL / Define 7 XL) |

### 主要 AIO の比較(2026 年 5 月時点)

| モデル | サイズ | ポンプ世代 | 価格目安 | 特徴 |
|---|---|---|---|---|
| Arctic Liquid Freezer III 360 | 360mm | Asetek 8 系 | 18,000 円 | CP 最強、付属 VRM ファン |
| Lian Li Galahad II Trinity 360 | 360mm | Asetek 8 系 | 25,000 円 | 見た目重視、RGB |
| NZXT Kraken 360 | 360mm | Asetek 8 系 | 30,000 円 | LCD 液晶ディスプレイ |
| Corsair iCUE H170i LCD 420 | 420mm | Asetek 8 系 | 38,000 円 | LCD 付き 420mm |
| EK-Nucleus AIO Lux D-RGB 360 | 360mm | EK 内製 | 32,000 円 | カスタム水冷ライク |

冷却性能だけで見るなら **Arctic Liquid Freezer III 360 / 420 が明確に CP が高い**。デザイン重視で LCD 付きや RGB 派手目にしたい場合は NZXT Kraken / Lian Li Galahad / Corsair iCUE に予算を回す形になります。

### AIO で詰みやすいポイント

- **ポンプ音** :アイドル時に「コー」「ジー」という低音が出る個体差。Asetek 8 系で改善
- **ポンプ寿命** :一般的に 5〜6 年(空冷は 7〜10 年)、保守期間を超えると要交換
- **エア噛み** :初期搬送時にチューブ内のエアが偏ると音が出る、ラジエータ最高点でない設置で改善
- **CPU 直上のポンプ位置** :ポンプヘッドが CPU 上にある製品は熱伝導しやすい(問題は少ないが空冷より明らか)
- **ラジエータの厚さ** :30mm が標準、45mm の厚型は冷却強化だがケース内クリアランスに影響

## 本格水冷(カスタムループ)

本格水冷は「冷却性能が必要」というより、見た目と趣味の領域です。

- **メリット** :CPU + GPU 一括冷却、見た目、静音性、長期運用
- **デメリット** :初期コスト 10〜30 万円、組み立て難度高、メンテナンス必須(クーラント交換 1〜2 年ごと)
- **適合層** :Threadripper / Xeon W / OC 競技 / 見た目重視ビルダー
- **代表ブランド** :EK Water Blocks / Bykski / Bitspower / Alphacool

「組むこと自体が趣味」「カスタム PC コンテストに出す」「Threadripper PRO で 32〜96 コア運用」のような層が対象で、ゲーミングや AI 開発では 360mm AIO と差がほぼ出ません。

## 静音性の比較

冷却性能が同じでも、ファン回転数次第で騒音は大きく変わります。**騒音は「冷却性能ではなく、回転数」で決まる** のが大事なポイントです。

| 構成 | 標準負荷時の騒音(dBA 目安) | 体感 |
|---|---|---|
| Noctua NH-D15 G2 + NF-A14x25 G2 | 28〜32 dBA | 至近距離で気にならない |
| Thermalright Peerless Assassin 120 SE | 32〜36 dBA | 気にならない |
| Arctic Liquid Freezer III 360 (P12 PWM PST) | 34〜38 dBA | やや聞こえる |
| 360mm AIO (RGB 重視モデル) | 36〜42 dBA | 聞こえる |
| 14900K + 360mm AIO 全開 | 45〜52 dBA | 明らかに聞こえる |

**静音重視なら Noctua NH-D15 G2 + 大型ケース + ファン回転数制御** の組み合わせが最強です。AIO はラジエータ厚 + ファン口径で似た性能を出せますが、ポンプの低周波音が残るのが難点。

## ケース互換の確認ポイント

クーラー選定で最も詰まりやすいのがケース互換です。

### 空冷の場合

- **ケース仕様の「CPU クーラー最大高さ」** :ケース側面パネルが閉まる上限
- **マザーボード VRM ヒートシンクの干渉** :高さ 30mm 以上の VRM だと一部干渉
- **メモリスロットへのファン位置** :背の高い RGB メモリと干渉する可能性

### AIO の場合

- **ラジエータ搭載位置** :フロント 240/280/360mm 対応 / トップ 240/280/360mm 対応
- **ラジエータ厚** :30mm が標準、45mm 厚は厚型対応ケースが必要
- **ファンの厚さ追加** :ラジエータ + ファン 25mm が標準、サンドイッチ構成なら + 50mm
- **メモリクリアランス** :トップマウントの場合、メモリの高さで干渉あり

E-ATX マザーボードやハイエンドケース(Lian Li O11 Dynamic EVO / Fractal Design Meshify 2 など)は概ね全パターン対応ですが、ミニタワーや Mini-ITX ケースは事前確認が必須です。マザーボードの選び方は「[マザーボードチップセットの選び方 2026年版](/blog/motherboard-chipset-comparison-2026/)」で詳しく扱っています。

## 用途別の推奨

### ゲーミング中心(Core Ultra 5 / 7 + RTX 5070 Ti / 5080)

- **第一候補** :Thermalright Peerless Assassin 120 SE (8,000 円)
- **理由** :Core Ultra 7 265K の発熱なら空冷で完全に十分、CP 最強、メンテ不要
- **代替** :Phantom Spirit 120 EVO / Noctua NH-U12A

### 配信 + ゲーミング(Core Ultra 9 285K / Ryzen 9 9900X)

- **第一候補** :Arctic Liquid Freezer III 360 (18,000 円)
- **理由** :配信エンコードで CPU 負荷が長時間続くため、ラジエータの体積で温度安定
- **代替** :Noctua NH-D15 G2(静音重視)、Lian Li Galahad II 360(見た目)

### AI 開発 / 動画編集(Ryzen 9 9950X / Core Ultra 9 285K)

- **第一候補** :Arctic Liquid Freezer III 360 (18,000 円) または NZXT Kraken 360 (30,000 円)
- **理由** :Ryzen 9000 は冷却強化でブーストクロック伸びる、長時間ロードで AIO の体積が効く
- **代替** :Liquid Freezer III 420(さらに余裕)

### 静音特化(深夜作業・配信ブース・録音環境)

- **第一候補** :Noctua NH-D15 G2 (24,000 円)
- **理由** :空冷の頂点、ポンプ音なし、ファン回転数を 800rpm 程度に絞っても十分冷える
- **代替** :be quiet! Dark Rock Pro 5(同価格帯、デザイン控えめ)

### 予算重視(Ryzen 7 9700X / Core Ultra 5 245K)

- **第一候補** :Thermalright Assassin X 120 R SE (3,500 円)
- **理由** :TDP 65W〜125W の CPU には完全にオーバースペックで余裕、超 CP
- **代替** :Deepcool AK620(7,000 円、より余裕重視)

## 寿命・保証

クーラーは消耗品の側面があります。

| 種類 | 想定寿命 | 主な故障モード | 保証期間 |
|---|---|---|---|
| 空冷ハイエンド(Noctua / be quiet!) | 7〜10 年 | ファン軸の摩耗 | 6 年(Noctua) |
| 空冷標準(Thermalright / Deepcool) | 5〜8 年 | ファン軸の摩耗 | 2〜5 年 |
| AIO 240mm / 280mm | 5〜6 年 | ポンプ寿命 / クーラント減少 | 5〜6 年 |
| AIO 360mm | 5〜7 年 | 同上 | 5〜6 年 |
| カスタム水冷 | 10 年以上 | クーラント・チューブの劣化(メンテ前提) | 各パーツによる |

**「3 年で買い替える前提」なら AIO のポンプ寿命は気にしなくて良い** ですが、「PC を 7〜10 年使い倒す」前提なら空冷ハイエンドの長寿命が効いてきます。中古市場でも空冷ハイエンドのほうが値落ちが小さい傾向。

## 電源との関係

ハイエンド CPU + AIO 構成では電源容量にも影響します。ラジエータファン 6 個 + ポンプで合計 20〜30W 程度追加されるため、電源は CPU + GPU + ストレージの合計に余裕を持たせて選ぶ必要があります。詳しくは「[電源ユニット(PSU)の選び方 2026年版](/blog/psu-selection-2026/)」で扱っています。

## まとめ:迷ったら

- ゲーミング中心(Core Ultra 7 / Ryzen 7 まで) → Thermalright Peerless Assassin 120 SE
- ハイエンド構成(Core Ultra 9 / Ryzen 9 + 配信 / AI) → Arctic Liquid Freezer III 360
- 静音重視・長期運用 → Noctua NH-D15 G2
- 予算重視・コスパ最優先 → Thermalright Assassin X 120 R SE / Peerless Assassin

2026 年の CPU クーラー選びは、**「ハイエンド CPU = 360mm AIO」だった常識が崩れて、空冷でも 14900K 世代の AIO に迫るレベルに到達** したのが大きな変化点。組む CPU の発熱量と、自分が「静音 / 持続クロック / 見た目 / 寿命」のどれを優先するかで、最適解は分かれます。ベンチマーク数値の数℃ 差より、**「3 年後も静かに回るか」「ケースに収まるか」「ポンプが壊れたとき手間がかからないか」**を含めて判断すれば、失敗しにくくなります。

---

## あなたに合うPCを診断する

用途や予算をもう少し細かく入力すると、3つの候補構成を提案します。

→ [診断スタート](/match)

## 関連記事

- [Intel Core Ultra 200（Arrow Lake）vs AMD Ryzen 9000（Zen 5）2026年版](/blog/intel-core-ultra-vs-ryzen-9000-cpu-2026/)
- [電源ユニット(PSU)の選び方 2026年版](/blog/psu-selection-2026/)
- [マザーボードチップセットの選び方 2026年版](/blog/motherboard-chipset-comparison-2026/)
