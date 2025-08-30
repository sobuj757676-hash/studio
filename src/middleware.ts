import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session');

  const isStudentRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/materials') || pathname.startsWith('/exams') || pathname.startsWith('/results') || pathname.startsWith('/transactions');
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  const studentLoginUrl = new URL('/login', request.url);
  const adminLoginUrl = new URL('/admin/login', request.url);
  const studentDashboardUrl = new URL('/dashboard', request.url);
  const adminDashboardUrl = new URL('/admin/dashboard', request.url);

  // If there's no session cookie
  if (!sessionCookie) {
    if (isStudentRoute) {
      return NextResponse.redirect(studentLoginUrl);
    }
    if (isAdminRoute) {
      return NextResponse.redirect(adminLoginUrl);
    }
    return NextResponse.next();
  }

  // If there is a session, try to verify it
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      headers: {
        Cookie: `__session=${sessionCookie.value}`,
      },
    });
    
    const { user } = await response.json();
    
    if (!user) {
        if (isStudentRoute) return NextResponse.redirect(studentLoginUrl);
        if (isAdminRoute) return NextResponse.redirect(adminLoginUrl);
    }

    if (pathname === '/login' || pathname === '/admin/login') {
        if (user.role === 'admin') return NextResponse.redirect(adminDashboardUrl);
        if (user.role === 'student') return NextResponse.redirect(studentDashboardUrl);
    }

    if (isStudentRoute && user.role !== 'student') {
        return NextResponse.redirect(adminDashboardUrl);
    }
    if (isAdminRoute && user.role !== 'admin') {
        return NextResponse.redirect(studentDashboardUrl);
    }

  } catch (error) {
    console.error('Middleware verification error:', error);
    // If verification fails, redirect to login
    if (isStudentRoute) {
      return NextResponse.redirect(studentLoginUrl);
    }
    if (isAdminRoute) {
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes, we will handle auth there individually)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
