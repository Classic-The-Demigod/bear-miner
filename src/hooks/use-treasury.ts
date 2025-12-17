import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface TreasuryInfo {
    address: string;
    symbol: string;
    network: string;
}

export function useTreasury(symbol: string = "SOL") {
    const [address, setAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchTreasury = async () => {
            try {
                // 1. Fetch Global Settings (Primary Source for SOL)
                const settingsRes = await fetch("/api/settings/wallets");
                const settings = await settingsRes.json();

                if (!mounted) return;

                if (symbol === "SOL") {
                    // Priority: Global Settings > Payment Wallet > Empty
                    if (settings?.solWallet) {
                        setAddress(settings.solWallet);
                        setIsLoading(false);
                        return;
                    }
                }

                // 2. If not SOL or not in Global, check Payment Wallets
                const walletsRes = await fetch("/api/admin/wallets");
                const wallets = await walletsRes.json();

                if (!mounted) return;

                if (Array.isArray(wallets)) {
                    const match = wallets.find((w: any) =>
                        w.symbol.toUpperCase() === symbol.toUpperCase() && w.isEnabled
                    );

                    if (match) {
                        setAddress(match.address);
                    } else {
                        // If specifically looking for SOL and failed all checks
                        if (symbol === "SOL") {
                            // Fallback to the known default if DB is empty (failsafe)
                            // But we prefer empty string to show loading/error state if strict.
                            // User requested "change it to that sol wallet".
                            // We'll leave it empty to prompt configuration if missing.
                        } else {
                            setError(`No treasury wallet configured for ${symbol}`);
                        }
                    }
                }

            } catch (err) {
                console.error("Treasury fetch error:", err);
                if (mounted) setError("Failed to load treasury settings");
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchTreasury();

        return () => { mounted = false; };
    }, [symbol]);

    return { address, isLoading, error };
}
