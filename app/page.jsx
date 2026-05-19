import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import AnimalsSection from '@/components/AnimalsSection';
import PackagesSection from '@/components/PackagesSection';
import BookingForm from '@/components/BookingForm';
import GalleryPreview from '@/components/GalleryPreview';
import ReviewsSection from '@/components/ReviewsSection';
import ContactSection from '@/components/ContactSection';
import SeoContentSection from '@/components/SeoContentSection';
import FAQSection from '@/components/FAQSection';
import BlogPreview from '@/components/BlogPreview';
import MobileBottomNav from '@/components/MobileBottomNav';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/Footer';
import { getSiteSettings, getWhatsappUrl } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const settings = await getSiteSettings();
  const keywords = String(settings.seoKeywords || '').split(',').map((item) => item.trim()).filter(Boolean);
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    keywords,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      url: settings.domain,
      siteName: settings.siteName,
      images: [{ url: settings.ogImage, width: 1200, height: 630 }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [settings.ogImage],
    },
    alternates: { canonical: '/' },
  };
}

export default async function Home() {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd settings={settings} />
      <Header />
      <main>
        <Hero settings={settings} />
        <WhyChooseUs />
        <AnimalsSection />
        <PackagesSection />
        <BookingForm settings={settings} />
        <SeoContentSection />
        <GalleryPreview />
        <BlogPreview />
        <ReviewsSection />
        <FAQSection />
        <ContactSection settings={settings} />
      </main>
      <a className="sticky-whatsapp" href={getWhatsappUrl(settings)} target="_blank" aria-label="Chat on WhatsApp"><span>WhatsApp</span><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 4C9.44 4 4.08 9.35 4.08 15.95c0 2.1.55 4.15 1.6 5.96L4 28l6.25-1.64a11.9 11.9 0 0 0 5.79 1.47h.01c6.6 0 11.96-5.36 11.96-11.95C28 9.36 22.64 4 16.04 4Zm0 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.71.98.99-3.62-.24-.37a9.83 9.83 0 0 1-1.51-5.24c0-5.49 4.47-9.95 9.96-9.95 2.66 0 5.16 1.04 7.04 2.92a9.86 9.86 0 0 1 2.91 7.03c0 5.49-4.47 9.85-10.03 9.85Zm5.46-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg></a>
      <MobileBottomNav />
      <Footer settings={settings} />
    </>
  );
}
