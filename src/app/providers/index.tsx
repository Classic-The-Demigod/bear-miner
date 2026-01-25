"use client";

import { SolanaWalletProvider } from "./wallet-provider";
import { AuthProvider } from "./auth-provider";
import { CustomWalletModalProvider } from "@/components/wallet/custom-wallet-modal-provider";
import { AutoLogout } from "@/components/auth/auto-logout";

export function Providers({ children }: { children: React.ReactNode }) {
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
