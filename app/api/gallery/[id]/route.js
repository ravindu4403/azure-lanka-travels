import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeGalleryPatch(body = {}, existing = {}) {
  return {
    ...existing,
    title: cleanText(body.title, existing.title || 'Safari gallery item'),
    category: cleanText(body.category, existing.category || 'Wildlife'),
    status: cleanText(body.status, existing.status || 'Pending Approval'),
    type: cleanText(body.type, existing.type || 'Image'),
    imageUrl: cleanText(body.imageUrl, existing.imageUrl || '/images/animals/elephant.png'),
    alt: cleanText(body.alt, existing.alt || body.title || existing.title || 'Yala safari moment'),
    caption: cleanText(body.caption, existing.caption || ''),
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request, { params }) {
  const body = await request.json();
  const gallery = await readCollection('gallery');
  const index = gallery.findIndex((item) => item.id === params.id);
  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 });
  }
  const item = normalizeGalleryPatch(body, gallery[index]);
  gallery[index] = item;
  await writeCollection('gallery', gallery);
  return NextResponse.json({ success: true, item });
}

export async function DELETE(_request, { params }) {
  const gallery = await readCollection('gallery');
  const exists = gallery.some((item) => item.id === params.id);
  if (!exists) {
    return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 });
  }
  await writeCollection('gallery', gallery.filter((item) => item.id !== params.id));
  return NextResponse.json({ success: true });
}
