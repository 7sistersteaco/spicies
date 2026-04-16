import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { isAdmin } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import BrandingUpload from '@/components/admin/BrandingUpload';
import { getBrandingSettings } from '@/app/actions/branding';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Admin | Branding Management',
  description: 'Manage website logo and favicon.'
};

export default async function BrandingPage() {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/admin');

  const settings = await getBrandingSettings();

  return (
    <Section className="pt-12 pb-24">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/40 hover:text-accent transition-colors mb-2"
              >
                <ChevronLeft className="w-3 h-3" />
                Back to Dashboard
              </a>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-3xl font-semibold md:text-4xl text-cream">Branding Management</h1>
              </div>
              <p className="text-sm text-cream/60">Control your global brand assets and identity.</p>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Logo Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-medium text-cream">Website Logo</h2>
                <span className="text-[10px] uppercase tracking-widest text-cream/30">Header logo</span>
              </div>
              <BrandingUpload 
                type="logo" 
                currentUrl={settings.logo_url} 
                fallbackUrl="/images/logo.svg" // Replace with actual default if different
              />
            </div>

            {/* Favicon Section */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-medium text-cream">Browser Favicon</h2>
                <span className="text-[10px] uppercase tracking-widest text-cream/30">Browser tab icon</span>
              </div>
              <BrandingUpload 
                type="favicon" 
                currentUrl={settings.favicon_url} 
                fallbackUrl="/favicon.ico" 
              />
            </div>

            {/* Help/Guide Section */}
            <div className="lux-surface p-6 bg-accent/5 border-accent/10">
              <h3 className="text-sm font-semibold text-cream uppercase tracking-widest mb-4">Branding Insights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-xs text-cream/60 leading-relaxed">
                  <p>• <strong>Transitions:</strong> Branding changes take effect immediately across all pages after save.</p>
                  <p>• <strong>WebP Optimization:</strong> Logos are automatically converted to WebP for high-speed performance.</p>
                </div>
                <div className="space-y-2 text-xs text-cream/60 leading-relaxed">
                  <p>• <strong>Fallback:</strong> If no asset is uploaded, the system automatically uses the hardcoded defaults.</p>
                  <p>• <strong>Dimensions:</strong> Keep logos wide/horizontal for the best header fit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
