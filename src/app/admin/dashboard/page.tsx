"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Wallet, Search, LayoutDashboard, Copy, Check, Coins, Plus, Minus, Trash2,
  MoreHorizontal, Smartphone, MessageCircle
} from "lucide-react"
import { toast } from "sonner"
import { IconBrandTelegram, IconBrandWhatsapp, IconWallet } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

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



export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const role = user?.role ?? "USER"

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
    whatsappEnabled: false,
    bearTokenPrice: "0"
  })
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
  const [solPrice, setSolPrice] = useState(0)

  // Portfolio Data
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false)

  // Edit Form
  const [editForm, setEditForm] = useState({
    minStakeBalance: "0",
    minDeposit: "100",
    balance: "0",
    tokenBalance: "0",
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

  const fetchPrice = async () => {
    try {
      const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112");
      const data = await res.json();
      const pair = data.pairs?.[1];
      if (pair) setSolPrice(parseFloat(pair.priceUsd));
    } catch (e) { console.error("Failed to fetch SOL price", e); }
  };

  useEffect(() => {
    fetchAll()
    fetchPrice()
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, [])

  // Filtering & Sorting
  useEffect(() => {
    let result = [...users]
    if (searchQuery) {
      result = result.filter(u => u.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Custom Sort: Admins First, then Users. Both sorted by Balance (Descending)
    result.sort((a, b) => {
      // 1. Role Comparison (ADMIN before USER)
      if (a.role === "ADMIN" && b.role !== "ADMIN") return -1
      if (a.role !== "ADMIN" && b.role === "ADMIN") return 1

      // 2. Balance Comparison within same role (Highest Real Balance first)
      const balanceA = a.walletBalance || 0
      const balanceB = b.walletBalance || 0
      return balanceB - balanceA
    })

    setFilteredUsers(result)
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
            tokenBalance: parseFloat(editForm.tokenBalance),
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
    if (!newWallet.name || !newWallet.address) {
      toast.error("Please fill in all fields");
      return;
    }

    // Expert Validation: No duplicate coin types
    // Admin must only have one master withdrawal wallet per coin
    const isDuplicate = paymentWallets.some(w => w.symbol.toUpperCase() === newWallet.symbol.toUpperCase());
    if (isDuplicate) {
      toast.error(`A withdrawal wallet for ${newWallet.symbol} already exists. Please edit or delete the existing one.`);
      return;
    }

    // Expert Multi-Chain Address Validation
    const address = newWallet.address.trim();
    const symbol = newWallet.symbol.toUpperCase();
    let isValid = true

    if (symbol.includes("SOLANA") || symbol.includes("SPL")) {
      // Solana: Base58, 32-44 characters
      isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
    } else if (symbol.includes("ERC-20") || symbol.includes("BEP-20") || symbol.includes("ETHEREUM")) {
      // EVM (ETH, BNB, etc.): 0x followed by 40 hex chars
      isValid = /^0x[a-fA-F0-9]{40}$/.test(address)
    } else if (symbol.includes("BITCOIN")) {
      // Bitcoin: 1, 3, or bc1...
      isValid = /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,62})$/.test(address)
    } else if (symbol.includes("TRC-20")) {
      // Tron (TRC-20): Starts with T, 34 chars
      isValid = /^T[a-zA-Z0-9]{33}$/.test(address)
    }

    if (!isValid) {
      return toast.error(`Invalid ${newWallet.name} (${newWallet.network}) address format. Please check and try again.`)
    }

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
      toast.success("Wallet Added Successfully")
    } catch { toast.error("Failed to save wallet") }
  }



  const openEdit = async (user: any) => {
    setEditUser(user)
    setEditForm({
      minStakeBalance: user.minStakeBalance?.toString() || "1000",
      minDeposit: user.minDeposit?.toString() || "100",
      balance: user.balance?.toString() || "0",
      tokenBalance: user.tokenBalance?.toString() || "0",
      targetReward: user.targetReward?.toString() || "50000",
      role: user.role || "USER"
    })

    // Fetch Live Portfolio
    setIsPortfolioLoading(true)
    setPortfolioData(null)
    try {
      const res = await fetch(`/api/wallet/portfolio?address=${user.walletAddress}`)
      if (res.ok) {
        setPortfolioData(await res.json())
      }
    } catch (e) {
      console.error("Failed to fetch portfolio", e)
    } finally {
      setIsPortfolioLoading(false)
    }
  }

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <SidebarProvider>
      <AppSidebar user={null} />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-col gap-8 p-5 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">


          {/* Header Removed */}


          {/* Stats Grid Header with Live Indicator */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">System Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Live SOL: {solPrice > 0 ? `$${solPrice.toFixed(2)}` : "Loading..."}</span>
            </div>
          </div>

          {/* Stats Grid */}
          {(() => {
            const totalRealAUM_USD = users.reduce((acc, u) => acc + (u.walletBalance || 0), 0);
            const totalRealAUM_SOL = solPrice > 0 ? totalRealAUM_USD / solPrice : 0;
            const totalRewards_SOL = users.reduce((acc, u) => acc + (u.balance || 0), 0);
            const totalRewards_USD = totalRewards_SOL * solPrice;

            return (
              <>
                {/* Desktop View: Separate Cards */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="Total Users" value={users.length} icon={UserCog} color="text-foreground" sub="Registered Accounts" />
                  <StatsCard
                    title="Real AUM"
                    value={`${totalRealAUM_SOL.toFixed(2)} SOL`}
                    subValue={`≈ ${formatCurrency(totalRealAUM_USD)}`}
                    icon={Wallet}
                    color="text-green-500"
                    sub="Connected Liquidity"
                  />
                  <StatsCard
                    title="Rewards (Sim)"
                    value={`${totalRewards_SOL.toFixed(2)} SOL`}
                    subValue={`≈ ${formatCurrency(totalRewards_USD)}`}
                    icon={Coins}
                    color="text-purple-500"
                    sub="Stake/Deposit Rewards"
                  />
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

                      <div className="flex flex-col p-3 bg-green-500/5 rounded-xl border border-green-500/10 h-full justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Wallet className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs font-medium text-green-700/70 uppercase tracking-tight">Real AUM</span>
                          </div>
                          <div className="text-lg font-black font-mono text-green-700 break-words line-clamp-1">{totalRealAUM_SOL.toFixed(2)} SOL</div>
                        </div>
                        <div className="text-[10px] font-bold text-green-600/60 mt-1">≈ {formatCurrency(totalRealAUM_USD)}</div>
                      </div>

                      <div className="flex flex-col p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 h-full justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Coins className="h-3.5 w-3.5 text-purple-600" />
                            <span className="text-xs font-medium text-purple-700/70 uppercase tracking-tight">Rewards</span>
                          </div>
                          <div className="text-lg font-black font-mono text-purple-700 break-words line-clamp-1">{totalRewards_SOL.toFixed(2)} SOL</div>
                        </div>
                        <div className="text-[10px] font-bold text-purple-600/60 mt-1">≈ {formatCurrency(totalRewards_USD)}</div>
                      </div>

                      <div className="flex flex-col p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LayoutDashboard className="h-3.5 w-3.5 text-orange-600" />
                          <span className="text-xs font-medium text-orange-700/70 uppercase tracking-tight">Active</span>
                        </div>
                        <div className="text-xl font-black font-mono text-orange-700">{paymentWallets.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}

          <Separator className="bg-border/40" />

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="bg-muted/30 backdrop-blur-md p-1.5 h-auto grid grid-cols-3 gap-2 border border-border/40 rounded-2xl w-full lg:w-max shadow-inner">
              <TabsTrigger
                value="users"
                className="px-2 sm:px-6 py-3 rounded-xl gap-2 font-bold transition-all duration-300
                  data-[state=active]:bg-[#5C4033] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#5C4033]/20
                  hover:bg-muted/50 text-xs sm:text-sm"
              >
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">User Management</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="px-2 sm:px-6 py-3 rounded-xl gap-2 font-bold transition-all duration-300
                  data-[state=active]:bg-[#5C4033] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#5C4033]/20
                  hover:bg-muted/50 text-xs sm:text-sm"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Platform Config</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger value="wallets" className="flex items-center gap-2 py-3 px-6 data-[state=active]:bg-[#5C4033] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl group">
                <IconWallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-semibold tracking-wide">Withdrawal Wallets</span>
              </TabsTrigger>
            </TabsList>

            {/* USERS TAB */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-card p-5 rounded-xl border shadow-sm">
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
                          <TableCell className="text-right font-mono text-green-600 font-medium whitespace-nowrap">
                            <div className="flex flex-col items-end">
                              <span>{solPrice > 0 ? ((user.walletBalance || 0) / solPrice).toFixed(4) : "0.0000"} SOL</span>
                              <span className="text-[10px] text-muted-foreground">≈ {formatCurrency(user.walletBalance || 0)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-purple-600 font-medium whitespace-nowrap">
                            <div className="flex flex-col items-end">
                              <span>{(user.balance || 0).toFixed(4)} SOL</span>
                              <span className="text-[10px] text-muted-foreground">≈ {formatCurrency((user.balance || 0) * solPrice)}</span>
                            </div>
                          </TableCell>
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
                          <span className="font-mono font-medium text-green-600">{solPrice > 0 ? ((user.walletBalance || 0) / solPrice).toFixed(4) : "0.0000"} SOL</span>
                          <span className="text-[10px] text-muted-foreground block">≈ {formatCurrency(user.walletBalance || 0)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">Sim Rewards</span>
                          <span className="font-mono font-medium text-purple-600">{(user.balance || 0).toFixed(4)} SOL</span>
                          <span className="text-[10px] text-muted-foreground block">≈ {formatCurrency((user.balance || 0) * solPrice)}</span>
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


                {/* Bear Token Config */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                      <span>🐻 Bear Token ($BMT) Configuration</span>
                    </CardTitle>
                    <CardDescription>Set the USD price for 1 $BMT token used for value calculations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Bear Token Price (USD)</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</div>
                        <Input
                          type="number"
                          step="0.0001"
                          value={settings.bearTokenPrice}
                          onChange={(e) => setSettings(p => ({ ...p, bearTokenPrice: e.target.value }))}
                          className="pl-7 font-mono"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
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
            <TabsContent value="wallets" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* (Renamed) Withdrawal Wallet Card (formerly Admin Treasury) */}
              <Card className="border-none shadow-xl bg-gradient-to-br from-[#F8EBDD] to-[#FFFFFF] overflow-hidden group">
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IconWallet className="w-16 h-16 text-[#5C4033]" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#5C4033] flex items-center gap-2">
                    <span className="p-2 bg-[#5C4033]/10 rounded-lg">🏦</span>
                    Deposit, Presale and Stake address
                  </CardTitle>
                  <CardDescription className="text-[#5C4033]/70 font-medium">
                    Configure the master treasury address for all incoming user funds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-[#5C4033]/60 uppercase tracking-widest ml-1">Solana Treasury Address</label>
                      <Input
                        value={settings.solWallet}
                        onChange={(e) => setSettings(p => ({ ...p, solWallet: e.target.value }))}
                        placeholder="Enter master SOL address"
                        className="h-12 bg-white/50 border-[#5C4033]/20 focus:border-[#5C4033] focus:ring-1 focus:ring-[#5C4033] rounded-xl font-mono text-sm"
                      />
                    </div>
                    <div className="md:w-32 flex items-end">
                      <Button
                        onClick={handleSaveSettings}
                        className="w-full h-12 bg-[#5C4033] hover:bg-[#3E2B22] text-white rounded-xl shadow-lg transition-all active:scale-95 font-bold"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden ring-1 ring-[#5C4033]/5">
                <CardHeader className="border-b border-[#5C4033]/5 bg-white/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-black text-[#5C4033] tracking-tight">Withdrawal Wallets</CardTitle>
                      <CardDescription className="font-medium text-[#5C4033]/60">Manage master addresses used for sending payouts to users.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddingWallet(true)} className="gap-2 bg-[#5C4033] hover:bg-[#3E2B22] text-white shadow-lg"><Plus className="h-4 w-4" /> Add New</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
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

      {/* Modals */}
      <AlertDialog open={isAddingWallet} onOpenChange={setIsAddingWallet}>
        <AlertDialogContent className="max-w-md border-none shadow-2xl bg-card p-0 overflow-hidden">
          <div className="bg-primary/10 p-6 border-b border-primary/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
                <Plus className="h-6 w-6" /> Add New Wallet
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground/80">
                Register a new payment method for user deposits.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Preset</label>
              <Select onValueChange={(val) => {
                const p = WALLET_PRESETS.find(x => x.name === val)
                if (p) setNewWallet({ ...newWallet, preset: val, name: p.name, symbol: p.symbol, network: p.network })
              }}>
                <SelectTrigger className="h-12 bg-muted/30 border-none shadow-inner"><SelectValue placeholder="Chose a coin..." /></SelectTrigger>
                <SelectContent>
                  {WALLET_PRESETS.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {newWallet.preset && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wallet Address ({newWallet.network})</label>
                <Input
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                  placeholder="Paste address here..."
                  className="h-12 bg-muted/30 border-none shadow-inner font-mono text-sm"
                />
              </div>
            )}
          </div>

          <AlertDialogFooter className="p-6 pt-0 flex gap-3 sm:flex-row flex-col">
            <AlertDialogCancel className="flex-1 h-12 border-none bg-muted/50 hover:bg-muted font-bold" onClick={() => setIsAddingWallet(false)}>Cancel</AlertDialogCancel>
            <Button onClick={handleAddWallet} className="flex-1 h-12 font-bold shadow-lg shadow-primary/20">Save Wallet</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <AlertDialogContent className="max-w-xl border-none shadow-2xl bg-card p-0 overflow-hidden">
          {editUser && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Premium Header */}
              <div className="bg-primary/5 p-8 border-b border-primary/10 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <UserCog className="h-24 w-24" />
                </div>
                <AlertDialogHeader className="relative z-10 flex flex-row items-center gap-6">
                  <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary shadow-xl">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${editUser.walletAddress}`} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">U</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <AlertDialogTitle className="text-2xl font-black tracking-tight">Edit Profile</AlertDialogTitle>
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(editUser.walletAddress);
                        toast.success("Address Copied");
                      }}
                      className="group/addr cursor-pointer flex items-center gap-2"
                    >
                      <AlertDialogDescription className="text-xs font-mono font-bold bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50 break-all select-all inline-block group-hover/addr:bg-primary/10 group-hover/addr:text-primary transition-all">
                        {editUser.walletAddress}
                      </AlertDialogDescription>
                      <Copy className="h-3 w-3 text-muted-foreground group-hover/addr:text-primary opacity-0 group-hover/addr:opacity-100 transition-all" />
                    </div>
                  </div>
                </AlertDialogHeader>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">

                {/* Live On-Chain Portfolio Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <RefreshCcw className={`h-3 w-3 text-primary ${isPortfolioLoading ? 'animate-spin' : ''}`} />
                      Live On-Chain Portfolio
                    </span>
                    {portfolioData && (
                      <span className="text-primary font-black">
                        Total: {formatCurrency(portfolioData.totalValueUsd)}
                      </span>
                    )}
                  </h4>

                  <div className="bg-muted/30 rounded-2xl border border-border/40 overflow-hidden">
                    {isPortfolioLoading ? (
                      <div className="p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-xs font-bold animate-pulse">Scanning Solana Mainnet...</p>
                      </div>
                    ) : portfolioData && portfolioData.tokens && portfolioData.tokens.length > 0 ? (
                      <div className="divide-y divide-border/30">
                        {portfolioData.tokens.map((token: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center font-bold text-xs ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                                {token.symbol === 'SOL' ? (
                                  <img src="/img/solana-logo.svg" alt="SOL" className="h-6 w-6" />
                                ) : (
                                  <span>{token.symbol?.[0] || 'T'}</span>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-sm font-black flex items-center gap-2">
                                  {token.symbol || 'Unknown Token'}
                                  {token.price > 0 && <span className="text-[10px] text-muted-foreground font-medium">@ {token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}</span>}
                                </div>
                                <div className="text-[10px] font-mono text-muted-foreground/60 break-all max-w-[150px] truncate">
                                  {token.mint}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold font-mono">
                                {token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                              </div>
                              <div className="text-[10px] font-black text-muted-foreground">
                                ≈ {formatCurrency(token.valueUsd || 0)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center space-y-2">
                        <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                          <Wallet className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">No active assets detected on-chain.</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* New Prominent Rewards Summary (Mobile Friendly) */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                    <Coins className="h-32 w-32" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Rewards Balance Status</span>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-black tracking-tight truncate" title={parseFloat(editForm.balance || "0").toFixed(4)}>{parseFloat(editForm.balance || "0").toFixed(4)}</span>
                          <span className="text-xl font-bold text-primary shrink-0">SOL</span>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground/80 truncate">
                          ≈ {solPrice > 0 ? formatCurrency(parseFloat(editForm.balance || "0") * solPrice) : "$0.00"} USD
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-primary/10 pt-6 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-black tracking-tight truncate" title={new Intl.NumberFormat().format(parseFloat(editForm.tokenBalance || "0"))}>{new Intl.NumberFormat().format(parseFloat(editForm.tokenBalance || "0"))}</span>
                          <span className="text-xl font-bold text-yellow-600 shrink-0">BMT</span>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground/80 truncate">
                          ≈ {formatCurrency(parseFloat(editForm.tokenBalance || "0") * parseFloat(settings.bearTokenPrice || "0"))} USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Section 2: Financial Configuration */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Wallet className="h-3 w-3 text-green-600" /> Financial Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rewards Balance */}
                    <div className="col-span-2 space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/50">
                      <label className="text-xs font-bold text-muted-foreground flex justify-between">
                        <span>Stake/Deposit Rewards Balance</span>
                        <span className="text-primary">SOL</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <img src="/img/solana-logo.svg" alt="SOL" className="h-6 w-6" />
                          </div>
                          <Input
                            type="number"
                            className="pl-12 h-14 font-mono text-2xl font-black bg-background border-none shadow-xl focus-visible:ring-primary/20"
                            value={editForm.balance}
                            onChange={(e) => setEditForm(p => ({ ...p, balance: e.target.value }))}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-[26px] w-10 border-primary/20 hover:bg-primary/10"
                            onClick={() => {
                              const val = parseFloat(editForm.balance || "0");
                              setEditForm(p => ({ ...p, balance: (val + 1).toString() }));
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-[26px] w-10 border-red-500/20 hover:bg-red-500/10"
                            onClick={() => {
                              const val = parseFloat(editForm.balance || "0");
                              setEditForm(p => ({ ...p, balance: Math.max(0, val - 1).toString() }));
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {solPrice > 0 && (
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-1">
                          <span className="opacity-50 text-[10px] uppercase tracking-wider">Estimated Value:</span>
                          <span className="text-foreground">{formatCurrency(parseFloat(editForm.balance || "0") * solPrice)} USD</span>
                        </div>
                      )}
                    </div>

                    {/* Bear Token Balance */}
                    <div className="col-span-2 space-y-3 bg-yellow-500/5 p-5 rounded-2xl border border-yellow-500/10">
                      <label className="text-xs font-bold text-muted-foreground flex justify-between">
                        <span>Bear Token Balance ($BMT)</span>
                        <span className="text-yellow-600">BMT</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-lg">🐻</div>
                          <Input
                            type="number"
                            className="pl-12 h-14 font-mono text-2xl font-black bg-background border-none shadow-xl focus-visible:ring-yellow-500/20"
                            value={editForm.tokenBalance}
                            onChange={(e) => setEditForm(p => ({ ...p, tokenBalance: e.target.value }))}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-[26px] w-10 border-yellow-500/20 hover:bg-yellow-500/10"
                            onClick={() => {
                              const val = parseFloat(editForm.tokenBalance || "0");
                              setEditForm(p => ({ ...p, tokenBalance: (val + 1000).toString() }));
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-[26px] w-10 border-red-500/20 hover:bg-red-500/10"
                            onClick={() => {
                              const val = parseFloat(editForm.tokenBalance || "0");
                              setEditForm(p => ({ ...p, tokenBalance: Math.max(0, val - 1000).toString() }));
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-1">
                        <span className="opacity-50 text-[10px] uppercase tracking-wider">Estimated Value:</span>
                        <span className="text-foreground">{formatCurrency(parseFloat(editForm.tokenBalance || "0") * parseFloat(settings.bearTokenPrice || "0"))} USD</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">Min Deposit (SOL)</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <img src="/img/solana-logo.svg" alt="SOL" className="h-4 w-4 opacity-80" />
                        </div>
                        <Input
                          type="number"
                          className="pl-9 h-11 bg-muted/40 border-none shadow-inner font-mono font-bold"
                          value={editForm.minDeposit}
                          onChange={(e) => setEditForm(p => ({ ...p, minDeposit: e.target.value }))}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground/60 px-1 mt-1">
                        ≈ {solPrice > 0 ? formatCurrency(parseFloat(editForm.minDeposit || "0") * solPrice) : "$0.00"} USD
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">Withdraw Threshold ($)</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold pointer-events-none">$</div>
                        <Input
                          type="number"
                          className="pl-7 h-11 bg-muted/40 border-none shadow-inner font-mono font-bold"
                          value={editForm.minStakeBalance}
                          onChange={(e) => setEditForm(p => ({ ...p, minStakeBalance: e.target.value }))}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground/60 px-1 mt-1">
                        ≈ {solPrice > 0 ? (parseFloat(editForm.minStakeBalance || "0") / solPrice).toFixed(4) : "0.0000"} SOL
                      </div>
                    </div>

                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* Section: Access Control (Moved to Bottom) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="h-3 w-3 text-primary" /> Identity & Access
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">Account Role</label>
                      <Select value={editForm.role} onValueChange={(v) => setEditForm(p => ({ ...p, role: v }))}>
                        <SelectTrigger className="h-12 bg-muted/40 border-none shadow-inner font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-none shadow-xl">
                          <SelectItem value="USER">User (Standard)</SelectItem>
                          <SelectItem value="ADMIN">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-8 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row gap-4">
                <AlertDialogCancel className="h-14 flex-1 border-none bg-background hover:bg-muted font-bold" onClick={() => setEditUser(null)}>
                  Discard Changes
                </AlertDialogCancel>
                <Button onClick={handleUpdateUser} className="h-14 flex-1 text-lg font-black shadow-xl shadow-primary/20" size="lg">
                
                  <Check className="mr-2 h-5 w-5" /> Save Profile
                </Button>
                {/* <Button onClick={handleUpdateUser} className="h-14 bg-red-600 flex-1 text-lg font-black shadow-xl shadow-primary/20" size="lg">
                <IconFidgetSpinner className={`mr-2 h-5 w-5`} />
                   Pending Withdrawal
                </Button> */}
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </SidebarProvider>
  )
}

function StatsCard({ title, value, subValue, icon: Icon, color, sub }: any) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground truncate">{value}</h3>
            {subValue && <p className="text-xs sm:text-sm font-bold text-muted-foreground/60 mt-0.5">{subValue}</p>}
          </div>
          <div className={`p-2.5 rounded-xl bg-background/80 shadow-sm border border-border/50 shrink-0 ml-2 ${color.replace('text-', 'bg-opacity-10 ')}`}>
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
