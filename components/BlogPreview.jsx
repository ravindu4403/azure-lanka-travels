import Link from 'next/link';
import { readCollection } from '@/lib/jsonDb';

export default async function BlogPreview() {
  const blogs = (await readCollection('blogs')).filter((blog) => blog.status === 'Published').slice(0, 3);
  if (!blogs.length) return null;
  return (
    <section id="blog" className="section blog-preview-section figma-page blog-luxe-section">
      <span className="small-label">Safari Travel Guide</span>
      <h2>Latest Yala Safari Tips</h2>
      <p className="section-lead">SEO-ready travel articles help foreign tourists discover Azure Lanka Travels before they arrive in Sri Lanka.</p>
      <div className="blog-preview-grid blog-preview-grid-luxe">
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
      <div className="gallery-more-row"><Link href="/blog">View All Travel Guides</Link></div>
    </section>
  );
}
