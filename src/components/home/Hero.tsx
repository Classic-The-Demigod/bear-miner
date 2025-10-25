import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="overflow-x-hidden">
      <main className="flex flex-col items-center justify-center text-center md:px-28  gap-6 px-4 py-10">
        <h1 className="md:text-8xl text-4xl font-serif text-primary">
          Mine. Earn. Grow. The Bear Way!. 🐻
        </h1>

        <p className="md:text-2xl text-lg max-w-3xl text-black font-medium">
          Bear Miner is a decentralized staking platform built on the Solana
          blockchain, offering a sustainable 5% daily return on your staked SOL.
          Transparent. Secure. Rewarding.
        </p>

        <div className="md:flex-row flex-col flex  gap-4 mt-6">
          <Link
            href="/signup"
            className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000]"
          >
            Start Mining
          </Link>
          <Link
            href="https://drive.google.com/file/d/1LaH43Em8GADoJtgt0IXf1a9Y-fg13NSY/view?usp=drive_link"
            target="_blank"
            className="bg-primary/20 text-black font-serif hover:bg-primary/90 px-6 py-3 rounded-full hover:text-[#F4D2AF] font-medium hover:scale-105 transition-all shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000] flex gap-1 items-center justify-center"
          >
            Read Whitepaper
            <ArrowUpRight />
          </Link>
        </div>
      </main>
      <Image
        src="/assets/hero.svg"
        alt="Hero Image"
        width={800}
        height={600}
        className="w-full h-auto"
        contain="true"
      />
    </section>
  );
};

export default Hero;
