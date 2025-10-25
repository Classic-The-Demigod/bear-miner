"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Search } from "lucide-react";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
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
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h"
      );
      const data: Crypto[] = await response.json();
      setCryptos(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  // Don't render time-sensitive content until mounted on client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary/70 to-primary/80 rounded-t-4xl">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary/70 to-primary/80 rounded-t-4xl">
      {/* Header */}
      <div className="bg-primary/50 backdrop-blur-sm sticky top-0 z-10 rounded-t-4xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-extrabold text-accent font-sans">
              Cryptocurrency Prices
            </h1>
            <button
              onClick={fetchCryptoData}
              disabled={loading}
              className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000] flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 rounded-top" />
            <input
              type="text"
              placeholder="Search cryptocurrency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent border-2 border-accent rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {lastUpdate && (
            <p className="text-white text-sm mt-2">
              Last updated: {lastUpdate}
            </p>
          )}
        </div>
      </div>

      {/* Crypto List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && cryptos.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          <div className="bg-primary/30 backdrop-blur-sm rounded-xl border border-primary/70 overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-primary/30 border-b border-primary/70 text-accent text-sm font-semibold">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">24h Change</div>
              <div className="col-span-2 text-right">Market Cap</div>
              <div className="col-span-2 text-right">Volume (24h)</div>
            </div>

            {/* Crypto Rows */}
            {filteredCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-primary/50 hover:bg-primary/20 transition-colors"
              >
                {/* Rank */}
                <div className="hidden md:flex col-span-1 items-center text-accent font-medium">
                  {crypto.market_cap_rank}
                </div>

                {/* Name & Logo */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <span className="md:hidden text-slate-300 text-sm font-medium mr-2">
                    #{crypto.market_cap_rank}
                  </span>
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">
                      {crypto.name}
                    </span>
                    <span className="text-slate-300 text-sm uppercase">
                      {crypto.symbol}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                  <span className="md:hidden text-slate-300 text-sm mr-2">
                    Price:
                  </span>
                  <span className="text-white font-semibold">
                    {formatPrice(crypto.current_price)}
                  </span>
                </div>

                {/* 24h Change */}
                <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                  <span className="md:hidden text-slate-300 text-sm mr-2">
                    24h:
                  </span>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      crypto.price_change_percentage_24h >= 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Market Cap */}
                <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                  <span className="md:hidden text-slate-300 text-sm mr-2">
                    Market Cap:
                  </span>
                  <span className="text-white">
                    {formatMarketCap(crypto.market_cap)}
                  </span>
                </div>

                {/* Volume */}
                <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                  <span className="md:hidden text-slate-300 text-sm mr-2">
                    Volume:
                  </span>
                  <span className="text-white">
                    {formatMarketCap(crypto.total_volume)}
                  </span>
                </div>
              </div>
            ))}

            {filteredCryptos.length === 0 && (
              <div className="text-center py-12 text-slate-300">
                No cryptocurrencies found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
