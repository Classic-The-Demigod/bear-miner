"use server";

import { prisma } from "@/lib/prisma";

const DAILY_RATE = 0.005; // 5% daily
const BMT_CONVERSION_RATE = 600; // 1 USD = 3589.6 BMT

export async function getBalanceWithGrowth(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        tokenBalance: true,
        lastBalanceUpdate: true,
        emailVerified: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
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
        },
      };
    }

    // Calculate accumulated growth
    const now = new Date();
    const lastUpdate = user.lastBalanceUpdate || user.createdAt;
    const timeDiff = now.getTime() - lastUpdate.getTime();
    const daysPassed = timeDiff / (1000 * 60 * 60 * 24);

    // Calculate compound growth: balance × (1.05)^days
    const growthFactor = Math.pow(1 + DAILY_RATE, daysPassed);
    const currentBalance = user.balance * growthFactor;
    const earnings = currentBalance - user.balance;

    // Convert earnings to tokens
    const tokenEarnings = earnings * BMT_CONVERSION_RATE;
    const currentTokenBalance = (user.tokenBalance || 0) + tokenEarnings;

    // Update database if more than 1 hour has passed (prevents too frequent updates)
    const shouldUpdate = daysPassed > 0.041667; // 1 hour = 0.041667 days

    if (shouldUpdate) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: currentBalance,
          tokenBalance: currentTokenBalance,
          lastBalanceUpdate: now,
        },
      });
    }

    return {
      success: true,
      user: {
        ...user,
        balance: currentBalance,
        tokenBalance: currentTokenBalance,
        lastUpdated: now.toISOString(),
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
