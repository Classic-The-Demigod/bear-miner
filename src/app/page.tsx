// import Image from "next/image";
"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "./providers/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/home/layout/Nav";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import HowToPurchase from "../components/home/Purchase";
import Roadmap from "../components/home/Roadmap";
import Tokenomics from "../components/home/Tokenomics";
import FaqAccordion from "../components/home/Accordion";
import Footer from "../components/home/Footer";
import BMTPurchase from "../components/home/BMTPurchase";
import AIMining from "../components/home/AIMining";
import TokenDetails from "../components/home/TokenDetails";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  // Redirect to dashboard if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // router.push("/dashboard");
  //   }
  // }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="bg-[#F3FFEB]">
      {/* First Fold: Header + Hero (100dvh) */}
      <div className="relative w-full">
        {/* Navigation - Overlay */}
        <div className="absolute top-0 w-full md:px-28 pt-6 px-4 z-50">
          <Nav />
        </div>

        <Hero />
      </div>

      <About />

      {/* AI Automated Mining Section */}
      <AIMining />

      {/* <div className="md:px-28 py-8 px-4">
        <BMTPurchase />
      </div>
      <HowToPurchase /> */}
      <Roadmap />
      {/* Tokenomics Coming Soon */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#F8EBDD] to-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border-2 border-primary/20 rounded-full px-5 py-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Coming Soon
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Tokenomics
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-xl mx-auto leading-relaxed mb-10">
            Full $BMT token distribution, supply details, and allocation
            breakdown will be revealed soon. Stay tuned.
          </p>
          <div className="bg-[#F8EBDD] rounded-3xl p-10 border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] inline-block">
            <span className="text-6xl">🐻</span>
            <p className="text-sm font-bold text-black/50 mt-4 uppercase tracking-wider">
              Under Construction
            </p>
          </div>
        </div>
      </section>
      <FaqAccordion />
      <Footer />
    </main>
  );
}
