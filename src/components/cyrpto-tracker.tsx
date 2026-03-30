"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Search, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
}

export default function CryptoPriceTracker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const fetchCryptoData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h"
      );
      const data: Crypto[] = await response.json();
      setCryptos(data);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // 1 min update
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  if (!mounted) return <Skeleton className="w-full h-[400px] rounded-xl" />;

  return (
    <Card className="border-none shadow-xl bg-[#d3c4bc] overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 pt-6 px-6 border-b border-black/5 bg-black/5">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 font-serif text-[#2D1B0D] tracking-wide">
            <Activity className="w-6 h-6 text-[#2D1B0D] animate-pulse" />
            Live Market Data
          </CardTitle>
          <CardDescription className="text-xs font-mono opacity-80 text-[#2D1B0D]/60 uppercase tracking-widest pl-9">
            Global Avg. • Updated: {lastUpdate}
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-black/40" />
            <Input
              placeholder="Search coin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white/50 border-black/10 focus:border-black/30 text-[#2D1B0D] placeholder:text-black/30 rounded-lg transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCryptoData}
            disabled={loading}
            className="h-10 w-10 shrink-0 bg-white/50 border-black/10 text-[#2D1B0D] hover:bg-[#2D1B0D] hover:text-white transition-all duration-300 rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[500px] overflow-y-auto custom-scrollbar">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-4 text-xs font-bold text-[#2D1B0D]/70 uppercase tracking-widest bg-black/5 sticky top-0 backdrop-blur-md z-10 border-b border-black/5">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Asset</div>
            <div className="col-span-3 text-right">Price</div>
            <div className="col-span-2 text-right">24h</div>
            <div className="col-span-3 text-right">Mkt Cap</div>
          </div>

          {/* List */}
          <div className="divide-y divide-black/5">
            {loading && cryptos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 space-y-4">
                <RefreshCw className="h-10 w-10 text-black/20 animate-spin" />
                <p className="text-sm font-serif text-black/40 tracking-wider">
                  Loading premium markets...
                </p>
              </div>
            ) : filteredCryptos.length > 0 ? (
              filteredCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex flex-col md:grid md:grid-cols-12 px-6 py-4 items-center hover:bg-black/5 transition-colors group cursor-default gap-3 md:gap-0"
                >
                  {/* Mobile Row: Rank + Name + 24h Badges */}
                  <div className="flex items-center justify-between w-full md:contents">
                    {/* Left: Rank & Info */}
                    <div className="flex items-center gap-3 col-span-4">
                      {/* Rank - Mobile */}
                      <span className="md:hidden text-xs font-mono text-black/40">
                        #{crypto.market_cap_rank}
                      </span>
                      {/* Rank - Desktop */}
                      <div className="hidden md:block col-span-1 text-xs font-mono text-black/40 group-hover:text-black/70 transition-colors">
                        {crypto.market_cap_rank}
                      </div>

                      <div className="relative">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-9 h-9 rounded-full shadow-sm ring-1 ring-black/10 group-hover:scale-110 transition-all duration-300"
                        />
                        {/* Rank Badge for Top 3 */}
                        {crypto.market_cap_rank <= 3 && (
                          <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2D1B0D] text-[9px] font-bold text-[#F4D2AF] shadow-sm">
                            ♛
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-[#2D1B0D] text-sm">
                          {crypto.name}
                        </span>
                        <span className="text-[10px] text-black/50 font-mono uppercase">
                          {crypto.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Right on Mobile: Price & Auto-layout */}
                    <div className="md:hidden flex flex-col items-end gap-1">
                      <span className="font-mono font-medium text-sm text-[#2D1B0D]">
                        {formatPrice(crypto.current_price)}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`font-mono text-[10px] px-1.5 py-0 border backdrop-blur-md h-5 ${
                          (crypto.price_change_percentage_24h ?? 0) >= 0
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {(crypto.price_change_percentage_24h ?? 0) >= 0
                          ? "+"
                          : ""}
                        {Math.abs(
                          crypto.price_change_percentage_24h ?? 0,
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </div>

                  {/* Desktop Only Columns */}
                  <div className="hidden md:block col-span-3 text-right font-mono font-medium text-sm text-[#2D1B0D]">
                    {formatPrice(crypto.current_price)}
                  </div>

                  <div className="hidden md:flex col-span-2 justify-end">
                    <Badge
                      variant="secondary"
                      className={`font-mono text-xs px-2.5 py-0.5 border backdrop-blur-md ${
                        (crypto.price_change_percentage_24h ?? 0) >= 0
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {(crypto.price_change_percentage_24h ?? 0) >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(crypto.price_change_percentage_24h ?? 0).toFixed(2)}%
                    </Badge>
                  </div>

                  <div className="hidden md:block col-span-3 text-right">
                    <span className="text-xs text-black/60 font-mono tracking-tight">
                      ${formatLargeNumber(crypto.market_cap)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-black/40 font-serif italic">
                  No assets found.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

