import { NextResponse } from 'next/server';
import { getPricingSettings, savePricingSettings } from '@/lib/pricingSettings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const pricingSettings = await getPricingSettings();
  return NextResponse.json({ success: true, pricingSettings });
}

export async function PATCH(request) {
  const body = await request.json().catch(() => ({}));
  const pricingSettings = await savePricingSettings(body);
  return NextResponse.json({ success: true, pricingSettings, message: 'Pricing calculator settings updated.' });
}
