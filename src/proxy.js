import { NextResponse } from 'next/server';

export function proxy(request) {
  const path = request.nextUrl.pathname;

  // Define admin routes
  if (path.startsWith('/admin')) {
    // Skip protection for login page to avoid infinite redirect
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');

    if (!adminSession || adminSession.value !== 'authenticated') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
