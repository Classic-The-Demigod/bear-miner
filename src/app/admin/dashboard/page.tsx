"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Settings, UserCog, RefreshCcw, Shield, ShieldAlert, Wallet, Calendar, Search, Bell, BarChart3, Plus, Trash2, Copy, Check, Coins } from "lucide-react";
import { toast } from "sonner";
import { IconBrandTelegram } from "@tabler/icons-react";

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const WALLET_PRESETS = [
  { name: "Bitcoin", symbol: "BTC", network: "Bitcoin Network" },
  { name: "Ethereum", symbol: "ETH", network: "ERC-20" },
  { name: "Solana", symbol: "SOL", network: "Solana Mainnet" },
  { name: "Tether (TRC20)", symbol: "USDT", network: "TRC-20" },
  { name: "Tether (ERC20)", symbol: "USDT", network: "ERC-20" },
  { name: "Tether (Solana)", symbol: "USDT", network: "SPL" },
  { name: "BNB", symbol: "BNB", network: "BEP-20" }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { role, isLoading: isAuthLoading } = useWalletPortfolio();

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Wallet Management State
  const [paymentWallets, setPaymentWallets] = useState<any[]>([]);
  const [isWalletsLoading, setIsWalletsLoading] = useState(false);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({
    preset: "",
    name: "",
    symbol: "",
    network: "",
    address: ""
  });

  // Settings State
  const [adminWallet, setAdminWallet] = useState(""); // Legacy support
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Form State
  const [editForm, setEditForm] = useState({
    minStakeBalance: "0",
    balance: "0",
    role: "USER"
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && role !== "ADMIN") {
      // Optional: Redirect logic
    }
  }, [role, isAuthLoading, router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWallets = async () => {
    setIsWalletsLoading(true);
    try {
      const res = await fetch("/api/admin/wallets");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPaymentWallets(data);
      }
    } catch (error) {
      toast.error("Failed to load wallets");
    } finally {
      setIsWalletsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/wallets");
      const data = await res.json();
      if (data.solWallet) setAdminWallet(data.solWallet);
      if (data.telegramBotToken) setTelegramBotToken(data.telegramBotToken);
      if (data.telegramChatId) setTelegramChatId(data.telegramChatId);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchUsers();
    fetchWallets();
    fetchSettings();
  }, []);

  // Filter logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u =>
        u.walletAddress.toLowerCase().includes(lowerQ)
      ));
    }
  }, [searchQuery, users]);

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWallet: editingUser.walletAddress,
          data: {
            minStakeBalance: parseFloat(editForm.minStakeBalance),
            balance: parseFloat(editForm.balance),
            role: editForm.role
          }
        })
      });

      if (!response.ok) throw new Error("Update failed");

      setEditingUser(null);
      toast.success("User updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleUpdateSettings = async () => {
    setIsUpdatingSettings(true);
    try {
      await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solWallet: adminWallet,
          telegramBotToken: telegramBotToken,
          telegramChatId: telegramChatId
        })
      });
      toast.success("Global settings updated. Notifications active.");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet.name || !newWallet.address) {
      toast.error("Please fill in name and address");
      return;
    }

    try {
      const res = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWallet)
      });
      if (!res.ok) throw new Error("Failed to add");

      await fetchWallets();
      setIsAddingWallet(false);
      setNewWallet({ preset: "", name: "", symbol: "", network: "", address: "" });
      toast.success("Wallet added successfully");
    } catch (err) {
      toast.error("Failed to add wallet");
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/wallets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchWallets();
      toast.success("Wallet deleted");
    } catch (err) {
      toast.error("Could not delete wallet");
    }
  };

  const handlePresetChange = (presetName: string) => {
    const preset = WALLET_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setNewWallet({
        preset: presetName,
        name: preset.name,
        symbol: preset.symbol,
        network: preset.network,
        address: "" // Reset address when changing preset
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({
      minStakeBalance: user.minStakeBalance?.toString() || "0",
      balance: user.balance?.toString() || "0",
      role: user.role || "USER"
    });
  };

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  // Calculate stats
  const totalUsers = users.length;
  const totalRealValue = users.reduce((acc, u) => acc + (u.walletBalance || 0), 0);
  const totalSimulatedValue = users.reduce((acc, u) => acc + (u.balance || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6 md:p-8 space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-black font-serif tracking-tight lg:text-5xl bg-gradient-to-r from-primary via-primary/80 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            Admin Console
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage ecosystem, users, and treasury.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchUsers} variant="outline" className="shadow-sm hover:shadow-md transition-all border-primary/20 bg-background/50 backdrop-blur-sm">
            <RefreshCcw className="h-4 w-4 mr-2 text-primary" /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Stats & Users (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered Accounts</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm relative overflow-hidden group hover:border-green-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Real AUM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-500">{formatCurrency(totalRealValue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Deposits (Live)</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Simulated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-500">{formatCurrency(totalSimulatedValue)}</div>
                <p className="text-xs text-muted-foreground mt-1">User Rewards (Display)</p>
              </CardContent>
            </Card>
          </div>

          {/* User Directory Table */}
          <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md ring-1 ring-border/50">
            <div className="p-6 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                User Directory
              </h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wallet address..."
                  className="pl-9 bg-background/50 border-white/10 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="w-[250px] pl-6">Identity</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Real Balance</TableHead>
                    <TableHead className="text-right">Rewards (Sim)</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-muted/40 transition-colors border-white/5">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-background shadow-sm bg-muted">
                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {user.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === 'ADMIN' ? (
                          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-purple-500/50">ADMIN</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted/50">USER</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-500 font-medium">
                        {formatCurrency(user.walletBalance || 0)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-500 font-medium">
                        {formatCurrency(user.balance || 0)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(user)}
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Settings & Wallets (4 cols) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Wallet Management */}
          <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" /> Payment Wallets
              </CardTitle>
              <Button size="sm" onClick={() => setIsAddingWallet(true)} className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all">
                <Plus className="h-3 w-3" /> Add New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                {isWalletsLoading ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">Loading wallets...</div>
                ) : paymentWallets.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">No payment wallets added.</div>
                ) : (
                  <div className="space-y-1 p-2">
                    {paymentWallets.map((wallet) => (
                      <div key={wallet.id} className="group p-3 rounded-lg bg-background/40 border border-white/5 hover:border-primary/20 hover:bg-background/60 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20">{wallet.symbol}</Badge>
                            <span className="text-sm font-semibold">{wallet.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => handleDeleteWallet(wallet.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="relative">
                          <div className="text-[10px] font-mono text-muted-foreground break-all bg-muted/30 p-1.5 rounded border border-white/5">
                            {wallet.address}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-full w-8 rounded-l-none hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => copyToClipboard(wallet.address, wallet.id)}
                          >
                            {copiedId === wallet.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 mt-1 pl-1">
                          Network: {wallet.network}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Global Settings */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-card/40 to-muted/20 backdrop-blur-md ring-1 ring-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" /> Platform Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Telegram Section */}
              <div className="space-y-4 p-4 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20">
                <div className="flex items-center gap-2 text-[#0088cc]">
                  <IconBrandTelegram className="h-5 w-5" />
                  <h3 className="text-sm font-bold">Telegram Integration</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Bot Token</label>
                    <Input
                      type="password"
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      placeholder="123456:ABC..."
                      className="bg-background/80 border-[#0088cc]/20 focus:border-[#0088cc]/50 font-mono text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Chat ID</label>
                    <Input
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="-100..."
                      className="bg-background/80 border-[#0088cc]/20 focus:border-[#0088cc]/50 font-mono text-xs h-9"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateSettings}
                disabled={isUpdatingSettings}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all"
              >
                {isUpdatingSettings ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                Save Global Settings
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Helper Sheets */}

      {/* Wallet Add Sheet */}
      <Sheet open={isAddingWallet} onOpenChange={setIsAddingWallet}>
        <SheetContent className="p-[15px] sm:max-w-md w-full">
          <SheetHeader className="mt-4">
            <SheetTitle>Add Payment Wallet</SheetTitle>
            <SheetDescription>Select a cryptocurrency and enter the receiving address.</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Cryptocurrency</label>
              <Select
                onValueChange={handlePresetChange}
                value={newWallet.preset}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose a coin..." />
                </SelectTrigger>
                <SelectContent>
                  {WALLET_PRESETS.filter(p => !paymentWallets.some(w => w.name === p.name)).map(p => (
                    <SelectItem key={p.name} value={p.name} disabled={p.name === "Custom"}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-12 justify-center">{p.symbol}</Badge>
                        <span>{p.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {WALLET_PRESETS.filter(p => !paymentWallets.some(w => w.name === p.name)).length === 0 && (
                    <div className="p-2 text-xs text-center text-muted-foreground">All available wallets added.</div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Only one wallet per cryptocurrency type is allowed.
              </p>
            </div>

            {newWallet.preset && (
              <div className="space-y-4 p-4 rounded-lg bg-muted/40 border animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Symbol</span>
                    <div className="font-mono text-sm">{newWallet.symbol}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Network</span>
                    <div className="font-mono text-sm">{newWallet.network}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-muted-foreground">Wallet Address</label>
                  <Input
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                    placeholder={`Enter ${newWallet.name} address...`}
                    className="font-mono text-sm h-10"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleAddWallet}
              className="w-full h-11 text-base mt-2"
              disabled={!newWallet.preset || !newWallet.address}
            >
              Add {newWallet.symbol || "Wallet"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet from Right */}
      <Sheet open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
        <SheetContent className="p-[15px] sm:max-w-md w-full">
          <SheetHeader className="mb-6 mt-4">
            <SheetTitle className="text-2xl">Edit User Profile</SheetTitle>
            <SheetDescription>
              Update permissions, thresholds, and simulated balances for this user.
            </SheetDescription>
          </SheetHeader>

          {editingUser && (
            <div className="space-y-6 p-1">
              {/* Identity Section */}
              <div className="space-y-2 p-4 bg-muted/40 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${editingUser.walletAddress}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">User Identity</p>
                    <p className="text-xs text-muted-foreground font-mono">{editingUser.walletAddress}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">{formatDate(editingUser.createdAt)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground">Real Balance</span>
                    <span className="font-medium text-green-600">{formatCurrency(editingUser.walletBalance || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Role Editing */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-purple-600" />
                  Role Permission
                </label>
                <Select
                  value={editForm.role}
                  onValueChange={(val) => setEditForm(prev => ({ ...prev, role: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User (Standard)</SelectItem>
                    <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Admins can access this dashboard and modify global settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Threshold Editing */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-orange-600" />
                    Withdrawal Threshold ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      className="pl-7"
                      value={editForm.minStakeBalance}
                      onChange={(e) => setEditForm(prev => ({ ...prev, minStakeBalance: e.target.value }))}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Minimum balance required for this user to attempt a withdrawal.
                  </p>
                </div>

                {/* Sim Balance Editing */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-blue-600" />
                    Simulated Rewards Balance ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      className="pl-7"
                      value={editForm.balance}
                      onChange={(e) => setEditForm(prev => ({ ...prev, balance: e.target.value }))}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This is the "Rewards" value shown to the user on their dashboard.
                  </p>
                </div>
              </div>

              <SheetFooter className="mt-8">
                <Button onClick={handleUpdateUser} className="w-full h-11 text-base bg-primary hover:bg-primary/90 shadow-lg transition-all">
                  Save Changes
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
