import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

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
  const slug = slugify(body.slug || existing.slug || title);
  return {
    ...existing,
    title,
    slug,
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

export async function GET() {
  const blogs = await readCollection('blogs');
  return NextResponse.json({ success: true, blogs });
}

export async function POST(request) {
  const body = await request.json();
  const blogs = await readCollection('blogs');
  const blog = { id: makeId('BLOG'), createdAt: new Date().toISOString(), ...normalizeBlog(body) };
  blogs.unshift(blog);
  await writeCollection('blogs', blogs);
  return NextResponse.json({ success: true, blog }, { status: 201 });
}
