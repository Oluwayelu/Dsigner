import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "No token provided." },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  try {
    const decoded = await verifyJwt(token);

    const response = NextResponse.next();
    response.cookies.set("userId", decoded.userId, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (error) {
    console.error(error);
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/api/dashboard/:path*",
    "/onboarding/:path*",
    "/dashboard/:path*",
  ], // Apply middleware to protected routes
};
