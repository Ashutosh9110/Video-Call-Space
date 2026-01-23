import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to auth pages and API routes
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Protect account routes
  if (pathname.startsWith("/account")) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}