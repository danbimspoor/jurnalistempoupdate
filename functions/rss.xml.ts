/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT a.*, au.name as author_name 
      FROM articles a 
      JOIN authors au ON a.author_id = au.id 
      ORDER BY a.published_at DESC 
      LIMIT 20
    `).all();
    
    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>JurnalisTempo Update</title>
  <link>https://jurnalistempo-update.pages.dev</link>
  <description>Suara Fakta, Denyut Peristiwa - Berita Terbaru dan Terpercaya</description>
  <language>id-id</language>`;

    results.forEach((article: any) => {
      rss += `
  <item>
    <title>${article.title}</title>
    <link>https://jurnalistempo-update.pages.dev/article/${article.slug || article.id}</link>
    <description>${article.excerpt}</description>
    <author>${article.author_name}</author>
    <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
    <guid>https://jurnalistempo-update.pages.dev/article/${article.id}</guid>
  </item>`;
    });

    rss += `\n</channel>\n</rss>`;

    return new Response(rss, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    return new Response('Error generating RSS', { status: 500 });
  }
};
