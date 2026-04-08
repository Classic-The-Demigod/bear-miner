"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from "react";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/app/providers/auth-provider";
import { WalletModal } from "./wallet-modal";

interface WalletModalContextState {
    visible: boolean;
    setVisible: (open: boolean) => void;
    connectWallet: (walletName: WalletName) => void;
    isPending: boolean;
}

const WalletModalContext = createContext<WalletModalContextState>(
    {} as WalletModalContextState
);

export function useWalletModal(): WalletModalContextState {
    return useContext(WalletModalContext);
}

export const CustomWalletModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [visible, setVisible] = useState(false);
    const [pendingWallet, setPendingWallet] = useState<WalletName | null>(null);
    const { select, connect, connecting, connected, publicKey, wallet } = useWallet();
    const { signIn, isAuthenticated, isAuthenticating } = useAuth();

    const connectWallet = useCallback((walletName: WalletName) => {
        setPendingWallet(walletName);
        setVisible(false);
        select(walletName);
    }, [select]);

    useEffect(() => {
        if (!pendingWallet || wallet?.adapter.name !== pendingWallet) {
            return;
        }

        let cancelled = false;

        const completeConnection = async () => {
            try {
                if (!connected) {
                    if (!connecting) {
                        await connect();
                    }
                    return;
                }

                if (!publicKey || isAuthenticating) {
                    return;
                }

                if (!isAuthenticated) {
                    await signIn();
                }

                if (!cancelled) {
                    setPendingWallet(null);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Connection/Authentication failed:", error);
                    setPendingWallet(null);
                }
            }
        };

        void completeConnection();

        return () => {
            cancelled = true;
        };
    }, [pendingWallet, wallet, connected, connecting, publicKey, connect, signIn, isAuthenticated, isAuthenticating]);

    return (
        <WalletModalContext.Provider
            value={{
                visible,
                setVisible,
                connectWallet,
                isPending: !!pendingWallet || connecting || isAuthenticating,
            }}
        >
            {children}
            {visible && <WalletModal onClose={() => setVisible(false)} />}
        </WalletModalContext.Provider>
    );
};
