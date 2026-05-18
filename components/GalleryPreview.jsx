import Link from 'next/link';
import { readCollection } from '@/lib/jsonDb';

const fallbackItems = [
  { imageUrl: '/images/animals/leopard.png', title: 'Leopard sightings', category: 'Wildlife', alt: 'Sri Lankan leopard in Yala National Park', caption: 'A rare big-cat moment that makes Yala unforgettable.' },
  { imageUrl: '/images/animals/elephant.png', title: 'Elephant encounters', category: 'Wildlife', alt: 'Asian elephant in Yala National Park', caption: 'Gentle giants, golden light, and peaceful waterhole scenes.' },
  { imageUrl: '/images/animals/deer.png', title: 'Golden grasslands', category: 'Landscapes', alt: 'Spotted deer in Sri Lanka safari grasslands', caption: 'Soft morning light across the open Yala grasslands.' },
  { imageUrl: '/images/animals/crocodile.png', title: 'Wild waterholes', category: 'Wildlife', alt: 'Mugger crocodile in Sri Lanka', caption: 'Ancient reptiles resting near quiet Yala waterholes.' },
];

export default async function GalleryPreview() {
  const allItems = await readCollection('gallery');
  const items = allItems.filter((item) => item.status === 'Published').slice(0, 4);
  const visibleItems = items.length ? items : fallbackItems;

  return (
    <section id="gallery" className="section gallery-section figma-page gallery-luxury-section">
      <div className="gallery-title-row">
        <div>
          <span className="small-label">Safari Moments</span>
          <h2 className="center-title">Gallery Preview</h2>
          <p className="section-lead">A cinematic glimpse of wildlife, jeep moments, golden landscapes, and guest memories from Yala safari experiences.</p>
        </div>
        <Link className="gallery-mini-cta" href="/gallery">Explore full gallery</Link>
      </div>

      <div className="safari-gallery-stage">
        {visibleItems.map((item, index) => (
          <article key={item.id || item.title} className={`safari-shot-card safari-shot-${index + 1}`}>
            <div className="safari-shot-bg" />
            <img src={item.imageUrl || '/images/animals/leopard.png'} alt={item.alt || item.title} />
            <div className="safari-shot-content">
              <small>{item.category || 'Safari Moment'}</small>
              <strong>{item.title}</strong>
              <p>{item.caption || 'A beautiful moment captured during a Yala safari experience.'}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="gallery-more-row"><Link href="/gallery">View Full Gallery</Link></div>
    </section>
  );
}
