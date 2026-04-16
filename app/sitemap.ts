import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';
import { products } from '@/lib/products/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = ['', '/products', '/about', '/contact', '/cart', '/checkout'];

  const productRoutes = products.map((product) =>
    product.category === 'tea'
      ? `/products/tea/${product.slug}`
      : `/products/spices/${product.slug}`
  );

  return [...staticRoutes, ...productRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
