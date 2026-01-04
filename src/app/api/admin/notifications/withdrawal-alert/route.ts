import { NextRequest, NextResponse } from "next/server";
import { TelegramService } from "@/lib/telegram";

export async function POST(request: NextRequest) {
    try {
        const { coinKind, amount, walletAddress } = await request.json();

        const message = `
⚠️ <b>MISSING WITHDRAWAL WALLET</b>

A user tried to withdraw tokens, but no admin wallet is configured for this coin type.

🔹 <b>Coin Kind:</b> ${coinKind}
🔹 <b>User Wallet:</b> <code>${walletAddress}</code>
🔹 <b>Estimated Amount:</b> ${amount} ${coinKind}

✅ <b>Action Required:</b> 
Please add an admin wallet for <b>${coinKind}</b> in the Payment Wallets section of the Admin Dashboard.
        `.trim();

        await TelegramService.sendNotification(message);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[API] Failed to send missing wallet alert:", error);
        return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
    }
}
