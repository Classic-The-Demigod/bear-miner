import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full relative flex flex-col items-center">

      {/* Text Content - Centered in 100dvh Viewport */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-8 w-full px-4 md:px-12 lg:px-28 h-[100dvh]">
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-primary leading-[1.1] tracking-tight max-w-5xl drop-shadow-sm flex flex-col items-center">
          <span>Mine. Earn. Grow.</span>
          <span>The Bear Way! 🐻</span>
        </h1>

        <p className="text-[14px] md:text-lg text-black/70 font-normal leading-relaxed max-w-2xl mx-auto px-[30px] md:px-0">
          Bear Miner is a decentralized staking platform built on the Solana
          blockchain, offering a sustainable 2% daily return on your staked SOL.
          Transparent. Secure. Rewarding.
        </p>

        <div className="flex justify-center w-full pt-4">
          <Link
            href="/whitepaper"
            target="_blank"
            className="group bg-primary/10 text-primary font-serif hover:bg-primary hover:text-[#F4D2AF] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-xl border-2 border-[#0E0000]/10 hover:border-transparent flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            Read Whitepaper
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hero Image - Flows below, pushing content */}
      <div className="w-full relative z-0 -mt-[150px] pointer-events-none select-none min-[2000px]:hidden">
        {/* Decorative Blob */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[150%] bg-white/40 blur-[100px] rounded-full -z-10" />

        <Image
          src="/img/hero.svg"
          alt="Bear Miner Hero"
          width={1920}
          height={600}
          className="w-full h-auto object-cover object-bottom"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
