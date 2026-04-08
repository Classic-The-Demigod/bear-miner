import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SETTINGS_TIMEOUT_MS = 1200;
const SETTINGS_TIMEOUT = Symbol("settings-timeout");

function getDefaultSettings() {
  return {
    id: 1,
    solWallet: "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb",
    btcWallet: null,
    ethWallet: null,
    telegramBotToken: null,
    telegramChatId: null,
    twilioAccountSid: null,
    twilioAuthToken: null,
    twilioPhoneNumber: null,
    whatsappEnabled: false,
    bearTokenPrice: 0,
    updatedAt: new Date(),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown settings error";
}

export async function GET() {
  try {
    const settings = await Promise.race([
      prisma.globalSettings.findUnique({
        where: { id: 1 },
      }),
      new Promise<typeof SETTINGS_TIMEOUT>((resolve) => {
        setTimeout(() => resolve(SETTINGS_TIMEOUT), SETTINGS_TIMEOUT_MS);
      }),
    ]);

    if (settings === SETTINGS_TIMEOUT) {
      console.warn(`[Settings API] Timed out after ${SETTINGS_TIMEOUT_MS}ms. Returning fallback settings.`);
      return NextResponse.json(getDefaultSettings());
    }

    return NextResponse.json(settings ?? getDefaultSettings());
  } catch (error) {
    console.error(`[Settings API] Failed to fetch global settings: ${getErrorMessage(error)}`);
    return NextResponse.json(getDefaultSettings());
  }
}
