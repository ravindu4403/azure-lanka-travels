import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowed = ['New', 'Contacted', 'Closed', 'Spam'];

export async function PATCH(request, { params }) {
  const body = await request.json();
  const status = cleanText(body.status);
  if (!allowed.includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid contact request status.' }, { status: 400 });
  }
  const requests = await readCollection('contactRequests');
  const index = requests.findIndex((item) => item.id === params.id);
  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Contact request not found.' }, { status: 404 });
  }
  requests[index] = { ...requests[index], status, updatedAt: new Date().toISOString() };
  await writeCollection('contactRequests', requests);
  return NextResponse.json({ success: true, request: requests[index] });
}
