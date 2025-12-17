"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconHome,
  IconShieldLock,
} from "@tabler/icons-react";

import { useAuth } from "@/app/providers/auth-provider";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  id: string;
  name: string;
  email: string;
  balance: number | null;
  tokenBalance: number | null;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  image: string | null;
}

type AppSidebarCombinedProps = React.ComponentProps<typeof Sidebar> & {
  user: AppSidebarProps | null;
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ user: propUser, ...props }: AppSidebarCombinedProps) {
  const { user } = useAuth(); // Use client auth state for roles to be instant

  const navMain = [...data.navMain];
  if (user?.role === 'ADMIN') {
    navMain.push({
      title: "Admin Panel",
      url: "/admin/dashboard",
      icon: IconShieldLock,
    });
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-background/95 backdrop-blur-xl" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/20 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="relative flex items-center justify-center h-10 w-10 shrink-0">
                  <Image
                    src="/assets/logo.svg"
                    alt="Bear Miner Logo"
                    width={34}
                    height={34}
                    className="transition-transform duration-300 hover:rotate-12 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden transition-all duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
                  <span className="font-serif text-xl font-bold tracking-tight text-foreground/90 whitespace-nowrap">
                    Bear Miner
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-semibold text-left">
                    Dashboard
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Nav */}
        <NavMain items={navMain} />

        {/* Secondary Groups could go here */}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/20 bg-muted/5 p-4">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
