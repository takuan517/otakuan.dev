import type { APIRoute } from 'astro';
import { routes } from '../data/site';
import { getWorks } from '../data/works';
export const GET: APIRoute = async ({ site }) => {
  const workPaths = (await getWorks()).filter(({ data }) => !data.sample).map(({ id }) => `/works/${id}/`);
  const urls = [...routes, ...workPaths].map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
