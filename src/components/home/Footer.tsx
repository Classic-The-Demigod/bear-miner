import Image from "next/image";
import Link from "next/link";



const Footer = () => {
  return (
    <footer className="bg-[#2B1311] text-white border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Top Section: Logo and Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-[#E29014] pb-10 mb-10">
          {/* Logo & Slogan */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="#"
              className="flex gap-2 items-center text-2xl font-bold text-pretty font-serif transition-colors duration-200"
            >
              <span>
                <Image
                  src="/assets/logo.svg"
                  alt="Bear Miner Logo"
                  width={50}
                  height={50}
                />
              </span>
              Bear Miner
            </Link>
            <p className="mt-4 text-gray-100 max-w-xs text-sm">
              The future of DeFi staking on the Solana ecosystem. Powered by
              community.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#E29014]">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-100">
              <li>
                <a
                  href="#home"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1LN2k1Nhu2DrA1r8FlyaWRImNESoeQabd/view?usp=sharing"
                  target="_blank"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#E29014]">
              Resources
            </h4>
            <ul className="space-y-3 text-gray-100">
              <li>
                <a
                  href="#"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Audits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#E29014] transition-colors duration-200"
                >
                  Bug Bounty
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-[#E29014]">
              Connect
            </h4>
            <div className="flex space-x-4">
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
                href="https://x.com/bearminersol?s=21&t=84EU8uEg_R77EpVGfFlzSw"
                className="hover:scale-110 transition-transform border-2 border-black rounded-lg p-2 bg-white"
                target="_blank"
              >
                <span>
                  <Image
                    src="/assets/twitter.svg"
                    alt="Telegram"
                    width={30}
                    height={30}
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright and Disclaimer */}
        <div className="text-center text-sm text-gray-100">
          <p>
            &copy; {new Date().getFullYear()} Bear Miner. All rights reserved.{" "}
          </p>
          <p className="mt-2">
            Built on the Solana Blockchain. Decentralized and Community-First.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
