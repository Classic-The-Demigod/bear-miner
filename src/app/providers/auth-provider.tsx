"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

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
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  // Check if user has an active session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (connected && publicKey && !user && !isAuthenticating) {
      handleAutoSignIn();
    }
  }, [connected, publicKey, user]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected && user) {
      handleSignOut();
    }
  }, [connected]);

  async function checkSession() {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAutoSignIn() {
    if (!publicKey || !signMessage || isAuthenticating) return;

    setIsAuthenticating(true);
    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(
        `/api/auth/nonce?walletAddress=${publicKey.toBase58()}`
      );

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce");
      }

      const { nonce } = await nonceResponse.json();

      // Step 2: Create message to sign
      const message = `Sign this message to authenticate with ${
        process.env.NEXT_PUBLIC_APP_NAME || "our app"
      }\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

      const encodedMessage = new TextEncoder().encode(message);

      // Step 3: Request signature from wallet
      const signature = await signMessage(encodedMessage);

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

      // Step 5: Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Auto sign-in failed:", error);
      // If user cancels signing, disconnect wallet
      if (error instanceof Error && error.message.includes("User rejected")) {
        await disconnect();
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function signIn() {
    await handleAutoSignIn();
  }

  async function signOut() {
    await handleSignOut();
  }

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      await disconnect();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
