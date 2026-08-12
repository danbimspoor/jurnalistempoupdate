export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ASSETS: Fetcher;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Test API
    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        service: "jurnalistempoupdate",
        status: "online",
      });
    }

    // Static files
    const response = await env.ASSETS.fetch(request);

    // Jika file tidak ditemukan, tampilkan React index.html
    // supaya React Router tetap bekerja.
    if (response.status === 404 && request.method === "GET") {
      const indexRequest = new Request(
        new URL("/index.html", request.url),
        request
      );

      return env.ASSETS.fetch(indexRequest);
    }

    return response;
  },
};
