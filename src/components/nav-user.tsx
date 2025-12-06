"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/app/providers/auth-provider"; // NEW: Use Solana auth

interface NavUserProps {
  name: string | null;
  email: string | null;
  walletAddress: string; // NEW: Added wallet address
  avatar?: string;
  balance: number | null;
  tokenBalance: number | null;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  image: string | null;
}

export function NavUser({ user }: { user: NavUserProps | null }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth(); // NEW: Get signOut from Solana auth

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading("Logging out...");

      await signOut(); // This now uses Solana wallet auth

      toast.dismiss(loadingToast);
      toast.success("You've logged out. See you soon!");

      // Small delay to allow toast to show before redirect
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      toast.error("An error occurred during logout");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (!user) {
    return null;
  }

  // Generate display name and initials from wallet address if name not set
  const displayName = user.name || `User ${user.walletAddress.slice(0, 4)}`;
  const displayEmail =
    user.email ||
    `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-4)}`;
  const initials = user.name
    ? user.name.substring(0, 2).toUpperCase()
    : user.walletAddress.substring(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.image || undefined} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar || user.image || undefined}
                    alt={displayName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs font-mono">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Show full wallet address */}
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="text-xs text-muted-foreground">
                Wallet Address
              </div>
              <div className="text-xs font-mono break-all mt-1">
                {user.walletAddress}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <IconLogout />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
