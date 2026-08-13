import { onRequestPost as __api_auth_login_ts_onRequestPost } from "/app/applet/functions/api/auth/login.ts"
import { onRequestPost as __api_auth_logout_ts_onRequestPost } from "/app/applet/functions/api/auth/logout.ts"
import { onRequestGet as __api_auth_me_ts_onRequestGet } from "/app/applet/functions/api/auth/me.ts"
import { onRequest as __api_articles__id__ts_onRequest } from "/app/applet/functions/api/articles/[id].ts"
import { onRequest as __api_news_ts_onRequest } from "/app/applet/functions/api/news.ts"
import { onRequest as __api_upload_ts_onRequest } from "/app/applet/functions/api/upload.ts"
import { onRequest as __robots_txt_ts_onRequest } from "/app/applet/functions/robots.txt.ts"
import { onRequest as __rss_xml_ts_onRequest } from "/app/applet/functions/rss.xml.ts"
import { onRequest as __sitemap_xml_ts_onRequest } from "/app/applet/functions/sitemap.xml.ts"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_ts_onRequestGet],
    },
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
  ]