import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const requests = await readCollection('accommodationRequests');
  return NextResponse.json({ success: true, requests });
}

export async function POST(request) {
  const body = await request.json();
  const name = cleanText(body.name);
  const email = cleanText(body.email);
  const whatsapp = cleanText(body.whatsapp);
  const location = cleanText(body.location);
  const checkIn = cleanText(body.checkIn);
  const checkOut = cleanText(body.checkOut);
  const guests = Math.max(1, Number(body.guests || 1));

  if (!name || !email || !whatsapp || !location || !checkIn || !checkOut) {
    return NextResponse.json({ success: false, message: 'Please complete name, contact details, location and dates.' }, { status: 400 });
  }

  const requests = await readCollection('accommodationRequests');
  const item = {
    id: makeId('AR'),
    name,
    email,
    whatsapp,
    location,
    checkIn,
    checkOut,
    guests,
    budget: cleanText(body.budget || 'Flexible'),
    roomType: cleanText(body.roomType || 'Any suitable room'),
    note: cleanText(body.note),
    status: 'New',
    submittedAt: new Date().toISOString(),
  };
  await writeCollection('accommodationRequests', [item, ...requests]);
  return NextResponse.json({ success: true, request: item }, { status: 201 });
}
