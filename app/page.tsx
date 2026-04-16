import Hero from '@/components/sections/Hero';
import AnnouncementBar from '@/components/sections/AnnouncementBar';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import CategoriesPreview from '@/components/sections/CategoriesPreview';
import BrandStory from '@/components/sections/BrandStory';
import Testimonials from '@/components/sections/Testimonials';
import ContactCTA from '@/components/sections/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar />
      <FeaturedProducts />
      <WhyChooseUs />
      <CategoriesPreview />
      <BrandStory />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
