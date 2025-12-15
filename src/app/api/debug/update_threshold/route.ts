import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    const amount = searchParams.get("amount");

    if (!address || !amount) {
        return NextResponse.json({ error: "Address and amount required" }, { status: 400 });
    }

    try {
        const user = await prisma.user.update({
            where: { walletAddress: address },
            data: { minStakeBalance: parseFloat(amount) }
        });
        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
