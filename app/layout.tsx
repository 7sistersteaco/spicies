import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';
import { baseMetadata } from '@/lib/seo/metadata';
import { organizationJsonLd } from '@/lib/seo/jsonld';
import { createClient } from '@/lib/supabase/server';
import ProgressBar from '@/components/ui/ProgressBar';
import { Suspense } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { getBrandingSettings } from '@/app/actions/branding';

const headingFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap'
});

const bodyFont = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBrandingSettings();
  
  return {
    ...baseMetadata,
    icons: settings.favicon_url ? {
      icon: settings.favicon_url,
      shortcut: settings.favicon_url,
      apple: settings.favicon_url,
    } : baseMetadata.icons
  };
}

export const viewport: Viewport = {
  themeColor: '#0B0B0B'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const branding = await getBrandingSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var m=window.matchMedia('(prefers-color-scheme: dark)');var r=t==='system'?(m.matches?'dark':'light'):t;var d=document.documentElement;d.classList.toggle('theme-light',r==='light');d.classList.toggle('theme-dark',r==='dark');d.dataset.theme=r;}catch(e){}})();`
          }}
        />
      </head>
      <body className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-ink text-cream`}>
        <ToastProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <ServiceWorkerRegister />
          <SiteHeader user={user} branding={branding} />
          <main>{children}</main>
          <SiteFooter />
        </ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
