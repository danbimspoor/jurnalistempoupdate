/// <reference types="@cloudflare/workers-types" />

interface Env {
  // BUCKET removed as per request
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  return new Response(JSON.stringify({ error: 'Upload feature is currently disabled (R2 storage removed).' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
};
