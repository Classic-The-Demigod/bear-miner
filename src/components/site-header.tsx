"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Home,
  ShieldAlert
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/app/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { publicKey, disconnect } = useWallet();
  const { user } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDisconnect = async () => {
    await disconnect();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all ease-in-out">

      {/* DESKTOP HEADER (Hidden on Mobile) */}
      <div className="hidden md:flex h-[--header-height] px-4 items-center gap-2">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-border/40"
        />
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">Platform</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-semibold">Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop specific actions if any */}
        </div>
      </div>

      {/* MOBILE HEADER (Visible only on Mobile) */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 bg-[#F8EBDD]/80 backdrop-blur-md shadow-lg transition-all duration-300">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 bg-red-500/0">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-50" />
            <Image
              src="/img/logo.svg"
              alt="Bear Miner Logo"
              width={36}
              height={36}
              className="relative"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <span className="text-lg font-serif font-black tracking-tight text-[#2D1B0D]">
            Bear Miner
          </span>
        </Link>

        {/* Mobile Action Button */}
        <button
          className="p-1.5 rounded-xl hover:bg-black/5 active:scale-95 transition-all text-[#2D1B0D] flex items-center gap-1 border border-black/5 bg-white/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-7 w-7 rounded-lg overflow-hidden border border-black/10">
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${publicKey?.toBase58() || 'user'}`}
              alt="Wallet"
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-4 mt-2 w-[260px] bg-[#F8EBDD] backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-5 duration-200 z-[60]"
          >
            {/* Quick User Info */}
            <div className="px-3 py-2 text-xs font-mono text-[#2D1B0D]/60 border-b border-black/5 mb-1">
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
            </div>

            {/* Menu Items */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7A4A33]/10 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#7A4A33]/10 flex items-center justify-center text-[#7A4A33]">
                <Home size={16} />
              </div>
              <span className="font-serif font-bold text-[#2D1B0D]">Home</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#7A4A33]/5 hover:bg-[#7A4A33]/15 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#7A4A33]/20 flex items-center justify-center text-[#7A4A33]">
                <LayoutDashboard size={16} />
              </div>
              <span className="font-serif font-bold text-[#2D1B0D]">Dashboard</span>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <ShieldAlert size={16} />
                </div>
                <span className="font-serif font-bold text-purple-900">Admin Panel</span>
              </Link>
            )}

            <div className="h-[1px] w-full bg-black/5 my-1" />

            <button
              onClick={handleDisconnect}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <LogOut size={16} />
              </div>
              <span className="font-serif font-bold text-red-600/80 group-hover:text-red-600">Log Out</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
}
