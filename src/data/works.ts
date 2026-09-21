import { getCollection } from 'astro:content';
export async function getWorks() {
  return (await getCollection('works', ({ data }) => data.published && data.locale === 'ja')).sort((a, b) => a.data.order - b.data.order);
}
