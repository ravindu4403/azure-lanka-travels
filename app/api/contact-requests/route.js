import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const requests = await readCollection('contactRequests');
  return NextResponse.json({ success: true, requests });
}

export async function POST(request) {
  const body = await request.json();
  const name = cleanText(body.name);
  const email = cleanText(body.email);
  const whatsapp = cleanText(body.whatsapp);
  const subject = cleanText(body.subject || 'General travel inquiry');
  const message = cleanText(body.message);

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, message: 'Please complete name, email and message.' }, { status: 400 });
  }

  const requests = await readCollection('contactRequests');
  const item = {
    id: makeId('CT'),
    name,
    email,
    whatsapp,
    subject,
    message,
    status: 'New',
    submittedAt: new Date().toISOString(),
  };
  await writeCollection('contactRequests', [item, ...requests]);
  return NextResponse.json({ success: true, request: item }, { status: 201 });
}
