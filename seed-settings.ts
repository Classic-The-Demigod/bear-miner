import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Global Settings...");

    // Upsert ensures we create it if missing, or do nothing if exists (update nothing)
    const settings = await prisma.globalSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            solWallet: "HjzNMHpUgRy4x4xXkniGciS1JpfKKjjJzogcFWMPWhqb"
        }
    });

    console.log("Global Settings Seeded:", settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
