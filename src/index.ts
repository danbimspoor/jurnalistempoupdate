export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API berita
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env);
    }

    // Semua halaman lainnya diberikan ke React/Vite
    return env.ASSETS.fetch(request);
  },
};

async function handleApi(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/news') {
    try {
      const limit = Math.min(
        parseInt(url.searchParams.get('limit') || '10'),
        100
      );

      const category = url.searchParams.get('category');
      const featured = url.searchParams.get('featured') === 'true';
      const trending = url.searchParams.get('trending') === 'true';
      const authorId = url.searchParams.get('author_id');
      const q = url.searchParams.get('q');

      let query = `
        SELECT
          a.*,
          au.name AS author_name,
          au.avatar_url AS author_avatar,
          au.bio AS author_bio,
          au.role AS author_role
        FROM articles a
        JOIN authors au ON a.author_id = au.id
      `;

      const conditions: string[] = [];
      const params: unknown[] = [];

      if (category) {
        conditions.push('a.category = ?');
        params.push(category);
      }

      if (featured) {
        conditions.push('a.is_featured = 1');
      }

      if (trending) {
        conditions.push('a.is_trending = 1');
      }

      if (authorId) {
        conditions.push('a.author_id = ?');
        params.push(authorId);
      }

      if (q) {
        conditions.push(
          '(a.title LIKE ? OR a.excerpt LIKE ? OR a.tags LIKE ?)'
        );

        const search = `%${q}%`;
        params.push(search, search, search);
      }

      if (conditions.length) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY a.published_at DESC LIMIT ?`;
      params.push(limit);

      const { results } = await env.DB
        .prepare(query)
        .bind(...params)
        .all();

      return Response.json(results);
    } catch (error) {
      return Response.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Database error',
        },
        { status: 500 }
      );
    }
  }

  return Response.json(
    { error: 'API endpoint not found' },
    { status: 404 }
  );
}
