import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const auth = req.headers.get("authorization");
  if (password && auth?.startsWith("Basic ")) {
    try {
      if (atob(auth.slice(6)) === `admin:${password}`) {
        return NextResponse.next();
      }
    } catch {}
  }
  return new NextResponse("需要登录", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
