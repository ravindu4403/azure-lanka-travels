import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Full-Day Yala Safari | Azure Lanka Travels',
  description: 'Full-day Yala safari package for wildlife lovers and photographers. Extended park time, sunrise and golden-hour safari moments.',
  alternates: { canonical: '/full-day-yala-safari' },
};

export default function FullDaySafariPage() {
  return (
    <>
      <Header />
      <main className="seo-landing-page">
        <section className="section figma-page">
          <span className="small-label left-label">Most Popular Safari</span>
          <h1 className="seo-page-title">Full-Day Yala Safari Experience</h1>
          <p className="section-intro left-intro">A full-day safari is ideal for travelers who want more time inside Yala National Park, better photography opportunities, and a deeper wildlife experience.</p>
        </section>
        <BookingForm />
      </main>
      <MobileBottomNav />
      <Footer />
    </>
  );
}
