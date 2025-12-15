// components/section-cards.tsx
"use client";
import { IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";
import {
  Card,
  CardAction,
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
  name: string | null; // Changed: can be null now
  email: string | null; // Changed: can be null now
  walletAddress: string; // NEW: Added wallet address
  balance: number | null;
  tokenBalance: number | null;
  emailVerified: boolean; // Keep for backward compatibility
  role: "USER" | "ADMIN";
  image: string | null;
  lastUpdated?: string;
  createdAt: Date; // NEW: Added for consistency
  updatedAt: Date; // NEW: Added for consistency
}

export function SectionCards({ user }: { user?: SectionCardsProps | null }) {
  const [currentBalance, setCurrentBalance] = useState(user?.balance ?? 0);
  const [currentTokenBalance, setCurrentTokenBalance] = useState(
    user?.tokenBalance ?? 0
  );
  const [mounted, setMounted] = useState(false);
  const { totalValue, isLoading: isPortfolioLoading } = useWalletPortfolio();

  useEffect(() => {
    setMounted(true);
    if (!user?.balance || user.balance <= 0) return;

    // Real-time growth animation
    // 2% per day = 0.02 / 86400 per second
    const growthPerSecond = 0.02 / 86400;

    const interval = setInterval(() => {
      setCurrentBalance((prev) => {
        const newBalance = prev * (1 + growthPerSecond);
        return newBalance;
      });

      // Token balance growth DISABLED - keeping static
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user?.balance]);

  // Calculate growth percentage
  const growthPercentage = user?.balance
    ? ((currentBalance - user.balance) / user.balance) * 100
    : 0;

  const dailyEarnings = currentBalance - (user?.balance ?? 0);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Skeleton for Balance Card */}
        <div className="rounded-xl border border-border/50 bg-card/10 backdrop-blur-sm shadow-xl h-[340px] p-6 flex flex-col justify-between animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-muted/20 rounded"></div>
              <div className="h-6 w-16 bg-muted/20 rounded-full"></div>
            </div>
            <div className="h-12 w-3/4 bg-muted/20 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-muted/20 rounded-xl"></div>
            <div className="h-20 bg-muted/20 rounded-xl"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-muted/20 rounded-xl"></div>
            <div className="h-12 flex-1 bg-muted/20 rounded-xl"></div>
          </div>
        </div>

        {/* Skeleton for Wallet Overview */}
        <div className="rounded-xl border border-border/50 bg-card/10 backdrop-blur-sm shadow-xl h-[340px] p-6 flex flex-col animate-pulse">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted/20 rounded"></div>
              <div className="h-3 w-48 bg-muted/20 rounded"></div>
            </div>
            <div className="h-10 w-10 bg-muted/20 rounded-full"></div>
          </div>
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted/20 rounded-full"></div>
                <div className="h-10 w-32 bg-muted/20 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted/20 rounded-full"></div>
                <div className="h-10 w-32 bg-muted/20 rounded"></div>
              </div>
            </div>
            <div className="h-16 bg-muted/20 rounded-xl mt-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      {/* LEFT CARD: Balance & Actions */}
      <Card className="@container/card relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-primary/10 via-background to-background dark:from-primary/5 ring-1 ring-border/50 flex flex-col justify-between">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <IconTrendingUp className="w-32 h-32" />
        </div>

        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardDescription className="text-xs font-bold tracking-widest uppercase text-muted-foreground/80">Total Balance</CardDescription>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                  ${Math.floor(currentBalance).toLocaleString('en-US')}
                </span>
                <span className="text-xl md:text-2xl font-bold text-muted-foreground/60">
                  .{currentBalance.toFixed(4).split('.')[1]}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-600 border-green-500/20 px-2 py-1 text-xs font-bold shadow-sm backdrop-blur-md h-fit"
            >
              <IconTrendingUp className="w-3 h-3 mr-1" />
              +{growthPercentage.toFixed(4)}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 relative z-10">
          <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-background/40 backdrop-blur-md rounded-xl border border-white/5 shadow-inner">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Daily Earnings</p>
              <p className="text-lg font-bold text-green-500 flex items-center gap-1">
                +${dailyEarnings.toFixed(4)}
              </p>
              <p className="text-[10px] text-muted-foreground/80">2% Daily Compound</p>
            </div>
            <div className="space-y-1 border-l border-border/10 pl-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold text-foreground">Active</span>
              </div>
              <p className="text-[10px] text-green-500/80 font-mono">⚡ Live Updates</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col pb-6 relative z-10 mt-auto">
          <div className="grid grid-cols-2 gap-3 w-full box-border">
            <StakeModal />
            <WithdrawModal />
          </div>
        </CardFooter>
      </Card>

      {/* RIGHT CARD: Wallet Overview (Consolidated) */}
      <Card className="flex flex-col border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
        <CardHeader className="pb-4 border-b border-border/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Wallet Overview</CardTitle>
              <CardDescription>Your assets and connection details</CardDescription>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <IconTrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-6 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Item 1: Bear Tokens */}
            <div className="flex flex-col justify-between group p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <span className="text-sm">🐻</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bear Holdings</p>
              </div>
              <p className="text-xl font-bold tabular-nums tracking-tight whitespace-nowrap">
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(currentTokenBalance)}
                <span className="text-xs font-medium text-muted-foreground ml-1">$Bear</span>
              </p>
            </div>

            {/* Item 2: Net Worth */}
            <div className="flex flex-col justify-between group p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <span className="text-sm">💎</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Worth</p>
              </div>
              <div className="text-xl font-bold tabular-nums tracking-tight whitespace-nowrap">
                {isPortfolioLoading ? (
                  <Skeleton className="h-7 w-24 rounded-md" />
                ) : (
                  "$" + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalValue)
                )}
              </div>
            </div>
          </div>

          {/* Item 3: Connected Wallet */}
          <div className="mt-4 p-4 rounded-xl bg-background/50 border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Connection</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-500">Solana Mainnet</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
                SOL
              </div>
              <code className="text-sm font-mono bg-muted py-1 px-2 rounded border border-border/50 text-foreground/80 break-all">
                {user?.walletAddress || "Not Connected"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
