import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 🛡️ Proxy Route Controller
 * Handles manual redirection and session validation for Admin and User ecosystems.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. 👑 ADMIN SESSION PROTECTION
  // Checks all routes starting with /admin (except the login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const adminSession = req.cookies.get("admin_session");

    // If no admin cookie is found, force redirect to the admin-login page
    if (!adminSession) {
      const adminLoginUrl = new URL("/admin-login", req.url);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 2. 👤 USER SESSION PROTECTION
  // Checks all routes starting with /dashboard (User ecosystem)
  if (pathname.startsWith("/dashboard")) {
    const userSession = req.cookies.get("user");

    // If no user wallet cookie is found, force redirect to the user login page
    if (!userSession) {
      const userLoginUrl = new URL("/login", req.url);
      return NextResponse.redirect(userLoginUrl);
    }
  }

  // 3. AUTHORIZED ACCESS
  // If the session is valid or the route is public, proceed to the destination
  return NextResponse.next();
}

/**
 * ⚙️ Middleware Configuration
 * This tells Next.js which paths should trigger the proxy logic.
 */
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
