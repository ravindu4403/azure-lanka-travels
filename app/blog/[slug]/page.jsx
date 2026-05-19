import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import { readCollection } from '@/lib/jsonDb';
import { getSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const blogs = await readCollection('blogs');
  const blog = blogs.find((item) => item.slug === params.slug && item.status === 'Published');
  if (!blog) return {};
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    openGraph: { title: blog.metaTitle || blog.title, description: blog.metaDescription || blog.excerpt, images: [blog.featuredImage] },
    alternates: { canonical: `/blog/${blog.slug}` },
  };
}

export default async function BlogDetailPage({ params }) {
  const settings = await getSiteSettings();
  const blogs = await readCollection('blogs');
  const blog = blogs.find((item) => item.slug === params.slug && item.status === 'Published');
  if (!blog) notFound();
  const paragraphs = String(blog.content || '').split(/\n+/).filter(Boolean);
  return (
    <>
      <Header />
      <main className="standalone-page blog-detail-page">
        <article className="section figma-page blog-article">
          <span className="small-label">{blog.category}</span>
          <h1>{blog.title}</h1>
          <p className="section-lead">{blog.excerpt}</p>
          <div className="blog-hero-image"><img src={blog.featuredImage || '/images/animals/leopard.png'} alt={blog.title} /></div>
          <div className="blog-content">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </article>
      </main>
      <MobileBottomNav />
      <Footer settings={settings} />
    </>
  );
}
