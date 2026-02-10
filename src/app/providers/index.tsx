"use client";

import { SolanaWalletProvider } from "./wallet-provider";
import { AuthProvider } from "./auth-provider";
import { CustomWalletModalProvider } from "@/components/wallet/custom-wallet-modal-provider";
import { AutoLogout } from "@/components/auth/auto-logout";
import { clusterApiUrl } from "@solana/web3.js";

export function Providers({ children }: { children: React.ReactNode }) {
const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

  return (
    <SolanaWalletProvider>
      <AuthProvider>
        <CustomWalletModalProvider>
          <AutoLogout />
          {children}
        </CustomWalletModalProvider>
      </AuthProvider>
    </SolanaWalletProvider>
  );
}
