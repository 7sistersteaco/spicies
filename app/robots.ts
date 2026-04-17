import { MetadataRoute } from 'next';
import { siteConfig, buildUrl } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cart', '/checkout', '/account', '/order-success', '/*?*']
    },
    sitemap: buildUrl('/sitemap.xml')
  };
}
