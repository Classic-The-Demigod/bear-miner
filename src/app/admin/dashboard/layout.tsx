import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Bear Miner | Admin",
    description: "Admin Dashboard",
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
        { media: "(prefers-color-scheme: dark)", color: "#09090B" },
    ],
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
