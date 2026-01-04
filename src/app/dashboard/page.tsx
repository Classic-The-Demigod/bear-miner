import { AppSidebar } from "@/components/app-sidebar";

import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getBalanceWithGrowth } from "@/app/actions/balance";
import CryptoPriceTracker from "@/components/cyrpto-tracker";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const viewport = {
  themeColor: "#F8EBDD",
};

export default async function Page() {
  // Get session from Solana wallet auth
  const session = await getSession();

  if (!session.userId) {
    return redirect("/");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return redirect("/");
  }

  // Get user with calculated balance growth
  const balanceData = await getBalanceWithGrowth(user.id);

  if (!balanceData.success || !balanceData.user) {
    return redirect("/");
  }

  const userData = balanceData.user;

  console.log("User with calculated balance:", userData);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={userData} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-8 py-8 md:gap-6 md:py-6">
              <SectionCards user={userData} />
              <div className="px-4 lg:px-6">
                <CryptoPriceTracker />
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
