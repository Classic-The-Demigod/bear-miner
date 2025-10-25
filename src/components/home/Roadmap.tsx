import React from "react";
import { Rocket, Zap, Trophy, CheckCircle2 } from "lucide-react";

const Roadmap = () => {
  const phases = [
    {
      icon: Rocket,
      quarter: "Q4 2025",
      title: "Launch Phase",
      color: "text-blue-500", // Change for text color
      bgColor: "bg-blue-100",
      items: [
        "Launch of Bear Miner on Solana Mainnet",
        "Smart contract audits by top security firms",
        "Beta testing and community feedback",
      ],
    },
    {
      icon: Zap,
      quarter: "Q3 2025",
      title: "Growth Phase",
      color: "text-purple-500", // Change for text color
      bgColor: "bg-purple-100",
      items: [
        "Integration with Chainlink VRF",
        "Launch of Referral Program",
        "Major marketing and partnerships",
      ],
    },
    {
      icon: Trophy,
      quarter: "Q4 2026",
      title: "Expansion Phase",
      color: "text-orange-500", // Change for text color
      bgColor: "bg-orange-100",
      items: [
        "Bear Miner Lotto & other utilities",
        "Enhanced DApp UI/UX",
        "Community-driven governance",
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20 px-4 bg-gradient-to-b from-white to-[#F8EBDD]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Roadmap
          </h2>
          <p className="text-lg text-[#0E0000]/70 max-w-2xl mx-auto">
            Building the future of decentralized staking, one milestone at a
            time
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 relative">
          {/* Main vertical line for desktop view */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-1 bg-gray-300 z-0 mx-auto max-w-6xl"></div>

          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div
                key={index}
                className="relative z-10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100"
              >
                {/* Connector Circle and Line for desktop view */}
                <div className="hidden lg:flex absolute -top-4 left-1/2 transform -translate-x-1/2 items-center">
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-white ${phase.color.replace(
                      "text-",
                      "bg-"
                    )} shadow-md`}
                  ></div>
                </div>

                {/* Content Card */}
                <div
                  className={`flex items-center space-x-4 mb-4 ${phase.bgColor} p-3 rounded-lg`}
                >
                  <Icon className={`w-6 h-6 ${phase.color}`} />
                  <div>
                    <p className="text-sm font-semibold uppercase text-gray-500">
                      {phase.quarter}
                    </p>
                    <h3 className="text-xl font-bold text-[#0E0000]">
                      {phase.title}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3 pt-2">
                  {phase.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start text-base text-[#0E0000]/80"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${phase.color}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
