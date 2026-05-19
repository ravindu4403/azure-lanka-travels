import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Half-Day Yala Safari | Morning & Evening Safari',
  description: 'Book a half-day Yala safari for morning wildlife movement or golden-hour evening safari moments with Azure Lanka Travels.',
  alternates: { canonical: '/half-day-yala-safari' },
};

export default function HalfDaySafariPage() {
  return (
    <>
      <Header />
      <main className="seo-landing-page">
        <section className="section figma-page">
          <span className="small-label left-label">Morning & Evening Safari</span>
          <h1 className="seo-page-title">Half-Day Yala Safari Packages</h1>
          <p className="section-intro left-intro">Choose an early morning safari for fresh wildlife activity or an evening safari for relaxed golden-hour views inside Yala National Park.</p>
        </section>
        <BookingForm />
      </main>
      <MobileBottomNav />
      <Footer />
    </>
  );
}
