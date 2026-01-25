module.exports = [
"[project]/src/lib/portfolio.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PortfolioService",
    ()=>PortfolioService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@solana/web3.js/lib/index.esm.js [app-route] (ecmascript)");
;
const TOKEN_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PublicKey"]("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const TOKEN_2022_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PublicKey"]("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
class PortfolioService {
    static async getPortfolio(address) {
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://solana-rpc.publicnode.com";
        const connection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Connection"](rpcUrl, "confirmed");
        const publicKey = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PublicKey"](address);
        let solBalanceLamports = 0;
        try {
            solBalanceLamports = await connection.getBalance(publicKey);
        } catch (e) {
            console.error("Failed to get SOL balance", e);
        }
        const solBalance = solBalanceLamports / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LAMPORTS_PER_SOL"];
        // Fetch Token Accounts
        const [tokenAccounts, token2022Accounts] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID
            }),
            connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_2022_PROGRAM_ID
            }).catch(()=>({
                    value: []
                }))
        ]);
        const tokens = [];
        const nfts = [];
        const mintsToFetchPrice = [
            "So11111111111111111111111111111111111111112"
        ];
        const processAccounts = (accounts)=>{
            for (const { account } of accounts){
                const parsedInfo = account.data.parsed.info;
                const mint = parsedInfo.mint;
                const amount = parsedInfo.tokenAmount.uiAmount;
                const decimals = parsedInfo.tokenAmount.decimals;
                if (amount > 0) {
                    if (decimals === 0 && amount === 1) {
                        nfts.push({
                            mint,
                            amount
                        });
                    } else {
                        tokens.push({
                            mint,
                            amount,
                            decimals
                        });
                        mintsToFetchPrice.push(mint);
                    }
                }
            }
        };
        processAccounts(tokenAccounts.value);
        if (token2022Accounts && token2022Accounts.value) {
            processAccounts(token2022Accounts.value);
        }
        // Fetch Prices (DexScreener)
        const uniqueMints = Array.from(new Set(mintsToFetchPrice));
        const ids = uniqueMints.slice(0, 30).join(",");
        let prices = {};
        if (ids.length > 0) {
            try {
                const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ids}`);
                const data = await response.json();
                if (data.pairs) {
                    data.pairs.forEach((pair)=>{
                        const mint = pair.baseToken.address;
                        if (!prices[mint]) {
                            prices[mint] = {
                                priceUsd: parseFloat(pair.priceUsd),
                                symbol: pair.baseToken.symbol,
                                name: pair.baseToken.name
                            };
                        }
                    });
                }
            } catch (e) {
                console.error("DexScreener failed", e);
            }
        }
        let totalValueUsd = 0;
        const solPrice = prices["So11111111111111111111111111111111111111112"]?.priceUsd || 0;
        if (solPrice > 0) totalValueUsd += solBalance * solPrice;
        const enrichedTokens = tokens.map((t)=>{
            const p = prices[t.mint];
            const val = p ? t.amount * p.priceUsd : 0;
            totalValueUsd += val;
            return {
                ...t,
                symbol: p?.symbol || "Unknown",
                name: p?.name || "Unknown Asset",
                price: p?.priceUsd || 0,
                valueUsd: val
            };
        }).sort((a, b)=>b.valueUsd - a.valueUsd);
        return {
            totalValueUsd,
            tokens: enrichedTokens,
            nfts,
            solBalance
        };
    }
}
}),
];

//# sourceMappingURL=src_lib_portfolio_ts_be6fa3ce._.js.map