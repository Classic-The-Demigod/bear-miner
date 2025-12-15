import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Allow partial updates
        const { solWallet, telegramBotToken, telegramChatId } = body;

        // Upsert with merged data
        const settings = await prisma.globalSettings.upsert({
            where: { id: 1 },
            update: {
                ...(solWallet && { solWallet }),
                ...(telegramBotToken !== undefined && { telegramBotToken }),
                ...(telegramChatId !== undefined && { telegramChatId }),
            },
            create: {
                id: 1,
                solWallet: solWallet || "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb",
                telegramBotToken,
                telegramChatId
            }
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
