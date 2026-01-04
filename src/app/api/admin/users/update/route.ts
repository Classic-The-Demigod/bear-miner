import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { targetWallet, data } = body;

        if (!targetWallet || !data) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Construct update object safely
        const updateData: any = {};
        if (data.minStakeBalance !== undefined) updateData.minStakeBalance = data.minStakeBalance;
        if (data.minDeposit !== undefined) updateData.minDeposit = data.minDeposit;
        if (data.balance !== undefined) updateData.balance = data.balance;
        if (data.tokenBalance !== undefined) updateData.tokenBalance = data.tokenBalance;
        if (data.role) updateData.role = data.role;
        if (data.targetReward !== undefined) updateData.targetReward = data.targetReward;

        const updatedUser = await prisma.user.update({
            where: { walletAddress: targetWallet },
            data: updateData
        });

        // Expert Alert: User Edited by Admin
        try {
            const { TelegramService } = await import("@/lib/telegram");
            await TelegramService.sendNotification(`
👤 <b>USER PROFILE UPDATED BY ADMIN</b>

Admin has modified a user's record manually.

🎯 <b>Target:</b> <code>${targetWallet}</code>
📊 <b>Balance:</b> ${updatedUser.balance} SOL
🐻 <b>BMT:</b> ${updatedUser.tokenBalance} $BMT
🔑 <b>Role:</b> ${updatedUser.role}

🕒 <b>Time:</b> ${new Date().toLocaleString()}
            `.trim());
        } catch (e) { console.error("User edit notify error", e); }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
