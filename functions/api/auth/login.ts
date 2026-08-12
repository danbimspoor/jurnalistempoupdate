interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { username, password } = await context.request.json() as any;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await context.env.DB.prepare(
      'SELECT id, username, role FROM users WHERE username = ? AND password = ?'
    )
      .bind(username, password)
      .first() as any;

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a simple session cookie
    // In a real app, you'd use a JWT or a signed session ID
    const sessionData = JSON.stringify({ id: user.id, username: user.username, role: user.role });
    const cookie = `session=${encodeURIComponent(sessionData)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
