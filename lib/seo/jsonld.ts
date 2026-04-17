import { Product } from '../products/types';
import { siteConfig, buildUrl } from './metadata';

export const getOrganizationJsonLd = (settings: any) => {
  const whatsapp = settings?.whatsapp_number || '916001258891';
  const formattedTel = `+${whatsapp.slice(0, 2)}-${whatsapp.slice(2)}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: settings?.logo_url || buildUrl('/images/logo-mark.svg'),
      width: '512',
      height: '512'
    },
    image: settings?.logo_url || buildUrl('/images/og-default.svg'),
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Barpeta Road',
      addressRegion: 'Assam',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: formattedTel,
      contactType: 'customer service',
      availableLanguage: ['English', 'Assamese', 'Hindi']
    },
    sameAs: [
      'https://www.instagram.com/7sisterstea',
      'https://www.facebook.com/7sisterstea'
    ]
  };
};

// Legacy support (static - used in non-async contexts if any)
export const organizationJsonLd = getOrganizationJsonLd({});

export const productJsonLd = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': buildUrl(`/products/${product.category}/${product.slug}/#product`),
  name: product.name,
  description: product.description,
  image: product.product_images?.map((image) => buildUrl(image.image_url)) || [],
  sku: product.variants[0]?.sku || product.slug,
  brand: {
    '@type': 'Brand',
    name: siteConfig.name
  },
  offers: {
    '@type': 'Offer',
    url: buildUrl(`/products/${product.category}/${product.slug}`),
    price: product.variants[0]?.priceInr,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition'
  }
});
