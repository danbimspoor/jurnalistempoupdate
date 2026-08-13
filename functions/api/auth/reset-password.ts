interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const cookieHeader = context.request.headers.get('Cookie');
  const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('='))) : {};
  const sessionCookie = cookies['session'];

  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    // Reset to default: admin123
    const defaultPassword = 'admin123';
    
    await context.env.DB.prepare(
      'UPDATE users SET password = ? WHERE id = ?'
    )
      .bind(defaultPassword, sessionData.id)
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
