interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const cookieHeader = context.request.headers.get('Cookie');
  if (!cookieHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [key, ...value] = c.trim().split('=');
    return [key, value.join('=')];
  }));
  const sessionCookie = cookies['session'];

  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));

    if (!session || session.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const data = await context.request.json() as any;
    const { title, slug, excerpt, content, category, author_id, image_url, is_featured, is_trending, tags } = data;

    if (!title || !slug || !content || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // 1. Ensure default author 'a1' exists
    await context.env.DB.prepare(`
      INSERT OR IGNORE INTO authors (id, name, bio, avatar_url, role)
      VALUES ('a1', 'Redaksi Utama', 'Tim redaksi pusat JurnalisTempo Update.', 'https://picsum.photos/seed/author1/200/200', 'Editor in Chief')
    `).run();

    // 2. Validate author_id or fallback to 'a1'
    let finalAuthorId = author_id || 'a1';
    const authorExists = await context.env.DB.prepare('SELECT id FROM authors WHERE id = ?').bind(finalAuthorId).first();
    if (!authorExists) {
      finalAuthorId = 'a1';
    }

    const id = crypto.randomUUID();
    await context.env.DB.prepare(`
      INSERT INTO articles (id, title, slug, excerpt, content, category, author_id, image_url, is_featured, is_trending, tags, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(id, title, slug, excerpt || '', content, category, finalAuthorId, image_url || null, is_featured ? 1 : 0, is_trending ? 1 : 0, tags || null).run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
