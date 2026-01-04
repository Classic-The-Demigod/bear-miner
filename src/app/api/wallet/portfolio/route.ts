import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PortfolioService } from "@/lib/portfolio";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    try {
        // 1. Fetch Full Portfolio using the Expert Service
        const portfolio = await PortfolioService.getPortfolio(address);

        // 2. Fetch User Settings (Prioritize Read)
        let minStakeBalance = 1000.0;
        let minDeposit = 100.0;
        let targetReward = 50000.0;
        let role = 'USER';

        try {
            const existingUser = await prisma.user.findUnique({
                where: { walletAddress: address }
            });

            if (existingUser) {
                minStakeBalance = existingUser.minStakeBalance;
                minDeposit = existingUser.minDeposit ?? 100.0;
                targetReward = existingUser.targetReward;
                role = existingUser.role;
            }

            // 3. Upsert User Balance
            await prisma.user.upsert({
                where: { walletAddress: address },
                update: {
                    walletBalance: portfolio.totalValueUsd,
                    lastBalanceUpdate: new Date()
                },
                create: {
                    walletAddress: address,
                    walletBalance: portfolio.totalValueUsd,
                    minStakeBalance: 1000.0,
                    minDeposit: 100.0,
                    targetReward: 50000.0,
                    role: 'USER'
                }
            });

        } catch (dbError: any) {
            console.error(`[API] DB Sync Error: ${dbError.message}`);
        }

        return NextResponse.json({
            totalValueUsd: portfolio.totalValueUsd,
            tokens: portfolio.tokens,
            nfts: portfolio.nfts,
            minStakeBalance,
            minDeposit,
            targetReward,
            role
        });

    } catch (error: any) {
        console.error("[API] Portfolio Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch portfolio" }, { status: 500 });
    }
}
