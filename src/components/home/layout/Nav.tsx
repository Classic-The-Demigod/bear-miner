"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut, Copy, Check, Send, Loader2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CustomWalletButton } from "@/components/custom-wallet-button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { connected, disconnect, publicKey, connecting } = useWallet();
  const { role } = useWalletPortfolio();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    }
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <nav className="relative flex items-center justify-between p-3 md:p-4 bg-[#F8EBDD]/80 backdrop-blur-md rounded-full border border-white/20 z-50 shadow-sm max-w-7xl mx-auto w-[95%] md:w-full mt-4">
      {/* Logo Section */}
      <div className="flex items-center gap-3 pl-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/img/logo.svg"
              alt="Bear Miner Logo"
              width={45}
              height={45}
              className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#2D1B0D]">
            Bear Miner
          </h1>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="md:flex items-center gap-4 hidden">
        <Link
          href="https://t.me/bearminers"
          target="_blank"
          className="group flex items-center justify-center p-2 rounded-2xl bg-white/50 hover:bg-[#0088cc]/10 border border-transparent hover:border-[#0088cc]/20 transition-all duration-300 hover:scale-110"
        >
          <Image
            src="/img/telegram.svg"
            alt="Telegram"
            width={32}
            height={32}
            className="drop-shadow-sm"
          />
        </Link>

        <div className="h-8 w-[1px] bg-black/5 mx-2" />

        <CustomWalletButton />
      </div>

      {/* Mobile Hamburger Button */}
      {/* Mobile Hamburger/Wallet Button */}
      {connecting ? (
        <button className="md:hidden p-2 rounded-xl bg-black/5 cursor-wait">
          <Loader2 size={24} className="animate-spin text-[#2D1B0D]" />
        </button>
      ) : connected ? (
        <button
          className="md:hidden p-1.5 rounded-xl hover:bg-black/5 active:scale-95 transition-all text-[#2D1B0D] flex items-center gap-1 border border-black/5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-black/10">
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${publicKey?.toBase58()}`}
              alt="Wallet"
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button
          className="md:hidden p-2 rounded-xl hover:bg-black/5 active:scale-95 transition-all text-[#2D1B0D]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}

      {/* Mobile Floating Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-4 w-[280px] bg-[#F8EBDD] backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-5 duration-200 z-[60]"
        >
          {connected ? (
            <>
              {/* Connected Actions */}
              <button
                onClick={handleDashboard}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7A4A33]/10 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#7A4A33]/10 flex items-center justify-center text-[#7A4A33]">
                  <LayoutDashboard size={20} />
                </div>
                <span className="font-serif font-bold text-[#2D1B0D]">Dashboard</span>
              </button>

              {role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                    {/* ShieldAlert is not imported, using LayoutDashboard or similar if not available, or import ShieldAlert */}
                    <LayoutDashboard size={20} />
                  </div>
                  <span className="font-serif font-bold text-purple-900">Admin Panel</span>
                </Link>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7A4A33]/10 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#7A4A33]/10 flex items-center justify-center text-[#7A4A33]">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#2D1B0D]">Copy Address</span>
                  <span className="text-xs text-[#2D1B0D]/50 font-mono truncate max-w-[120px]">
                    {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                  </span>
                </div>
              </button>

              <button
                onClick={handleDisconnect}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <LogOut size={20} />
                </div>
                <span className="font-serif font-bold text-red-600/80 group-hover:text-red-600">Disconnect</span>
              </button>
            </>
          ) : (
            /* Unconnected: Connect Button */
            <div className="w-full">
              <CustomWalletButton />
            </div>
          )}

          <div className="h-[1px] w-full bg-black/5" />

          {/* Telegram Button (Always Visible) */}
          <Link
            href="https://t.me/bearminers"
            target="_blank"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0088cc]/5 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#0088cc]/10 group-hover:border-[#0088cc]/30 transition-all">
              <Image
                src="/img/telegram.svg"
                alt="Telegram"
                width={20}
                height={20}
              />
            </div>
            <span className="font-serif font-bold text-[#2D1B0D] group-hover:text-[#0088cc] transition-colors">Join Telegram</span>
          </Link>

        </div>
      )}
    </nav>
  );
};

export default Nav;
