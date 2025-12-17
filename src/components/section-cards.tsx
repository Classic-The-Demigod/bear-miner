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

  // Net Worth Logic
  const netWorthValue = totalValue > 0 ? totalValue : (user?.walletBalance ?? 0);
  const isNetWorthLoading = isPortfolioLoading && totalValue === 0;

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
          <div className="flex flex-row flex-wrap gap-2">
            {/* Item 1: Net Worth */}
            <div className="flex-1 min-w-[200px] flex items-center gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-all duration-300 border border-transparent hover:border-primary/10 group">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform duration-300">
                <span className="text-lg">💎</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Net Worth</p>
                <div className={`text-xl font-black tracking-tight transition-all duration-500 ${isNetWorthLoading ? "text-muted-foreground/40 animate-pulse blur-[0.5px]" : "text-foreground"}`}>
                  {"$" + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(netWorthValue)}
                </div>
              </div>
            </div>
            {/* Item 2: Bear Holdings */}
            <div className="flex-1 min-w-[200px] flex items-center gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-all duration-300 border border-transparent hover:border-primary/10 group">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)] group-hover:scale-105 transition-transform duration-300">
                <span className="text-lg">🐻</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Bear Holdings</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-foreground tracking-tight">
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(currentTokenBalance)}
                  </span>
                  <span className="text-[10px] font-bold text-yellow-500/80">$Bear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3: Connected Wallet (Redesigned) */}
          <div
            onClick={copyAddress}
            className="mt-4 p-4 rounded-xl bg-background/40 border border-primary/10 hover:bg-primary/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Active Connection</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary/80 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                Solana Mainnet
              </Badge>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                SOL
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-foreground/90 truncate font-semibold">
                    {user?.walletAddress || "Not Connected"}
                  </code>
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />}
                </div>
              </div>
            </div>

            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-primary font-medium bg-background/80 backdrop-blur px-2 py-0.5 rounded-md border border-primary/10">
              Click to Copy
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
