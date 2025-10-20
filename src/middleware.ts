
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
    headers: {
      cookie: `accessToken=${token}`,
    },
    cache: "no-store",
  });

  if (!res?.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const data = await res.json();
  const user = data?.data?.user || data?.user;

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
