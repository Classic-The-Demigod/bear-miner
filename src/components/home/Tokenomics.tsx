import React from "react";
import {
  PieChart,
  TrendingUp,
  Droplets,
  Megaphone,
  Users,
  Package,
} from "lucide-react";

const Tokenomics = () => {
  const allocations = [
    {
      icon: TrendingUp,
      category: "Staking Rewards",
      percentage: "50%",
      description: "Distributed daily via smart contract",
      color: "bg-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Droplets,
      category: "Liquidity Pool",
      percentage: "20%",
      description: "Supports trading and price stability",
      color: "bg-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Megaphone,
      category: "Marketing & Partnerships",
      percentage: "15%",
      description: "Growth and brand expansion",
      color: "bg-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      icon: Users,
      category: "Team & Development",
      percentage: "10%",
      description: "Core contributors and maintenance",
      color: "bg-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      icon: Package,
      category: "Reserve & Future Utilities",
      percentage: "5%",
      description: "For upcoming features and ecosystem tools",
      color: "bg-pink-500",
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F8EBDD] px-6 py-3 rounded-full border-2 border-black mb-6">
            <PieChart size={24} className="text-primary" />
            <span className="font-serif font-bold text-[#0E0000]">
              Tokenomics
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Token Distribution
          </h2>
          <p className="text-lg text-[#0E0000]/70 max-w-2xl mx-auto">
            Fair and transparent allocation designed for long-term
            sustainability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allocations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${
                  item.bgColor
                } rounded-3xl p-6 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_10px_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group ${
                  index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${item.color} w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-serif font-bold text-[#0E0000]">
                      {item.percentage}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#0E0000] mb-2">
                  {item.category}
                </h3>

                <p className="text-[#0E0000]/70 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Key Highlights */}
        <div className="mt-16 bg-[#F8EBDD] rounded-3xl p-8 md:p-12 border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)]">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#0E0000] mb-8 text-center">
            Key Highlights
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-black">
              <div className="text-4xl font-serif font-bold text-primary mb-2">
                5%
              </div>
              <div className="text-sm text-[#0E0000]/70">Daily Reward Rate</div>
              <p className="text-xs text-[#0E0000]/60 mt-2">
                Consistent returns on staked assets
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-black">
              <div className="text-4xl font-serif font-bold text-primary mb-2">
                7%
              </div>
              <div className="text-sm text-[#0E0000]/70">Referral Bonus</div>
              <p className="text-xs text-[#0E0000]/60 mt-2">
                On deposits and compounded rewards
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-black">
              <div className="text-4xl font-serif font-bold text-primary mb-2">
                12h
              </div>
              <div className="text-sm text-[#0E0000]/70">Compound Interval</div>
              <p className="text-xs text-[#0E0000]/60 mt-2">
                Fair and sustainable growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
