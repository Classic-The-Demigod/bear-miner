"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Image from "next/image";

export default function BMTPurchase() {
  const [copied, setCopied] = useState(false);
  const [solAmount, setSolAmount] = useState("1");
  const [bmtAmount, setBmtAmount] = useState("3589.6");

  const BMT_PER_SOL = 3589.6;
  const totalRaised = 5094162.39;
  const percentRaised = 91.76;
  const softcapTarget = 8000000;
  const participants = 15394;
  const presalePrice = 0.0029;
  const launchPrice = 0.05;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSolChange = (value: string) => {
    setSolAmount(value);
    const numValue = parseFloat(value) || 0;
    setBmtAmount((numValue * BMT_PER_SOL).toFixed(2));
  };

  const handleBmtChange = (value: string) => {
    setBmtAmount(value);
    const numValue = parseFloat(value) || 0;
    setSolAmount((numValue / BMT_PER_SOL).toFixed(4));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-primary rounded-3xl p-6 border-2 border-yellow-600/30 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block bg-black border border-yellow-600/50 rounded-lg px-4 py-2 mb-4">
          <span className="text-yellow-500 font-bold">Buy BMT</span>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-black border-2 border-yellow-600/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
          <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span>Buy</span>
          </div>
          <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5">
            <span>Stake</span>
          </div>
          <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5">
            <span>History</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white mb-2">
            ${totalRaised.toLocaleString()}
          </div>
          <div className="text-yellow-500 font-medium mb-3">
            {percentRaised}% of softcap raised
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div
              className="absolute h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-300"
              style={{ width: `${percentRaised}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span></span>
            <span>${softcapTarget.toLocaleString()}</span>
          </div>

          <div className="text-gray-400 text-sm mt-3">
            {participants.toLocaleString()} Participants
          </div>
        </div>
      </div>

      {/* Payment Method - Solana Only */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-yellow-600 text-black rounded-lg px-4 py-3 font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image
                  src="/assets/solana-sol-logo.svg"
                  alt="Bear Miner Logo"
                  width={50}
                  height={50}
                />
              </div>
              <span className="">SOL</span>
            </div>
            <span className=" font-bold font-sans text-2xl">Solana</span>
          </div>
        </div>
      </div>

      {/* Token Selection */}
      <div className="mb-6">
        <div className="bg-yellow-600 text-black rounded-lg px-4 py-3 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6  flex items-center justify-center text-xs font-bold">
              <Image
                src="/assets/logo.svg"
                alt="Bear Miner Logo"
                width={50}
                height={50}
              />
            </div>
            <span>BMT</span>
          </div>
          <span className="font-bold font-sans text-2xl">Bear Miner Token</span>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-black/50 rounded-lg px-4 py-3 mb-6 text-center">
        <div className="text-xs text-gray-400 space-x-4">
          <span>Presale Price = ${presalePrice}</span>
          <span className="text-yellow-500">|</span>
          <span>Launch Price = ${launchPrice}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            You Pay in SOL:
          </label>
          <div className="relative">
            <Input
              type="number"
              value={solAmount}
              onChange={(e) => handleSolChange(e.target.value)}
              className="bg-amber-800 text-white text-lg h-14 pr-20"
              step="0.01"
              min="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-600 text-black px-3 py-1.5 rounded-lg font-medium flex items-center gap-2  ">
              <div className="w-4 h-4 ">
                <Image
                  src="/assets/solana-sol-logo.svg"
                  alt="Bear Miner Logo"
                  width={16}
                  height={16}
                />
              </div>
              <span className="text-sm">SOL</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            You Receive BMT + <span className="text-accent">Balanced NFT</span>
          </label>
          <div className="relative">
            <Input
              type="number"
              value={bmtAmount}
              onChange={(e) => handleBmtChange(e.target.value)}
              className="bg-amber-800 text-white text-lg h-14 pr-20"
              step="0.01"
              min="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-600 text-black px-3 py-1.5 rounded-lg font-medium flex items-center gap-2">
              <div className="w-4 h-4 ">
                <Image
                  src="/assets/logo.svg"
                  alt="Bear Miner Logo"
                  width={16}
                  height={16}
                />
              </div>
              <span className="text-sm">BMT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Button with Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all">
            Buy BMT
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Follow the steps below to purchase BMT tokens on Solana
            </AlertDialogTitle>
            <AlertDialogDescription>
              Send {solAmount} SOL to the address below to receive {bmtAmount}{" "}
              BMT tokens. Your tokens will be credited automatically once the
              transaction is confirmed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-3">
            <div className="rounded-lg border p-4 bg-muted">
              <p className="text-sm font-medium mb-2">Wallet Address:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs break-all bg-background p-2 rounded">
                  HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb
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
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                Transaction Summary:
              </p>
              <div className="text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
                <div className="flex justify-between">
                  <span>Amount to send:</span>
                  <span className="font-bold">{solAmount} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>You will receive:</span>
                  <span className="font-bold">{bmtAmount} BMT</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>1 SOL = {BMT_PER_SOL} BMT</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum purchase: 0.1 SOL • Network: Solana Mainnet
            </p>
            <p className="text-xs text-red-500">
              Please do not close this dialog until you have sent the SOL and
              clicked "I've sent SOL".
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90">
              I've sent SOL
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promo Code Section */}
      <div className="mt-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-4">
        <div className="text-center">
          <p className="text-green-400 font-medium mb-2">
            Halloween Special: Use code{" "}
            <span className="text-yellow-500 font-bold">CANDY40</span>
          </p>
          <p className="text-gray-400 text-xs">
            to get 40% more BMT for a limited time.
          </p>
        </div>
      </div>
    </div>
  );
}
