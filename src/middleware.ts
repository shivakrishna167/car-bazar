import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // ONLY run logic for admin routes
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')
    const isLoginPage = pathname === '/admin/login'

    // If trying to access admin pages (except login) without a session
    if (!isLoginPage && !adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // If already logged in and trying to access login page
    if (isLoginPage && adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ALL other routes are public
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

export default middleware
