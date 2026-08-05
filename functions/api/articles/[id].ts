/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
  
  try {
    // Get article with author info
    const article = await context.env.DB.prepare(`
      SELECT a.*, au.name as author_name, au.avatar_url as author_avatar, au.bio as author_bio
      FROM articles a 
      JOIN authors au ON a.author_id = au.id 
      WHERE a.id = ? OR a.slug = ?
    `)
    .bind(id, id)
    .first();
      
    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Increment views (fire and forget in this context)
    context.waitUntil(
      context.env.DB.prepare('UPDATE articles SET views = views + 1 WHERE id = ?')
        .bind(article.id)
        .run()
    );
    
    return new Response(JSON.stringify(article), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
