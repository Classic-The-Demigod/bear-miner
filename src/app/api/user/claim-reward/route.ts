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

        return NextResponse.json({ success: true, newBalance: updatedUser.balance });
    } catch (error: any) {
        console.error("Failed to claim reward:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
