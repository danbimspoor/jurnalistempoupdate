interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  try {
    // In a real app, you might search by slug OR id
    const article = await context.env.DB.prepare(`
      SELECT a.*, au.name as author_name, au.avatar_url as author_avatar 
      FROM articles a 
      JOIN authors au ON a.author_id = au.id
      WHERE a.id = ? OR a.slug = ?
    `).bind(id, id).first();

    if (!article) {
      return new Response('Article not found', { status: 404 });
    }

    // Increment views (optional, but requested in schema)
    context.waitUntil(
      context.env.DB.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').bind(article.id).run()
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
