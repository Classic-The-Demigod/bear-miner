import Image from "next/image";
import Nav from "../components/home/layout/Nav";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import HowToPurchase from "../components/home/Purchase";
import Roadmap from "../components/home/Roadmap";
import Tokenomics from "../components/home/Tokenomics";
import FaqAccordion from "../components/home/Accordion";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <section className="bg-[#F3FFEB]">
      <div className="md:px-28 py-8 px-4">
        <Nav />
      </div>

      <Hero />

      <About />
      <HowToPurchase />
      <Roadmap />
      <Tokenomics />
      <FaqAccordion />
      <Footer />
    </section>
  );
}
