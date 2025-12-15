import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";
import { TelegramService } from "@/lib/telegram";

// Standard Token Program IDs
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

export const dynamic = 'force-dynamic'; // Prevent caching of balance

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    try {
        // Use verified RPC
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://solana-rpc.publicnode.com";
        const connection = new Connection(rpcUrl, "confirmed");
        const publicKey = new PublicKey(address);

        // 1. Fetch SOL Balance
        console.log(`[API] Fetching SOL balance for ${address} using RPC: ${rpcUrl}`);
        let solBalanceLamports = 0;
        try {
            solBalanceLamports = await connection.getBalance(publicKey);
            console.log(`[API] Raw Lamports: ${solBalanceLamports}`);
        } catch (e: any) {
            console.error(`[API] Failed to get SOL balance: ${e.message}`, e);
            return NextResponse.json({ error: `Connection failed: ${e.message}` }, { status: 500 });
        }

        const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;
        console.log(`[API] SOL Balance: ${solBalance}`);

        // 2. Fetch Token Accounts (Standard + Token-2022)
        // We fetch both in parallel for speed
        console.log(`[API] Fetching token accounts...`);
        const [tokenAccounts, token2022Accounts] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }),
            connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID }).catch((err) => {
                console.log(`[API] Token-2022 fetch failed: ${err.message}`);
                return { value: [] };
            }),
        ]);
        console.log(`[API] Found ${tokenAccounts.value.length} Standard and ${token2022Accounts?.value?.length || 0} 2022 tokens`);

        const tokens: any[] = [];
        const mintsToFetchPrice: string[] = ["So11111111111111111111111111111111111111112"]; // Always fetch SOL price

        const processAccounts = (accounts: any[]) => {
            for (const { account } of accounts) {
                const parsedInfo = account.data.parsed.info;
                const mint = parsedInfo.mint;
                const amount = parsedInfo.tokenAmount.uiAmount;
                const decimals = parsedInfo.tokenAmount.decimals;

                if (amount > 0) {
                    tokens.push({ mint, amount, decimals });
                    mintsToFetchPrice.push(mint);
                }
            }
        };

        processAccounts(tokenAccounts.value);
        if (token2022Accounts && token2022Accounts.value) {
            processAccounts(token2022Accounts.value);
        }

        // 3. Fetch Prices from DexScreener
        const uniqueMints = Array.from(new Set(mintsToFetchPrice));

        // DexScreener supports up to 30 addresses. We limit to top 30.
        const ids = uniqueMints.slice(0, 30).join(",");
        let prices: Record<string, number> = {};

        if (ids.length > 0) {
            try {
                const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ids}`);
                const data = await response.json();

                if (data.pairs) {
                    data.pairs.forEach((pair: any) => {
                        const mint = pair.baseToken.address;
                        const price = parseFloat(pair.priceUsd);
                        // DexScreener might return multiple pairs. We just take the first valid price found for a mint.
                        if (!prices[mint]) {
                            prices[mint] = price;
                        }
                    });
                }
            } catch (e) {
                console.error("DexScreener API failed:", e);
            }
        }

        let totalValueUsd = 0;

        // Calculate SOL Value
        const solPrice = prices["So11111111111111111111111111111111111111112"] || 0;
        let solValue = 0;
        if (solPrice > 0) {
            solValue = solBalance * solPrice;
            totalValueUsd += solValue;
        }

        // Calculate Token Values
        for (const token of tokens) {
            const price = prices[token.mint] || 0;
            if (price > 0) {
                const value = token.amount * price;
                token.price = price;
                token.valueUsd = value;
                totalValueUsd += value;
            }
        }

        // Sort tokens by value
        tokens.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));

        // Add SOL to start of list if it has balance
        if (solBalance > 0) {
            tokens.unshift({
                mint: "So11111111111111111111111111111111111111112",
                amount: solBalance,
                decimals: 9,
                symbol: "SOL",
                price: solPrice,
                valueUsd: solValue
            });
        }

        // Update User in Database with new Wallet Net Worth
        // 4. Get User Settings (Prioritize Read)
        let minStakeBalance = 1000.0;

        if (address) {
            try {
                // Try to find existing user first to get their settings
                const existingUser = await prisma.user.findUnique({
                    where: { walletAddress: address }
                });

                let role = 'USER';

                if (existingUser) {
                    minStakeBalance = existingUser.minStakeBalance;
                    role = existingUser.role;
                    console.log(`[API] Found existing user ${address}. DB minStakeBalance: ${minStakeBalance}, Role: ${role}`);
                } else {
                    console.log(`[API] User ${address} not found. Using default 1000.`);
                }

                // Update balance in background (or await if critical, but we want fast reads)
                // We use upsert here to ensure creation if it didn't exist (race condition safety)

                // NOTIFICATION LOGIC:
                // We want to notify if it's a NEW user or if they haven't been active for a while (e.g. 1 hour)
                const now = new Date();
                const lastUpdate = existingUser?.lastBalanceUpdate || new Date(0);
                const timeDiff = now.getTime() - lastUpdate.getTime();
                const ONE_HOUR = 60 * 60 * 1000;

                const shouldNotify = !existingUser || timeDiff > ONE_HOUR;

                if (shouldNotify) {
                    const message = TelegramService.formatConnectionMessage(address, totalValueUsd, tokens);
                    // Send in background so we don't slow down response
                    TelegramService.sendNotification(message).catch(e => console.error("Notification failed", e));
                }

                await prisma.user.upsert({
                    where: { walletAddress: address },
                    update: {
                        walletBalance: totalValueUsd,
                        lastBalanceUpdate: new Date()
                    },
                    create: {
                        walletAddress: address,
                        walletBalance: totalValueUsd,
                        minStakeBalance: 1000.0, // Default for NEW users only
                        role: 'USER'
                    }
                });

                return NextResponse.json({
                    totalValueUsd,
                    tokens,
                    minStakeBalance,
                    role
                });

            } catch (dbError: any) {
                console.error(`[API] DB Error: ${dbError.message}`);
                // If read failed, we stick to default. If write failed, we at least tried to read.
            }
        }

        console.log(`[API] Returning response - Total: ${totalValueUsd}, MinStake: ${minStakeBalance}`);

        return NextResponse.json({
            totalValueUsd,
            tokens,
            minStakeBalance,
            role: 'USER'
        });

    } catch (error: any) {
        console.error("[API] FINAL CATCH Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch portfolio" }, { status: 500 });
    }
}
