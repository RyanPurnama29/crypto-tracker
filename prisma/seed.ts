import { PrismaClient } from '@prisma/client';
import { etfData } from './mock-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.etf.createMany({
    data: etfData,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
