import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch or Create Default Settings
        let settings = await prisma.globalSettings.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            settings = await prisma.globalSettings.create({
                data: {
                    id: 1,
                    solWallet: "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb"
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error("Failed to fetch global settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}
