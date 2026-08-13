interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cookieHeader = context.request.headers.get('Cookie');
  if (!cookieHeader) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [key, ...value] = c.trim().split('=');
    return [key, value.join('=')];
  }));
  const sessionCookie = cookies['session'];

  if (!sessionCookie) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    const { id, username } = session;

    if (!id || !username) {
      throw new Error('Invalid session data');
    }
    
    // STRICT VERIFICATION: Check if user still exists in database
    const user = await context.env.DB.prepare(
      'SELECT id, username, role FROM users WHERE id = ? AND username = ?'
    )
      .bind(id, username)
      .first() as any;

    if (!user) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0', // Clear invalid cookie
        },
      });
    }

    return new Response(JSON.stringify({ user: { id: user.id, username: user.username, role: user.role } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
