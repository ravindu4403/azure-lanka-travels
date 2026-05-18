import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

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
  const title = cleanText(body.title, existing.title);
  const visibility = cleanText(body.visibility, existing.visibility || 'Draft');
  return {
    ...existing,
    id: existing.id || makeId('PKG'),
    badge: cleanText(body.badge, existing.badge || 'Safari Package'),
    title,
    price: cleanText(body.price, existing.price || 'Custom'),
    duration: cleanText(body.duration, existing.duration || 'Flexible'),
    capacity: cleanText(body.capacity, existing.capacity || '6 per jeep'),
    visibility: visibility === 'Published' ? 'Published' : 'Draft',
    featured: Boolean(body.featured ?? existing.featured ?? false),
    text: cleanText(body.text || body.description, existing.text || existing.description || ''),
    includes: normalizeIncludes(body.includes ?? existing.includes),
    updatedAt: new Date().toISOString(),
    createdAt: existing.createdAt || new Date().toISOString(),
  };
}

export async function GET() {
  const packages = await readCollection('packages');
  return NextResponse.json({ success: true, packages });
}

export async function POST(request) {
  const body = await request.json();
  const packages = await readCollection('packages');
  const safariPackage = normalizePackage(body);

  if (!safariPackage.title) {
    return NextResponse.json({ success: false, message: 'Package title is required.' }, { status: 400 });
  }

  await writeCollection('packages', [safariPackage, ...packages]);
  return NextResponse.json({ success: true, package: safariPackage }, { status: 201 });
}
