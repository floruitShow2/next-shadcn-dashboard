import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/news']

// 定义公开路由
const publicRoutes = ['/login', '/sign-up']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(request)
  console.log('cookie', request.cookies)
  const { pathname } = request.nextUrl

  const token = request.cookies.get('auth-token')?.value

  console.log('auth token', token)

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (token) {
    try {
      const isTokenValid = true

      if (!isTokenValid) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
      }
    } catch(err) {
      console.error('Token verification failed:', err)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
