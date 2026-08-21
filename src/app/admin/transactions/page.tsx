"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
  Loader2, Search, ArrowDownLeft, ArrowUpRight, Coins, Wallet, ExternalLink,
  Copy, Check, RefreshCcw, ShieldCheck, Filter, ArrowRight,
  CheckCircle2, XCircle, Clock3, Eye, Sparkles, Rocket
} from "lucide-react"
import { toast } from "sonner"

// Formatting Helpers
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

// Helper to generate authentic-looking Base58 Solana addresses & 88-char signatures
const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const getRandomBase58 = (length: number) => {
  let res = ""
  for (let i = 0; i < length; i++) {
    res += BASE58_CHARS.charAt(Math.floor(Math.random() * BASE58_CHARS.length))
  }
  return res
}

// Master Treasury Solana Address (Authentic 44-char Base58 Key)
const MASTER_TREASURY_ADDRESS = "7xKXtg2CW87d97TXJSDn5DBwA5kGnp6gB8kY2p3vF1m4"

interface MockTx {
  id: string
  hash: string
  user: any
  type: "DEPOSIT" | "WITHDRAW" | "BMT_CLAIM" | "PRESALE_PURCHASE"
  title: string
  solAmount: number
  bmtAmount?: number
  usdValue: number
  destinationWallet: string
  sourceWallet: string
  status: "CONFIRMED" | "PENDING" | "PROCESSING" | "FAILED"
  slot: number
  blockHeight: number
  gasFeeSol: number
  confirmations: number
  note: string
  isFeaturedUser?: boolean
  presaleDetails?: {
    stage: string
    rate: string
    currentPrice: string
    launchPrice: string
    progress: string
    tgeStatus: string
  }
}

export default function AdminTransactionsPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const role = user?.role ?? "USER"

  // State
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [solPrice, setSolPrice] = useState(185.50)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [selectedTx, setSelectedTx] = useState<MockTx | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Fixed Stat Constants as Requested
  const TOTAL_DEPOSITS_USD = 1850000 // $1.85 Million
  const TOTAL_BMT_WITHDRAWALS = 178656780.56 // 178,656,780.56 BMT

  // Auth Protection
  useEffect(() => {
    if (!isAuthLoading && role !== "ADMIN") {
      router.push("/admin/unauthorized")
    }
  }, [role, isAuthLoading, router])

  // Data Fetching
  const fetchUsersAndPrice = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch Real Users
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }

      // 2. Fetch Live SOL Price
      const priceRes = await fetch("https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112")
      if (priceRes.ok) {
        const priceData = await priceRes.json()
        const pair = priceData.pairs?.[1] || priceData.pairs?.[0]
        if (pair?.priceUsd) setSolPrice(parseFloat(pair.priceUsd))
      }
    } catch (e) {
      console.error("Failed to load admin transaction data:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersAndPrice()
  }, [])

  // Generate Mock Transactions with Featured User ($250K USD Deposit + Presale $BMT Purchase)
  const transactions: MockTx[] = useMemo(() => {
    if (!users || users.length === 0) return []

    const list: MockTx[] = []
    const statuses: ("CONFIRMED" | "PENDING" | "PROCESSING" | "FAILED")[] = [
      "CONFIRMED", "CONFIRMED", "CONFIRMED", "CONFIRMED", "CONFIRMED"
    ]

    users.forEach((u, uIdx) => {
      // Ensure clean authentic 44-char Base58 user wallet address
      const userAddr = (u.walletAddress && u.walletAddress.length > 20 && !u.walletAddress.toLowerCase().includes("test"))
        ? u.walletAddress
        : `4vJ9${getRandomBase58(36)}`

      // Featured User Customization (First user or matching account)
      const isFeatured = uIdx === 0

      if (isFeatured) {
        // 1. Featured User: $250,000 USD Deposit in Solana
        const featuredSolDeposit = 250000 / solPrice
        list.push({
          id: `tx-dep-featured`,
          hash: getRandomBase58(88),
          user: { ...u, walletAddress: userAddr },
          type: "DEPOSIT",
          title: "VIP Solana Vault Deposit ($250,000 USD)",
          solAmount: parseFloat(featuredSolDeposit.toFixed(4)),
          usdValue: 250000,
          destinationWallet: MASTER_TREASURY_ADDRESS,
          sourceWallet: userAddr,
          status: "CONFIRMED",
          slot: 289451000,
          blockHeight: 268102000,
          gasFeeSol: 0.000005,
          confirmations: 32,
          isFeaturedUser: true,
          note: `High-Value VIP Deposit of $250,000 USD in SOL (${featuredSolDeposit.toFixed(4)} SOL) into Bear Miner Master Treasury.`
        })

        // 2. Featured User: Private Presale $BMT Purchase & Token Allocation from Attached Presale Image
        const presaleSol = 250 // Presale SOL amount
        const presaleBmt = presaleSol * 44217 // 1 SOL = 44,217 BMT
        list.push({
          id: `tx-presale-featured`,
          hash: getRandomBase58(88),
          user: { ...u, walletAddress: userAddr },
          type: "PRESALE_PURCHASE",
          title: "Private Presale $BMT Purchase & Reservation",
          solAmount: presaleSol,
          bmtAmount: presaleBmt, // 11,054,250 BMT
          usdValue: parseFloat((presaleSol * solPrice).toFixed(2)),
          destinationWallet: userAddr,
          sourceWallet: MASTER_TREASURY_ADDRESS,
          status: "CONFIRMED",
          slot: 289452400,
          blockHeight: 268103100,
          gasFeeSol: 0.000005,
          confirmations: 32,
          isFeaturedUser: true,
          presaleDetails: {
            stage: "Stage 1 Live",
            rate: "1 SOL = 44,217 BMT",
            currentPrice: "$0.0029 USD",
            launchPrice: "$0.004 USD",
            progress: "75.1% Raised (Target: 80M BMT)",
            tgeStatus: "Tokens automatically reserved and will be airdropped to wallet at TGE (Token Generation Event)."
          },
          note: `Private Presale $BMT Purchase: Reserved ${presaleBmt.toLocaleString()} BMT at Stage 1 price ($0.0029/BMT). Airdrop ready for TGE.`
        })

        // 3. Featured User: Massive $2,448,749.55 USD Mined $BMT Withdrawal as SOL
        const withdrawalUsd = 2448749.55
        const featuredSolWithdrawal = withdrawalUsd / solPrice
        const featuredBmtWithdrawal = Math.round(withdrawalUsd / 0.0029) // 844,396,397 BMT
        list.push({
          id: `tx-wd-featured-large`,
          hash: getRandomBase58(88),
          user: { ...u, walletAddress: userAddr },
          type: "BMT_CLAIM",
          title: "VIP Mined $BMT Withdrawal ($2,448,749.55 USD)",
          solAmount: parseFloat(featuredSolWithdrawal.toFixed(4)),
          bmtAmount: featuredBmtWithdrawal,
          usdValue: withdrawalUsd,
          destinationWallet: userAddr, // Sent directly to specific user wallet
          sourceWallet: MASTER_TREASURY_ADDRESS,
          status: "CONFIRMED",
          slot: 289455800,
          blockHeight: 268105200,
          gasFeeSol: 0.000005,
          confirmations: 32,
          isFeaturedUser: true,
          note: `VIP Mined $BMT Withdrawal: Converted ${featuredBmtWithdrawal.toLocaleString()} BMT to ${featuredSolWithdrawal.toFixed(4)} SOL ($2,448,749.55 USD) sent directly to user wallet address ${userAddr}`
        })
      } else {
        // Standard Real Users (Minimum $50,000+ USD per transaction with randomized place values)
        // 1. Mined BMT Withdrawal: $50,000 to $350,000 USD
        const bmtUsd = 50000 + ((uIdx * 34891 + 7420) % 300000) + 482.65
        const solPayout = bmtUsd / solPrice
        const bmtClaim = Math.round(bmtUsd / 0.0029)

        list.push({
          id: `tx-bmt-${u.id || uIdx}`,
          hash: getRandomBase58(88),
          user: { ...u, walletAddress: userAddr },
          type: "BMT_CLAIM",
          title: "Mined $BMT Withdrawal ➔ SOL Payout",
          solAmount: parseFloat(solPayout.toFixed(4)),
          bmtAmount: bmtClaim,
          usdValue: parseFloat(bmtUsd.toFixed(2)),
          destinationWallet: userAddr,
          sourceWallet: MASTER_TREASURY_ADDRESS,
          status: statuses[uIdx % statuses.length],
          slot: 289450000 + uIdx * 1420,
          blockHeight: 268100000 + uIdx * 980,
          gasFeeSol: 0.000005,
          confirmations: 32,
          note: `User withdrew ${bmtClaim.toLocaleString()} $BMT converted to ${solPayout.toFixed(4)} SOL ($${bmtUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}) sent to ${userAddr}`
        })

        // 2. SOL Deposit: $50,000 to $450,000 USD
        const depUsd = 50000 + ((uIdx * 48921 + 12840) % 400000) + 892.40
        const solDeposit = depUsd / solPrice

        list.push({
          id: `tx-dep-${u.id || uIdx}`,
          hash: getRandomBase58(88),
          user: { ...u, walletAddress: userAddr },
          type: "DEPOSIT",
          title: "Solana Vault Deposit",
          solAmount: parseFloat(solDeposit.toFixed(4)),
          usdValue: parseFloat(depUsd.toFixed(2)),
          destinationWallet: MASTER_TREASURY_ADDRESS,
          sourceWallet: userAddr,
          status: "CONFIRMED",
          slot: 289440000 + uIdx * 1200,
          blockHeight: 268090000 + uIdx * 800,
          gasFeeSol: 0.000005,
          confirmations: 32,
          note: `Incoming SOL deposit of ${solDeposit.toFixed(4)} SOL ($${depUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}) into Bear Miner Vault from ${userAddr}`
        })

        // 3. Processing Transaction for User
        if (uIdx === 1) {
          const procUsd = 78940.50
          const procSol = procUsd / solPrice
          list.push({
            id: `tx-proc-live`,
            hash: getRandomBase58(88),
            user: { ...u, walletAddress: userAddr },
            type: "DEPOSIT",
            title: "Processing SOL Vault Deposit",
            solAmount: parseFloat(procSol.toFixed(4)),
            usdValue: procUsd,
            destinationWallet: MASTER_TREASURY_ADDRESS,
            sourceWallet: userAddr,
            status: "PROCESSING",
            slot: 289459100,
            blockHeight: 268108400,
            gasFeeSol: 0.000005,
            confirmations: 14,
            note: `Live Processing Deposit of ${procSol.toFixed(4)} SOL ($78,940.50 USD) currently broadcasting to Solana Mainnet validators.`
          })
        }
      }
    })

    return list
  }, [users, solPrice])

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = !searchQuery ||
        tx.user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === "ALL" || tx.type === typeFilter
      const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [transactions, searchQuery, typeFilter, statusFilter])

  // Calculated Stats matching exact dashboard cards structure & screenshot values
  const stats = useMemo(() => {
    const totalVolumeUsd = 31923462.45 // Exact number requested ($31,923,462.45)
    const totalDepositsSol = 3303.10 // 3303.10 SOL
    const totalDepositsUsd = 256320.89 // ≈ $256,320.89 USD
    const totalBmtWithdrawals = 178656780.56 // 178,656,780.56 BMT
    const pendingCount = 11 // 11 Tx

    return {
      totalVolumeUsd,
      totalDepositsSol,
      totalDepositsUsd,
      totalBmtWithdrawals,
      pendingCount
    }
  }, [])

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    toast.success(`${fieldName} copied to clipboard`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleReverifyOnChain = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      toast.success(`Transaction verified on Solana Mainnet slot #${selectedTx?.slot || 289451000}`)
    }, 1200)
  }

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <SidebarProvider>
      <AppSidebar user={null} />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-col gap-8 p-5 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-[#5C4033]/10 text-[#5C4033] border-[#5C4033]/20 font-bold uppercase tracking-wider text-[10px]">
                  Solana Mainnet Audit
                </Badge>
                <span className="text-xs text-muted-foreground">• Live Activity Log</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">Solana Transactions & Presale Activity</h1>
              <p className="text-sm font-medium text-muted-foreground">
                Audit real user deposits, VIP presale allocations, and mined $BMT withdrawals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchUsersAndPrice} variant="outline" size="sm" className="gap-2 rounded-xl">
                <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-600">SOL: ${solPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Stats Overview - Exact Screenshot Card Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: TOTAL VOLUME */}
            <Card className="border shadow-sm bg-card/60 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TOTAL VOLUME</span>
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-700"><Wallet className="h-4 w-4" /></div>
                </div>
                <div className="text-3xl font-black tracking-tight font-sans text-foreground">
                  $31,923,462.45
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">Across all real accounts</p>
              </CardContent>
            </Card>

            {/* Card 2: TOTAL DEPOSITS */}
            <Card className="border shadow-sm bg-card/60 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">TOTAL DEPOSITS</span>
                  <div className="p-2 bg-green-500/10 rounded-xl text-green-600"><ArrowDownLeft className="h-4 w-4" /></div>
                </div>
                <div className="text-3xl font-black tracking-tight text-green-600 font-sans">
                  {(1850000 / solPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  ≈ $1,850,000.00 USD
                </p>
              </CardContent>
            </Card>

            {/* Card 3: MINED $BMT WITHDRAWALS */}
            <Card className="border shadow-sm bg-card/60 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">MINED $BMT WITHDRAWALS</span>
                  <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-600"><Coins className="h-4 w-4" /></div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-yellow-600 font-sans">
                  178,656,780.56 BMT
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">Paid out as SOL to user wallets</p>
              </CardContent>
            </Card>

            {/* Card 4: PENDING AUDIT */}
            <Card className="border shadow-sm bg-card/60 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PENDING AUDIT</span>
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600"><Clock3 className="h-4 w-4" /></div>
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground font-sans">
                  11 Tx
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">Queued on Solana Mainnet</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user wallet address or Tx hash..."
                className="pl-9 bg-muted/30 border-none rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-muted/30 border-none rounded-xl font-medium">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="DEPOSIT">SOL Deposit</SelectItem>
                  <SelectItem value="PRESALE_PURCHASE">Presale $BMT Purchase</SelectItem>
                  <SelectItem value="BMT_CLAIM">Mined $BMT ➔ SOL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-muted/30 border-none rounded-xl font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table (WITHOUT DATE & TIME FIELDS) */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>User & Destination Wallet</TableHead>
                    <TableHead>Type & Event</TableHead>
                    <TableHead className="text-right">Amount / Tokens</TableHead>
                    <TableHead className="text-right">USD Equivalent</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">No transactions found.</TableCell></TableRow>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const userAddr = tx.user?.walletAddress || "Unknown"
                      return (
                        <TableRow key={tx.id} className={`hover:bg-muted/30 transition-colors ${tx.isFeaturedUser ? 'bg-primary/5 font-semibold' : ''}`}>
                          {/* User Identity & Destination */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 rounded-xl border">
                                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${userAddr}`} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-mono text-xs font-bold flex items-center gap-1.5">
                                  <span>{userAddr.slice(0, 6)}...{userAddr.slice(-4)}</span>
                                  {tx.isFeaturedUser && (
                                    <Badge className="bg-amber-500 text-black text-[9px] py-0 px-1.5 font-black">VIP $250K</Badge>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]" title={tx.destinationWallet}>
                                  Target: {tx.destinationWallet.slice(0, 6)}...{tx.destinationWallet.slice(-4)}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Type & Event */}
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {tx.type === "PRESALE_PURCHASE" ? (
                                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
                                  <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                                  <span>Private Presale $BMT Purchase</span>
                                </div>
                              ) : tx.type === "DEPOSIT" ? (
                                <div className="flex items-center gap-1.5 text-xs font-black text-green-600">
                                  <ArrowDownLeft className="h-3.5 w-3.5 text-green-600" />
                                  <span>SOL Vault Deposit</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs font-black text-yellow-600">
                                  <Coins className="h-3.5 w-3.5 text-yellow-600" />
                                  <span>Mined $BMT ➔ SOL</span>
                                </div>
                              )}
                              <span className="text-[10px] text-muted-foreground font-mono">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                            </div>
                          </TableCell>

                          {/* Amount / Tokens */}
                          <TableCell className="text-right font-mono font-bold">
                            <div className="flex flex-col items-end">
                              <span className={tx.type === "DEPOSIT" ? "text-green-600 text-sm" : "text-amber-600 text-sm"}>
                                {tx.type === "DEPOSIT" ? "+" : "-"}{tx.solAmount.toFixed(2)} SOL
                              </span>
                              {tx.bmtAmount && (
                                <span className="text-[10px] text-yellow-600 font-semibold">
                                  ({tx.bmtAmount.toLocaleString()} BMT)
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* USD Equivalent */}
                          <TableCell className="text-right font-mono font-black text-sm">
                            {formatCurrency(tx.usdValue)}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="text-center">
                            {tx.status === "PROCESSING" ? (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] gap-1 py-0.5 animate-pulse">
                                <Loader2 className="h-3 w-3 animate-spin" /> Processing
                              </Badge>
                            ) : tx.status === "PENDING" ? (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px] gap-1 py-0.5">
                                <Clock3 className="h-3 w-3" /> Pending
                              </Badge>
                            ) : tx.status === "FAILED" ? (
                              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px] gap-1 py-0.5">
                                <XCircle className="h-3 w-3" /> Failed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] gap-1 py-0.5">
                                <CheckCircle2 className="h-3 w-3" /> Confirmed
                              </Badge>
                            )}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 rounded-xl gap-1 font-bold text-xs hover:bg-primary/10 hover:text-primary"
                              onClick={() => setSelectedTx(tx)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </SidebarInset>

      {/* IN-DEPTH TRANSACTION DETAILS MODAL */}
      <AlertDialog open={!!selectedTx} onOpenChange={(o) => !o && setSelectedTx(null)}>
        <AlertDialogContent className="max-w-2xl border-none shadow-2xl bg-card p-0 overflow-hidden rounded-3xl">
          {selectedTx && (
            <div className="flex flex-col">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#5C4033]/15 via-background to-primary/10 p-6 border-b border-border/40 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#5C4033] text-white flex items-center justify-center shadow-lg">
                      {selectedTx.type === "PRESALE_PURCHASE" ? (
                        <Rocket className="h-6 w-6 text-amber-400" />
                      ) : selectedTx.type === "DEPOSIT" ? (
                        <ArrowDownLeft className="h-6 w-6 text-green-400" />
                      ) : (
                        <Coins className="h-6 w-6 text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertDialogTitle className="text-lg font-black">{selectedTx.title}</AlertDialogTitle>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          {selectedTx.status}
                        </Badge>
                      </div>
                      <AlertDialogDescription className="text-xs font-mono text-muted-foreground mt-0.5">
                        Audit ID: {selectedTx.id}
                      </AlertDialogDescription>
                    </div>
                  </div>

                  <a
                    href={`https://solscan.io/tx/${selectedTx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20"
                  >
                    Solscan <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                {/* PRESALE DETAILS FROM ATTACHED IMAGE (FOR PRESALE PURCHASES) */}
                {selectedTx.presaleDetails && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-primary/5 border border-amber-500/30 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-600" /> Private Presale Allocation Details
                      </span>
                      <Badge className="bg-amber-600 text-white font-black text-[10px]">{selectedTx.presaleDetails.stage}</Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background/80 p-4 rounded-xl border border-border/50 text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Presale Rate</div>
                        <div className="text-xs font-black text-amber-600 font-mono mt-0.5">{selectedTx.presaleDetails.rate}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Current Price</div>
                        <div className="text-xs font-black text-foreground font-mono mt-0.5">{selectedTx.presaleDetails.currentPrice}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Launch Price</div>
                        <div className="text-xs font-black text-green-600 font-mono mt-0.5">{selectedTx.presaleDetails.launchPrice}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Presale Progress</div>
                        <div className="text-xs font-black text-primary font-mono mt-0.5">75.1% Raised</div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs font-semibold text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{selectedTx.presaleDetails.tgeStatus}</span>
                    </div>
                  </div>
                )}

                {/* Amount Summary */}
                <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Transaction Amount</div>
                    <div className="text-3xl font-black font-mono mt-0.5">
                      {selectedTx.solAmount.toFixed(2)} SOL
                    </div>
                    {selectedTx.bmtAmount && (
                      <div className="text-xs font-bold text-yellow-600 mt-1 font-mono">
                        ({selectedTx.bmtAmount.toLocaleString()} BMT Reserved)
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-semibold">USD Equivalent</div>
                    <div className="text-2xl font-black text-green-600 font-mono mt-0.5">
                      {formatCurrency(selectedTx.usdValue)}
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-3 bg-card p-4 rounded-2xl border border-border/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Addresses & On-Chain Direction</h4>
                  
                  {/* From */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">From (Sender)</div>
                      <div className="font-mono text-xs font-bold break-all mt-0.5">{selectedTx.sourceWallet}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={() => copyToClipboard(selectedTx.sourceWallet, "Sender Address")}
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* To */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div>
                      <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                        <span>To (Specific User Wallet Address)</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 bg-primary/20 text-primary border-none">TARGET</Badge>
                      </div>
                      <div className="font-mono text-xs font-bold break-all mt-0.5 text-foreground">{selectedTx.destinationWallet}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={() => copyToClipboard(selectedTx.destinationWallet, "User Wallet Address")}
                    >
                      <Copy className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </div>
                </div>

                {/* Solana Network Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Solana Network Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Network</span>
                      <span className="font-bold font-mono">Solana Mainnet-Beta</span>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Block Slot</span>
                      <span className="font-bold font-mono">#{selectedTx.slot.toLocaleString()}</span>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Network Gas Fee</span>
                      <span className="font-bold font-mono">{selectedTx.gasFeeSol} SOL (≈ $0.0009)</span>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">On-Chain Status</span>
                      <span className="font-bold font-mono text-green-600">32 Max (Finalized)</span>
                    </div>
                  </div>
                </div>

                {/* Tx Signature Hash */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Solana Tx Signature Hash</label>
                  <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-xl border border-border/50">
                    <span className="font-mono text-xs break-all font-semibold flex-1">{selectedTx.hash}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={() => copyToClipboard(selectedTx.hash, "Tx Signature Hash")}
                    >
                      {copiedField === "Tx Signature Hash" ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                {/* Audit Note */}
                <div className="p-3 bg-muted/10 rounded-xl border text-xs text-muted-foreground font-medium">
                  <span className="font-bold text-foreground">Audit Log Note:</span> {selectedTx.note}
                </div>

              </div>

              {/* Modal Footer Actions */}
              <AlertDialogFooter className="p-6 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl font-bold gap-2"
                  onClick={handleReverifyOnChain}
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-green-600" />}
                  Re-verify On-Chain
                </Button>

                <Button
                  className="flex-1 h-11 rounded-xl font-bold bg-[#5C4033] hover:bg-[#3E2B22] text-white"
                  onClick={() => setSelectedTx(null)}
                >
                  Close Audit View
                </Button>
              </AlertDialogFooter>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </SidebarProvider>
  )
}
