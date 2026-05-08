#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, '..', 'src', 'content', 'blog', 'ja');
const outDir = join(__dirname, '..', 'dist');
const fullPath = join(outDir, 'llms-full.txt');
const indexPath = join(outDir, 'llms.txt');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (m) meta[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: match[2] };
}

function stripImages(body) {
  return body.replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gm, '');
}

const SECTION_LABELS = {
  laptop: 'ノートPC',
  gaming: 'ゲーミング',
  'ai-dev': 'AI開発',
  mac: 'Mac',
  desktop: 'デスクトップ',
  parts: 'パーツ',
  column: 'コラム',
};

function groupArticles(articles) {
  const groups = {};
  for (const a of articles) {
    const sec = a.meta.section ?? 'other';
    (groups[sec] ??= []).push(a);
  }
  return groups;
}

function formatIndex(articles) {
  const groups = groupArticles(articles);
  const order = ['ai-dev', 'column', 'gaming', 'desktop', 'laptop', 'mac', 'parts'];
  const lines = [];
  lines.push('# mypcrig');
  lines.push('');
  lines.push('> あなたに合うPCを見つける。用途別の構成診断と推奨カタログ。');
  lines.push('');
  lines.push('mypcrigは、用途・予算・好みからユーザーに最適なPC構成を提案するPC選定サイトです。AI開発機（ローカルLLM / Claude Code）、ゲーミング、クリエイター用途、ノートPC、Apple Silicon、デスクトップ、パーツ単体まで、構造化されたマッチングロジックで「あなたの rig」を見つけます。');
  lines.push('');
  lines.push('## What mypcrig Does');
  lines.push('');
  lines.push('- 用途×予算×制約から推奨PC構成を提示するマッチング診断');
  lines.push('- AI開発（ローカルLLM、Claude Code、AI画像生成等）に最適なPC/GPU構成の提案');
  lines.push('- 公開ベンチマーク・実測報告の横断整理 + 一部実機検証（Phase 1 から自前実機ベンチを追加予定）');
  lines.push('- ノートPC・ゲーミングPC・Mac・パーツ単体までカバー');
  lines.push('');
  lines.push('## Phase / Editorial Status');
  lines.push('');
  lines.push('- 現状 Phase 0（情報サイト基盤化フェーズ、2026-05 ドメイン取得）');
  lines.push('- 記事の主体は公開ベンチマーク・公式情報・コミュニティ実測の横断集約');
  lines.push('- 自前実機ベンチマークは propel-lab 検証環境で順次追加（Phase 1）');
  lines.push('- ranking / review カテゴリは Phase 1 から本格投入');
  lines.push('- 提供記事・PR記事は受け付けない方針');
  lines.push('');
  lines.push('## Site Sections');
  lines.push('');
  lines.push('- /laptop/  — ノートPC全般（学生 / ビジネス / クリエイター）');
  lines.push('- /gaming/  — ゲーミングPC（FPS / MMO / 配信）');
  lines.push('- /ai-dev/  — AI開発向け（ローカルLLM / 画像生成 / ベンチマーク）');
  lines.push('- /mac/     — Apple Silicon');
  lines.push('- /desktop/ — デスクトップ全般');
  lines.push('- /parts/   — パーツ単体（GPU / CPU / メモリ）');
  lines.push('- /column/  — 雑学・基礎知識');
  lines.push('- /match/   — マッチング診断（用途×予算）');
  lines.push('');
  lines.push('## Content Categories');
  lines.push('');
  lines.push('- ranking    — 用途別ランキング（Phase 1 から本格投入）');
  lines.push('- review     — 個別機種レビュー（Phase 1 から）');
  lines.push('- guide      — 用途別ガイド・選び方');
  lines.push('- benchmark  — 実機ベンチマーク');
  lines.push('- comparison — 機種・パーツ比較');
  lines.push('');
  lines.push(`## Articles (${articles.length} 本、自動生成)`);
  lines.push('');
  for (const sec of order) {
    if (!groups[sec] || groups[sec].length === 0) continue;
    lines.push(`### ${SECTION_LABELS[sec] ?? sec}`);
    lines.push('');
    for (const a of groups[sec]) {
      lines.push(`- https://mypcrig.com/blog/${a.slug}/ — ${a.meta.title ?? a.slug}`);
    }
    lines.push('');
  }
  lines.push('## Languages');
  lines.push('');
  lines.push('- 日本語（メイン）');
  lines.push('');
  lines.push('## Related Sites');
  lines.push('');
  lines.push('- 法人サービス: https://propel-lab.co.jp — 企業向けLLM開発環境構築コンサル');
  lines.push('');
  lines.push('## Full Text');
  lines.push('');
  lines.push('- https://mypcrig.com/llms-full.txt — 全記事のフルテキスト版（AI 引用用）');
  lines.push('');
  lines.push('## About / 運営情報');
  lines.push('');
  lines.push('- 運営: Iris (propel-lab) / 監修: ken imoto');
  lines.push('- お問い合わせ: info@propel-lab.co.jp / https://mypcrig.com/contact/');
  lines.push('- プライバシーポリシー: https://mypcrig.com/privacy/');
  lines.push('- 編集方針: https://mypcrig.com/about/');
  lines.push('');
  return lines.join('\n');
}

function formatFull(articles) {
  const lines = [];
  lines.push('# mypcrig — フルテキスト版');
  lines.push('');
  lines.push('> 全記事のフルテキストを 1 ファイルにまとめた AI 引用用ファイル。');
  lines.push('> 個別記事 URL は llms.txt または sitemap-index.xml を参照。');
  lines.push('');
  for (const a of articles) {
    const url = `https://mypcrig.com/blog/${a.slug}/`;
    lines.push('---');
    lines.push('');
    lines.push(`# ${a.meta.title ?? a.slug}`);
    lines.push('');
    lines.push(`URL: ${url}`);
    if (a.meta.date) lines.push(`Date: ${a.meta.date}`);
    if (a.meta.section) lines.push(`Section: ${a.meta.section}`);
    if (a.meta.category) lines.push(`Category: ${a.meta.category}`);
    if (a.meta.description) lines.push(`Description: ${a.meta.description}`);
    lines.push('');
    lines.push(stripImages(a.body).trim());
    lines.push('');
  }
  return lines.join('\n');
}

async function loadArticles() {
  const files = (await readdir(blogDir)).filter((f) => f.endsWith('.md')).sort();
  const articles = [];
  for (const f of files) {
    const raw = await readFile(join(blogDir, f), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    articles.push({ slug: f.replace(/\.md$/, ''), meta, body });
  }
  return articles;
}

async function main() {
  const articles = await loadArticles();
  await mkdir(outDir, { recursive: true });

  const indexContent = formatIndex(articles);
  await writeFile(indexPath, indexContent, 'utf8');
  console.log(`Wrote ${indexPath} (${indexContent.length} chars, ${articles.length} articles)`);

  const fullContent = formatFull(articles);
  await writeFile(fullPath, fullContent, 'utf8');
  console.log(`Wrote ${fullPath} (${fullContent.length} chars)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
