export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {

    const url = new URL(request.url);

    /*
     * =========================
     * API
     * =========================
     */

    if (url.pathname === "/api/news") {
      return handleNews(request, env);
    }

    if (url.pathname.startsWith("/api/articles/")) {
      const id = decodeURIComponent(
        url.pathname.replace("/api/articles/", "")
      );

      return handleArticle(request, env, id);
    }

    /*
     * Upload sementara dinonaktifkan
     * karena project tidak menggunakan R2.
     */
    if (url.pathname === "/api/upload") {
      return json(
        {
          error: "Upload file belum tersedia karena R2 tidak digunakan."
        },
        501
      );
    }

    /*
     * =========================
     * FRONTEND REACT
     * =========================
     */

    return env.ASSETS.fetch(request);
  },
};


/* =====================================================
   NEWS API
   ===================================================== */

async function handleNews(
  request: Request,
  env: Env
): Promise<Response> {

  const { searchParams } = new URL(request.url);

  const limit = Math.min(
    parseInt(searchParams.get("limit") || "10"),
    100
  );

  const category = searchParams.get("category");
  const featured =
    searchParams.get("featured") === "true";

  const trending =
    searchParams.get("trending") === "true";

  const authorId =
    searchParams.get("author_id");

  const queryParam =
    searchParams.get("q");

  let query = `
    SELECT
      a.*,
      au.name AS author_name,
      au.avatar_url AS author_avatar,
      au.bio AS author_bio,
      au.role AS author_role
    FROM articles a
    JOIN authors au ON a.author_id = au.id
  `;

  const params: unknown[] = [];
  const conditions: string[] = [];

  if (category) {
    conditions.push("a.category = ?");
    params.push(category);
  }

  if (featured) {
    conditions.push("a.is_featured = 1");
  }

  if (trending) {
    conditions.push("a.is_trending = 1");
  }

  if (authorId) {
    conditions.push("a.author_id = ?");
    params.push(authorId);
  }

  if (queryParam) {
    conditions.push(`
      (
        a.title LIKE ?
        OR a.excerpt LIKE ?
        OR a.tags LIKE ?
      )
    `);

    const likeValue = `%${queryParam}%`;

    params.push(
      likeValue,
      likeValue,
      likeValue
    );
  }

  if (conditions.length > 0) {
    query +=
      " WHERE " +
      conditions.join(" AND ");
  }

  query += `
    ORDER BY a.published_at DESC
    LIMIT ?
  `;

  params.push(limit);

  try {

    const { results } =
      await env.DB
        .prepare(query)
        .bind(...params)
        .all();

    return json(results);

  } catch (error) {

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      500
    );
  }
}


/* =====================================================
   ARTICLE API
   ===================================================== */

async function handleArticle(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {

  try {

    const article =
      await env.DB
        .prepare(`
          SELECT
            a.*,
            au.name AS author_name,
            au.avatar_url AS author_avatar,
            au.bio AS author_bio,
            au.role AS author_role
          FROM articles a
          JOIN authors au
            ON a.author_id = au.id
          WHERE a.id = ?
             OR a.slug = ?
        `)
        .bind(id, id)
        .first();

    if (!article) {
      return json(
        {
          error: "Article not found"
        },
        404
      );
    }

    /*
     * Tambah jumlah views.
     */
    ctxWaitUntil(
      env.DB
        .prepare(`
          UPDATE articles
          SET views = views + 1
          WHERE id = ?
        `)
        .bind(article.id)
        .run()
    );

    return json(article);

  } catch (error) {

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      500
    );
  }
}


/* =====================================================
   RESPONSE HELPER
   ===================================================== */

function json(
  data: unknown,
  status = 200
): Response {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=UTF-8",
        "Cache-Control":
          "no-cache"
      }
    }
  );
}


/*
 * Helper sederhana untuk waitUntil.
 *
 * Untuk sementara tidak menggunakan
 * ExecutionContext dari handler API.
 */
function ctxWaitUntil(
  promise: Promise<unknown>
): void {

  promise.catch(() => {
    // Jangan menggagalkan response
    // hanya karena update views gagal.
  });
}
