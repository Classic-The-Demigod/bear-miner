"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/auth-provider";

export function WalletModal({ onClose }: { onClose: () => void }) {
    const { wallets, select, connect, connecting, wallet } = useWallet();
    const { signIn } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [pendingWallet, setPendingWallet] = useState<WalletName | null>(null);

    const handleWalletClick = useCallback(
        (walletName: WalletName) => {
            select(walletName);
            setPendingWallet(walletName);
            // Don't close immediately, wait for wallet to update and connect
        },
        [select]
    );

    // Trigger connection when the selected wallet updates
    useEffect(() => {
        const connectWallet = async () => {
            if (pendingWallet && wallet?.adapter.name === pendingWallet) {
                try {
                    // Check if already connected but not authenticated
                    if (!wallet.adapter.connected) {
                        await connect();
                    }
                    // Automatically trigger verification (signIn) after connection state is confirmed
                    await signIn();
                    setPendingWallet(null);
                    onClose();
                } catch (error) {
                    console.error("Connection/Authentication failed:", error);
                    setPendingWallet(null);
                }
            }
        };
        connectWallet();
    }, [pendingWallet, wallet, connect, signIn, onClose]);

    // Filter wallets: show installed first, then others
    const { installed, others } = useMemo(() => {
        const installed: typeof wallets = [];
        const others: typeof wallets = [];

        for (const wallet of wallets) {
            if (wallet.readyState === "Installed") {
                installed.push(wallet);
            } else {
                others.push(wallet);
            }
        }
        return { installed, others };
    }, [wallets]);

    // Combine for display: show installed + first 3 others, or all if expanded
    const displayedWallets = useMemo(() => {
        if (expanded) return [...installed, ...others];
        return [...installed, ...others.slice(0, 3)];
    }, [installed, others, expanded]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1A0B0A] border border-[#7A4A33]/30 rounded-3xl shadow-2xl shadow-[#7A4A33]/20 overflow-hidden animate-in zoom-in-95 duration-200 relative">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#FFFFFF]/5 bg-[#2D1B0D]/50">
                    <h2 className="text-xl font-serif font-bold text-[#F8EBDD]">Connect Wallet</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                        {displayedWallets.map((wallet) => (
                            <button
                                key={wallet.adapter.name}
                                onClick={() => handleWalletClick(wallet.adapter.name)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-[#7A4A33]/20 hover:border-[#7A4A33]/50 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#1A0B0A] p-2 border border-white/5 group-hover:border-[#7A4A33]/30 transition-colors">
                                        <img
                                            src={wallet.adapter.icon}
                                            alt={wallet.adapter.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="font-medium text-[#F8EBDD] text-lg">
                                        {wallet.adapter.name}
                                    </span>
                                </div>
                                {wallet.readyState === "Installed" && (
                                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14F195]/10 text-[#14F195] uppercase tracking-wider">
                                        Detected
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {!expanded && others.length > 3 && (
                        <Button
                            variant="ghost"
                            onClick={() => setExpanded(true)}
                            className="w-full mt-4 text-[#7A4A33] hover:text-[#CEA065] hover:bg-transparent flex items-center justify-center gap-2"
                        >
                            <span>Show More</span>
                            <ChevronRight size={16} className="rotate-90" />
                        </Button>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#2D1B0D]/30 text-center">
                    <p className="text-[#F8EBDD]/40 text-xs">
                        New to Solana? <a href="https://solana.com/ecosystem/explore?categories=wallet" target="_blank" rel="noopener noreferrer" className="text-[#CEA065] hover:underline">Learn more about wallets</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
