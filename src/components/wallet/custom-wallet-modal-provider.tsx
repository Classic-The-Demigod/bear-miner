"use client";

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { WalletModal } from "./wallet-modal";

interface WalletModalContextState {
    visible: boolean;
    setVisible: (open: boolean) => void;
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

    return (
        <WalletModalContext.Provider
            value={{
                visible,
                setVisible,
            }}
        >
            {children}
            {visible && <WalletModal onClose={() => setVisible(false)} />}
        </WalletModalContext.Provider>
    );
};
