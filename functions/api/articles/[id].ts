interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  try {
    const article = await context.env.DB.prepare(`
      SELECT a.*, au.name as author_name, au.avatar_url as author_avatar 
      FROM articles a 
      JOIN authors au ON a.author_id = au.id
      WHERE a.id = ? OR a.slug = ?
    `).bind(id, id).first();

    if (!article) {
      return new Response('Article not found', { status: 404 });
    }

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

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
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

    const result = await context.env.DB.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author_id = ?, image_url = ?, is_featured = ?, is_trending = ?, tags = ?
      WHERE id = ?
    `).bind(title, slug, excerpt || '', content, category, finalAuthorId, image_url || null, is_featured ? 1 : 0, is_trending ? 1 : 0, tags || null, id).run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
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

    await context.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
