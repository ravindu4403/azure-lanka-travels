import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { readCollection } from '@/lib/jsonDb';
import { getSiteSettings } from '@/lib/siteSettings';


function isVideoMedia(url = '', type = '') {
  return String(type).toLowerCase() === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(String(url).split('?')[0]);
}

function PublicMedia({ item }) {
  const src = item.imageUrl || '/images/animals/leopard.png';
  if (isVideoMedia(src, item.type)) {
    return <video src={src} controls playsInline muted preload="metadata" />;
  }
  return <img src={src} alt={item.alt || item.title} loading="lazy" />;
}

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Yala Safari Gallery | Azure Lanka Travels',
  description: 'View wildlife photos, safari moments and guest memories from Azure Lanka Travels Yala safari experiences.',
  alternates: { canonical: '/gallery' },
};

export default async function GalleryPage() {
  const settings = await getSiteSettings();
  const items = (await readCollection('gallery')).filter((item) => item.status === 'Published');
  const visibleItems = items.length ? items : [
    { id: 'fallback-1', title: 'Leopard at Yala trail', category: 'Wildlife', imageUrl: '/images/animals/leopard.png', alt: 'Sri Lankan leopard in Yala National Park', caption: 'Powerful wildlife moments for serious safari lovers.' },
    { id: 'fallback-2', title: 'Elephant near waterhole', category: 'Wildlife', imageUrl: '/images/animals/elephant.png', alt: 'Asian elephant in Yala National Park', caption: 'Gentle giants photographed during a peaceful Yala drive.' },
    { id: 'fallback-3', title: 'Wild waterhole crocodile', category: 'Wildlife', imageUrl: '/images/animals/crocodile.png', alt: 'Mugger crocodile in Sri Lanka', caption: 'A rare reptile moment near Yala waterholes.' },
  ];

  const categories = ['All Moments', 'Wildlife', 'Safari Moments', 'Customer Photos', 'Videos'];

  return (
    <>
      <Header />
      <main className="standalone-page gallery-page gallery-page-luxe">
        <section className="section figma-page gallery-hero-luxe">
          <span className="small-label">Yala Safari Gallery</span>
          <h1>Wildlife & Safari Moments</h1>
          <p className="section-lead">A premium visual story of Yala National Park — wildlife portraits, safari memories, guest photos, and future video moments curated for foreign travelers.</p>
          <div className="gallery-filter-chips">
            {categories.map((category) => <span key={category}>{category}</span>)}
          </div>
        </section>

        <section className="section figma-page gallery-wall-section">
          <div className="gallery-wall">
            {visibleItems.map((item, index) => (
              <article key={item.id || item.title} className={`gallery-wall-card wall-card-${index + 1}`}>
                <div className="wall-image-stage">
                  <PublicMedia item={item} />
                </div>
                <div className="wall-card-copy">
                  <small>{item.category || 'Safari Moment'}</small>
                  <h2>{item.title}</h2>
                  <p>{item.caption || 'A beautiful published moment from Azure Lanka Travels safari experiences.'}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <MobileBottomNav />
      <Footer settings={settings} />
    </>
  );
}
