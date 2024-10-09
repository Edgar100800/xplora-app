import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  try {
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
  } catch (e) {
    console.error('Error in middleware:', e)
    // If there's an error parsing the cookie, we'll clear it
    res.cookies.delete('supabase-auth-token')
  }
  return res
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}