import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function isExpired(token?: string) {
  if (!token) return true;
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;

    // refresh if within 30s of expiry => but during that time the user can navigate
    // to the auth pages even while they have the valid access token
    // return Date.now() >= decoded.exp * 1000 - 30 * 1000;
  } catch {
    return true;
  }
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const path = req.nextUrl.pathname;
  const cookieHeader = req.headers.get("cookie") || "";

  const publicRoutes = ["/auth/signin", "/auth/signup", "/auth/reset-password"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  if (isPublicRoute && accessToken && !isExpired(accessToken)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute) {
    if (!accessToken || isExpired(accessToken)) {
      if (refreshToken) {
        try {
          const response = await fetch(
            `${req.nextUrl.origin}/api/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                cookie: cookieHeader,
              },
            }
          );

          if (response.status === 200) {
            const { accessToken: newAccessToken } = await response.json();
            const res = NextResponse.next();
            res.cookies.set("accessToken", newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              maxAge: 60 * 1,
            });
            return res;
          }
        } catch (err) {
          console.error("Refresh failed:", err);
        }
      }

      const redirectUrl = new URL("/auth/signin", req.url);
      redirectUrl.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/auth/:path*", "/news/:path*", "/request", "/consultation-request", "/ad-server/:path*", "/settings/:path*"],
};
