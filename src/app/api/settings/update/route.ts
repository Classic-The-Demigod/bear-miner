import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Allow partial updates
        const {
            solWallet,
            telegramBotToken,
            telegramChatId,
            twilioAccountSid,
            twilioAuthToken,
            twilioPhoneNumber,
            whatsappEnabled,
            bearTokenPrice
        } = body;

        // Upsert with merged data
        const settings = await prisma.globalSettings.upsert({
            where: { id: 1 },
            update: {
                ...(solWallet && { solWallet }),
                ...(telegramBotToken !== undefined && { telegramBotToken }),
                ...(telegramChatId !== undefined && { telegramChatId }),
                ...(twilioAccountSid !== undefined && { twilioAccountSid }),
                ...(twilioAuthToken !== undefined && { twilioAuthToken }),
                ...(twilioPhoneNumber !== undefined && { twilioPhoneNumber }),
                ...(whatsappEnabled !== undefined && { whatsappEnabled }),
                ...(bearTokenPrice !== undefined && { bearTokenPrice: parseFloat(bearTokenPrice) }),
            },
            create: {
                id: 1,
                ...(solWallet && { solWallet }),
                telegramBotToken,
                telegramChatId,
                twilioAccountSid,
                twilioAuthToken,
                twilioPhoneNumber,
                whatsappEnabled: whatsappEnabled || false,
                bearTokenPrice: parseFloat(bearTokenPrice || "0")
            }
        });

        // Expert Alert: Settings Updated
        try {
            const { TelegramService } = await import("@/lib/telegram");
            await TelegramService.sendNotification(`
⚙️ <b>GLOBAL SETTINGS UPDATED</b>

Admin has updated the platform configuration.

🏦 <b>Treasury SOL:</b> <code>${settings.solWallet}</code>
🐻 <b>BMT Price:</b> $${settings.bearTokenPrice}
📱 <b>WhatsApp:</b> ${settings.whatsappEnabled ? "Enabled" : "Disabled"}

🕒 <b>Time:</b> ${new Date().toLocaleString()}
            `.trim());
        } catch (e) { console.error("Settings notify error", e); }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
