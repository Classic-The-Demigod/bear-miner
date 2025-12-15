import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { targetWallet, data } = body;

        if (!targetWallet || !data) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { walletAddress: targetWallet },
            data: data
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
