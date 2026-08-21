"use client";
import Image from "next/image";
import { Brain, TrendingUp, ShieldCheck, Cpu, BarChart3, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const AIMining = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Reinforcement Learning Engine",
      description:
        "Our AI is modelled on reinforcement learning — it trades as a problem solver, adapting to live conditions rather than making static predictions.",
      color: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      icon: BarChart3,
      title: "Real Market Data Feed",
      description:
        "Decisions are driven by real-time market data feeds and short-term price direction analysis across the Solana ecosystem.",
      color: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      icon: ShieldCheck,
      title: "Anti-Drawdown Protection",
      description:
        "Programmed against portfolio drawdown — our bot guarantees sustainable returns while protecting your capital at all times.",
      color: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      icon: Zap,
      title: "Automated Execution",
      description:
        "No manual management needed. The AI bot operates 24/7, executing optimized trades and distributing rewards automatically to your wallet.",
      color: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-[#F3FFEB]/50 to-[#F8EBDD]/40">
      {/* Ambient background blobs */}
      <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-[#14F195]/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-[350px] h-[350px] bg-[#CEA065]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7A4A33]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Badge + Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#14F195]/15 border-2 border-[#14F195]/30 rounded-full px-5 py-2 mb-6">
            <Cpu size={16} className="text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              AI-Powered Technology
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-5 leading-tight">
            AI Automated Mining
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-3xl mx-auto leading-relaxed">
            Bear Miner&apos;s structured AI trading bot powers your returns — analyzing
            real market data, executing precision trades, and distributing rewards
            directly to your wallet. No effort required.
          </p>
        </div>

        {/* Main content: Illustration + Feature highlight */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left: AI Brain Illustration */}
          <div className="relative flex items-center justify-center order-2 lg:order-1">
            {/* Glow behind illustration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] h-[70%] bg-[#14F195]/10 blur-[80px] rounded-full" />
            </div>

            {/* Container with subtle border */}
            <div className="relative bg-gradient-to-br from-[#F8EBDD]/60 via-white/80 to-[#F3FFEB]/60 rounded-[2rem] border-2 border-[#CEA065]/20 p-6 md:p-10 shadow-xl backdrop-blur-sm w-full max-w-[500px]">
              {/* Decorative corner dots */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#14F195]" />
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#CEA065]" />
              <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-[#CEA065]" />
              <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#14F195]" />

              <Image
                src="/img/ai-brain.svg"
                alt="Bear Miner AI Neural Network"
                width={500}
                height={420}
                className="w-full h-auto drop-shadow-lg"
                priority
              />

              {/* Live status indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-[#14F195]/30">
                <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                <span className="text-[11px] font-bold text-[#14F195] tracking-wide uppercase">
                  AI Bot Active — Trading Live
                </span>
              </div>
            </div>
          </div>

          {/* Right: Key headline + description */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0E0000] mb-4 leading-tight">
                Your Returns, Powered{" "}
                <span className="text-primary">by Intelligence</span>
              </h3>
              <p className="text-base text-black/60 leading-relaxed mb-6">
                Bear Miner eliminates the complexity of crypto mining. Our AI
                trading bot operates autonomously — analyzing real-time Solana
                market data, identifying short-term price opportunities, and
                executing optimized trades to generate your daily 1% returns.
              </p>
              <p className="text-base text-black/60 leading-relaxed">
                Unlike traditional mining that relies on hardware, Bear Miner uses
                a <strong className="text-[#0E0000]">reinforcement learning model</strong> that
                solves market problems in real-time. It&apos;s programmed against
                portfolio drawdown, ensuring your capital stays protected while
                consistently growing.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F8EBDD] rounded-2xl p-4 border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)] text-center">
                <div className="text-2xl md:text-3xl font-serif font-bold text-primary">24/7</div>
                <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider mt-1">
                  Active Trading
                </div>
              </div>
              <div className="bg-[#F8EBDD] rounded-2xl p-4 border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)] text-center">
                <div className="text-2xl md:text-3xl font-serif font-bold text-emerald-600">1%</div>
                <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider mt-1">
                  Daily Returns
                </div>
              </div>
              <div className="bg-[#F8EBDD] rounded-2xl p-4 border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)] text-center">
                <div className="text-2xl md:text-3xl font-serif font-bold text-amber-600">0%</div>
                <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider mt-1">
                  Manual Effort
                </div>
              </div>
            </div>

            <Link
              href="/whitepaper"
              target="_blank"
              className="group w-fit flex items-center gap-2 bg-primary text-[#F4D2AF] font-serif px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl border-2 border-primary hover:bg-primary/90"
            >
              Learn More in Whitepaper
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Capability cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="bg-[#F8EBDD] rounded-3xl p-7 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_10px_0_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group"
              >
                <div
                  className={`${cap.color} w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={28} className={cap.iconColor} />
                </div>

                <h4 className="text-lg font-serif font-bold text-[#0E0000] mb-3 leading-snug">
                  {cap.title}
                </h4>

                <p className="text-sm text-black/60 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-[#CEA065]/20 shadow-sm">
            <TrendingUp size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-[#0E0000]/70">
              Sustainable returns powered by real market data — not speculation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMining;
