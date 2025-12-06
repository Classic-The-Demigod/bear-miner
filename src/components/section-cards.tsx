// components/section-cards.tsx
"use client";
import { IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2">
        <div className="h-48 bg-card rounded-lg animate-pulse" />
        <div className="h-48 bg-card rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Your Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            }).format(currentBalance)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              <IconTrendingUp />+{growthPercentage.toFixed(4)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Daily returns active <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Earned ${dailyEarnings.toFixed(7)} today • 2% daily compound
          </div>
          <div className="text-xs text-green-500 font-medium">
            ⚡ Live growth: Updates every second
          </div>

          <div className="flex w-full justify-between flex-col md:flex-row gap-4 mt-2">
            <StakeModal />
            <WithdrawModal />
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Your Total $Bear Tokens</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(currentTokenBalance)}{" "}
            $Bear
          </CardTitle>
          <CardAction>
            {/* Token growth badge removed since tokens are now static */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Token balance
          </div>
          <div className="text-muted-foreground">Stable token holdings</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Connected Wallet</CardDescription>
          <CardTitle className="text-sm font-mono break-all">
            {user?.walletAddress
              ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(
                  -4
                )}`
              : "Not connected"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Solana Wallet
          </div>
          <div className="text-muted-foreground text-xs">
            {user?.walletAddress}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
