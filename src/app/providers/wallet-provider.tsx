"use client";

import { useMemo, useCallback } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
// import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";
import { AutoLogout } from "@/components/auth/auto-logout";
import { CustomWalletModalProvider } from "@/components/wallet/custom-wallet-modal-provider";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get network from environment or default to devnet
  const network =
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) ||
    WalletAdapterNetwork.Devnet;

  // Get RPC endpoint from environment or use default
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Configure supported wallets
  // We use an empty array because modern Solana wallets (Phantom, Solflare, etc.) 
  // support the "Wallet Standard" and are automatically detected by the provider.
  // This prevents annoying "Failed to connect" errors from extensions like MetaMask.
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError) => {
    // Silence non-critical extension errors that don't affect our app's functionality.
    // This specifically prevents "Failed to connect to MetaMask" from showing up
    // when both Phantom and MetaMask are installed.
    if (error.name === 'WalletConnectionError' || error.message.includes('MetaMask')) {
      return;
    }
    console.error("[WalletProvider] Wallet Error:", error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={false}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
