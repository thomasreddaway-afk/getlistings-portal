import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Demo mode - set to true to bypass authentication for local development
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/api/leads/facebook', // Facebook webhook needs to be public
];

// Paths that start with these prefixes are public
const publicPrefixes = [
  '/_next',
  '/favicon',
  '/api/webhooks', // All webhooks are public
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In demo mode, allow all access without authentication
  if (DEMO_MODE) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path);
  const isPublicPrefix = publicPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isPublicPath || isPublicPrefix) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value;

  // If no token and not on login page, redirect to login
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
