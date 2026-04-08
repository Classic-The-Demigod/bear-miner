import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PortfolioService, type PortfolioData } from "@/lib/portfolio";

export const dynamic = 'force-dynamic';

const DEFAULT_MIN_STAKE_BALANCE = 1000.0;
const DEFAULT_MIN_DEPOSIT = 100.0;
const DEFAULT_TARGET_REWARD = 50000.0;
const PORTFOLIO_TIMEOUT_MS = 8000;

function getErrorMessage(error: unknown) {
    if (!(error instanceof Error)) {
        return "Unknown portfolio provider error";
    }

    if (error.message.includes("403")) {
        return "Portfolio provider returned 403 Forbidden";
    }

    if (error.message.includes("504") || error.message.includes("Gateway time-out")) {
        return "Portfolio provider timed out";
    }

    return error.message;
}

function getDbErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown database error";
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    let minStakeBalance = DEFAULT_MIN_STAKE_BALANCE;
    let minDeposit = DEFAULT_MIN_DEPOSIT;
    let targetReward = DEFAULT_TARGET_REWARD;
    let role = "USER";
    let cachedBalance = 0;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { walletAddress: address }
        });

        if (existingUser) {
            minStakeBalance = existingUser.minStakeBalance;
            minDeposit = existingUser.minDeposit ?? DEFAULT_MIN_DEPOSIT;
            targetReward = existingUser.targetReward;
            role = existingUser.role;
            cachedBalance = existingUser.walletBalance ?? 0;
        }
    } catch (dbError) {
        console.error(`[API] User Lookup Error: ${getDbErrorMessage(dbError)}`);
    }

    let portfolio: PortfolioData = {
        totalValueUsd: cachedBalance,
        tokens: [],
        nfts: [],
        solBalance: 0,
    };
    let portfolioUnavailable = false;

    try {
        portfolio = await Promise.race([
            PortfolioService.getPortfolio(address),
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error(`Portfolio request timed out after ${PORTFOLIO_TIMEOUT_MS}ms`)), PORTFOLIO_TIMEOUT_MS);
            }),
        ]);

        try {
            await prisma.user.upsert({
                where: { walletAddress: address },
                update: {
                    walletBalance: portfolio.totalValueUsd,
                    lastBalanceUpdate: new Date()
                },
                create: {
                    walletAddress: address,
                    walletBalance: portfolio.totalValueUsd,
                    minStakeBalance: DEFAULT_MIN_STAKE_BALANCE,
                    minDeposit: DEFAULT_MIN_DEPOSIT,
                    targetReward: DEFAULT_TARGET_REWARD,
                    role: "USER"
                }
            });
        } catch (dbError) {
            console.error(`[API] DB Sync Error: ${getDbErrorMessage(dbError)}`);
        }
    } catch (error) {
        portfolioUnavailable = true;
        console.error(`[API] Portfolio Provider Unavailable: ${getErrorMessage(error)}`);
    }

    return NextResponse.json({
        totalValueUsd: portfolio.totalValueUsd,
        tokens: portfolio.tokens,
        nfts: portfolio.nfts,
        minStakeBalance,
        minDeposit,
        targetReward,
        role,
        portfolioUnavailable,
    });
}
