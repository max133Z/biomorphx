import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin'
const ADMIN_ENABLED = (process.env.ADMIN_ENABLED || '1') === '1'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!ADMIN_ENABLED) {
      return new NextResponse('Not Found', { status: 404 })
    }
    const auth = req.headers.get('authorization')

    if (!auth || !auth.startsWith('Basic ')) {
      return new NextResponse('Auth required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' },
      })
    }

    const [, encoded] = auth.split(' ')
    // Edge runtime: используем atob вместо Buffer
    const decoded = atob(encoded)
    const [user, pass] = decoded.split(':')

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
