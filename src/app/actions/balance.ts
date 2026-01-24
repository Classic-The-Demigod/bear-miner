import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const DAILY_RATE = 0.02; // 2% daily
// const BMT_CONVERSION_RATE = 600; // 1 USD = 3589.6 BMT // Commented out for future use

export async function getBalanceWithGrowth(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        walletAddress: true,
        name: true,
        email: true,
        balance: true,
        tokenBalance: true,
        lastBalanceUpdate: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found", user: null };
    }

    // If balance is 0 or null, no growth needed
    if (!user.balance || user.balance <= 0) {
      return {
        success: true,
        user: {
          ...user,
          balance: user.balance || 0,
          tokenBalance: user.tokenBalance || 0,
          lastUpdated: new Date().toISOString(),
          emailVerified: false, // Add for compatibility with components
        },
      };
    }

    // Calculate accumulated growth
    const now = new Date();
    const lastUpdate = user.lastBalanceUpdate || user.createdAt;
    const timeDiff = now.getTime() - lastUpdate.getTime();
    const daysPassed = timeDiff / (1000 * 60 * 60 * 24);

    // Calculate compound growth: balance × (1.02)^days
    const growthFactor = Math.pow(1 + DAILY_RATE, daysPassed);
    const currentBalance = user.balance * growthFactor;
    // const earnings = currentBalance - user.balance;

    // Convert earnings to tokens - DISABLED
    // const tokenEarnings = earnings * BMT_CONVERSION_RATE;
    // const currentTokenBalance = (user.tokenBalance || 0) + tokenEarnings;
    const currentTokenBalance = user.tokenBalance || 0; // Keep token balance static

    // Update database (Per user request: ensure continuous persistence)
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: currentBalance,
        lastBalanceUpdate: now,
      },
    });

    return {
      success: true,
      user: {
        ...user,
        balance: currentBalance,
        tokenBalance: currentTokenBalance,
        lastUpdated: now.toISOString(),
        emailVerified: false, // Add for compatibility with components
      },
    };
  } catch (error) {
    console.error("Error calculating balance:", error);
    return {
      success: false,
      error: "Failed to calculate balance",
      user: null,
    };
  }
}
