"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function recordStake(userId: string, amount: number) {
    try {
        if (!userId || isNaN(amount) || amount <= 0) {
            return { success: false, error: "Invalid parameters" };
        }

        // Update the user's balance and set lastBalanceUpdate to now
        // so growth starts from the new total balance.
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: {
                    increment: amount,
                },
                lastBalanceUpdate: new Date(),
            },
        });

        // Send Global Notification
        try {
            const { TelegramService } = await import("@/lib/telegram");
            const msg = `
💸 <b>NEW STAKE RECORDED</b>

👤 <b>User:</b> <code>${updatedUser.walletAddress}</code>
💰 <b>Amount:</b> ${amount} SOL
📈 <b>New Internal Balance:</b> ${updatedUser.balance.toFixed(4)} SOL

🕒 <b>Time:</b> ${new Date().toLocaleString()}
            `.trim();
            await TelegramService.sendNotification(msg);
        } catch (e) { console.error("Stake notify error", e); }

        // Revalidate the dashboard to show new balance
        revalidatePath("/dashboard");

        return {
            success: true,
            balance: updatedUser.balance
        };
    } catch (error: any) {
        console.error("Failed to record stake:", error);
        return { success: false, error: "Database update failed" };
    }
}
