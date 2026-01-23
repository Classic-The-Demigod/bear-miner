// components/section-cards.tsx
"use client";
import { IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import StakeModal from "./modals/stake-modal";
import WithdrawModal from "./modals/withdraw-modal";

interface SectionCardsProps {
  id: string;
  name: string | null;
  email: string | null;
  walletAddress: string;
  balance: number | null;
  walletBalance: number | null; // Added for Net Worth persistence
  tokenBalance: number | null;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  image: string | null;
  lastUpdated?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function SectionCards({ user }: { user?: SectionCardsProps | null }) {
  const [currentBalance, setCurrentBalance] = useState(user?.balance ?? 0);
  const [currentTokenBalance, setCurrentTokenBalance] = useState(
    user?.tokenBalance ?? 0
  );
  const [mounted, setMounted] = useState(false);
  const { totalValue, isLoading: isPortfolioLoading } = useWalletPortfolio();
  const [copied, setCopied] = useState(false);

  const [solPrice, setSolPrice] = useState(0);
  const [bmtPrice, setBmtPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);

  useEffect(() => {
    // Fetch SOL Price & Change from DexScreener
    const fetchPrice = async () => {
      try {
        const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112");
        const data = await res.json();
        const pair = data.pairs?.[0];

        if (pair) {
          setSolPrice(parseFloat(pair.priceUsd));
          setPriceChange24h(pair.priceChange.h24);
        }

        // Also fetch Global Settings for BMT Price
        const settingsRes = await fetch("/api/settings/wallets");
        const settings = await settingsRes.json();
        if (settings && settings.bearTokenPrice !== undefined) {
          setBmtPrice(settings.bearTokenPrice);
        }
      } catch (e) {
        console.error("Failed to fetch prices", e);
      }
    };
    fetchPrice();
    // Refresh prices every minute
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast.success("Wallet address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.balance || user.balance <= 0) return;

    // Smooth real-time growth: 2% daily calculated every 100ms
    // Rate: 0.02 / (24 * 60 * 60 * 10)
    const growthPerTick = 0.02 / 864000;

    const interval = setInterval(() => {
      setCurrentBalance((prev) => prev * (1 + growthPerTick));
    }, 100);

    return () => clearInterval(interval);
  }, [user?.balance]);

  // Calculate growth percentage
  // Calculate USD Value Growth (Yield + Price Action)
  // Base 2% daily yield + 24h price change
  const combinedGrowth = ((1.02 * (1 + (priceChange24h / 100))) - 1) * 100;

  const dailyEarningsSOL = currentBalance * 0.02;
  const totalBalanceUSD = currentBalance * solPrice;

  // Net Worth Logic
  const netWorthValue = totalValue > 0 ? totalValue : (user?.walletBalance ?? 0);
  const isNetWorthLoading = isPortfolioLoading && totalValue === 0;

  return (
    <div className="flex justify-center w-full px-4">
      <Card className="@container/card w-full max-w-4xl relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/5 ring-1 ring-border/50 flex flex-col justify-between min-h-[500px]">
        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
          <IconTrendingUp className="w-64 h-64" />
        </div>

        {/* TOP STATUS BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 z-10 relative gap-4">
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md Order-2 md:order-1"
          >
            <IconTrendingUp className="w-3 h-3 mr-1" />
            Mining Active
          </Badge>

          {/* Connected Wallet Pill */}
          <div
            onClick={copyAddress}
            className="flex items-center gap-3 bg-background/60 hover:bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-1.5 cursor-pointer transition-colors group order-1 md:order-2 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              {user?.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : "Not Connected"}
            </span>
            <span className="text-border/40 h-3 w-px mx-1"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Solana</span>
            {copied ? <Check className="h-3 w-3 text-green-500 ml-1" /> : <Copy className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />}
          </div>
        </div>

        {/* MAIN BALANCE */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 relative px-4 text-center">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Total Balance</span>

          <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter flex flex-wrap justify-center items-baseline gap-2 leading-none filter drop-shadow-sm">
            {currentBalance.toFixed(4)}
            <div className="flex items-center gap-2">
              <img src="/img/solana-logo.svg" alt="SOL" className="h-8 w-8 md:h-12 md:w-12" />
              <span className="text-2xl md:text-4xl text-primary font-bold">SOL</span>
            </div>
          </h2>

          {solPrice > 0 && (
            <p className="text-lg md:text-xl font-medium text-muted-foreground mt-4 flex items-center gap-2 bg-muted/40 px-5 py-2 rounded-full border border-border/50">
              ≈ ${totalBalanceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-bold opacity-70">USD</span>
            </p>
          )}

          {/* 3-COLUMN STATS GRID */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl px-4">

            {/* 1. Daily Yield */}
            <div className="bg-background/60 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm flex flex-col items-center justify-center gap-1 hover:bg-background/80 transition-colors group">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary/80 transition-colors">Daily Yield</p>
              <p className="text-lg font-bold text-green-500 flex items-center justify-center gap-1">
                +{(currentBalance * 0.02).toFixed(4)} SOL
              </p>
              {solPrice > 0 && (
                <p className="text-[10px] text-muted-foreground/60">
                  ≈ ${((currentBalance * 0.02) * solPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              )}
            </div>

            {/* 2. Bear Holdings (New) */}
            <div className="bg-background/60 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm flex flex-col items-center justify-center gap-1 hover:bg-background/80 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-yellow-600 transition-colors z-10">Bear Holdings</p>
              <div className="flex items-center justify-center gap-1.5 z-10">
                <span className="text-lg">🐻</span>
                <span className="text-lg font-black text-foreground">
                  {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currentTokenBalance)}
                </span>
                <span className="text-xs font-bold text-yellow-600">$BMT</span>
              </div>
              {bmtPrice > 0 && (
                <p className="text-[10px] text-muted-foreground/60 z-10">
                  ≈ ${(currentTokenBalance * bmtPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              )}
            </div>

            {/* 3. Growth */}
            <div className="bg-background/60 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm flex flex-col items-center justify-center gap-1 hover:bg-background/80 transition-colors group">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary/80 transition-colors">Growth (24h)</p>
              <p className={`text-lg font-bold flex items-center justify-center gap-1 ${combinedGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {combinedGrowth >= 0 ? '+' : ''}{combinedGrowth.toFixed(4)}%
              </p>
            </div>

          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <CardFooter className="flex-col pb-8 pt-4 px-8 z-10 relative">
          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
            {mounted ? (
              <>
                <StakeModal userId={user?.id} />
                <WithdrawModal availableSol={currentBalance} solPrice={solPrice} />
              </>
            ) : (
              <>
                <div className="h-12 bg-muted animate-pulse rounded-xl" />
                <div className="h-12 bg-muted animate-pulse rounded-xl" />
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
