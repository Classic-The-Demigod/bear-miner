export default function TokenDetails() {
  const tokenAllocation = [
    { label: "Pre-Sale", percentage: 20, color: "#F59E0B", startAngle: 0 },
    {
      label: "Staking Rewards",
      percentage: 30,
      color: "#10B981",
      startAngle: 72,
    },
    { label: "Liquidity", percentage: 20, color: "#3B82F6", startAngle: 180 },
    { label: "Marketing", percentage: 10, color: "#8B5CF6", startAngle: 252 },
    { label: "Partnership", percentage: 5, color: "#EC4899", startAngle: 288 },
    { label: "Team", percentage: 5, color: "#F97316", startAngle: 306 },
    { label: "Development", percentage: 5, color: "#EF4444", startAngle: 324 },
    {
      label: "Reserved for CEX Listings",
      percentage: 5,
      color: "#6366F1",
      startAngle: 342,
    },
  ];

  const createPieChart = () => {
    let cumulativeAngle = 0;
    const radius = 140;
    const innerRadius = 80;
    const centerX = 200;
    const centerY = 200;

    return tokenAllocation.map((item, index) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;

      const startRadians = (startAngle - 90) * (Math.PI / 180);
      const endRadians = (endAngle - 90) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startRadians);
      const y1 = centerY + radius * Math.sin(startRadians);
      const x2 = centerX + radius * Math.cos(endRadians);
      const y2 = centerY + radius * Math.sin(endRadians);
      const x3 = centerX + innerRadius * Math.cos(endRadians);
      const y3 = centerY + innerRadius * Math.sin(endRadians);
      const x4 = centerX + innerRadius * Math.cos(startRadians);
      const y4 = centerY + innerRadius * Math.sin(startRadians);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      cumulativeAngle += angle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="#0A1A2F"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div
      id="tokendetails"
      className="min-h-screen  bg-[#2B1311] text-white py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Token Details</h1>
          <p className="text-gray-200 text-lg">
            The token allocation is structured to reward early supporters the
            most
          </p>
        </div>

        {/* Pie Chart Section */}
        <div className="relative mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Left Labels */}
            <div className="space-y-8 text-right lg:order-1">
              <div className="flex items-center justify-end gap-3">
                <div>
                  <div className="text-3xl font-bold text-[#10B981]">30%</div>
                  <div className="text-gray-200 text-sm">Staking Rewards</div>
                </div>
                <div className="w-24 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <div>
                  <div className="text-3xl font-bold text-[#8B5CF6]">10%</div>
                  <div className="text-gray-200 text-sm">Marketing</div>
                </div>
                <div className="w-24 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <div>
                  <div className="text-3xl font-bold text-[#EC4899]">5%</div>
                  <div className="text-gray-200 text-sm">Partnership</div>
                </div>
                <div className="w-24 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <div>
                  <div className="text-3xl font-bold text-[#EF4444]">5%</div>
                  <div className="text-gray-200 text-sm">Development</div>
                </div>
                <div className="w-24 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="lg:order-2">
              <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                className="drop-shadow-2xl"
              >
                {createPieChart()}
              </svg>
            </div>

            {/* Right Labels */}
            <div className="space-y-8 lg:order-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                <div>
                  <div className="text-3xl font-bold text-[#F59E0B]">20%</div>
                  <div className="text-gray-200 text-sm">Pre-Sale</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                <div>
                  <div className="text-3xl font-bold text-[#3B82F6]">20%</div>
                  <div className="text-gray-200 text-sm">Liquidity</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                <div>
                  <div className="text-3xl font-bold text-[#F97316]">5%</div>
                  <div className="text-gray-200 text-sm">Team</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                <div>
                  <div className="text-3xl font-bold text-[#6366F1]">5%</div>
                  <div className="text-gray-200 text-sm">
                    Reserved for CEX Listings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Token Name */}
          <div className=" bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Token Name</div>
            <div className="text-2xl font-bold">Bear Miner</div>
          </div>

          {/* Launch On */}
          <div className="bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Launch on</div>
            <div className="text-2xl font-bold">Raydium and CEX</div>
          </div>

          {/* Token Type */}
          <div className="bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Token Type</div>
            <div className="text-2xl font-bold">Solana (SPL)</div>
          </div>

          {/* Token Symbol */}
          <div className="bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Token Symbol</div>
            <div className="text-2xl font-bold">BMT</div>
          </div>

          {/* Decimal */}
          <div className="bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Decimal</div>
            <div className="text-2xl font-bold">9</div>
          </div>

          {/* Total Supply */}
          <div className="bg-primary backdrop-blur-sm  rounded-2xl p-6">
            <div className="text-gray-100 text-sm mb-2">Total Supply</div>
            <div className="text-2xl font-bold">300,000,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
