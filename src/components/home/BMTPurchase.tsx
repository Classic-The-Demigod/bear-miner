"use client";

import { useState, useEffect } from "react";
import { useTreasury } from "@/hooks/use-treasury";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, TrendingUp, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function BMTPurchase() {
  const [copied, setCopied] = useState(false);
  const [solAmount, setSolAmount] = useState("1");
  const [bmtAmount, setBmtAmount] = useState("44217");
  const { address: presaleAddress, error: treasuryError } = useTreasury("SOL");

  const BMT_PER_SOL = 44217;
  const totalRaised = 25000000;
  const percentRaised = 41.67;
  // const softcapTarget = 60000000;
  const participants = 150;
  const presalePrice = 0.0029;
  const launchPrice = 0.004;

  useEffect(() => {
    if (treasuryError) {
      toast.error(treasuryError);
    }
  }, [treasuryError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(presaleAddress);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSolChange = (value: string) => {
    setSolAmount(value);
    const numValue = parseFloat(value) || 0;
    setBmtAmount((numValue * BMT_PER_SOL).toFixed(0)); // BMT is usually integer-ish display
  };

  const handleBmtChange = (value: string) => {
    setBmtAmount(value);
    const numValue = parseFloat(value) || 0;
    setSolAmount((numValue / BMT_PER_SOL).toFixed(4));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-[150px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left Side: Info & Progress */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
              Public Presale
            </h2>
            <p className="text-muted-foreground text-lg">
              Join the Bear Miner revolution. Secure your $BMT tokens at the lowest price before launch.
            </p>
          </div>

          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>Presale Progress</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  Stage 1 Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-primary font-bold">{percentRaised}% Raised</span>
                  <span className="text-muted-foreground">{participants} Participants</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentRaised}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>25M BMT</span>
                  <span>Target: 60M BMT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-background/50 p-3 rounded-lg border text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Current Price</p>
                  <p className="text-xl font-bold text-primary">${presalePrice}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Launch Price</p>
                  <p className="text-xl font-bold text-foreground">${launchPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 text-sm text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <p>
              Tokens are automatically reserved and will be airdropped to your wallet at TGE (Token Generation Event).
            </p>
          </div>
        </div>

        {/* Right Side: Purchase Card */}
        <Card className="border-none shadow-2xl bg-gradient-to-b from-card to-background ring-1 ring-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Image src="/assets/logo.svg" alt="bg" width={200} height={200} />
          </div>

          <CardHeader>
            <CardTitle className="text-2xl font-bold">Buy $BMT</CardTitle>
            <CardDescription>Minimum purchase: 0.1 SOL</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input 1: SOL */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>You Pay</label>
                <span className="text-muted-foreground">Network: Solana</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={solAmount}
                  onChange={(e) => handleSolChange(e.target.value)}
                  className="h-14 pl-4 pr-32 text-lg font-bold bg-muted/30 border-primary/20 focus-visible:ring-primary/30"
                  step="0.01"
                />
                <div className="absolute right-2 top-2 bottom-2 bg-background rounded-lg border shadow-sm px-3 flex items-center gap-2 pointer-events-none">
                  <Image src="/assets/solana-sol-logo.svg" alt="SOL" width={20} height={20} />
                  <span className="font-bold text-sm">SOL</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <div className="bg-card border p-1.5 rounded-full shadow-sm">
                <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 lg:rotate-90" />
              </div>
            </div>

            {/* Input 2: BMT */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label>You Receive</label>
                <span className="text-muted-foreground">1 SOL = {BMT_PER_SOL.toLocaleString()} BMT</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={bmtAmount}
                  onChange={(e) => handleBmtChange(e.target.value)}
                  className="h-14 pl-4 pr-32 text-lg font-bold bg-muted/30 border-primary/20 focus-visible:ring-primary/30"
                  step="1"
                />
                <div className="absolute right-2 top-2 bottom-2 bg-background rounded-lg border shadow-sm px-3 flex items-center gap-2 pointer-events-none">
                  <Image src="/assets/logo.svg" alt="BMT" width={20} height={20} className="rounded-full" />
                  <span className="font-bold text-sm">BMT</span>
                </div>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:scale-[1.01] transition-all">
                  Connect Wallet & Buy
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    Complete Purchase
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    To finalize your purchase of <strong className="text-foreground">{bmtAmount} BMT</strong>, please send <strong className="text-foreground">{solAmount} SOL</strong> to the presale address.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="bg-muted/50 p-4 rounded-xl space-y-3 my-4 border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-bold">Deposit, Presale and Stake Address:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background p-2.5 rounded-lg border font-mono flex-1 break-all">
                      {presaleAddress}
                    </code>
                    <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0 h-9 w-9">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="h-px bg-border/50 my-2" />
                  <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
                    <TrendingUp className="h-3 w-3" />
                    Important: Send only from a generic wallet (Phantom, Solflare). Do NOT send from an exchange.
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/5 p-3 rounded-lg flex justify-between items-center text-sm">
                    <span>Rate</span>
                    <span className="font-bold">1 SOL = {BMT_PER_SOL.toLocaleString()} BMT</span>
                  </div>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-primary text-[#F4D2AF] hover:bg-primary/90">
                    I've Sent SOL
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 text-center">
            <p className="text-xs text-muted-foreground w-full">
              By purchasing, you agree to our Terms of Service and Token Sale Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
