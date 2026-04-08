"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@/components/wallet/custom-wallet-modal-provider";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Copy, LogOut, LayoutDashboard, Wallet, ChevronDown, Check, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";

export function CustomWalletButton() {
    const { disconnect, connecting, connected, publicKey } = useWallet();
    const { openModal, isPending } = useWalletModal();
    const { user, isAuthenticated, isAuthenticating, signIn } = useAuth();
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const role = user?.role ?? "USER";

    const copyAddress = useCallback(() => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey.toBase58());
            setCopied(true);
            toast.success("Address copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    }, [publicKey]);

    const handleConnect = useCallback(() => {
        if (connected && isAuthenticated) return;
        openModal("connect-and-auth");
    }, [connected, isAuthenticated, openModal]);

    const handleDisconnect = useCallback(async () => {
        await disconnect();
        toast.info("Wallet disconnected");
        router.refresh();
    }, [disconnect, router]);

    const base58 = publicKey?.toBase58();
    const content = base58 ? base58.slice(0, 4) + '..' + base58.slice(-4) : '';

    if (isAuthenticated && connected && publicKey) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="bg-[#7a4a33] hover:bg-[#633c2a] text-white font-serif font-medium rounded-2xl h-11 px-5 shadow-lg shadow-[#7a4a33]/20 transition-all duration-300 hover:scale-[1.02] border border-[#7a4a33]/50 flex items-center gap-2 group"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#d4c5bd] animate-pulse shadow-[0_0_8px_rgba(212,197,189,0.8)]" />
                        <span className="font-mono text-sm tracking-tight">{content}</span>
                        <ChevronDown className="w-4 h-4 text-[#d4c5bd] group-data-[state=open]:rotate-180 transition-transform duration-300" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-background/95 backdrop-blur-xl border-[#7a4a33]/20 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2 py-1.5">
                        My Wallet
                    </DropdownMenuLabel>

                    <DropdownMenuItem onClick={copyAddress} className="rounded-xl cursor-pointer focus:bg-[#7a4a33]/10 focus:text-[#7a4a33] p-2.5 flex items-center gap-2.5 transition-colors">
                        {copied ? <Check className="w-4 h-4 text-[#7a4a33]" /> : <Copy className="w-4 h-4" />}
                        <span className="font-medium">Copy Address</span>
                    </DropdownMenuItem>

                    {role === 'ADMIN' && (
                        <Link href="/admin/dashboard" className="w-full">
                            <DropdownMenuItem className="rounded-xl cursor-pointer focus:bg-purple-500/10 focus:text-purple-600 p-2.5 flex items-center gap-2.5 transition-colors">
                                <ShieldAlert className="w-4 h-4" />
                                <span className="font-medium">Admin Panel</span>
                            </DropdownMenuItem>
                        </Link>
                    )}

                    <Link href="/dashboard" className="w-full">
                        <DropdownMenuItem className="rounded-xl cursor-pointer focus:bg-[#7a4a33]/10 focus:text-[#7a4a33] p-2.5 flex items-center gap-2.5 transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="font-medium">Dashboard</span>
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator className="bg-border/50 my-1" />

                    <DropdownMenuItem onClick={handleDisconnect} className="rounded-xl cursor-pointer focus:bg-red-500/10 focus:text-red-600 p-2.5 flex items-center gap-2.5 text-red-500/80 hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Disconnect</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    if (connected && !isAuthenticated) {
        return (
            <Button
                onClick={signIn}
                disabled={isAuthenticating}
                className="bg-[#7a4a33] hover:bg-[#633c2a] text-white font-serif font-bold text-base rounded-2xl h-12 px-6 shadow-lg shadow-[#7a4a33]/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 border-b-4 border-[#5a3626] active:border-b-0 min-w-[160px] relative overflow-hidden group"
            >
                {isAuthenticating ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#d4c5bd]" />
                        <span className="animate-pulse">Verifying...</span>
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        <Check className="mr-2 h-5 w-5" />
                        Verify Wallet
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            onClick={handleConnect}
            disabled={connecting || isPending}
            className="bg-[#7a4a33] hover:bg-[#633c2a] text-white font-serif font-bold text-base rounded-2xl h-12 px-6 shadow-lg shadow-[#7a4a33]/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 border-b-4 border-[#5a3626] active:border-b-0 min-w-[160px] relative overflow-hidden group"
        >
            {connecting || isPending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#d4c5bd]" />
                    <span className="animate-pulse">Connecting...</span>
                </>
            ) : (
                <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    <Wallet className="mr-2 h-5 w-5 fill-current" />
                    Connect Wallet
                </>
            )}
        </Button>
    );
}
