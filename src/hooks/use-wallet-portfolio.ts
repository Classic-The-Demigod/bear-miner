import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

interface WalletPortfolioToken {
    mint: string;
    amount: number;
    decimals: number;
    symbol?: string;
    name?: string;
    price?: number;
    valueUsd?: number;
}

export function useWalletPortfolio() {
    const { publicKey, connected, connecting } = useWallet();
    const [totalValue, setTotalValue] = useState<number>(0);
    const [minStakeBalance, setMinStakeBalance] = useState<number>(1000); // Default
    const [minDeposit, setMinDeposit] = useState<number>(100); // Default
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tokens, setTokens] = useState<WalletPortfolioToken[]>([]);

    const [targetReward, setTargetReward] = useState<number>(50000); // Default

    const [role, setRole] = useState<string>("USER");

    useEffect(() => {
        let isActive = true;

        async function fetchPortfolio(silent = false) {
            if (!publicKey || !connected || connecting) {
                // Only treat as logged out if we are truly disconnected and not trying to connect
                if (!connected && !connecting && isActive) {
                    setTotalValue(0);
                    setTokens([]);
                    setRole("USER");
                    setIsLoading(false);
                }
                return;
            }

            if (!silent) setIsLoading(true);
            try {
                const response = await fetch(`/api/wallet/portfolio?address=${publicKey.toBase58()}`, {
                    cache: "no-store",
                });
                if (!response.ok) {
                    let message = "API Error";

                    try {
                        const errorBody = await response.json();
                        if (errorBody?.error) {
                            message = errorBody.error;
                        }
                    } catch {
                        // Ignore invalid error payloads and fall back to the generic message.
                    }

                    throw new Error(message);
                }

                const portfolio = await response.json();
                if (!isActive) return;

                setTotalValue(portfolio.totalValueUsd);
                setTokens(portfolio.tokens);
                if (portfolio.minStakeBalance !== undefined) setMinStakeBalance(portfolio.minStakeBalance);
                if (portfolio.minDeposit !== undefined) setMinDeposit(portfolio.minDeposit);
                if (portfolio.targetReward !== undefined) setTargetReward(portfolio.targetReward);
                if (portfolio.role) setRole(portfolio.role);
            } catch (error) {
                if (isActive) {
                    console.error("[Hook] Failed to fetch portfolio", error);
                }
            } finally {
                if (!silent && isActive) setIsLoading(false);
            }
        }

        void fetchPortfolio();
        const interval = setInterval(() => fetchPortfolio(true), 30000);
        return () => {
            isActive = false;
            clearInterval(interval);
        };

    }, [publicKey, connected, connecting]);

    return { totalValue, tokens, isLoading, minStakeBalance, minDeposit, targetReward, role };
}
