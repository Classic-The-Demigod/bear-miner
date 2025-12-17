import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function useWalletPortfolio() {
    const { publicKey, connected, connecting } = useWallet();
    const [totalValue, setTotalValue] = useState<number>(0);
    const [minStakeBalance, setMinStakeBalance] = useState<number>(1000); // Default
    const [minDeposit, setMinDeposit] = useState<number>(100); // Default
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tokens, setTokens] = useState<any[]>([]);

    const [targetReward, setTargetReward] = useState<number>(50000); // Default

    const [role, setRole] = useState<string>("USER");

    useEffect(() => {
        async function fetchPortfolio(silent = false) {
            if (!publicKey) {
                // Only treat as logged out if we are truly disconnected and not trying to connect
                if (!connected && !connecting) {
                    setTotalValue(0);
                    setTokens([]);
                    setRole("USER");
                    setIsLoading(false);
                }
                return;
            }

            if (!silent) setIsLoading(true);
            try {
                const response = await fetch(`/api/wallet/portfolio?address=${publicKey.toBase58()}`);
                if (!response.ok) throw new Error("API Error");

                const portfolio = await response.json();
                setTotalValue(portfolio.totalValueUsd);
                setTokens(portfolio.tokens);
                if (portfolio.minStakeBalance !== undefined) setMinStakeBalance(portfolio.minStakeBalance);
                if (portfolio.minDeposit !== undefined) setMinDeposit(portfolio.minDeposit);
                if (portfolio.targetReward !== undefined) setTargetReward(portfolio.targetReward);
                if (portfolio.role) setRole(portfolio.role);
            } catch (error) {
                console.error("[Hook] Failed to fetch portfolio", error);
            } finally {
                if (!silent) setIsLoading(false);
            }
        }

        fetchPortfolio();
        const interval = setInterval(() => fetchPortfolio(true), 30000);
        return () => clearInterval(interval);

    }, [publicKey]);

    return { totalValue, tokens, isLoading, minStakeBalance, minDeposit, targetReward, role };
}
