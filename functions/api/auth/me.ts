interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cookieHeader = context.request.headers.get('Cookie');
  const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('='))) : {};
  const sessionCookie = cookies['session'];

  if (!sessionCookie) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    const { sig, ...sessionData } = session;

    if (!sig) throw new Error('Missing signature');

    // Verify signature
    const secret = (context.env as any).SESSION_SECRET || 'default-secret-change-me';
    const sessionStr = JSON.stringify(sessionData);
    const msgUint8 = new TextEncoder().encode(sessionStr + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSig = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (sig !== expectedSig) {
      throw new Error('Invalid signature');
    }
    
    // STRICT VERIFICATION: Check if user still exists in database
    const user = await context.env.DB.prepare(
      'SELECT id, username, role FROM users WHERE id = ? AND username = ?'
    )
      .bind(sessionData.id, sessionData.username)
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
