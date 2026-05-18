import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedStatuses = ['pending', 'approved', 'rejected'];

export async function PATCH(request, { params }) {
  const body = await request.json();
  const status = String(body.status || '').toLowerCase();

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid review status.' }, { status: 400 });
  }

  const reviews = await readCollection('reviews');
  const nextReviews = reviews.map((review) => review.id === params.id ? { ...review, status } : review);
  const updated = nextReviews.find((review) => review.id === params.id);

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Review not found.' }, { status: 404 });
  }

  await writeCollection('reviews', nextReviews);
  return NextResponse.json({ success: true, review: updated });
}
