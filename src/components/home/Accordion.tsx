"use client";
import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import Image from "next/image";

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is Bear Miner?",
      a: "Bear Miner is a decentralized application (DApp) on the Solana blockchain that rewards users for staking or locking their native tokens, offering yield through a carefully balanced mining mechanism and treasury management.",
    },
    {
      q: "How secure are the smart contracts?",
      a: "Security is our highest priority. All core smart contracts undergo rigorous audits by multiple top-tier security firms before deployment. We also maintain a bug bounty program.",
    },
    {
      q: "What are the tokenomics?",
      a: "The token has a fixed supply with deflationary mechanics applied through burn mechanisms tied to certain DApp utilities. A portion of transaction fees is also allocated to the community treasury and staking rewards.",
    },
    {
      q: "When is the official mainnet launch?",
      a: "Our launch is scheduled for Q2 2025, following the completion of all security audits and extensive beta testing with our community. Check the Roadmap for specific milestones!",
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#FFF8F3]">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F4D2AF]/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CEA065]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A4A33]/5 border border-[#7A4A33]/10 text-[#7A4A33] text-sm font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#7A4A33] animate-pulse" />
            Support Center
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#2D1B0D] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#2D1B0D]/70 max-w-2xl mx-auto font-sans leading-relaxed">
            Everything you need to know about Bear Miner, our ecosystem, and how we secure your assets.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index
                ? "bg-white border-[#7A4A33]/20 shadow-xl shadow-[#7A4A33]/5"
                : "bg-white/60 border-[#2D1B0D]/5 hover:bg-white hover:border-[#7A4A33]/10"
                }`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className={`font-serif font-bold text-lg transition-colors duration-300 ${activeIndex === index ? "text-[#7A4A33]" : "text-[#2D1B0D]"
                  }`}>
                  {faq.q}
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-[#7A4A33] text-white rotate-180" : "bg-[#2D1B0D]/5 text-[#2D1B0D]/60 group-hover:bg-[#7A4A33]/10 group-hover:text-[#7A4A33]"
                  }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <div
                className={`grid transition-all duration-500 ease-in-out ${activeIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-[#2D1B0D]/70 leading-relaxed font-sans border-t border-[#7A4A33]/5 pt-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners / Audits */}
        <div className="mt-24 pt-10 border-t border-[#2D1B0D]/5">
          <div className="text-center space-y-8">
            <h3 className="text-sm font-bold text-[#2D1B0D]/40 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[#2D1B0D]/20" />
              Audited & Approved By
              <span className="w-8 h-[1px] bg-[#2D1B0D]/20" />
            </h3>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
              {[
                { src: "/img/solidproof.svg", alt: "SolidProof" },
                { src: "/img/coinsult.svg", alt: "Coinsult" },
                { src: "/img/certik.svg", alt: "CertiK" },
              ].map((partner) => (
                <div key={partner.alt} className="group relative grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#7A4A33]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={140}
                    height={40}
                    className="h-10 w-auto object-contain"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#7A4A33]/60 bg-[#7A4A33]/5 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              100% Secure & Verified Contracts
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqAccordion;
