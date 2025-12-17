import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1A0B0A] text-white border-t border-[#FFFFFF]/5 overflow-hidden font-sans">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7A4A33]/50 to-transparent opacity-50" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#7A4A33]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto pt-20 pb-10 px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Section (4 cols) */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-12">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#7A4A33]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/assets/logo.svg"
                  alt="Bear Miner Logo"
                  width={48}
                  height={48}
                  className="relative transform transition-transform duration-500 group-hover:rotate-12"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <span className="text-2xl font-serif font-black tracking-tight text-[#F8EBDD]">Bear Miner</span>
            </Link>

            <p className="text-[#F8EBDD]/60 leading-relaxed max-w-sm text-base">
              The future of DeFi staking on the Solana ecosystem. Powered by community, built for sustainable yield.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="https://t.me/bearminers"
                target="_blank"
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[#0088cc]/20 hover:border-[#0088cc]/30 transition-all duration-300"
              >
                <Image
                  src="/assets/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </div>
          </div>

          {/* Spacer (1 col) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Section (Use Grid for remaining 6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* Quick Links */}
            <div>
              <h4 className="text-[#CEA065] font-serif font-bold mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Roadmap', 'FAQ'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit"
                    >
                      <span className="w-0 group-hover:w-2 h-[1px] bg-[#CEA065] transition-all duration-300" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[#CEA065] font-serif font-bold mb-6 tracking-wide">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://drive.google.com/file/d/1LN2k1Nhu2DrA1r8FlyaWRImNESoeQabd/view?usp=sharing"
                    target="_blank"
                    className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit"
                  >
                    Whitepaper
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
                <li>
                  <Link href="#" className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit">
                    Audits
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support/Other */}
            <div>
              <h4 className="text-[#CEA065] font-serif font-bold mb-6 tracking-wide">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[#F8EBDD]/50 hover:text-[#F8EBDD] transition-colors duration-200 text-sm font-medium flex items-center gap-1 group w-fit">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[#F8EBDD]/30 text-xs">
            &copy; {currentYear} Bear Miner. All rights reserved.
          </p>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-[#F8EBDD]/50 text-xs font-medium tracking-wide">Built on Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
