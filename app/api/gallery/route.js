import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeGalleryItem(body = {}, existing = {}) {
  return {
    ...existing,
    title: cleanText(body.title, existing.title || 'Safari gallery item'),
    category: cleanText(body.category, existing.category || 'Wildlife'),
    status: cleanText(body.status, existing.status || 'Pending Approval'),
    type: cleanText(body.type, existing.type || 'Image'),
    imageUrl: cleanText(body.imageUrl, existing.imageUrl || '/images/animals/elephant.png'),
    alt: cleanText(body.alt, existing.alt || body.title || existing.title || 'Yala safari moment'),
    caption: cleanText(body.caption, existing.caption || ''),
  };
}

export async function GET() {
  const gallery = await readCollection('gallery');
  return NextResponse.json({ success: true, gallery });
}

export async function POST(request) {
  const body = await request.json();
  const gallery = await readCollection('gallery');
  const item = {
    id: makeId('GAL'),
    createdAt: new Date().toISOString(),
    ...normalizeGalleryItem(body),
  };
  gallery.unshift(item);
  await writeCollection('gallery', gallery);
  return NextResponse.json({ success: true, item }, { status: 201 });
}
