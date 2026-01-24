import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export interface SessionData {
  userId?: string;
  walletAddress?: string;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "solana_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

// Helper to get current user from session
export async function getCurrentUser() {
  const session = await getSession();

  if (!session.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}
