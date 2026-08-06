interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const trending = searchParams.get('trending') === 'true';
  const authorId = searchParams.get('author_id');
  const queryParam = searchParams.get('q');

  let query = `
    SELECT a.*, au.name as author_name, au.avatar_url as author_avatar, au.bio as author_bio, au.role as author_role
    FROM articles a 
    JOIN authors au ON a.author_id = au.id
  `;
  const params: any[] = [];
  const conditions: string[] = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (featured) {
    conditions.push('is_featured = 1');
  }
  if (trending) {
    conditions.push('is_trending = 1');
  }
  if (authorId) {
    conditions.push('author_id = ?');
    params.push(authorId);
  }
  if (queryParam) {
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)');
    const likeVal = `%${queryParam}%`;
    params.push(likeVal, likeVal, likeVal);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY published_at DESC LIMIT ?';
  params.push(limit);

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
