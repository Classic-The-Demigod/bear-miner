"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import {
  Loader2, Settings, UserCog, RefreshCcw, ShieldAlert,
  Wallet, Search, LayoutDashboard, Copy, Check, Coins, Plus, Trash2,
  MoreHorizontal, Smartphone, MessageCircle
} from "lucide-react"
import { toast } from "sonner"
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const WALLET_PRESETS = [
  { name: "Bitcoin", symbol: "BTC", network: "Bitcoin Network" },
  { name: "Ethereum", symbol: "ETH", network: "ERC-20" },
  { name: "Solana", symbol: "SOL", network: "Solana Mainnet" },
  { name: "Tether (TRC20)", symbol: "USDT", network: "TRC-20" },
  { name: "Tether (ERC20)", symbol: "USDT", network: "ERC-20" },
  { name: "Tether (Solana)", symbol: "USDT", network: "SPL" },
  { name: "BNB", symbol: "BNB", network: "BEP-20" }
]

// Formatting Helpers
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const viewport = {
  themeColor: "#F8EBDD",
};

export default function AdminDashboard() {
  const router = useRouter()
  const { role, isLoading: isAuthLoading } = useWalletPortfolio()

  // State
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Wallet Management
  const [paymentWallets, setPaymentWallets] = useState<any[]>([])
  const [isWalletsLoading, setIsWalletsLoading] = useState(false)
  const [isAddingWallet, setIsAddingWallet] = useState(false)
  const [newWallet, setNewWallet] = useState({ preset: "", name: "", symbol: "", network: "", address: "" })

  // Settings
  const [settings, setSettings] = useState({
    solWallet: "",
    telegramBotToken: "",
    telegramChatId: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    whatsappEnabled: false
  })
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)

  // Edit Form
  const [editForm, setEditForm] = useState({
    minStakeBalance: "0",
    minDeposit: "100",
    balance: "0",
    targetReward: "50000",
    role: "USER"
  })

  // Auth Check
  useEffect(() => {
    if (!isAuthLoading && role !== "ADMIN") {
      router.push("/admin/unauthorized")
    }
  }, [role, isAuthLoading, router])

  // Data Fetching
  const fetchAll = async () => {
    fetchUsers()
    fetchWallets()
    fetchSettings()
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
        setFilteredUsers(data)
      }
    } catch (e) { console.error(e) } finally { setIsLoading(false) }
  }

  const fetchWallets = async () => {
    setIsWalletsLoading(true)
    try {
      const res = await fetch("/api/admin/wallets")
      if (res.ok) setPaymentWallets(await res.json())
    } catch (e) { console.error(e) } finally { setIsWalletsLoading(false) }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/wallets")
      const data = await res.json()
      setSettings(prev => ({ ...prev, ...data }))
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchAll() }, [])

  // Filtering
  useEffect(() => {
    if (!searchQuery) setFilteredUsers(users)
    else setFilteredUsers(users.filter(u => u.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())))
  }, [searchQuery, users])

  // Handlers
  const handleUpdateUser = async () => {
    if (!editUser) return
    try {
      const res = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWallet: editUser.walletAddress,
          data: {
            minStakeBalance: parseFloat(editForm.minStakeBalance),
            minDeposit: parseFloat(editForm.minDeposit),
            balance: parseFloat(editForm.balance),
            targetReward: parseFloat(editForm.targetReward),
            role: editForm.role
          }
        })
      })
      if (!res.ok) throw new Error()
      setEditUser(null)
      toast.success("User Updated")
      fetchUsers()
    } catch { toast.error("Update Failed") }
  }

  const handleSaveSettings = async () => {
    setIsUpdatingSettings(true)
    try {
      await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })
      toast.success("Global Settings Saved")
    } catch { toast.error("Save Failed") } finally { setIsUpdatingSettings(false) }
  }

  const handleAddWallet = async () => {
    if (!newWallet.address) return toast.error("Address Required")
    try {
      const res = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWallet)
      })
      if (!res.ok) throw new Error()
      await fetchWallets()
      setIsAddingWallet(false)
      setNewWallet({ preset: "", name: "", symbol: "", network: "", address: "" })
      toast.success("Wallet Added")
    } catch { toast.error("Add Failed") }
  }

  const openEdit = (user: any) => {
    setEditUser(user)
    setEditForm({
      minStakeBalance: user.minStakeBalance?.toString() || "1000",
      minDeposit: user.minDeposit?.toString() || "100",
      balance: user.balance?.toString() || "0",
      targetReward: user.targetReward?.toString() || "50000",
      role: user.role || "USER"
    })
  }

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">


          {/* Header Removed */}


          {/* Stats Grid */}
          {/* Desktop View: Separate Cards */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Users" value={users.length} icon={UserCog} color="text-foreground" sub="Registered Accounts" />
            <StatsCard title="Real AUM" value={formatCurrency(users.reduce((acc, u) => acc + (u.walletBalance || 0), 0))} icon={Wallet} color="text-green-500" sub="Connected Liquidity" />
            <StatsCard title="Rewards (Sim)" value={formatCurrency(users.reduce((acc, u) => acc + (u.balance || 0), 0))} icon={Coins} color="text-purple-500" sub="Display Value" />
            <StatsCard title="Active Wallets" value={paymentWallets.length} icon={LayoutDashboard} color="text-orange-500" sub="Deposit Options" />
          </div>

          {/* Mobile View: Single Consolidated Card */}
          <Card className="md:hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 bg-muted/20 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCog className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Users</span>
                  </div>
                  <div className="text-xl font-black font-mono">{users.length}</div>
                </div>

                <div className="flex flex-col p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-700/70 uppercase tracking-tight">Real AUM</span>
                  </div>
                  <div className="text-lg font-black font-mono text-green-700">{formatCurrency(users.reduce((acc, u) => acc + (u.walletBalance || 0), 0))}</div>
                </div>

                <div className="flex flex-col p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700/70 uppercase tracking-tight">Rewards</span>
                  </div>
                  <div className="text-lg font-black font-mono text-purple-700">{formatCurrency(users.reduce((acc, u) => acc + (u.balance || 0), 0))}</div>
                </div>

                <div className="flex flex-col p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutDashboard className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700/70 uppercase tracking-tight">Active</span>
                  </div>
                  <div className="text-lg font-black font-mono text-orange-700">{paymentWallets.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/40" />

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start w-full sm:w-auto">
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <UserCog className="h-4 w-4" /> User Management
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" /> Platform Config
              </TabsTrigger>
              <TabsTrigger value="wallets" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Wallet className="h-4 w-4" /> Payment Wallets
              </TabsTrigger>
            </TabsList>

            {/* USERS TAB */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold">User Directory</h3>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search address..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Desktop Table / Mobile Cards */}
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="hidden md:block">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>User Identity</TableHead>
                        <TableHead className="text-right">Real Balance</TableHead>
                        <TableHead className="text-right">Sim Rewards</TableHead>
                        <TableHead className="text-center">Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                      ) : filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 rounded-lg bg-muted border">
                                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-mono text-xs font-bold">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</div>
                                <div className="text-[10px] text-muted-foreground">{formatDate(user.createdAt)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-green-600 font-medium">{formatCurrency(user.walletBalance || 0)}</TableCell>
                          <TableCell className="text-right font-mono text-purple-600 font-medium">{formatCurrency(user.balance || 0)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px]">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => openEdit(user)}><Settings className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-lg bg-muted border">
                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-mono text-sm font-bold">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</div>
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] mt-1">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(user)}><Settings className="h-4 w-4" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                        <div>
                          <span className="text-xs text-muted-foreground block">Real Assets</span>
                          <span className="font-mono font-medium text-green-600">{formatCurrency(user.walletBalance || 0)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">Sim Rewards</span>
                          <span className="font-mono font-medium text-purple-600">{formatCurrency(user.balance || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* CONFIG TAB */}
            <TabsContent value="config">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Telegram Config */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0088cc]">
                      <IconBrandTelegram className="h-5 w-5" /> Telegram Bot
                    </CardTitle>
                    <CardDescription>Configure alerts for logins and withdrawals.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Bot Token</label>
                      <Input
                        placeholder="123456:ABC-..."
                        type="password"
                        value={settings.telegramBotToken}
                        onChange={(e) => setSettings(p => ({ ...p, telegramBotToken: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Chat ID</label>
                      <Input
                        placeholder="-100..."
                        value={settings.telegramChatId}
                        onChange={(e) => setSettings(p => ({ ...p, telegramChatId: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp Config */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#25D366]">
                      <IconBrandWhatsapp className="h-5 w-5" /> WhatsApp (Twilio)
                    </CardTitle>
                    <CardDescription>Enterprise messaging via Twilio API.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Enable WhatsApp Alerts</span>
                      <Switch
                        checked={settings.whatsappEnabled}
                        onCheckedChange={(c) => setSettings(p => ({ ...p, whatsappEnabled: c }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Account SID</label>
                      <Input
                        placeholder="AC..."
                        value={settings.twilioAccountSid}
                        onChange={(e) => setSettings(p => ({ ...p, twilioAccountSid: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Auth Token</label>
                      <Input
                        type="password"
                        placeholder="Token..."
                        value={settings.twilioAuthToken}
                        onChange={(e) => setSettings(p => ({ ...p, twilioAuthToken: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Sender Number</label>
                      <Input
                        placeholder="whatsapp:+14155238886"
                        value={settings.twilioPhoneNumber}
                        onChange={(e) => setSettings(p => ({ ...p, twilioPhoneNumber: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Wallet */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" /> Admin Treasury Wallet
                    </CardTitle>
                    <CardDescription>Wallet used for receiving fees or withdrawals (if applicable).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={settings.solWallet}
                      onChange={(e) => setSettings(p => ({ ...p, solWallet: e.target.value }))}
                      className="font-mono"
                      placeholder="Solana Address..."
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isUpdatingSettings} size="lg" className="gap-2 shadow-lg">
                  {isUpdatingSettings ? <Loader2 className="animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Configuration
                </Button>
              </div>
            </TabsContent>

            {/* WALLETS TAB */}
            <TabsContent value="wallets">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage deposit wallets displayed to users.</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddingWallet(true)} className="gap-2"><Plus className="h-4 w-4" /> Add New</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentWallets.map((w) => (
                      <div key={w.id} className="p-4 border rounded-xl bg-muted/10 relative group hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">{w.symbol}</Badge>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => {
                            // Just UI for now, actual delete needs implementation or handler
                            // Reusing the fetch from previous example logic if implicit
                            // Assuming handle delete exists or calling api directly
                            fetch(`/api/admin/wallets/${w.id}`, { method: "DELETE" }).then(() => fetchWallets())
                          }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-bold text-sm mb-1">{w.name}</div>
                        <div className="text-xs text-muted-foreground break-all font-mono bg-muted p-2 rounded">{w.address}</div>
                        <div className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">{w.network}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </SidebarInset>

      {/* Sheets */}
      <Sheet open={isAddingWallet} onOpenChange={setIsAddingWallet}>
        <SheetContent>
          <SheetHeader><SheetTitle>Add Wallet</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coin</label>
              <Select onValueChange={(val) => {
                const p = WALLET_PRESETS.find(x => x.name === val)
                if (p) setNewWallet({ ...newWallet, preset: val, name: p.name, symbol: p.symbol, network: p.network })
              }}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {WALLET_PRESETS.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {newWallet.preset && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Address ({newWallet.network})</label>
                <Input value={newWallet.address} onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })} />
              </div>
            )}
            <Button onClick={handleAddWallet} className="w-full">Add Wallet</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full border-l shadow-2xl">
          <SheetHeader className="mb-6 space-y-2 pt-6">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <UserCog className="h-6 w-6 text-primary" />
              Edit User Profile
            </SheetTitle>
            <SheetDescription>
              Modify permissions, balances, and global settings for this account.
            </SheetDescription>
          </SheetHeader>

          {editUser && (
            <div className="space-y-6 pb-20">
              {/* Identity Section */}
              <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <ShieldAlert className="h-3.5 w-3.5" /> Identity & Access
                </h4>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Wallet Address</label>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg border font-mono text-xs break-all shadow-sm">
                    <span className="flex-1">{editUser.walletAddress}</span>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => {
                      navigator.clipboard.writeText(editUser.walletAddress);
                      toast.success("Address Copied");
                    }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Account Role</label>
                  <Select value={editForm.role} onValueChange={(v) => setEditForm(p => ({ ...p, role: v }))}>
                    <SelectTrigger className="h-10 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User (Standard)</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Financials Section */}
              <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <Wallet className="h-3.5 w-3.5" /> Financial Configuration
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Simulated Rewards Balance (USD)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">$</div>
                      <Input
                        type="number"
                        className="pl-7 h-10 font-mono bg-background"
                        value={editForm.balance}
                        onChange={(e) => setEditForm(p => ({ ...p, balance: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Withdraw Threshold ($)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">$</div>
                      <Input
                        type="number"
                        className="pl-7 h-10 font-mono bg-background"
                        value={editForm.minStakeBalance}
                        onChange={(e) => setEditForm(p => ({ ...p, minStakeBalance: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Min Deposit (SOL)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">◎</div>
                      <Input
                        type="number"
                        className="pl-7 h-10 font-mono bg-background"
                        value={editForm.minDeposit}
                        onChange={(e) => setEditForm(p => ({ ...p, minDeposit: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Target Reward Cap ($)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">$</div>
                      <Input
                        type="number"
                        className="pl-7 h-10 font-mono bg-background"
                        value={editForm.targetReward}
                        onChange={(e) => setEditForm(p => ({ ...p, targetReward: e.target.value }))}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Maximum displayed simulated reward before claiming is enforced.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 sticky bottom-0 bg-background/50 backdrop-blur-sm pb-4">
                <Button onClick={handleUpdateUser} className="w-full h-12 text-base font-semibold shadow-xl" size="lg">
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </SidebarProvider>
  )
}

function StatsCard({ title, value, icon: Icon, color, sub }: any) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">{title}</p>
            <h3 className="text-3xl font-black tracking-tight text-foreground">{value}</h3>
          </div>
          <div className={`p-2.5 rounded-xl bg-background/80 shadow-sm border border-border/50 ${color.replace('text-', 'bg-opacity-10 ')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${color.includes('green') ? 'bg-green-500' : color.includes('purple') ? 'bg-purple-500' : color.includes('orange') ? 'bg-orange-500' : 'bg-primary'}`} />
          <p className="text-xs font-medium text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}
