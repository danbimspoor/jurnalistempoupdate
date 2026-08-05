/// <reference types="@cloudflare/workers-types" />

interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    const key = `news/${Date.now()}-${file.name}`;
    await context.env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    const url = `https://assets.jurnalistempo.co.id/${key}`; // Assuming custom domain for R2

    return new Response(JSON.stringify({ url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
