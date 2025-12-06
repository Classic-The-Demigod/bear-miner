"use client";

import { SolanaWalletProvider } from "./wallet-provider";
import { AuthProvider } from "./auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaWalletProvider>
      <AuthProvider>{children}</AuthProvider>
    </SolanaWalletProvider>
  );
}
