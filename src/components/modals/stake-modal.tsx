import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";
import { useTreasury } from "@/hooks/use-treasury";
import { recordStake } from "@/app/actions/stake";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const StakeModal = ({ userId }: { userId?: string }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { minDeposit } = useWalletPortfolio(); // Fetched from hook

  const { address: adminWallet, error: treasuryError } = useTreasury("SOL");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<'initial' | 'confirming' | 'processing' | 'success'>('initial');
  const [maxSol, setMaxSol] = useState(0);

  useEffect(() => {
    if (treasuryError) {
      toast.error(treasuryError);
    }
  }, [treasuryError]);

  // Fetch Max Balance (Auto-refresh)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const bal = await connection.getBalance(publicKey);
          setMaxSol(bal / LAMPORTS_PER_SOL);
        } catch (e) {
          console.error("Failed to fetch balance:", e);
        }
      }
    };

    fetchBalance();

    // Auto-refresh every 10 seconds while modal is open
    interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleMax = () => {
    // Leave 0.005 for gas
    const max = Math.max(0, maxSol - 0.005);
    setAmount(max.toFixed(4));
  };

  const validateAndProceed = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (val < (minDeposit || 100)) {
      toast.error(`Minimum stake amount is ${minDeposit} SOL.`);
      return;
    }
    if (val > maxSol) {
      toast.error("Insufficient balance.");
      return;
    }
    setStep('confirming');
  };

  const handleStake = async () => {
    if (!publicKey || !adminWallet) return;

    try {
      setStep('processing');
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(adminWallet),
          lamports: parseInt(lamports.toString()),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("Staking sent:", signature);

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      // Record stake in database
      if (userId) {
        await recordStake(userId, parseFloat(amount));
      }

      setStep('success');
      toast.success("Staking Successful!");

    } catch (error: any) {
      console.error("Staking failed:", error);
      let errorMessage = "Transaction failed. Please try again.";
      if (error.message) {
        if (error.message.includes("User rejected")) errorMessage = "Transaction rejected by user.";
        else if (error.message.includes("0x1")) errorMessage = "Insufficient funds for gas.";
        else errorMessage = `Transaction Error: ${error.message}`;
      }
      toast.error(errorMessage);
      setStep('initial');
    }
  };

  const reset = () => {
    setStep('initial');
    setAmount("");
  };

  return (
    <AlertDialog open={step !== 'initial' ? true : undefined} onOpenChange={(open) => !open && reset()}>
      <AlertDialogTrigger asChild>
        <Button className="w-full h-full min-h-[50px] bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-4 py-3 rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-md border-2 border-[#0E0000] text-sm md:text-base whitespace-nowrap leading-tight truncate">
          Start Mining $Bear
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md border-none shadow-2xl bg-card">

        {step === 'initial' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Deposit SOL
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Deposit SOL to start earning 2% daily rewards
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-6 my-4">
              {/* Input Section */}
              <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Amount to Deposit</span>
                  <span>Available: {maxSol.toFixed(4)} SOL</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <img src="/assets/solana-sol-logo.svg" alt="SOL" className="h-5 w-5" />
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-11 text-lg font-mono font-bold bg-background border-transparent focus-visible:ring-primary/20 shadow-inner"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleMax} className="px-3 font-bold text-xs text-primary border-primary/20 hover:bg-primary/5">
                    MAX
                  </Button>
                </div>

                {/* Min Deposit Warning */}
                {(parseFloat(amount) || 0) < (minDeposit || 100) && (
                  <div className="flex items-center gap-2 text-xs text-orange-500 font-medium bg-orange-500/10 p-2 rounded-lg">
                    <AlertTriangle className="h-3 w-3" />
                    Minimum deposit is {minDeposit || 100} SOL
                  </div>
                )}
              </div>

              {/* Info Logic */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-muted-foreground">Daily Return (Est.)</span>
                  <span className="font-bold text-green-600">
                    +{((parseFloat(amount) || 0) * 0.02).toFixed(4)} SOL <span className="text-xs text-muted-foreground font-normal">(2%)</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs px-2 text-muted-foreground">
                  <span>Network Fee</span>
                  <span>~0.000005 SOL</span>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={validateAndProceed}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) < (minDeposit || 100)}
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
              >
                Proceed to Deposit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <AlertDialogCancel onClick={reset} className="w-full mt-2 border-none hover:bg-muted">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}

        {step === 'confirming' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
              <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Waiting for Wallet...</h3>
              <p className="text-muted-foreground text-sm max-w-[80%] mx-auto">
                Please approve the transaction of <strong className="text-foreground">{amount} SOL</strong> in your wallet.
              </p>
            </div>
            <Button onClick={handleStake} className="w-full max-w-xs font-bold animate-pulse">
              Confirm in Wallet
            </Button>
            <Button variant="ghost" onClick={() => setStep('initial')} className="text-sm">Go Back</Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Processing Transaction</h3>
              <p className="text-muted-foreground text-sm">Sending transaction to Solana network...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-24 w-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-foreground">STAKING SUCCESSFUL!</h3>
              <p className="text-muted-foreground text-sm">
                Your deposit has been received. Mining starts immediately.
              </p>
              <div className="text-3xl font-bold text-primary py-2">
                {amount} SOL
              </div>
            </div>
            <AlertDialogCancel onClick={reset} className="w-full bg-muted hover:bg-muted/80">
              Done
            </AlertDialogCancel>
          </div>
        )}

      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StakeModal;
