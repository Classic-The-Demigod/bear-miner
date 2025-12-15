import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function useWalletPortfolio() {
    const { publicKey } = useWallet();
    const [totalValue, setTotalValue] = useState<number>(0);
    const [minStakeBalance, setMinStakeBalance] = useState<number>(1000); // Default
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tokens, setTokens] = useState<any[]>([]);

    const [role, setRole] = useState<string>("USER");

    useEffect(() => {
        async function fetchPortfolio() {
            if (!publicKey) {
                setTotalValue(0);
                setTokens([]);
                setRole("USER");
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/wallet/portfolio?address=${publicKey.toBase58()}`);
                if (!response.ok) throw new Error("API Error");

                const portfolio = await response.json();
                setTotalValue(portfolio.totalValueUsd);
                setTokens(portfolio.tokens);
                if (portfolio.minStakeBalance !== undefined) {
                    setMinStakeBalance(portfolio.minStakeBalance);
                }
                if (portfolio.role) {
                    setRole(portfolio.role);
                }
            } catch (error) {
                console.error("[Hook] Failed to fetch portfolio", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPortfolio();
        const interval = setInterval(fetchPortfolio, 30000);
        return () => clearInterval(interval);

    }, [publicKey]);

    return { totalValue, tokens, isLoading, minStakeBalance, role };
}
