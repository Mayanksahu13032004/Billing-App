import { NextResponse } from "next/server";

/**
 * Next.js 16 Turbopack looks specifically for this named export.
 */
export async function proxy(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // API route protection
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Page redirection (Optional but recommended)
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Ensure the matcher is strictly defined
export const config = {
  matcher: [
    "/api/bills/:path*",
    "/api/customers/:path*",
    "/api/reports/:path*",
    "/api/admin/:path*",
  ],
};