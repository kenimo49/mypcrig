import { visit } from 'unist-util-visit';

// アフィリエイト/広告リンク扱い: rel="nofollow sponsored noopener" + target="_blank"
const AFFILIATE_HOSTS = new Set([
  'www.amazon.co.jp',
  'amazon.co.jp',
  'amzn.to',
  'amzn.asia',
  'www.mouse-jp.co.jp',
  'www.dospara.co.jp',
  'kakaku.com',
]);

// 通常の参照リンク扱い: rel="noopener" + target="_blank"
// メーカー公式・スペック確認等、推奨ロジックの根拠として参照する先
const REFERENCE_HOSTS = new Set([
  'www.apple.com',
  'apple.com',
]);

const AMAZON_HOSTS = new Set([
  'www.amazon.co.jp',
  'amazon.co.jp',
  'amzn.to',
  'amzn.asia',
]);

function injectAmazonTag(urlString, tag) {
  if (!tag) return urlString;
  try {
    const url = new URL(urlString);
    if (!AMAZON_HOSTS.has(url.hostname)) return urlString;
    if (url.searchParams.has('tag')) return urlString;
    url.searchParams.set('tag', tag);
    return url.toString();
  } catch {
    return urlString;
  }
}

function classifyHost(urlString) {
  try {
    const url = new URL(urlString);
    if (AFFILIATE_HOSTS.has(url.hostname)) return 'affiliate';
    if (REFERENCE_HOSTS.has(url.hostname)) return 'reference';
    return null;
  } catch {
    return null;
  }
}

export function remarkAffiliate() {
  const tag = process.env.PUBLIC_AMAZON_TAG ?? '';

  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!node.url) return;
      const kind = classifyHost(node.url);
      if (!kind) return;

      const data = (node.data ??= {});
      const props = (data.hProperties ??= {});

      if (kind === 'affiliate') {
        node.url = injectAmazonTag(node.url, tag);
        props.rel = 'nofollow sponsored noopener';
      } else {
        props.rel = 'noopener';
      }
      props.target = '_blank';
    });
  };
}
