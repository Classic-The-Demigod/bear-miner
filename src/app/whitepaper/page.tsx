import Image from "next/image";
import Link from "next/link";

export default function WhitePaperPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Container */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        {/* Header */}
        <Link href="/" className="flex items-center justify-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/img/logo.svg"
              alt="Bear Miner Logo"
              width={105}
              height={105}
              className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              //   style={{ width: "auto", height: "auto" }}
            />
          </div>
        </Link>
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            BEAR MINER
          </h1>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-500">
            White Paper · Version 1.1
          </p>
          <p className="mt-6 text-lg text-gray-600">
            Built on the Solana Blockchain
          </p>
        </header>

        {/* Section */}
        <Section title="Introduction">
          <p>
            Bear Miner is a decentralized yield protocol built on the Solana
            blockchain, designed to provide predictable daily income while
            maintaining long-term economic sustainability. The protocol offers a
            fixed <strong>2% daily return</strong> on deposited capital, paired
            with a <strong>5% referral incentive</strong>, governed by an
            advanced system of behavioral controls, capital protection
            mechanisms, and transparent on-chain logic.
          </p>

          <p>
            Bear Miner exists at the intersection of two historically
            conflicting models in decentralized finance: high-yield
            community-driven platforms and institutionally disciplined financial
            infrastructure. Many platforms succeed at one while failing
            catastrophically at the other. Bear Miner is architected to resolve
            this conflict.
          </p>

          <p>
            At its core, Bear Miner is not a speculative product but a
            rule-based yield engine. All protocol behavior is enforced by
            immutable smart contracts deployed on Solana, guaranteeing fairness,
            predictability, and auditability.
          </p>
        </Section>

        <Section title="Market Problem & Opportunity">
          <p>
            The decentralized finance ecosystem has consistently demonstrated
            strong demand for passive income products. However, most high-yield
            platforms fail due to fundamental economic design flaws such as
            unsustainable emissions, referral abuse, and reliance on constant
            new inflows.
          </p>

          <p>
            Bear Miner addresses this gap by rejecting variable emissions and
            uncontrolled growth in favor of a fixed-yield model with explicit
            behavioral constraints. The 2% daily return is a hard ceiling
            enforced by smart contracts, eliminating uncertainty.
          </p>
        </Section>

        <Section title="Architecture & System Design">
          <p>
            Bear Miner is architected as a non-custodial, rule-based yield
            protocol where all economic logic is enforced directly by immutable
            smart contracts deployed on Solana.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Capital locking for economic stability</li>
            <li>Individualized reward accounting</li>
            <li>Controlled compounding intervals</li>
            <li>Separated referral reward logic</li>
            <li>Fully on-chain transparency</li>
          </ul>
        </Section>

        <Section title="Daily 2% Yield Mechanics">
          <p>
            The 2% daily return is the foundation of Bear Miner’s economic
            model. Unlike variable APY platforms, Bear Miner employs a fixed
            daily reward ceiling enforced by smart contract logic.
          </p>

          <p>
            Rewards accrue continuously based on effective staking power.
            Compounding increases future yield, while withdrawals are moderated
            through individualized penalty systems to prevent destabilizing
            behavior.
          </p>
        </Section>

        <Section title="Tokenomics">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2">Percentage</th>
                  <th className="border px-4 py-2">Amount (BMT)</th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  name="Staking Rewards"
                  percent="30%"
                  amount="90,000,000"
                />
                <TableRow
                  name="Liquidity Pool"
                  percent="20%"
                  amount="60,000,000"
                />
                <TableRow name="Pre-Sale" percent="20%" amount="60,000,000" />
                <TableRow
                  name="Marketing & Partnerships"
                  percent="15%"
                  amount="45,000,000"
                />
                <TableRow
                  name="Team & Development"
                  percent="10%"
                  amount="30,000,000"
                />
                <TableRow name="Reserve" percent="5%" amount="15,000,000" />
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Risk Framework & Investor Protection">
          <p>
            Bear Miner does not eliminate risk, but it defines and constrains
            it. Risks include smart contract vulnerabilities, behavioral
            penalties, and the trade-off of locked principal.
          </p>

          <p>
            Transparency is the primary protection mechanism. All protocol
            activity is visible on-chain and independently verifiable.
          </p>
        </Section>

        <Section title="Final Conclusion">
          <p>
            Bear Miner represents a disciplined departure from speculative miner
            platforms. By combining fixed yield, controlled referrals, and
            anti-whale protections, the protocol prioritizes sustainability,
            transparency, and long-term alignment.
          </p>
        </Section>

        {/* Footer */}
        <footer className="mt-24 border-t pt-8 text-center text-sm text-gray-500">
          <p>
            Website:{" "}
            <Link href={"https://bear-miner.com"}>https://bear-miner.com</Link>
          </p>
          <p>
            Telegram:{" "}
            <Link href={"https://t.me/bearminerwordwide"} target="_blank">
              https://t.me/bearminers
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

/* Reusable Components */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="space-y-4 leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

function TableRow({
  name,
  percent,
  amount,
}: {
  name: string;
  percent: string;
  amount: string;
}) {
  return (
    <tr>
      <td className="border px-4 py-2">{name}</td>
      <td className="border px-4 py-2 text-center">{percent}</td>
      <td className="border px-4 py-2 text-center">{amount}</td>
    </tr>
  );
}
