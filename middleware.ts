import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  userId?: string;
  walletAddress?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "solana_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected (dashboard)
  if (pathname.startsWith("/dashboard")) {
    try {
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
      );

      // If no session, redirect to landing page
      if (!session.userId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Middleware session check error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
