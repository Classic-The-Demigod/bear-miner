"use client";
import Image from "next/image";
import Link from "next/link";
// import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-[#F8EBDD] rounded-full">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.svg"
            alt="Bear Miner Logo"
            width={50}
            height={50}
          />

          <h1 className="text-2xl font-serif">Bear Miner</h1>
        </div>

        <div className="md:flex items-center gap-4 hidden">
          <Link
            href="https://t.me/bearminers"
            className="hover:scale-110 transition-transform border-2 border-black rounded-lg p-2 bg-white"
            target="_blank"
          >
            <span>
              <Image
                src="/assets/telegram.svg"
                alt="Telegram"
                width={30}
                height={30}
              />
            </span>
          </Link>
          <Link
            href="https://x.com/bearminer1?s=11&t=84EU8uEg_R77EpVGfFlzSw"
            className="hover:scale-110 transition-transform border-2 border-black rounded-lg p-2 bg-white"
            target="_blank"
          >
            <span>
              <Image
                src="/assets/twitter.svg"
                alt="Twitter"
                width={30}
                height={30}
              />
            </span>
          </Link>

          <Link
            href="/signup"
            className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000]"
          >
            Start Mining
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={38} />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F8EBDD] z-50 md:hidden transform transition-transform duration-300 ease-in-out border-l-4 border-black ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <button className="self-end mb-8" onClick={() => setIsOpen(false)}>
            <X size={32} />
          </button>

          <div className="flex flex-col gap-6">
            <Link
              href="https://t.me/bearminers"
              className="hover:scale-105 transition-transform border-2 border-black rounded-lg p-3 bg-white flex items-center justify-center"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/assets/telegram.svg"
                alt="Telegram"
                width={30}
                height={30}
              />
              <span className="ml-3 font-serif text-lg">Telegram</span>
            </Link>

            <Link
              href="https://x.com/bearminersol?s=21&t=84EU8uEg_R77EpVGfFlzSw"
              className="hover:scale-105 transition-transform border-2 border-black rounded-lg p-3 bg-white flex items-center justify-center"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/assets/twitter.svg"
                alt="Twitter"
                width={30}
                height={30}
              />
              <span className="ml-3 font-serif text-lg">Twitter</span>
            </Link>

            <Link
              href="/dashboard"
              className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-4 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000] text-center text-lg mt-4"
              onClick={() => setIsOpen(false)}
            >
              Start Mining
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
