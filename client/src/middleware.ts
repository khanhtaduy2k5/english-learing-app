import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that are only for unauthenticated users
const publicAuthPaths = ["/login", "/register"];

// Paths that are completely public (including landing page)
const publicPaths = ["/", ...publicAuthPaths];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if current path is a public path
  // Exactly matches "/" or starts with "/login" or "/register"
  const isPublicPath = publicPaths.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path),
  );

  const isPublicAuthPath = publicAuthPaths.some((path) =>
    pathname.startsWith(path),
  );

  const isRegisterPath = pathname.startsWith("/register");

  // Let /register load once so the stale token can be cleared on the client.
  if (isRegisterPath && token) {
    const response = NextResponse.next();
    response.cookies.set("refreshToken", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
    return response;
  }

  // Redirect authenticated users away from login
  if (isPublicAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login for all protected paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
