import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const bookings = await readCollection('bookings');
  return NextResponse.json({ success: true, bookings });
}

function normalizeMealSelections(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const persons = Math.max(1, Number(item.persons || 1));
    const priceUsd = Math.max(0, Number(item.priceUsd || 0));
    return {
      id: cleanText(item.id),
      title: cleanText(item.title),
      priceUsd,
      persons,
      lineTotalUsd: Number((priceUsd * persons).toFixed(2)),
    };
  }).filter((item) => item.title);
}

export async function POST(request) {
  const body = await request.json();
  const adults = Math.max(1, Number(body.adults || 1));
  const children = Math.max(0, Number(body.children || 0));
  const people = adults + children;
  const jeeps = Math.max(1, Math.ceil(people / 6));

  const guest = cleanText(body.name || body.guest);
  const email = cleanText(body.email);
  const whatsapp = cleanText(body.whatsapp);
  const safariPackage = cleanText(body.safariType || body.package);
  const date = cleanText(body.date);

  if (!guest || !email || !whatsapp || !safariPackage || !date) {
    return NextResponse.json({ success: false, message: 'Please complete name, email, WhatsApp, safari package and date.' }, { status: 400 });
  }

  const mealSelections = normalizeMealSelections(body.mealSelections);
  const mealTotalUsd = Number(mealSelections.reduce((sum, item) => sum + item.lineTotalUsd, 0).toFixed(2));
  const safariPriceUsd = Math.max(0, Number(body.safariPriceUsd || 0));
  const ticketTotalUsd = Math.max(0, Number(body.ticketTotalUsd || 0));
  const serviceFeeUsd = Math.max(0, Number(body.serviceFeeUsd || 0));
  const exchangeRateLkr = Math.max(0, Number(body.exchangeRateLkr || 0));
  const grandTotalUsd = Number((ticketTotalUsd + safariPriceUsd + mealTotalUsd + serviceFeeUsd).toFixed(2));

  const bookings = await readCollection('bookings');
  const booking = {
    id: makeId('BK'),
    guest,
    country: cleanText(body.country || body.nationality || 'Not selected'),
    visitorCategory: cleanText(body.visitorCategory || body.nationality || 'Not selected'),
    package: safariPackage,
    date,
    adults,
    children,
    people,
    jeeps,
    email,
    whatsapp,
    note: cleanText(body.note),
    mealPlanRequired: mealSelections.length > 0,
    mealSelections,
    safariPriceUsd,
    ticketTotalUsd,
    mealTotalUsd,
    serviceFeeUsd,
    grandTotalUsd,
    exchangeRateLkr,
    grandTotalLkr: exchangeRateLkr ? Math.round(grandTotalUsd * exchangeRateLkr) : 0,
    currency: 'USD',
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  };

  await writeCollection('bookings', [booking, ...bookings]);
  return NextResponse.json({ success: true, booking }, { status: 201 });
}
