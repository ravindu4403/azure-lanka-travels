import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];

export async function PATCH(request, { params }) {
  const body = await request.json();
  const status = cleanText(body.status);

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid booking status.' }, { status: 400 });
  }

  const bookings = await readCollection('bookings');
  const index = bookings.findIndex((booking) => booking.id === params.id);

  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Booking request not found.' }, { status: 404 });
  }

  const updated = {
    ...bookings[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updated;
  await writeCollection('bookings', bookings);

  return NextResponse.json({ success: true, booking: updated });
}
