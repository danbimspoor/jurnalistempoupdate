interface Env {
  DB: D1Database;
}

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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    
    // Reset to default: admin123
    const defaultPassword = 'admin123';
    
    await context.env.DB.prepare(
      'UPDATE users SET password = ? WHERE id = ?'
    )
      .bind(defaultPassword, session.id)
      .run();

    return new Response(JSON.stringify({ success: true, message: 'Password reset to default (admin123)' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
