import { prisma } from "./src/lib/prisma";

async function main() {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);
    users.forEach(u => {
        console.log(`Address: ${u.walletAddress}, Balance: ${u.walletBalance}, MinStake: ${u.minStakeBalance}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
