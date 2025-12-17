"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function AutoLogout() {
    const { connected, disconnect } = useWallet();
    const timerRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!connected) return;

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                console.log("Auto-logout triggered due to inactivity.");
                disconnect();
                toast.info("Disconnected due to inactivity (5m).");
            }, TIMEOUT_MS);
        };

        // Events to track activity
        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

        // Initial start
        resetTimer();

        // Attach listeners
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [connected, disconnect]);

    return null;
}
