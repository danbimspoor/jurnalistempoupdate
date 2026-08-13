interface Env {
  DB: D1Database;
}

async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    const { oldPassword, newPassword } = await context.request.json() as any;

    if (!oldPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Old and new passwords are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check old password (supporting both plaintext and hashed)
    const user = await context.env.DB.prepare(
      'SELECT password FROM users WHERE id = ?'
    )
      .bind(sessionData.id)
      .first() as any;

    const oldHashedPassword = await hashPassword(oldPassword);

    if (!user || (user.password !== oldPassword && user.password !== oldHashedPassword)) {
      return new Response(JSON.stringify({ error: 'Invalid old password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update to new hashed password
    const newHashedPassword = await hashPassword(newPassword);
    await context.env.DB.prepare(
      'UPDATE users SET password = ? WHERE id = ?'
    )
      .bind(newHashedPassword, session.id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
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
