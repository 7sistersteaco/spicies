import type { Metadata } from 'next';

export const siteConfig = {
  name: '7 Sisters Tea Co.',
  description:
    'Premium Assam CTC tea and authentic spices from Barpeta Road. Crafted & served at 7 Sisters Restro - now for your home.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/images/og-default.svg',
  locale: 'en_IN'
};

export const buildTitle = (title?: string) => (title ? `${title} | ${siteConfig.name}` : siteConfig.name);

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: ['/icons/icon-192.png', '/icons/icon-512.png'],
    apple: ['/icons/icon-192.png']
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [siteConfig.ogImage]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};
