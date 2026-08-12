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

    // API sementara
    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        service: "jurnalistempoupdate",
        status: "online"
      });
    }

    // Semua file React/Vite dilayani dari dist/
    return env.ASSETS.fetch(request);
  }
};
