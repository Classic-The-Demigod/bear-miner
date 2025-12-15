import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Standard Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const TOKEN_2022_PROGRAM_ID = new PublicKey(
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

interface TokenPortfolioItem {
    mint: string;
    amount: number;
    decimals: number;
    symbol?: string;
    price?: number;
    valueUsd?: number;
}

interface WalletPortfolio {
    totalValueUsd: number;
    tokens: TokenPortfolioItem[];
}

/**
 * Fetches the total value of a wallet in USD by:
 * 1. Fetching SOL balance
 * 2. Fetching all parsed token accounts (Standard & Token-2022)
 * 3. Fetching prices via DexScreener API (Public & Reliable)
 * 4. Aggregating the total value
 */
export async function getWalletPortfolio(
    connection: Connection,
    walletAddress: string
): Promise<WalletPortfolio> {
    try {
        const publicKey = new PublicKey(walletAddress);

        // 1. Fetch SOL Balance
        const solBalanceLamports = await connection.getBalance(publicKey);
        const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

        // 2. Fetch Token Accounts (Standard + Token-2022)
        const [tokenAccounts, token2022Accounts] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            }),
            connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_2022_PROGRAM_ID,
            }).catch(() => ({ value: [] })), // Catch error if RPC doesn't support Token-2022 or fails
        ]);

        const tokens: TokenPortfolioItem[] = [];
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

        // If no tokens and no SOL, return 0
        if (uniqueMints.length === 0) {
            return { totalValueUsd: 0, tokens: [] };
        }

        // DexScreener allows up to 30 addresses. We limit to top 30 if user has many.
        // Ideally we batch requests, but for MVP we take top 30 distinct mints.
        const ids = uniqueMints.slice(0, 30).join(",");

        let prices: Record<string, number> = {};

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

        let totalValueUsd = 0;

        // Calculate SOL Value
        // DexScreener treats Wrapped SOL as So111...
        // Sometimes accessing just specific mint is needed.
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

        return {
            totalValueUsd,
            tokens,
        };
    } catch (error) {
        console.error("Error fetching wallet portfolio:", error);
        return {
            totalValueUsd: 0,
            tokens: [],
        };
    }
}
