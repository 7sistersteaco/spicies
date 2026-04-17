import BrandingUpload from '@/components/admin/BrandingUpload';
import CategoryImageUpload from '@/components/admin/CategoryImageUpload';
import FssaiSection from '@/components/admin/FssaiSection';
import { getBrandingSettings, updateWhatsAppNumber } from '@/app/actions/branding';
import { createAdminClient } from '@/lib/supabase/admin';
import { ShieldCheck, Info, LayoutGrid } from 'lucide-react';

export const metadata = {
  title: 'Admin | Branding Management',
  description: 'Manage website logo and favicon.'
};

export default async function BrandingPage() {
  const settings = await getBrandingSettings();

  // Fetch current category images from DB
  const supabase = createAdminClient();
  const { data: categoryRows } = await supabase
    .from('categories')
    .select('slug, image_url')
    .in('slug', ['tea', 'spices']);
  const catImages = Object.fromEntries((categoryRows || []).map(r => [r.slug, r.image_url]));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Branding Management</h1>
          <p className="text-xs text-cream/50">Control your global brand assets and identity.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Editor */}
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-10">
            {/* Logo Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Website Logo</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Displayed in the main header across the storefront.</p>
                </div>
              </div>
              <BrandingUpload 
                type="logo" 
                currentUrl={settings.logo_url} 
                fallbackUrl="/images/logo.svg" 
              />
            </div>

            {/* Favicon Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Browser Favicon</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Displayed in the browser tab and bookmarks.</p>
                </div>
              </div>
              <BrandingUpload 
                type="favicon" 
                currentUrl={settings.favicon_url} 
                fallbackUrl="/favicon.ico" 
              />
            </div>

            {/* Hero Image Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Website Hero Image</h2>
                  <p className="text-[10px] text-cream/40 font-medium">The main visual featured at the top of the homepage.</p>
                </div>
              </div>
              <BrandingUpload 
                type="hero" 
                currentUrl={settings.hero_image_url} 
                fallbackUrl="/images/hero-fallback.svg" 
              />
            </div>

            {/* Category Images Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Category Images</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Images shown in the "Shop by Category" section on the homepage. Falls back to SVG if not uploaded.</p>
                </div>
              </div>
              <div className="space-y-8">
                <CategoryImageUpload
                  slug="tea"
                  label="Tea"
                  currentUrl={catImages['tea'] || null}
                  fallbackSvg="/images/tea-hero.svg"
                />
                <div className="h-px bg-white/5" />
                <CategoryImageUpload
                  slug="spices"
                  label="Spices"
                  currentUrl={catImages['spices'] || null}
                  fallbackSvg="/images/spice-hero.svg"
                />
              </div>
            </div>

            {/* Restro Story Image Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Restro Story Image</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Photo shown in the "From Restro to Home" section on the homepage. Falls back to the SVG illustration if not uploaded.</p>
                </div>
              </div>
              <BrandingUpload
                type="restro"
                currentUrl={settings.restro_image_url}
                fallbackUrl="/images/restro-story.svg"
              />
            </div>

            {/* About Page Image Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">About Page Image</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Hero image shown on the About page beside the brand story. Falls back to SVG if not uploaded.</p>
                </div>
              </div>
              <BrandingUpload
                type="about"
                currentUrl={settings.about_image_url}
                fallbackUrl="/images/about-assam.svg"
              />
            </div>

            {/* Banner Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">Marketing Banner</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Background image for global promotional banners.</p>
                </div>
              </div>
              <BrandingUpload 
                type="banner" 
                currentUrl={settings.banner_image_url} 
                fallbackUrl="/images/banner-placeholder.svg" 
              />
            </div>

            {/* FSSAI Compliance Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">FSSAI Compliance</h2>
                  <p className="text-[10px] text-cream/40 font-medium">Food safety license number shown in footer. Certificate image shown on /compliance page.</p>
                </div>
              </div>
              <FssaiSection
                licenseNumber={settings.fssai_license_number ?? null}
                certificateUrl={settings.fssai_certificate_url ?? null}
              />
            </div>

            {/* WhatsApp Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-cream">WhatsApp Contact</h2>
                  <p className="text-[10px] text-cream/40 font-medium">The primary contact number for customer support.</p>
                </div>
              </div>
              <form action={async (formData) => {
                'use server';
                await updateWhatsAppNumber(formData);
              }} className="flex gap-4">
                <div className="flex-1">
                  <input 
                    type="text" 
                    name="whatsapp" 
                    defaultValue={settings.whatsapp_number || ''} 
                    placeholder="91XXXXXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-accent/40 transition-all font-mono"
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-accent text-ink rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-accent/90 transition-all"
                >
                  Save Number
                </button>
              </form>
              <p className="text-[10px] text-cream/30 italic">Format: Country Code + Number (e.g. 919876543210). No + or spaces.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-accent/20 bg-accent/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xs font-semibold text-cream uppercase tracking-widest leading-none">Brand Identity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5 text-accent">
                  <Info size={14} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-cream">Real-time Updates</p>
                  <p className="text-[11px] leading-relaxed text-cream/50">Branding changes take effect immediately across all client sessions after saving.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 text-accent">
                  <Info size={14} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-cream">Asset Optimization</p>
                  <p className="text-[11px] leading-relaxed text-cream/50">Logos are automatically converted to WebP for maximum performance.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 text-accent">
                  <Info size={14} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-cream">Best Practices</p>
                  <p className="text-[11px] leading-relaxed text-cream/50 text-balance italic">“Keep logos horizontal (landscape) for the best fit in the storefront header.”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
