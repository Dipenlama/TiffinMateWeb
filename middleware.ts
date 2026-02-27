import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that do not require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api',
  '/_next',
  '/assets',
  '/favicon.ico',
  '/icon.png',
  '/manifest.json',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public and static assets
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // support both legacy `token` and `auth_token`
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Root route: send admins to admin dashboard, others to dashboard, unauthenticated to login
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    if (token) {
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    } else {
      url.pathname = '/login';
    }
    return NextResponse.redirect(url);
  }

  // Protected routes: redirect to login when no token
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // preserve intended path to return after login if needed
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Role gating: restrict admin routes to admin role when available
  if (pathname.startsWith('/admin') && role && role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Authenticated: allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};