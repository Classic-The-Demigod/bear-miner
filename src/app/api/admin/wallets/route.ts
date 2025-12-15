import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: List all wallets
export async function GET() {
    try {
        const wallets = await prisma.paymentWallet.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(wallets);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
    }
}

// POST: Add a new wallet
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, symbol, network, address } = body;

        if (!name || !symbol || !network || !address) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const wallet = await prisma.paymentWallet.create({
            data: {
                name,
                symbol,
                network,
                address,
                isEnabled: true
            }
        });

        return NextResponse.json(wallet);
    } catch (error: any) {
        console.error("Wallet create error:", error);
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
    }
}
