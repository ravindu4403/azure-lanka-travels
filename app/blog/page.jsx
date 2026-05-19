import Link from 'next/link';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { readCollection } from '@/lib/jsonDb';
import { getSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Yala Safari Travel Blog | Azure Lanka Travels',
  description: 'Read Yala safari booking tips, wildlife guides and Sri Lanka travel advice from Azure Lanka Travels.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const settings = await getSiteSettings();
  const blogs = (await readCollection('blogs')).filter((blog) => blog.status === 'Published');
  return (
    <>
      <Header />
      <main className="standalone-page blog-list-page blog-page-luxe">
        <section className="section figma-page blog-hero-luxe">
          <span className="small-label">Yala Safari Blog</span>
          <h1>Travel Guides For Your Sri Lanka Safari</h1>
          <p className="section-lead">Helpful articles for foreign tourists planning Yala National Park safaris, jeep bookings, wildlife encounters and Sri Lanka travel days.</p>
        </section>
        <section className="section figma-page blog-wall-section">
          <div className="blog-preview-grid blog-preview-grid-luxe full-blog-grid">
            {blogs.map((blog, index) => (
              <article key={blog.id} className={`blog-preview-card blog-tone-${(index % 3) + 1}`}>
                <Link className="blog-image-link" href={`/blog/${blog.slug}`}>
                  <div className="blog-card-image blog-fit-image">
                    <img className="blog-fit-animal" src={blog.featuredImage || '/images/animals/leopard.png'} alt={blog.title} loading="lazy" />
                    <div className="blog-image-glow" />
                  </div>
                </Link>
                <div className="blog-card-copy">
                  <span>{blog.category}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <Link href={`/blog/${blog.slug}`}>Read guide <b>→</b></Link>
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
