

import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/bills/:path*",
    "/api/customers/:path*",
    "/api/reports/:path*",
    "/api/admin/:path*",
  ],
};
