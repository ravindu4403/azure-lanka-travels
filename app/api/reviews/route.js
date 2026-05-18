import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const reviews = await readCollection('reviews');
  const filtered = status ? reviews.filter((review) => review.status === status) : reviews;
  return NextResponse.json({ success: true, reviews: filtered });
}

export async function POST(request) {
  const body = await request.json();
  const name = cleanText(body.name);
  const country = cleanText(body.country);
  const text = cleanText(body.text || body.comment);
  const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));

  if (!name || !country || !text) {
    return NextResponse.json({ success: false, message: 'Please add name, country and review message.' }, { status: 400 });
  }

  const reviews = await readCollection('reviews');
  const review = {
    id: makeId('REV'),
    name,
    country,
    rating,
    text,
    status: 'pending',
    source: 'Website',
    submittedAt: new Date().toISOString().slice(0, 10),
  };

  await writeCollection('reviews', [review, ...reviews]);
  return NextResponse.json({ success: true, review }, { status: 201 });
}
