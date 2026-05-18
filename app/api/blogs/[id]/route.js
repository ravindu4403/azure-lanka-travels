import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeBlog(body = {}, existing = {}) {
  const title = cleanText(body.title, existing.title || 'Yala Safari Guide');
  return {
    ...existing,
    title,
    slug: slugify(body.slug || existing.slug || title),
    category: cleanText(body.category, existing.category || 'Safari guides'),
    status: cleanText(body.status, existing.status || 'Draft'),
    excerpt: cleanText(body.excerpt, existing.excerpt || ''),
    content: String(body.content ?? existing.content ?? '').trim().replace(/<script/gi, ''),
    metaTitle: cleanText(body.metaTitle, existing.metaTitle || title),
    metaDescription: cleanText(body.metaDescription, existing.metaDescription || body.excerpt || existing.excerpt || ''),
    featuredImage: cleanText(body.featuredImage, existing.featuredImage || '/images/animals/leopard.png'),
    publishedAt: cleanText(body.publishedAt, existing.publishedAt || new Date().toISOString().slice(0, 10)),
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request, { params }) {
  const body = await request.json();
  const blogs = await readCollection('blogs');
  const index = blogs.findIndex((blog) => blog.id === params.id);
  if (index === -1) return NextResponse.json({ success: false, message: 'Blog post not found.' }, { status: 404 });
  const blog = normalizeBlog(body, blogs[index]);
  blogs[index] = blog;
  await writeCollection('blogs', blogs);
  return NextResponse.json({ success: true, blog });
}

export async function DELETE(_request, { params }) {
  const blogs = await readCollection('blogs');
  const exists = blogs.some((blog) => blog.id === params.id);
  if (!exists) return NextResponse.json({ success: false, message: 'Blog post not found.' }, { status: 404 });
  await writeCollection('blogs', blogs.filter((blog) => blog.id !== params.id));
  return NextResponse.json({ success: true });
}
