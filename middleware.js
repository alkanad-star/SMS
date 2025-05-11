import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Define protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/statistics');
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/statistics/:path*']
};