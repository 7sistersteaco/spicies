import Hero from '@/components/sections/Hero';
import LaunchCountdown from '@/components/sections/LaunchCountdown';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import CampaignBanner from '@/components/sections/CampaignBanner';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import CategoriesPreview from '@/components/sections/CategoriesPreview';
import BrandStory from '@/components/sections/BrandStory';
import Testimonials from '@/components/sections/Testimonials';
import ContactCTA from '@/components/sections/ContactCTA';
import { Metadata } from 'next';
import { getBrandingSettings } from '@/app/actions/branding';

export const metadata: Metadata = {
  title: '7 Sisters Tea & Co. | Authentic Assam CTC Tea & Spices',
  description: 'Experience the strong aroma of premium Assam CTC tea and hand-picked spices. Restaurant-tested quality from 7 Sisters Restro, delivered to your home.',
  alternates: {
    canonical: '/'
  }
};

export default async function HomePage() {
  const branding = await getBrandingSettings();
  
  return (
    <>
      <Hero heroImageUrl={branding.hero_image_url} />
      <LaunchCountdown />
      <AnnouncementBar />
      <CampaignBanner bannerImageUrl={branding.banner_image_url} />
      <FeaturedProducts />
      <WhyChooseUs />
      <CategoriesPreview />
      <BrandStory restroImageUrl={branding.restro_image_url} />
      <Testimonials />
      <ContactCTA />
    </>
  );
}

