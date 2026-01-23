"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  walletAddress: string;
  balance: number;
  tokenBalance: number;
  role: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, signMessage, connected, disconnect, connecting } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Ref to prevent double-firing (tracks the last wallet address we tried to auth with)
  const lastAttemptedWallet = useRef<string | null>(null);

  // Auto-authenticate removed to avoid "WalletSignMessageError" (gesture requirement) 
  // Authentication must now be triggered by a user click via signIn()
  useEffect(() => {
    if (connected && !user && !isAuthenticating) {
      console.log("[AuthProvider] Wallet connected. Waiting for manual sign-in.");
    }
  }, [connected, user, isAuthenticating]);

  // Handle wallet disconnection and redirection
  useEffect(() => {
    if (!connected) {
      if (user) setUser(null);
      lastAttemptedWallet.current = null; // Reset attempt flag so we can login again
      setIsAuthenticating(false);

      // Redirect if on protected path and not currently trying to connect or authenticate
      const isProtectedRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
      if (isProtectedRoute && !isLoading && !isAuthenticating && !connecting) {
        console.log("[AuthProvider] Unauthorized access detected. Redirecting to home...");
        router.push("/");
      }
    }
  }, [connected, user, pathname, isLoading, isAuthenticating, connecting, router]);

  async function handleAutoSignIn() {
    // Double check requirements inside the function to be safe
    if (!publicKey || !signMessage || isAuthenticating) return;

    // Check ref again vs current key
    if (lastAttemptedWallet.current === publicKey.toBase58()) return;

    setIsAuthenticating(true);
    lastAttemptedWallet.current = publicKey.toBase58();

    const toastId = toast.loading("Please sign the message in your wallet...");

    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(
        `/api/auth/nonce?walletAddress=${publicKey.toBase58()}`
      );

      if (!nonceResponse.ok) {
        throw new Error("Failed to initialize login");
      }

      const { nonce } = await nonceResponse.json();

      // Step 2: Create message to sign
      const message = `Sign this message to authenticate with ${process.env.NEXT_PUBLIC_APP_NAME || "Bear Miners"
        }\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

      const encodedMessage = new TextEncoder().encode(message);

      // Step 3: Request signature from wallet
      // This is the part that triggers the popup
      const signature = await signMessage(encodedMessage);

      toast.dismiss(toastId);
      toast.loading("Verifying signature...", { id: toastId });

      // Step 4: Verify signature with backend
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: Array.from(signature),
          message,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Authentication failed");
      }

      const { user: authenticatedUser } = await verifyResponse.json();
      setUser(authenticatedUser);
      toast.success("Successfully logged in", { id: toastId });

      router.push("/dashboard");

      // Step 5: Redirect to dashboard is handled by components checking user state
    } catch (error) {
      console.error("Auto sign-in failed:", error);
      lastAttemptedWallet.current = null; // Allow retry if it failed

      let errorMessage = "Authentication failed";
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Login cancelled by user";
          await disconnect(); // Disconnect if user refuses to sign
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function signIn() {
    await handleAutoSignIn();
  }

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      lastAttemptedWallet.current = null;
      await disconnect();
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Logout failed");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAuthenticating,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
