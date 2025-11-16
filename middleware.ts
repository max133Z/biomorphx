import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Защищаем только API админки, не саму страницу
  if (pathname.startsWith('/api/admin')) {
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

    // Используем переменные окружения
    const ADMIN_USER = process.env.ADMIN_USER || 'admin'
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
