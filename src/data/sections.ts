export const navItems = [
  { href: '/match/', label: '診断' },
  { href: '/laptop/', label: 'ノートPC' },
  { href: '/gaming/', label: 'ゲーミング' },
  { href: '/ai-dev/', label: 'AI開発' },
  { href: '/mac/', label: 'Mac' },
  { href: '/desktop/', label: 'デスクトップ' },
  { href: '/parts/', label: 'パーツ' },
  { href: '/column/', label: 'コラム' },
];

export const sectionLabels: Record<string, string> = {
  laptop: 'ノートPC',
  gaming: 'ゲーミング',
  'ai-dev': 'AI開発',
  mac: 'Mac',
  desktop: 'デスクトップ',
  parts: 'パーツ',
  column: 'コラム',
};

export const categoryLabels: Record<string, string> = {
  ranking: 'ランキング',
  review: 'レビュー',
  guide: 'ガイド',
  benchmark: 'ベンチマーク',
  comparison: '比較',
};

export const homeSectionCards = [
  {
    href: '/ai-dev/',
    title: 'AI開発向け',
    headline: 'ローカルLLMが動くPC',
    description: 'VRAM別の動作モデル / 実機ベンチマーク / Claude Code 快適化',
  },
  {
    href: '/gaming/',
    title: 'ゲーミングPC',
    headline: 'FPS / MMO / 配信',
    description: '予算別ランキング / フレームレート実測 / 用途別構成',
  },
  {
    href: '/laptop/',
    title: 'ノートPC',
    headline: '軽量 / バッテリー / 性能',
    description: '学生・ビジネス・クリエイター向け選び方',
  },
  {
    href: '/mac/',
    title: 'Mac',
    headline: 'Apple Silicon',
    description: 'M3 / M4 シリーズ徹底比較 / Unified Memory の実力',
  },
  {
    href: '/desktop/',
    title: 'デスクトップ',
    headline: 'BTO / 自作',
    description: '拡張性と静音性のバランス / コスパ最強構成',
  },
  {
    href: '/parts/',
    title: 'パーツ単体',
    headline: 'GPU / CPU / メモリ',
    description: '単品レビュー / 世代比較 / アップグレード指南',
  },
];
