"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useTreasury } from "@/hooks/use-treasury";
import { useWalletModal } from "@/components/wallet/custom-wallet-modal-provider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { sendSolTransfer } from "@/lib/send-sol-transfer";

const BMT_PER_SOL = 44217;
const MIN_PURCHASE_SOL = 0.1;

type PurchaseStep = "idle" | "review" | "processing" | "success";

export default function BMTPurchase() {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction, wallet } = useWallet();
  const { openModal, isPending } = useWalletModal();
  const [solAmount, setSolAmount] = useState("1");
  const [bmtAmount, setBmtAmount] = useState("44217");
  const [step, setStep] = useState<PurchaseStep>("idle");
  const [availableSol, setAvailableSol] = useState(0);
  const { address: presaleAddress, error: treasuryError } = useTreasury("SOL");

  const percentRaised = 65.73;
  // const softcapTarget = 60000000;
  const participants = 323;
  const presalePrice = 0.0029;
  const launchPrice = 0.004;

  useEffect(() => {
    if (treasuryError) {
      toast.error(treasuryError);
    }
  }, [treasuryError]);

  useEffect(() => {
    let isActive = true;

    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        if (isActive) setAvailableSol(0);
        return;
      }

      try {
        const balance = await connection.getBalance(publicKey);
        if (isActive) {
          setAvailableSol(balance / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      }
    };

    void fetchBalance();
    const interval = setInterval(() => void fetchBalance(), 15000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [connection, connected, publicKey]);

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

  const parsedSolAmount = parseFloat(solAmount) || 0;

  const resetDialog = () => {
    setStep("idle");
  };

  const handlePurchaseIntent = () => {
    if (!presaleAddress) {
      toast.error("Presale wallet is not configured yet.");
      return;
    }

    if (!Number.isFinite(parsedSolAmount) || parsedSolAmount <= 0) {
      toast.error("Please enter a valid SOL amount.");
      return;
    }

    if (parsedSolAmount < MIN_PURCHASE_SOL) {
      toast.error(`Minimum purchase is ${MIN_PURCHASE_SOL} SOL.`);
      return;
    }

    if (!connected) {
      openModal("connect-only");
      return;
    }

    setStep("review");
  };

  const handlePurchase = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first.");
      resetDialog();
      return;
    }

    if (!presaleAddress) {
      toast.error("Presale wallet is not configured yet.");
      resetDialog();
      return;
    }

    if (!Number.isFinite(parsedSolAmount) || parsedSolAmount <= 0) {
      toast.error("Please enter a valid SOL amount.");
      setStep("review");
      return;
    }

    if (parsedSolAmount < MIN_PURCHASE_SOL) {
      toast.error(`Minimum purchase is ${MIN_PURCHASE_SOL} SOL.`);
      setStep("review");
      return;
    }

    if (availableSol > 0 && parsedSolAmount > availableSol) {
      toast.error("Insufficient balance.");
      setStep("review");
      return;
    }

    try {
      setStep("processing");
      await sendSolTransfer({
        amountSol: parsedSolAmount,
        connection,
        destination: presaleAddress,
        publicKey,
        sendTransaction,
        wallet,
      });
      toast.success("Purchase transaction confirmed.");
      setStep("success");
    } catch (error) {
      console.error("BMT purchase failed:", error);

      let errorMessage = "Transaction failed. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction rejected by user.";
        } else if (error.message.includes("insufficient")) {
          errorMessage = "Insufficient balance for transaction.";
        } else {
          errorMessage = `Transaction Error: ${error.message}`;
        }
      }

      toast.error(errorMessage);
      setStep("review");
    }
  };

  const buttonLabel = isPending
    ? "Connecting..."
    : !connected
      ? "Connect Wallet & Buy"
      : "Buy $BMT";

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
                  <span>50M BMT</span>
                  <span>Target: 80M BMT</span>
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
            <Image src="/img/logo.svg" alt="bg" width={200} height={200} />
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
                  <Image src="/img/solana-logo.svg" alt="SOL" width={20} height={20} />
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
                  <Image src="/img/logo.svg" alt="BMT" width={20} height={20} className="rounded-full" />
                  <span className="font-bold text-sm">BMT</span>
                </div>
              </div>
            </div>

            {(parsedSolAmount || 0) < MIN_PURCHASE_SOL && (
              <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-3 rounded-lg border border-orange-500/10">
                <AlertTriangle className="h-3.5 w-3.5" />
                Minimum purchase is {MIN_PURCHASE_SOL} SOL
              </div>
            )}

            {connected && publicKey && (
              <div className="flex justify-between items-center text-xs font-medium text-muted-foreground bg-muted/30 border rounded-xl px-4 py-3">
                <span>Connected Wallet</span>
                <span className="font-mono text-primary">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
              </div>
            )}

            <Button
              onClick={handlePurchaseIntent}
              disabled={isPending}
              className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:scale-[1.01] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {buttonLabel}
                </>
              ) : (
                buttonLabel
              )}
            </Button>

            <AlertDialog
              open={step !== "idle"}
              onOpenChange={(open) => {
                if (!open && step !== "processing") {
                  resetDialog();
                }
              }}
            >
              <AlertDialogContent>
                {step === "review" && (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-primary" />
                        Confirm Purchase
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Your wallet will open to approve a direct transfer of{" "}
                        <strong className="text-foreground">{solAmount} SOL</strong>{" "}
                        for <strong className="text-foreground">{bmtAmount} BMT</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="bg-muted/50 p-4 rounded-xl space-y-3 my-4 border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">You Pay</span>
                        <span className="font-bold text-foreground">{solAmount} SOL</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">You Receive</span>
                        <span className="font-bold text-primary">{bmtAmount} BMT</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">Transfer Type</span>
                        <span className="font-medium text-foreground">Direct wallet deposit</span>
                      </div>
                      {connected && publicKey && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-bold">From Wallet</span>
                          <span className="font-mono text-xs text-primary">
                            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                          </span>
                        </div>
                      )}
                      <div className="h-px bg-border/50 my-2" />
                      <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
                        <TrendingUp className="h-3 w-3" />
                        Important: Buy directly from Phantom, Solflare, or another self-custody wallet.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/5 p-3 rounded-lg flex justify-between items-center text-sm">
                        <span>Rate</span>
                        <span className="font-bold">1 SOL = {BMT_PER_SOL.toLocaleString()} BMT</span>
                      </div>
                    </div>

                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel onClick={resetDialog}>Cancel</AlertDialogCancel>
                      <Button className="bg-primary text-[#F4D2AF] hover:bg-primary/90" onClick={handlePurchase}>
                        Confirm Purchase
                      </Button>
                    </AlertDialogFooter>
                  </>
                )}

                {step === "processing" && (
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-6">
                    <Loader2 className="h-14 w-14 text-primary animate-spin" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Processing Transaction</h3>
                      <p className="text-muted-foreground text-sm">
                        Approving your direct wallet transfer on Solana.
                      </p>
                    </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground">PURCHASE CONFIRMED!</h3>
                      <p className="text-muted-foreground text-sm">
                        Your wallet transfer was confirmed. Your BMT allocation will be tied to the connected wallet for TGE distribution.
                      </p>
                      <div className="text-3xl font-bold text-primary py-2">
                        {bmtAmount} BMT
                      </div>
                    </div>
                    <AlertDialogCancel onClick={resetDialog} className="w-full bg-muted hover:bg-muted/80">
                      Done
                    </AlertDialogCancel>
                  </div>
                )}
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
