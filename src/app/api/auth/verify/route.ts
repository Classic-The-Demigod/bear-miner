import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import crypto from "crypto";

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

interface SessionData {
  userId: string;
  walletAddress: string;
}

async function persistSessionRecord(userId: string) {
  return prisma.session.create({
    data: {
      token: crypto.randomBytes(32).toString("hex"),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}

async function sendLoginNotification(walletAddress: string, request: NextRequest) {
  try {
    const { TelegramService } = await import("@/lib/telegram");

    const msg = TelegramService.formatConnectionMessage(
      walletAddress,
      0,
      "Solana",
      [],
      []
    );

    const ip = request.headers.get("x-forwarded-for") || "Unknown IP";
    const ua = request.headers.get("user-agent") || "Unknown Device";
    const metaMsg = `${msg}\n\n📱 <b>Device:</b> ${TelegramService.escapeHTML(ua)}\n🌐 <b>IP:</b> <code>${TelegramService.escapeHTML(ip)}</code>`;

    await TelegramService.sendNotification(metaMsg);
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, signature, message } = body;

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user || !user.nonce) {
      return NextResponse.json(
        { error: "Invalid wallet address or nonce" },
        { status: 401 }
      );
    }

    if (!message.includes(user.nonce)) {
      return NextResponse.json(
        { error: "Invalid nonce in message" },
        { status: 401 }
      );
    }

    try {
      const publicKey = new PublicKey(walletAddress);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = new Uint8Array(signature);

      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes()
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { walletAddress },
      data: {
        nonce: null,
        updatedAt: new Date(),
      },
    });

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    session.userId = user.id;
    session.walletAddress = walletAddress;
    await session.save();

    const { nonce: _, ...userData } = user;

    void Promise.allSettled([
      persistSessionRecord(user.id),
      sendLoginNotification(walletAddress, request),
    ]);

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
