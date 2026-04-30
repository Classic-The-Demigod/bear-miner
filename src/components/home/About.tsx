import { TrendingUp, Shield, Lock, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Daily 1% Return",
      description:
        "Earn a consistent 1% daily return on your staked SOL. Rewards are automatically distributed by smart contracts — compound or withdraw anytime.",
      color: "bg-green-100",
    },
    {
      icon: Shield,
      title: "Sustainability & Anti-Whale Protection",
      description:
        "Fairness is at our core. Daily compounding limits, penalty systems, and vacation modes ensure a balanced and long-term ecosystem.",
      color: "bg-blue-100",
    },
    {
      icon: Lock,
      title: "Security & Transparency",
      description:
        "Built on Solana's high-speed, low-cost network and powered by Chainlink VRF for verifiable randomness — ensuring full transparency.",
      color: "bg-purple-100",
    },
    {
      icon: Users,
      title: "Referral Rewards",
      description:
        "Earn more by growing the community! Get 5% from referral deposits and 5% from compounded rewards of your referrals.",
      color: "bg-orange-100",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Why Choose Bear Miner?
          </h2>
          <p className="text-base md:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Built on Solana blockchain with innovative mechanisms for
            sustainable growth and investor protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#F8EBDD] rounded-3xl p-8 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_10px_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl border-2 border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={32} className="text-[#0E0000]" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#0E0000] mb-4">
                  {feature.title}
                </h3>

                <p className="text-sm md:text-base text-black/70 leading-7 font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
