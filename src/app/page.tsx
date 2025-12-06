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
import TokenDetails from "../components/home/TokenDetails";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <section className="bg-[#F3FFEB]">
      <div className="md:px-28 py-8 px-4">
        <Nav />
      </div>

      <Hero />

      <About />

      <div className="md:px-28 py-8 px-4">
        <BMTPurchase />
      </div>
      <HowToPurchase />
      <Roadmap />
      <Tokenomics />
      <TokenDetails />
      <FaqAccordion />
      <Footer />
    </section>
  );
}
