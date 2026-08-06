import { onRequest as __api_articles__id__ts_onRequest } from "/app/applet/functions/api/articles/[id].ts"
import { onRequest as __api_news_ts_onRequest } from "/app/applet/functions/api/news.ts"
import { onRequest as __api_upload_ts_onRequest } from "/app/applet/functions/api/upload.ts"
import { onRequest as __robots_txt_ts_onRequest } from "/app/applet/functions/robots.txt.ts"
import { onRequest as __rss_xml_ts_onRequest } from "/app/applet/functions/rss.xml.ts"
import { onRequest as __sitemap_xml_ts_onRequest } from "/app/applet/functions/sitemap.xml.ts"
import { onRequest as __test_ts_onRequest } from "/app/applet/functions/test.ts"

export const routes = [
    {
      routePath: "/api/articles/:id",
      mountPath: "/api/articles",
      method: "",
      middlewares: [],
      modules: [__api_articles__id__ts_onRequest],
    },
  {
      routePath: "/api/news",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_news_ts_onRequest],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_upload_ts_onRequest],
    },
  {
      routePath: "/robots.txt",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__robots_txt_ts_onRequest],
    },
  {
      routePath: "/rss.xml",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__rss_xml_ts_onRequest],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__sitemap_xml_ts_onRequest],
    },
  {
      routePath: "/test",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__test_ts_onRequest],
    },
  ]