import type { Metadata } from 'next';

export const siteConfig = {
  name: '7 Sisters Tea Co.',
  description:
    'Premium Assam CTC tea and authentic spices from Barpeta Road. Crafted & served at 7 Sisters Restro - now for your home.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/images/og-default.svg',
  locale: 'en_IN'
};

export const buildUrl = (path: string) => {
  const base = siteConfig.url.endsWith('/') ? siteConfig.url.slice(0, -1) : siteConfig.url;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: './'
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: buildUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [buildUrl(siteConfig.ogImage)]
  }
};
