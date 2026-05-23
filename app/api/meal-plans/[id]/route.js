import { NextResponse } from 'next/server';
import { cleanText, readCollection, writeCollection } from '@/lib/jsonDb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeMealPlan(body = {}, existing = {}) {
  const includes = Array.isArray(body.includes)
    ? body.includes.map((item) => cleanText(item)).filter(Boolean)
    : String(body.includesText || '').split('\n').map((item) => cleanText(item)).filter(Boolean);

  return {
    ...existing,
    title: cleanText(body.title || existing.title),
    badge: cleanText(body.badge || existing.badge || 'Meal Plan'),
    priceUsd: Math.max(0, Number(body.priceUsd ?? existing.priceUsd ?? 0)),
    description: cleanText(body.description || existing.description),
    imageUrl: cleanText(body.imageUrl || existing.imageUrl || '/images/animals/elephant.png'),
    visibility: cleanText(body.visibility || existing.visibility || 'Draft'),
    includes,
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request, { params }) {
  const body = await request.json();
  const mealPlans = await readCollection('mealPlans');
  const index = mealPlans.findIndex((item) => item.id === params.id);

  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Meal plan not found.' }, { status: 404 });
  }

  const updated = normalizeMealPlan(body, mealPlans[index]);
  mealPlans[index] = updated;
  await writeCollection('mealPlans', mealPlans);

  return NextResponse.json({ success: true, mealPlan: updated });
}

export async function DELETE(request, { params }) {
  const mealPlans = await readCollection('mealPlans');
  const exists = mealPlans.some((item) => item.id === params.id);
  if (!exists) {
    return NextResponse.json({ success: false, message: 'Meal plan not found.' }, { status: 404 });
  }

  await writeCollection('mealPlans', mealPlans.filter((item) => item.id !== params.id));
  return NextResponse.json({ success: true });
}
