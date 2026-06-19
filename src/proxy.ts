import NextAuth from "next-auth";
import { authConfig } from "../auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/track") ||
    nextUrl.pathname.startsWith("/coach") ||
    nextUrl.pathname.startsWith("/simulate") ||
    nextUrl.pathname.startsWith("/challenges") ||
    nextUrl.pathname.startsWith("/achievements") ||
    nextUrl.pathname.startsWith("/reports") ||
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/settings");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin route protection
  if (nextUrl.pathname.startsWith("/admin")) {
    const userRole = (req.auth?.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
