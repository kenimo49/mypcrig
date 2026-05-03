import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'mypcrig — あなたに合うPCを見つける',
    description:
      '用途・予算・実機ベンチマークに基づくPC選定。AI開発、ゲーミング、クリエイター用途、ノートPC、Apple Silicon、デスクトップ、パーツ単体までカバー。',
    site: context.site ?? 'https://mypcrig.com',
    items: posts.map((post) => {
      const slug = post.id.replace(/^ja\//, '');
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${slug}/`,
        categories: [post.data.section, post.data.category, ...post.data.tags],
      };
    }),
    customData: '<language>ja-jp</language>',
  });
}
