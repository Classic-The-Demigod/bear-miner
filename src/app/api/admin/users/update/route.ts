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
        if (data.role) updateData.role = data.role;
        if (data.targetReward !== undefined) updateData.targetReward = data.targetReward;

        const updatedUser = await prisma.user.update({
            where: { walletAddress: targetWallet },
            data: updateData
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
