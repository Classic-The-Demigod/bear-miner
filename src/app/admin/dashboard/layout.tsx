// app/admin/dashboard/layout.tsx
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#F8EBDD",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
