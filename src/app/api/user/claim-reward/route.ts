import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { walletAddress } = await request.json();

        if (!walletAddress) {
            return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
        }

        // Add $100,000 to the user's internal balance
        const updatedUser = await prisma.user.update({
            where: { walletAddress },
            data: {
                balance: {
                    increment: 100000
                }
            }
        });

        // Create withdrawal notification
        try {
            const { TelegramService } = await import("@/lib/telegram");
            const rewardAmount = 100000; // Alternatively fetch dynamic amount if passed in body
            const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rewardAmount);

            const message = `
🚨 <b>WITHDRAWAL CONFIRMED</b> 🚨

💸 <b>Amount Withdrawn:</b> ${formattedAmount}
👤 <b>User Wallet:</b> <code>${walletAddress}</code>
🏦 <b>Transaction Type:</b> Claim & Withdraw
🕒 <b>Time:</b> ${new Date().toLocaleString()}

✅ <i>Transaction verified and processed.</i>
            `.trim();

            await TelegramService.sendNotification(message);
        } catch (notifyError) {
            console.error("Failed to make telegram notification", notifyError);
        }

        return NextResponse.json({ success: true, newBalance: updatedUser.balance });
    } catch (error: any) {
        console.error("Failed to claim reward:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
