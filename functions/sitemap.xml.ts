/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT id, slug, published_at FROM articles ORDER BY published_at DESC').all();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jurnalistempo-update.pages.dev/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`;

    results.forEach((article: any) => {
      sitemap += `
  <url>
    <loc>https://jurnalistempo-update.pages.dev/article/${article.slug || article.id}</loc>
    <lastmod>${new Date(article.published_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `\n</urlset>`;

    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    return new Response('Error generating sitemap', { status: 500 });
  }
};
