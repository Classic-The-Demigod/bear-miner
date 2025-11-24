"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

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

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl  md:text-5xl font-serif text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Everything you need to know about Bear Miner and our ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-[0_0_5px_rgba(244,210,175,1)] hover:shadow-[0_0_5px_rgba(244,210,175,0.5)]shadow-primary transition-shadow duration-300"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left font-sans font-semibold text-lg text-primary bg-[#F4D2AF]  transition-colors duration-200 focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    activeIndex === index
                      ? "rotate-180 text-primary"
                      : "rotate-0 text-black"
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="p-5 pt-4 text-black leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16 space-y-4 flex flex-col items-center justify-center">


        <h1 className="text-xl text-accent">Audited and Approved By</h1>

        <div className="flex justify-center items-center gap-4">
          <Image
              src="/assets/solidproof.svg"
              alt="Bear Miner Logo"
              width={150}
              height={150}
          />
          <Image
              src="/assets/coinsult.svg"
              alt="Bear Miner Logo"
              width={150}
              height={150}
          />
          <Image
              src="/assets/certik.svg"
              alt="Bear Miner Logo"
              width={150}
              height={150}
          />


        </div>
          {/* <h1 className="text-xl text-accent">Verified Ratings</h1>

          <Image
              src="/assets/Avatar group.png"
              alt="Bear Miner Logo"
              width={100}
              height={100}
          />


        <div className="flex items-center gap-4">

          <h1 className="text-xl text-accent font-bold">4.87/5</h1>
          <Image
              src="/assets/stars.png"
              alt="Bear Miner Logo"
              width={80}
              height={80}
          />

        </div> */}


      </div>


    </section>
  );
};

export default FaqAccordion;
