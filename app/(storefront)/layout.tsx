import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { createClient } from '@/lib/supabase/server';
import { getBrandingSettings } from '@/app/actions/branding';
import dynamic from 'next/dynamic';

const AnnouncementBanner = dynamic(() => import('@/components/layout/AnnouncementBanner'), { ssr: false });
const ServiceWorkerRegister = dynamic(() => import('@/components/layout/ServiceWorkerRegister'), { ssr: false });

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const branding = await getBrandingSettings();

  return (
    <>
      <ServiceWorkerRegister />
      <AnnouncementBanner />
      <SiteHeader user={user} branding={branding} />
      <main className="flex-grow">{children}</main>
      <SiteFooter branding={branding} />
    </>
  );
}
