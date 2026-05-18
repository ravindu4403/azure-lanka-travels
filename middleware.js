import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'azure_admin_session';

function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || 'azure-lanka-demo-admin-session-2026';
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token === getAdminSessionToken()) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
