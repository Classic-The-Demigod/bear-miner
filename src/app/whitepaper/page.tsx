import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Bear Miner White Paper",
};

export default function WhitePaperPage() {
  return (
    <main className="bg-white text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="text-center mb-16">
          <Link
            href="/"
            className="flex justify-center items-center gap-3 group mb-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/img/logo.svg"
                alt="Bear Miner Logo"
                width={75}
                height={75}
                className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                // style={{ width: "auto", height: "auto" }}
              />
            </div>
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Bear Miner White Paper
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold">
            Version 1.1
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Built on Solana Blockchain
          </p>
        </header>

        <Section title="Contents">
          <ul className="list-disc pl-6 space-y-1">
            <li>Bear Miner White Paper</li>
            <li>Introduction</li>
            <li>Market Problem & Opportunity</li>
            <li>Bear Miner Architecture and System Design</li>
            <li>Daily 1% Yield Mechanics</li>
            <li>How Bear Miner Works</li>
            {/* <li>Tokenomics</li>
            <li>Token Flow Diagram</li> */}
            <li>Anti-Whale Architecture & Penalty Systems</li>
            <li>Risk Framework & Investor Protection</li>
            <li>Governance, Roadmap & Long-Term Vision</li>
            <li>Final Conclusion</li>
          </ul>
        </Section>

        <Section title="Introduction">
          <Paragraph>
            Bear Miner is a decentralized yield protocol built on the Solana
            blockchain, designed to provide predictable daily income while
            maintaining long-term economic sustainability. The protocol offers a
            fixed 1% daily return on deposited capital, paired with a 5%
            referral incentive, governed by an advanced system of behavioral
            controls, capital protection mechanisms, and transparent on-chain
            logic.
          </Paragraph>
          <Paragraph>
            Bear Miner exists at the intersection of two historically
            conflicting models in decentralized finance: high-yield
            community-driven platforms and institutionally disciplined financial
            infrastructure. Many platforms succeed at one while failing
            catastrophically at the other. Community-first miners often collapse
            under unsustainable emissions and referral abuse, while
            institutional products frequently sacrifice accessibility,
            transparency, or meaningful yield. Bear Miner is architected to
            resolve this conflict.
          </Paragraph>
          <Paragraph>
            The protocol was designed after extensive analysis of legacy miner
            platforms, staking contracts, and yield farms that dominated
            previous market cycles. This research revealed consistent failure
            points: unchecked whale dominance, deflationary algorithms that
            silently degrade rewards, referral systems that "print" value
            without backing, and reward structures that rely entirely on
            constant new inflows. Bear Miner directly addresses each of these
            weaknesses through a fixed-yield framework, individualized penalty
            systems, controlled compounding, and sustainable referral mechanics.
          </Paragraph>
          <Paragraph>
            At its core, Bear Miner is not a speculative product but a
            rule-based yield engine. All protocol behavior is enforced by
            immutable smart contracts deployed on Solana. There is no
            discretionary control over rewards, penalties, or distributions.
            This guarantees fairness, predictability, and auditability for all
            participants, regardless of size or entry timing.
          </Paragraph>
          <Paragraph>
            The 1% daily return is the foundation of the protocol's economic
            model. This rate is intentionally capped and fixed to eliminate
            reward volatility and simplify capital planning for users.
            Participants may compound or withdraw rewards based on personal
            strategy, but all actions are moderated by protocol-level rules
            designed to protect the overall system. Unlike variable APY models
            that fluctuate unpredictably, Bear Miner offers clarity: users know
            exactly how yield is generated, accrued, and constrained.
          </Paragraph>
          <Paragraph>
            Complementing the base yield is a 5% referral program, designed not
            as an inflationary growth hack but as a controlled community
            expansion mechanism. Referral rewards are structurally separated
            from base yield emissions, ensuring that organic growth does not
            dilute existing participants. This design allows active community
            builders to accelerate returns while preserving equilibrium across
            the ecosystem.
          </Paragraph>
          <Paragraph>
            Bear Miner leverages Solana's high-throughput, low-fee environment
            to enable frequent compounding, real-time reward tracking, and
            cost-efficient participation. These characteristics make the
            protocol accessible to retail users while remaining viable for
            larger capital allocators who require scalability and efficiency.
          </Paragraph>
          <Paragraph>
            From an investment perspective, Bear Miner is positioned as a hybrid
            yield infrastructure: conservative in its economic discipline, yet
            attractive through consistent returns and community-aligned
            incentives. The protocol does not promise infinite growth or
            unrealistic outcomes. Instead, it offers a transparent framework
            where risk, reward, and behavior are explicitly defined.
          </Paragraph>
          <Paragraph>
            Bear Miner is built for endurance. Its success is measured not by
            short-term hype cycles, but by sustained operation, capital
            preservation, and long-term user confidence.
          </Paragraph>
          <Subheading>Solana Foundations</Subheading>
          <Paragraph>
            Solana is a high-performance blockchain designed for scalability,
            speed, and low transaction costs. It is the ideal foundation for
            Bear Miner due to its technical advantages and growing ecosystem.
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              High Throughput: Solana can process over 65,000 transactions per
              second (TPS), making it one of the fastest blockchains in the
              world. This ensures that Bear Miner users experience
              near-instantaneous staking, compounding, and withdrawal
              operations.
            </li>
            <li>
              Low Fees: Transaction fees on Solana are typically less than
              $0.01. This allows users to maximize their returns without
              worrying about high gas costs, which is especially important for
              daily compounding and micro-transactions.
            </li>
            <li>
              Security and Stability: Solana uses a hybrid Proof-of-History
              (PoH) and Proof-of-Stake (PoS) consensus mechanism, offering
              robust security while maintaining decentralization. This ensures
              that user funds and smart contract operations are protected from
              malicious actors.
            </li>
            <li>
              Developer Ecosystem: Solana's active developer community and
              support for smart contract development using Rust and C provide a
              solid foundation for building advanced DeFi applications like Bear
              Miner.
            </li>
          </ul>
        </Section>

        <Section title="Market Problem & Opportunity">
          <Paragraph>
            The decentralized finance ecosystem has consistently demonstrated
            strong demand for passive income products. Across market cycles,
            users seek mechanisms to deploy idle capital and earn predictable
            returns without active trading. However, the majority of high-yield
            platforms that attempt to satisfy this demand fail due to
            fundamental economic design flaws.
          </Paragraph>
          <Paragraph>
            Miner-style protocols, in particular, have a long history of
            collapse. While often marketed as "staking" or "mining," many of
            these platforms rely on unsustainable reward emissions, deflationary
            formulas that silently erode yield, or referral systems that
            generate unbacked obligations. These designs create a short-term
            illusion of profitability while embedding long-term fragility into
            the protocol.
          </Paragraph>
          <Paragraph>
            A common failure pattern emerges repeatedly. Early participants
            experience outsized gains due to low contract saturation. As the
            protocol grows, reward calculations degrade, penalties become
            unavoidable, and late participants absorb disproportionate risk.
            Eventually, new inflows slow, withdrawals accelerate, and the
            contract balance becomes insufficient to sustain promised returns.
            Trust collapses, capital exits, and the protocol fails.
          </Paragraph>
          <Paragraph>
            From a market perspective, this cycle has created deep skepticism
            among experienced users and institutional observers. High-yield DeFi
            products are often dismissed as inherently unsustainable, regardless
            of nuance. This skepticism represents both a challenge and an
            opportunity.
          </Paragraph>
          <Paragraph>
            The opportunity lies in rebuilding trust through discipline and
            transparency. There is clear unmet demand for yield platforms that:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Offer predictable returns</li>
            <li>Clearly define risk</li>
            <li>Enforce fairness across participant sizes</li>
            <li>Do not rely entirely on constant new deposits</li>
          </ul>
          <Paragraph>
            Bear Miner addresses this gap by rejecting variable emissions and
            uncontrolled growth in favor of a fixed-yield model with explicit
            behavioral constraints. The 1% daily return is not a marketing
            figure; it is a ceiling enforced by smart contracts. This
            immediately removes one of the largest sources of uncertainty in
            DeFi yield products.
          </Paragraph>
          <Paragraph>
            Solana's ecosystem further amplifies this opportunity. Many yield
            platforms fail not only due to economic design, but also due to
            operational friction. High transaction fees discourage disciplined
            compounding and penalize smaller users. Solana's low-cost
            environment enables Bear Miner to enforce healthy behaviors, such as
            regular compounding, without imposing prohibitive costs.
          </Paragraph>
          <Paragraph>
            Additionally, emerging markets and underbanked regions continue to
            show strong interest in transparent, on-chain income mechanisms.
            Bear Miner's simplicity, combined with its rule-based design, makes
            it accessible to these users while remaining sophisticated enough
            for advanced participants.
          </Paragraph>
          <Paragraph>
            In summary, Bear Miner operates in a market characterized by high
            demand and low trust. By prioritizing predictability,
            sustainability, and transparency, the protocol positions itself to
            capture users who have been underserved or burned by previous
            platforms.
          </Paragraph>
        </Section>
        <Section title="Bear Miner Architecture and System Design">
          <Paragraph>
            Bear Miner is architected as a non-custodial, rule-based yield
            protocol where all economic logic is enforced directly by immutable
            smart contracts deployed on the Solana blockchain. The system is
            intentionally designed to remove discretionary control, human
            intervention, or opaque parameter changes that commonly undermine
            trust in decentralized yield platforms.
          </Paragraph>
          <Paragraph>
            At a high level, the Bear Miner protocol consists of a core staking
            contract and supporting logic modules that govern reward
            calculation, compounding behavior, withdrawal moderation, and
            referral distribution. Users interact with the protocol by
            depositing supported assets into the Bear Miner contract, at which
            point their capital becomes locked and begins generating yield
            according to deterministic rules.
          </Paragraph>
          <Paragraph>
            Unlike proof-of-work mining or liquidity farming, Bear Miner does
            not depend on external market conditions, trading volume, or
            speculative activity to generate yield. Instead, yield generation is
            capital-based and algorithmically controlled. This design choice
            eliminates dependencies that can destabilize returns during periods
            of market stress and ensures that reward behavior remains consistent
            regardless of broader ecosystem volatility.
          </Paragraph>
          <Subheading>Capital Locking and Reward Accrual</Subheading>
          <Paragraph>
            Once deposited, user capital is locked within the smart contract and
            cannot be withdrawn. This constraint is fundamental to the
            protocol's sustainability. By preventing principal withdrawal, Bear
            Miner ensures that the contract maintains a stable capital base from
            which rewards can be managed predictably. Users earn value
            exclusively through daily rewards, not through principal redemption.
          </Paragraph>
          <Paragraph>
            Rewards accrue continuously and are tracked per user on-chain. The
            protocol calculates yield based on each user's effective staking
            power, which increases through compounding and decreases only
            through protocol-defined penalties. This individualized accounting
            ensures that participant behavior directly influences outcomes
            without impacting other users unfairly.
          </Paragraph>
          <Subheading>Compounding Logic and Behavioral Controls</Subheading>
          <Paragraph>
            Compounding is a critical feature of Bear Miner, enabling users to
            reinvest earned rewards and increase future yield. However,
            unrestricted compounding has historically been a major source of
            imbalance in miner-style platforms, particularly when exploited by
            large stakeholders.
          </Paragraph>
          <Paragraph>
            To address this, Bear Miner implements controlled compounding
            intervals. Users may compound only at defined minimum time
            intervals, ensuring that no participant gains an unfair advantage
            through high-frequency interactions. This design equalizes
            opportunity across participants regardless of capital size or
            automation capability.
          </Paragraph>
          <Paragraph>
            The compounding system is not merely a technical constraint; it is a
            behavioral alignment mechanism. By encouraging regular but
            disciplined compounding, the protocol promotes healthy capital
            growth while protecting overall system stability.
          </Paragraph>
          <Subheading>Withdrawal Mechanisms</Subheading>
          <Paragraph>
            While principal remains locked, reward withdrawals are permitted at
            any time, subject to protocol rules. Withdrawals are intentionally
            flexible to accommodate real-world needs, but they are moderated by
            penalty systems designed to discourage excessive extraction that
            could destabilize reward dynamics. Importantly, withdrawals do not
            directly reduce other users' rewards. Penalties are applied at the
            individual level, ensuring that one user's behavior does not degrade
            the experience of others. This individualized enforcement is a key
            differentiator from legacy miner platforms, where global variables
            often cause cascading reward degradation.
          </Paragraph>
          <Subheading>Referral Accounting Separation</Subheading>
          <Paragraph>
            One of the most critical architectural decisions in Bear Miner is
            the complete separation of base yield accounting from referral
            rewards. Referral incentives are tracked independently and do not
            alter base reward calculations. This prevents referral-driven growth
            from inflating reward obligations beyond sustainable limits.
          </Paragraph>
          <Paragraph>
            Referral rewards are distributed automatically through the smart
            contract, with all calculations and payouts transparently verifiable
            on-chain. This eliminates ambiguity and ensures that referral
            incentives remain aligned with long-term protocol health.
          </Paragraph>
          <Subheading>Immutability and Transparency</Subheading>
          <Paragraph>
            Once deployed, Bear Miner's core contracts are immutable. This
            guarantees that reward rates, penalty logic, and interaction rules
            cannot be altered arbitrarily. Transparency is further reinforced by
            public access to all contract logic and transaction history,
            enabling independent audits and community oversight.
          </Paragraph>
          <Paragraph>
            In summary, Bear Miner's architecture is deliberately conservative
            in its constraints and liberal in its transparency. This combination
            enables predictable yield generation while protecting against the
            structural failures that have plagued similar platforms.
          </Paragraph>
        </Section>

        <Section title="Daily 1% Yield Mechanics">
          <Subheading>Deep Economic Explanation</Subheading>
          <Paragraph>
            The 1% daily return is the foundation of Bear Miner's economic model
            and the most critical element of its long-term viability. Unlike
            variable yield platforms that adjust rewards dynamically based on
            market conditions or contract balance, Bear Miner employs a fixed
            daily reward ceiling, enforced by smart contract logic.
          </Paragraph>
          <Paragraph>
            This design choice is intentional and informed by extensive analysis
            of previous miner and staking platforms. Variable yield systems
            often obscure risk, allowing rewards to spike temporarily before
            collapsing as conditions change. In contrast, a fixed yield model
            provides clarity and predictability, enabling participants to plan
            capital deployment and compounding strategies with confidence.
          </Paragraph>
          <Subheading>Why 1%?</Subheading>
          <Paragraph>
            The selection of a 1% daily return represents a balance between
            attractiveness and sustainability. Rates significantly higher than
            1% have historically led to rapid contract depletion, especially
            when combined with aggressive referral systems. Lower rates, while
            safer, often fail to sustain user engagement. At 1% daily, Bear
            Miner offers a compelling return profile while maintaining
            sufficient control to manage long-term reward obligations. This rate
            is capped, meaning users can never exceed it through manipulation,
            timing, or automation.
          </Paragraph>
          <Subheading>Reward Accrual Process</Subheading>
          <Paragraph>
            Rewards accrue continuously based on each user's effective staking
            power. Effective staking power increases through compounding and
            decreases through penalties. The protocol calculates rewards
            deterministically, ensuring that two users with identical behavior
            and deposits will experience identical outcomes.
          </Paragraph>
          <Paragraph>
            The daily reward cap applies strictly to base staking rewards. Even
            if a user compounds frequently or accumulates rewards over time, the
            protocol enforces the ceiling to prevent exponential runaway growth.
          </Paragraph>
          <Subheading>Compounding vs. Withdrawing</Subheading>
          <Paragraph>
            Users may choose to compound rewards to increase future earnings or
            withdraw rewards for immediate use. This choice introduces a
            strategic dimension, but it is carefully constrained to prevent
            exploitative behavior. Compounding increases staking power,
            accelerating long-term returns. However, compounding is limited by
            minimum time intervals to prevent whales from compounding
            excessively and dominating reward flow. Withdrawals, while flexible,
            are moderated by penalty systems if performed too frequently. These
            penalties do not confiscate rewards; rather, they temporarily reduce
            reward efficiency to discourage destabilizing behavior.
          </Paragraph>
          <Subheading>Separation from Referral Rewards</Subheading>
          <Paragraph>
            A critical sustainability feature of Bear Miner is that referral
            rewards do not count toward the 1% daily yield cap. Referral income
            is additive and tracked separately. This ensures that base yield
            obligations remain predictable regardless of network growth.
          </Paragraph>
          <Paragraph>
            This separation also protects non-referring users. In many legacy
            platforms, aggressive referral activity indirectly degrades rewards
            for everyone else. Bear Miner eliminates this externality entirely.
          </Paragraph>
          <Subheading>Long-Term Reward Stability</Subheading>
          <Paragraph>
            By enforcing a fixed yield ceiling, controlled compounding, and
            individualized penalties, Bear Miner stabilizes reward flow across
            time. Even during periods of reduced activity or slower growth, the
            protocol continues to function predictably. This stability is
            essential for building long-term trust, particularly among users who
            have experienced sudden yield collapses in other platforms.
          </Paragraph>
        </Section>
        <Section title="How Bear Miner Works">
          <Subheading>Mining vs Earning</Subheading>
          <Paragraph>
            Unlike traditional mining, which involves solving complex
            mathematical problems to validate transactions on a blockchain, SOL
            miners often participate in earning SOL through staking or liquidity
            providing rather than direct mining.
          </Paragraph>
          <Subheading>Staking</Subheading>
          <Paragraph>
            Users can stake their SOL in various platforms or wallets that
            support SOL staking. By doing this, they help validate transactions
            on the network and, in return, earn rewards in the form of
            additional SOL. The process involves locking up a certain amount of
            SOL for a specified period.
          </Paragraph>
          <Subheading>Liquidity Providing</Subheading>
          <Paragraph>
            Some platforms allow users to provide liquidity in exchange for
            rewards. Users can deposit their SOL into liquidity pools on
            decentralized exchanges (DEXs). In return, they earn a portion of
            the trading fees generated by the DEX, often paid in SOL. Users earn
            a fixed 1% daily reward on their staked amount.
          </Paragraph>
          <Subheading>Yield Farming</Subheading>
          <Paragraph>
            This is another way to earn SOL. Users can use their SOL to
            participate in yield farming, where they lend their assets or
            provide liquidity to earn returns. The returns can be in the form of
            SOL or other tokens.
          </Paragraph>
          <Subheading>Mining Pools</Subheading>
          <Paragraph>
            Some users join mining pools that focus on SOL. In these pools,
            participants combine their resources to increase the chances of
            earning rewards, which are then distributed among pool members based
            on the Bear Miner automated Trading Bot. This allows users to earn SOL without having to manage the mining process themselves. Bear Miner has put in place a structured ai trading bot that is built on taking decisions based on real market data feed and short term price direction. It is programmed against portfolio drawdown and guarantees a sustainable return. Our trading bot is modelled to reinforce learning that causes it to trade as a problem solver rather than making predictions.
          </Paragraph>
          <Subheading>Withdrawal</Subheading>
          <Paragraph>
            Users can withdraw their rewards at any time, subject to the
            platform's withdrawal rules and penalties to maintain
            sustainability.
          </Paragraph>
        </Section>

        <Section title="Risks and Considerations">
          <Paragraph>
            It's essential to note that while earning SOL through these methods
            can be profitable, it also carries risks, including market
            volatility, potential loss of funds, and the security of the
            platforms used.
          </Paragraph>
        </Section>

        {/* <Section title="Tokenomics">
          <Subheading>Token Overview</Subheading>
          <div className="grid gap-2 text-sm text-gray-800">
            <KeyValue label="Token Name" value="Bear Miner" />
            <KeyValue label="Token Symbol" value="BMT" />
            <KeyValue label="Blockchain" value="Solana (SPL Standard)" />
            <KeyValue label="Decimals" value="9" />
            <KeyValue label="Total Supply" value="300,000,000 BMT" />
            <KeyValue
              label="Initial Launch Venues"
              value="Raydium (DEX) and Centralized Exchanges (CEX)"
            />
          </div>
          <Paragraph>
            The Bear Miner token (BMT) is the core economic unit of the Bear
            Miner ecosystem. It is designed to power staking rewards,
            incentivize long-term participation, support liquidity stability,
            and enable sustainable ecosystem growth. The tokenomics framework
            prioritizes transparency, fairness, and durability over short-term
            speculation.
          </Paragraph>
          <Paragraph>
            BMT is not designed as a purely speculative asset. Instead, it
            functions as a utility-driven reward and participation token,
            closely integrated with the Bear Miner product mechanics.
          </Paragraph>

          <Subheading>Tokenomics Table</Subheading>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">
                    Allocation Category
                  </th>
                  <th className="border px-4 py-2 text-center">Percentage</th>
                  <th className="border px-4 py-2 text-center">
                    Token Amount (BMT)
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Intended Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Staking Rewards</td>
                  <td className="border px-4 py-2 text-center">30%</td>
                  <td className="border px-4 py-2 text-center">90,000,000</td>
                  <td className="border px-4 py-2">
                    Incentivize protocol participation through smart
                    contract-controlled distributions
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Liquidity Pool</td>
                  <td className="border px-4 py-2 text-center">20%</td>
                  <td className="border px-4 py-2 text-center">60,000,000</td>
                  <td className="border px-4 py-2">
                    Support market liquidity, price discovery, and trading
                    efficiency
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Pre-Sale Allocation</td>
                  <td className="border px-4 py-2 text-center">20%</td>
                  <td className="border px-4 py-2 text-center">60,000,000</td>
                  <td className="border px-4 py-2">
                    Early ecosystem participation and initial protocol usage
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Marketing & Partnerships</td>
                  <td className="border px-4 py-2 text-center">15%</td>
                  <td className="border px-4 py-2 text-center">45,000,000</td>
                  <td className="border px-4 py-2">
                    Ecosystem growth, user education, partnerships, and
                    integrations
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Team & Development</td>
                  <td className="border px-4 py-2 text-center">10%</td>
                  <td className="border px-4 py-2 text-center">30,000,000</td>
                  <td className="border px-4 py-2">
                    Product development, maintenance, security, and operational
                    continuity
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Reserve & Future Utilities
                  </td>
                  <td className="border px-4 py-2 text-center">5%</td>
                  <td className="border px-4 py-2 text-center">15,000,000</td>
                  <td className="border px-4 py-2">
                    Future features, utilities, and ecosystem expansion
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Total</td>
                  <td className="border px-4 py-2 text-center font-semibold">
                    100%
                  </td>
                  <td className="border px-4 py-2 text-center font-semibold">
                    300,000,000
                  </td>
                  <td className="border px-4 py-2">Fixed maximum supply</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Subheading>Allocation Rationale</Subheading>
          <SubheadingMinor>Staking Rewards (30%)</SubheadingMinor>
          <Paragraph>
            Tokens allocated to staking rewards are distributed programmatically
            through smart contracts based on predefined protocol logic.
            Distribution rates, conditions, and eligibility are enforced
            automatically and are not subject to discretionary modification.
          </Paragraph>
          <Paragraph>This allocation is intended to:</Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Incentivize continued protocol participation</li>
            <li>Support protocol usage over time</li>
            <li>Align token utility with product engagement</li>
          </ul>
          <Paragraph>
            Distribution does not represent guaranteed returns and may vary
            based on individual behavior and protocol conditions.
          </Paragraph>

          <SubheadingMinor>Liquidity Pool (20%)</SubheadingMinor>
          <Paragraph>
            Liquidity tokens are reserved to support secondary market trading on
            decentralized and centralized exchanges. Adequate liquidity is
            necessary to:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Facilitate efficient token transfers</li>
            <li>Reduce excessive price volatility</li>
            <li>Enable orderly market participation</li>
          </ul>
          <Paragraph>
            Liquidity provision does not constitute price support or market
            guarantees.
          </Paragraph>

          <SubheadingMinor>Pre-Sale Allocation (20%)</SubheadingMinor>
          <Paragraph>
            Pre-sale tokens are allocated to early participants who engage with
            the ecosystem prior to public availability. This allocation is
            designed to:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bootstrap initial protocol usage</li>
            <li>Support early ecosystem formation</li>
          </ul>
          <Paragraph>
            Participation terms may include vesting or usage conditions to
            encourage long-term alignment. Pre-sale participation does not
            convey ownership or profit rights.
          </Paragraph>

          <SubheadingMinor>Marketing & Partnerships (15%)</SubheadingMinor>
          <Paragraph>This allocation supports:</Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Community education initiatives</li>
            <li>Ecosystem partnerships</li>
            <li>User onboarding campaigns</li>
            <li>Exchange and infrastructure integrations</li>
          </ul>
          <Paragraph>
            Marketing tokens are deployed gradually and strategically to promote
            responsible growth rather than short-term speculation.
          </Paragraph>

          <SubheadingMinor>Team & Development (10%)</SubheadingMinor>
          <Paragraph>
            Team and development tokens compensate contributors responsible for:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Smart contract development</li>
            <li>Product maintenance</li>
            <li>Security reviews and audits</li>
            <li>Operational infrastructure</li>
          </ul>
          <Paragraph>
            Team allocations are structured to align long-term contributor
            incentives with protocol stability and continuity.
          </Paragraph>

          <SubheadingMinor>Reserve & Future Utilities (5%)</SubheadingMinor>
          <Paragraph>
            The reserve allocation provides flexibility for:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Future protocol features</li>
            <li>Additional token utilities</li>
            <li>Ecosystem tools and integrations</li>
          </ul>
          <Paragraph>
            Any future use of reserve tokens will align with the Bear Miner
            stated objectives and supply constraints.
          </Paragraph>
        </Section>

        <Section title="Token Flow Diagram">
          <Paragraph>
            The Bear Miner token flow is designed to be transparent, linear, and
            auditable, avoiding circular dependencies or hidden inflation
            mechanics.
          </Paragraph>
          <SubheadingMinor>1. Initial Distribution Phase</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              BMT tokens are allocated according to the predefined tokenomics
              table.
            </li>
            <li>
              Tokens designated for liquidity are deployed to Raydium and
              selected centralized exchanges.
            </li>
            <li>
              Pre-sale and team allocations are distributed under defined
              conditions.
            </li>
          </ul>
          <SubheadingMinor>2. Protocol Interaction Flow</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Users acquire BMT via supported exchanges or participation
              mechanisms.
            </li>
            <li>
              BMT may be used within the Bear Miner protocol according to its
              functional rules.
            </li>
            <li>
              Staking rewards are distributed from the staking allocation pool
              via smart contracts.
            </li>
          </ul>
          <SubheadingMinor>3. Reward Distribution Flow</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Smart contracts calculate and distribute staking-related
              incentives based on protocol logic.
            </li>
            <li>
              Referral-related incentives, where applicable, are processed
              independently from base staking distributions.
            </li>
            <li>
              All token movements are recorded on-chain and publicly verifiable.
            </li>
          </ul>
          <SubheadingMinor>4. Market Circulation Flow</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tokens may circulate freely through secondary markets.</li>
            <li>
              Liquidity pools facilitate transfers without protocol
              intervention.
            </li>
            <li>
              The protocol does not enforce price controls or market behavior.
            </li>
          </ul>
          <SubheadingMinor>5. Long-Term Ecosystem Flow</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Marketing and partnership tokens support ecosystem expansion.
            </li>
            <li>
              Reserve tokens may be activated for future utilities without
              increasing total supply.
            </li>
            <li>
              No minting or inflation mechanisms exist beyond the original
              supply.
            </li>
          </ul>
          <Paragraph>
            This flow ensures that BMT utility, distribution, and circulation
            remain predictable and transparent.
          </Paragraph>
          <Paragraph>
            BMT is a utility token intended solely for use within the Bear Miner
            ecosystem. Participation in the protocol involves technological,
            market, and smart contract risks. Token value may fluctuate and is
            not guaranteed. Nothing in this document constitutes financial
            advice, investment solicitation, or a promise of returns. Users
            should conduct independent due diligence and comply with all
            applicable laws and regulations in their jurisdiction.
          </Paragraph>
        </Section> */}
        <Section title="Anti-Whale Architecture & Penalty Systems">
          <Paragraph>
            Unchecked whale dominance is one of the most destructive forces in
            decentralized yield platforms. Large stakeholders, when
            unrestricted, can extract disproportionate value, distort reward
            dynamics, and accelerate protocol collapse. Bear Miner is explicitly
            designed to neutralize this risk through individualized anti-whale
            controls.
          </Paragraph>
          <Subheading>
            Individualized Penalties, Not Global Punishment
          </Subheading>
          <Paragraph>
            Rather than applying global reward reductions that affect all users,
            Bear Miner enforces penalties at the individual level. This ensures
            that irresponsible behavior is isolated and does not propagate harm
            throughout the system.
          </Paragraph>
          <Paragraph>
            Penalties are triggered by specific actions, such as excessive
            withdrawal frequency, prolonged inactivity, or attempts to game
            compounding mechanics. Each penalty temporarily reduces reward
            efficiency for the offending user only.
          </Paragraph>
          <Subheading>Behavioral Alignment, Not Punishment</Subheading>
          <Paragraph>
            The goal of penalties is not punishment, but alignment. Users who
            follow recommended behavior patterns experience optimal performance,
            while those who attempt to extract value aggressively see
            diminishing returns.
          </Paragraph>
          <Paragraph>
            This design discourages whales from exploiting their size advantage
            while allowing them to participate fairly under the same rules as
            smaller users.
          </Paragraph>
          <Subheading>Capital Preservation</Subheading>
          <Paragraph>
            By moderating extraction and compounding behavior, Bear Miner
            protects the protocol's capital base. This ensures that reward
            obligations remain manageable over time and that the system does not
            rely on constant new deposits to survive.
          </Paragraph>
          <Paragraph>
            In effect, Bear Miner transforms what is traditionally a zero-sum
            extraction race into a rule-based yield environment where long-term
            participation is rewarded more consistently than short-term
            exploitation.
          </Paragraph>
        </Section>

        <Section title="Risk Framework & Investor Protection">
          <Paragraph>
            No decentralized protocol can eliminate risk entirely. However, risk
            can be defined, constrained, and managed. Bear Miner adopts a
            transparent risk framework that prioritizes capital preservation,
            behavioral alignment, and informed participation.
          </Paragraph>
          <Subheading>Fixed-Yield Risk Profile</Subheading>
          <Paragraph>
            The fixed 1% daily yield introduces a clear risk-reward profile.
            Unlike variable APY platforms that obscure downside risk, Bear Miner
            makes its reward ceiling explicit. This transparency allows users to
            assess sustainability realistically rather than relying on
            speculative assumptions.
          </Paragraph>
          <Paragraph>
            The protocol does not promise guaranteed outcomes or infinite
            growth. Returns are deterministic, but subject to individual
            behavior, penalties, and overall system health.
          </Paragraph>
          <Subheading>Smart Contract Risk</Subheading>
          <Paragraph>
            As with all decentralized applications, Bear Miner carries smart
            contract risk. To mitigate this:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contracts are designed with minimal complexity</li>
            <li>Core logic is immutable</li>
            <li>All calculations are deterministic and auditable</li>
          </ul>
          <Paragraph>
            Users are encouraged to review contract code or rely on third-party
            audits before participating.
          </Paragraph>
          <Subheading>Behavioral Risk & Penalties</Subheading>
          <Paragraph>
            Many platform failures stem not from malicious intent, but from
            misaligned incentives. Bear Miner addresses this through proactive
            behavioral controls.
          </Paragraph>
          <Paragraph>Penalties are applied when users:</Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Withdraw rewards too frequently</li>
            <li>Fail to interact for extended periods</li>
            <li>Attempt to exploit compounding mechanics</li>
          </ul>
          <Paragraph>
            These penalties are temporary and individualized. They are designed
            to discourage harmful behavior, not to confiscate funds or punish
            honest mistakes.
          </Paragraph>
          <Subheading>Capital Locking Trade-Off</Subheading>
          <Paragraph>
            Bear Miner requires users to accept that principal deposits are
            locked. This is a deliberate trade-off. While it removes the option
            to exit principal directly, it enables the protocol to maintain a
            stable capital base and predictable reward behavior.
          </Paragraph>
          <Paragraph>
            Users must evaluate this constraint carefully and invest only
            capital they are comfortable committing long-term.
          </Paragraph>
          <Subheading>Transparency as Protection</Subheading>
          <Paragraph>
            All protocol activity is visible on-chain. Reward calculations,
            penalties, referral distributions, and withdrawals can be
            independently verified. This level of transparency is a core
            investor protection mechanism, enabling continuous oversight and
            accountability.
          </Paragraph>
        </Section>

        <Section title="Governance, Roadmap & Long-Term Vision">
          <Paragraph>
            Bear Miner is designed not as a static product, but as an evolving
            yield infrastructure. Its roadmap emphasizes disciplined expansion
            rather than feature overload.
          </Paragraph>
          <Subheading>Governance Philosophy</Subheading>
          <Paragraph>
            Future governance mechanisms are intended to balance
            decentralization with operational stability. Governance will focus
            on:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-1">
            <li>Parameter optimization</li>
            <li>Utility expansion</li>
            <li>Community-aligned upgrades</li>
          </ul>
          <Paragraph>
            Core yield mechanics, including the 1% daily cap, are intended to
            remain immutable to preserve trust.
          </Paragraph>
          <Subheading>Roadmap Phases</Subheading>
          <SubheadingMinor>Phase 1 - Foundation</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>Smart contract deployment</li>
            <li>Security audits</li>
            <li>Community onboarding</li>
            <li>Initial liquidity growth</li>
          </ul>
          <SubheadingMinor>Phase 2 - Expansion</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>Enhanced user interfaces</li>
            <li>Analytics and transparency tools</li>
            <li>Strategic partnerships</li>
            <li>Additional sustainability utilities</li>
          </ul>
          <SubheadingMinor>Phase 3 - Maturity</SubheadingMinor>
          <ul className="list-disc pl-6 space-y-1">
            <li>Governance activation</li>
            <li>Ecosystem integrations</li>
            <li>Long-term treasury optimization</li>
          </ul>
          <Subheading>Vision</Subheading>
          <Paragraph>
            Bear Miner's long-term vision is to become a foundational yield
            primitive within the Solana ecosystem. The protocol aims to
            demonstrate that high-yield does not have to mean high-risk when
            discipline, transparency, and incentive alignment are prioritized.
          </Paragraph>
        </Section>

        <Section title="Final Conclusion">
          <Paragraph>
            Bear Miner represents a deliberate departure from speculative miner
            platforms toward a more disciplined, transparent, and sustainable
            model of decentralized yield generation. By combining a fixed 1%
            daily return, a carefully engineered 5% referral system, and robust
            anti-whale and risk controls, the protocol creates an environment
            where long-term participation is favored over short-term extraction.
          </Paragraph>
          <Paragraph>
            This hybrid approach allows Bear Miner to serve both
            community-driven users seeking consistent income and institutional
            observers demanding clarity and sustainability. Rather than
            promising unrealistic outcomes, Bear Miner defines clear rules and
            enforces them uniformly through immutable smart contracts.
          </Paragraph>
          <Paragraph>
            In a sector often characterized by volatility and opacity, Bear
            Miner's value proposition is simple: predictable yield, transparent
            risk, and long-term alignment.
          </Paragraph>
        </Section>

        {/* <Section title="Contacts">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Website:{" "}
              <Link href={"www.bear-miner.com"} target="_blank">
                Bear Miner
              </Link>
            </li>
            <li>
              Telegram:{" "}
              <Link href={"https://t.me/bearminerwordwide"} target="_blank">
                Bear Miner
              </Link>
            </li>
          </ul>
        </Section> */}
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4 leading-relaxed text-gray-800">{children}</div>
    </section>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold mt-6">{children}</h3>;
}

function SubheadingMinor({ children }: { children: React.ReactNode }) {
  return <h4 className="text-base font-semibold mt-4">{children}</h4>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-gray-800">{children}</p>;
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
