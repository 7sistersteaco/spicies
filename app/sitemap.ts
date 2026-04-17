import { MetadataRoute } from 'next';
import { siteConfig, buildUrl } from '@/lib/seo/metadata';
import { getProductsSafe } from '@/lib/products/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/products', '/about', '/contact'];
  const products = await getProductsSafe();

  const productRoutes = products.map((product) =>
    product.category === 'tea'
      ? `/products/tea/${product.slug}`
      : `/products/spices/${product.slug}`
  );

  const allRoutes = [...staticRoutes, ...productRoutes];

  return allRoutes.map((path) => {
    // Attempt to find product for this path to get lastModified
    const product = products.find(p => {
      const pPath = p.category === 'tea' 
        ? `/products/tea/${p.slug}` 
        : `/products/spices/${p.slug}`;
      return pPath === path;
    });

    return {
      url: buildUrl(path),
      lastModified: (product as any)?.updated_at ? new Date((product as any).updated_at) : new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.8
    };
  });
}
