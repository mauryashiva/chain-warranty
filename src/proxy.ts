import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Check for the 'user' cookie we set during the SIWE verify step
  const user = req.cookies.get("user");

  // If no user cookie exists, they aren't logged in
  if (!user) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the cookie exists, let them through to the dashboard
  return NextResponse.next();
}

// This config tells Next.js to ONLY run this check on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
