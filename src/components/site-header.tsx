import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-[--header-height] sticky top-0 z-50 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 transition-all ease-in-out">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-border/40"
        />
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">Platform</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-semibold">Dashboard</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Add global actions or notifications here later */}
        </div>
      </div>
    </header>
  )
}
