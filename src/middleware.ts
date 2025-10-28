import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {

  const token = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard'];
  const authRoutes = ['/login'];

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  console.log(isAuthRoute)

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}