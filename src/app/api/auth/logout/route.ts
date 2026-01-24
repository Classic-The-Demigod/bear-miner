import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import crypto from "crypto";

const prisma = new PrismaClient();

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "solana_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

interface SessionData {
  userId: string;
  walletAddress: string;
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

    // Get user with nonce
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user || !user.nonce) {
      return NextResponse.json(
        { error: "Invalid wallet address or nonce" },
        { status: 401 }
      );
    }

    // Verify the nonce is in the message
    if (!message.includes(user.nonce)) {
      return NextResponse.json(
        { error: "Invalid nonce in message" },
        { status: 401 }
      );
    }

    // Verify signature
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

    // Clear the nonce (prevent replay attacks)
    await prisma.user.update({
      where: { walletAddress },
      data: {
        nonce: null,
        updatedAt: new Date(),
      },
    });

    // Create session
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    session.userId = user.id;
    session.walletAddress = walletAddress;
    await session.save();

    // Also create session record in database
    await prisma.session.create({
      data: {
        token: crypto.randomBytes(32).toString("hex"),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Return user data (excluding sensitive fields)
    const { nonce: _, ...userData } = user;

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
