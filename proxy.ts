import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // const authSession = request.cookies.get('auth_session')

    // if (!authSession) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
