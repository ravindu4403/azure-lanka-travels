import { NextResponse } from 'next/server';
import { cleanText, makeId, readCollection, writeCollection } from '@/lib/jsonDb';

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
  };
}

export async function GET() {
  const mealPlans = await readCollection('mealPlans');
  return NextResponse.json({ success: true, mealPlans });
}

export async function POST(request) {
  const body = await request.json();
  const title = cleanText(body.title);
  if (!title) {
    return NextResponse.json({ success: false, message: 'Meal plan title is required.' }, { status: 400 });
  }

  const mealPlans = await readCollection('mealPlans');
  const mealPlan = {
    id: makeId('MEAL'),
    ...normalizeMealPlan(body),
    createdAt: new Date().toISOString(),
  };

  await writeCollection('mealPlans', [mealPlan, ...mealPlans]);
  return NextResponse.json({ success: true, mealPlan }, { status: 201 });
}
