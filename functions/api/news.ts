/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const category = searchParams.get('category');
  const trending = searchParams.get('trending');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';
  
  let query = `
    SELECT a.*, au.name as author_name, au.avatar_url as author_avatar 
    FROM articles a 
    JOIN authors au ON a.author_id = au.id 
    WHERE 1=1
  `;
  let params: any[] = [];
  
  if (category) {
    query += ' AND a.category = ?';
    params.push(category);
  }

  if (trending === 'true') {
    query += ' AND a.is_trending = 1';
  }

  if (featured === 'true') {
    query += ' AND a.is_featured = 1';
  }
  
  query += ' ORDER BY a.published_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  try {
    const { results } = await context.env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
