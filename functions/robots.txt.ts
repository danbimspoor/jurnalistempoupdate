export const onRequest: PagesFunction = async () => {
  const robots = `User-agent: *
Allow: /

Sitemap: https://jurnalistempo-update.pages.dev/sitemap.xml
`;
  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
