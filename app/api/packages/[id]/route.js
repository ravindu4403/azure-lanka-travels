import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeIncludes(value) {
  if (Array.isArray(value)) return value.map((item) => cleanText(item)).filter(Boolean);
  return String(value || '')
    .split('\n')
    .map((item) => cleanText(item))
    .filter(Boolean);
}

function normalizePackage(body = {}, existing = {}) {
  const visibility = cleanText(body.visibility, existing.visibility || 'Draft');
  return {
    ...existing,
    badge: cleanText(body.badge, existing.badge || 'Safari Package'),
    title: cleanText(body.title, existing.title),
    price: cleanText(body.price, existing.price || 'Custom'),
    duration: cleanText(body.duration, existing.duration || 'Flexible'),
    capacity: cleanText(body.capacity, existing.capacity || '6 per jeep'),
    visibility: visibility === 'Published' ? 'Published' : 'Draft',
    featured: Boolean(body.featured ?? existing.featured ?? false),
    text: cleanText(body.text || body.description, existing.text || existing.description || ''),
    includes: normalizeIncludes(body.includes ?? existing.includes),
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request, { params }) {
  const body = await request.json();
  const id = cleanText(params.id);
  const packages = await readCollection('packages');
  const index = packages.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
  }

  const updated = normalizePackage(body, packages[index]);
  if (!updated.title) {
    return NextResponse.json({ success: false, message: 'Package title is required.' }, { status: 400 });
  }

  packages[index] = updated;
  await writeCollection('packages', packages);
  return NextResponse.json({ success: true, package: updated });
}

export async function DELETE(_request, { params }) {
  const id = cleanText(params.id);
  const packages = await readCollection('packages');
  const exists = packages.some((item) => item.id === id);

  if (!exists) {
    return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
  }

  await writeCollection('packages', packages.filter((item) => item.id !== id));
  return NextResponse.json({ success: true });
}
