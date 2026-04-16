import { Product } from '../products/types';
import { siteConfig } from './metadata';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo-mark.svg`,
  foundingPlace: 'Barpeta Road, Assam, India',
  brand: siteConfig.name,
  parentOrganization: '7 Sisters Restro'
};

export const productJsonLd = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images.map((image) => `${siteConfig.url}${image.url}`),
  sku: product.variants[0]?.sku,
  brand: {
    '@type': 'Brand',
    name: siteConfig.name
  },
  offers: {
    '@type': 'Offer',
    price: product.variants[0]?.priceInr,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock'
  }
});
