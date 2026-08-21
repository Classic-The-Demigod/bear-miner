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
      <Tokenomics />
      <TokenDetails />
      <FaqAccordion />
      <Footer />
    </main>
  );
}
