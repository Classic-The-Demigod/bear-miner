import React from "react";
import { Wallet, DollarSign, Link2, Coins, ArrowDown } from "lucide-react";

const HowToPurchase = () => {
  const steps = [
    {
      icon: Wallet,
      number: "01",
      title: "Create a Solana Wallet",
      description:
        "Use wallets like Phantom or Solflare to get started with Solana.",
    },
    {
      icon: DollarSign,
      number: "02",
      title: "Fund with SOL",
      description:
        "Purchase SOL on exchanges (Binance, Coinbase, etc.) and transfer to your wallet.",
    },
    {
      icon: Link2,
      number: "03",
      title: "Connect to Bear Miner DApp",
      description: "Visit our official DApp and securely connect your wallet.",
    },
    {
      icon: Coins,
      number: "04",
      title: "Stake SOL → Earn Rewards",
      description: "Stake and start earning your 5% daily reward instantly.",
    },
    {
      icon: ArrowDown,
      number: "05",
      title: "Withdraw or Compound",
      description:
        "Manage your earnings directly from the dashboard — total flexibility.",
    },
  ];

  return (
    <section id="" className="py-20 px-4 bg-gradient-to-b from-[#F8EBDD] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            How to Get Started
          </h2>
          <p className="text-lg text-[#0E0000]/70 max-w-2xl mx-auto">
            Start earning with Bear Miner in just 5 simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-black/20 -ml-0.5"></div>

          <div className="space-y-8 lg:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div
                    className={`flex-1 ${
                      isEven ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    <div className="bg-white rounded-3xl p-8 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_10px_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 ${
                            isEven ? "lg:order-2" : "lg:order-1"
                          }`}
                        >
                          <div className="bg-primary w-16 h-16 rounded-2xl border-2 border-black flex items-center justify-center">
                            <Icon size={28} className="text-[#F4D2AF]" />
                          </div>
                        </div>
                        <div
                          className={`flex-1 ${
                            isEven ? "lg:order-1" : "lg:order-2"
                          }`}
                        >
                          <h3 className="text-2xl font-serif font-bold text-[#0E0000] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[#0E0000]/70">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Number Circle */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-[#F8EBDD] border-4 border-black shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center justify-center">
                      <span className="text-2xl font-serif font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for even layout */}
                  <div className="hidden lg:block flex-1"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/dashboard"
            className="inline-block bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-10 py-4 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_6px_0_rgba(0,0,0,1)] border-2 border-[#0E0000] text-lg"
          >
            Start Staking Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowToPurchase;
