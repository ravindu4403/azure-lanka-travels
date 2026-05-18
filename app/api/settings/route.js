import { NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/siteSettings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PATCH(request) {
  const body = await request.json().catch(() => ({}));
  const settings = await saveSiteSettings(body);
  return NextResponse.json({ success: true, settings, message: 'Website settings updated successfully.' });
}
