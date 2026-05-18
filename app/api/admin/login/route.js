import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminCredentials, getAdminSessionToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const credentials = getAdminCredentials();

  if (email !== credentials.email.toLowerCase() || password !== credentials.password) {
    return NextResponse.json({ success: false, message: 'Invalid admin email or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, message: 'Admin login successful.' });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminSessionToken(),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
