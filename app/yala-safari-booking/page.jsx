import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Yala Safari Booking | Azure Lanka Travels',
  description: 'Book a Yala National Park safari with Azure Lanka Travels. Choose full-day, morning or evening safari packages with fast WhatsApp booking support.',
  alternates: { canonical: '/yala-safari-booking' },
};

export default function YalaSafariBookingPage() {
  return (
    <>
      <Header />
      <main className="seo-landing-page">
        <section className="section figma-page">
          <span className="small-label left-label">Yala Safari Booking</span>
          <h1 className="seo-page-title">Book Your Yala National Park Safari</h1>
          <p className="section-intro left-intro">Plan a safe and memorable Yala safari with local support, comfortable jeeps, clear booking steps, and quick WhatsApp communication.</p>
        </section>
        <BookingForm />
        <FAQSection />
      </main>
      <MobileBottomNav />
      <Footer />
    </>
  );
}
