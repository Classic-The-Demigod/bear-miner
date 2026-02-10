"use client";

import { SolanaWalletProvider } from "./wallet-provider";
import { AuthProvider } from "./auth-provider";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

export function Providers({ children }: { children: React.ReactNode }) {
const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider>
        <AuthProvider>{children}</AuthProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
